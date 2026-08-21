from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=True)
DATABASE_URL = os.getenv("DATABASE_URL")
print("DEBUG DATABASE_URL:", DATABASE_URL) 
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()

def init_db() -> None:
    Base.metadata.create_all(bind=engine)