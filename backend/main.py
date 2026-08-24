from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
    print_recommended_places,
)
from services.bedrock_service import generate_ai_recommendation
from database import SessionLocal, init_db
from models.trip import Trip

app = FastAPI(title="kelanaAI API")

init_db()

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float

class UpdateBudgetRequest(BaseModel):
    budget: float

@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]

@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)

    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        daily_budget=daily_budget,
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    return trip   

@app.put("/api/v1/trips/{id}")
def update_trip_budget(id: int, request: UpdateBudgetRequest):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail="Trip not found")

    trip.budget = request.budget
    trip.category = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(request.budget, trip.days)

    db.commit()
    db.refresh(trip)
    db.close()

    return trip


@app.delete("/api/v1/trips/{id}")
def delete_trip(id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail="Trip not found")

    db.delete(trip)
    db.commit()
    db.close()

    return {"message": f"Trip {id} deleted successfully"}


@app.post("/api/v1/trips/{id}/generate")
def generate_trip_recommendation(id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail="Trip not found")

    ai_recommendation = generate_ai_recommendation(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        travel_style=trip.category,
    )

    trip.ai_recommendation = ai_recommendation
    db.commit()
    db.refresh(trip)
    db.close()

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": trip.ai_recommendation,
    }





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
    places = get_recommended_places(destination)
    print_recommended_places(places)


def main():
    destination = input("Enter destination: ")
    days = int(input("Enter number of days: "))
    budget = float(input("Enter budget: "))
    currency = input("Enter currency: ")
    travel_month = input("Enter travel month: ")

    print_trip_summary(destination, days, budget, currency, travel_month)


if __name__ == "__main__":
    main()