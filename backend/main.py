import os
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from database import SessionLocal, init_db
from models.trip import Trip
from services.bedrock_service import generate_ai_recommendation
from services.trip_service import (
    calculate_daily_budget,
    get_recommended_places,
    get_travel_season,
    get_trip_category,
    print_recommended_places,
)


app = FastAPI(title="KelanaAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class TripRequest(BaseModel):
    destination: str = Field(min_length=1, max_length=120)
    days: int = Field(gt=0, le=365)
    budget: float = Field(gt=0)
    travel_style: Literal["Family", "Solo", "Couple"] = "Solo"


class UpdateBudgetRequest(BaseModel):
    budget: float = Field(gt=0)


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


@app.get("/api/v1/trips")
def get_trips():
    db = SessionLocal()
    try:
        return db.query(Trip).order_by(Trip.id.desc()).all()
    finally:
        db.close()


@app.get("/api/v1/trips/{id}")
def get_trip(id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")
        return trip
    finally:
        db.close()


@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    destination = request.destination.strip()
    if not destination:
        raise HTTPException(status_code=422, detail="Destination cannot be empty")

    trip = Trip(
        destination=destination,
        days=request.days,
        budget=request.budget,
        category=get_trip_category(request.budget),
        travel_style=request.travel_style,
        daily_budget=calculate_daily_budget(request.budget, request.days),
    )

    db = SessionLocal()
    try:
        db.add(trip)
        db.commit()
        db.refresh(trip)
        return trip
    finally:
        db.close()


@app.put("/api/v1/trips/{id}")
def update_trip_budget(id: int, request: UpdateBudgetRequest):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        trip.budget = request.budget
        trip.category = get_trip_category(request.budget)
        trip.daily_budget = calculate_daily_budget(request.budget, trip.days)

        db.commit()
        db.refresh(trip)
        return trip
    finally:
        db.close()


@app.delete("/api/v1/trips/{id}")
def delete_trip(id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        db.delete(trip)
        db.commit()
        return {"message": f"Trip {id} deleted successfully"}
    finally:
        db.close()


@app.post("/api/v1/trips/{id}/generate")
def generate_trip_recommendation(id: int):
    db = SessionLocal()
    try:
        trip = db.query(Trip).filter(Trip.id == id).first()
        if trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        try:
            recommendation = generate_ai_recommendation(
                destination=trip.destination,
                days=trip.days,
                budget=trip.budget,
                travel_style=trip.travel_style,
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail="Layanan AI belum siap. Periksa AWS credentials, region, dan akses Amazon Bedrock.",
            ) from exc

        trip.ai_recommendation = recommendation
        db.commit()
        db.refresh(trip)

        return {
            "trip_id": trip.id,
            "destination": trip.destination,
            "recommendation": trip.ai_recommendation,
        }
    finally:
        db.close()


def print_trip_summary(destination, days, budget, currency, travel_month):
    category = get_trip_category(budget)
    season = get_travel_season(travel_month)
    daily_budget = calculate_daily_budget(budget, days)

    print("==================================")
    print("KelanaAI")
    print("==================================")
    print(f"Destination  : {destination}")
    print(f"Days         : {days}")
    print(f"Budget       : {budget} {currency}")
    print(f"Category     : {category}")
    print(f"Daily Budget : {daily_budget} {currency}/Day")
    print(f"Travel Month : {travel_month}")
    print(f"Season       : {season}")

    print("\nRecommended Places")
    print_recommended_places(get_recommended_places(destination))


def main():
    destination = input("Enter destination: ")
    days = int(input("Enter number of days: "))
    budget = float(input("Enter budget: "))
    currency = input("Enter currency: ")
    travel_month = input("Enter travel month: ")

    print_trip_summary(destination, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()
