"""Apply the existing idempotent schema upgrade. Run from repository root."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
from database import init_db
import models
init_db()
print("Schema initialized: users, trips, conversations, messages")
