import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=False)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine_options = {"pool_pre_ping": True}
if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


LEGACY_USER_EMAIL = "legacy@kelana.invalid"


def _create_legacy_user(connection) -> int:
    legacy_user_id = connection.execute(
        text("SELECT id FROM users WHERE email = :email"),
        {"email": LEGACY_USER_EMAIL},
    ).scalar_one_or_none()
    if legacy_user_id is not None:
        return int(legacy_user_id)

    values = {
        "name": "Legacy Kelana",
        "email": LEGACY_USER_EMAIL,
        # Deliberately not a valid bcrypt hash: this system account cannot log in.
        "password_hash": "!legacy-account-disabled!",
    }
    if connection.dialect.name == "postgresql":
        return int(
            connection.execute(
                text(
                    "INSERT INTO users (name, email, password_hash) "
                    "VALUES (:name, :email, :password_hash) RETURNING id"
                ),
                values,
            ).scalar_one()
        )

    result = connection.execute(
        text(
            "INSERT INTO users (name, email, password_hash) "
            "VALUES (:name, :email, :password_hash)"
        ),
        values,
    )
    return int(result.lastrowid)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    # create_all does not alter existing tables. Keep databases from earlier
    # sessions compatible without deleting their trips.
    with engine.begin() as connection:
        inspector = inspect(connection)
        if "trips" not in inspector.get_table_names():
            return

        columns = {
            column["name"]: column
            for column in inspector.get_columns("trips")
        }
        if "travel_style" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE trips ADD COLUMN travel_style "
                    "VARCHAR NOT NULL DEFAULT 'Solo'"
                )
            )

        if "user_id" not in columns:
            connection.execute(text("ALTER TABLE trips ADD COLUMN user_id INTEGER"))

        orphan_count = int(
            connection.execute(
                text("SELECT COUNT(*) FROM trips WHERE user_id IS NULL")
            ).scalar_one()
        )
        if orphan_count:
            legacy_user_id = _create_legacy_user(connection)
            connection.execute(
                text("UPDATE trips SET user_id = :user_id WHERE user_id IS NULL"),
                {"user_id": legacy_user_id},
            )

        if connection.dialect.name == "postgresql":
            connection.execute(
                text("ALTER TABLE trips ALTER COLUMN user_id SET NOT NULL")
            )
            foreign_keys = inspect(connection).get_foreign_keys("trips")
            has_user_foreign_key = any(
                foreign_key.get("referred_table") == "users"
                and "user_id" in foreign_key.get("constrained_columns", [])
                for foreign_key in foreign_keys
            )
            if not has_user_foreign_key:
                connection.execute(
                    text(
                        "ALTER TABLE trips ADD CONSTRAINT trips_user_id_fkey "
                        "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE"
                    )
                )

        connection.execute(
            text("CREATE INDEX IF NOT EXISTS ix_trips_user_id ON trips (user_id)")
        )
