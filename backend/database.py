from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=False)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not configured")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

def init_db() -> None:
    Base.metadata.create_all(bind=engine)

    # create_all does not add columns to an existing table. Keep databases
    # created in earlier sessions compatible with the Session 7 schema.
    columns = {column["name"] for column in inspect(engine).get_columns("trips")}
    if "travel_style" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE trips ADD COLUMN travel_style "
                    "VARCHAR NOT NULL DEFAULT 'Solo'"
                )
            )
