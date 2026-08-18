from fastapi import FastAPI

from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    get_recommended_places,
    print_recommended_places,
)

app = FastAPI(title="kelanaAI API")
@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]

@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


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