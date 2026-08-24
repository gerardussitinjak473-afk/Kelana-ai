from dotenv import load_dotenv
import boto3
import os

# Load environment variables from .env
load_dotenv()

# Create the Bedrock Runtime client (reused for every model invocation)
client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2"),
)

MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def build_itinerary_prompt(destination: str, days: int, budget: float, travel_style: str = "General") -> str:
    """
    Bangun prompt yang kaya (rich prompt) agar Bedrock menghasilkan
    structured daily plan: morning / afternoon / evening.
    """
    return f"""
You are an experienced travel planner with deep local knowledge.

Create a detailed day-by-day itinerary for the following trip:
- Destination: {destination}
- Duration: {days} day(s)
- Total Budget: USD {budget}
- Travel Style: {travel_style}

For EACH day, structure the plan into exactly three sections, in this order:

## Day X: <short theme for the day>

Morning:
- Provide 2-3 specific morning activities (name real places or experiences, not generic advice).

Afternoon:
- Recommend at least one cultural site (temple, museum, landmark, etc.) and one local experience.

Evening:
- Suggest a specific dinner spot (name the type of food/restaurant) and a nightlife or evening leisure activity.

After all days are covered, add these closing sections:
- ## Estimated Daily Budget — a rough per-day cost breakdown in USD.
- ## Local Food Recommendations — signature dishes or dishes worth trying.
- ## Transportation Suggestions — how to get around between the recommended places.

Format the entire response as Markdown, using "##" for headers and "-" for bullet lists.
""".strip()


def generate_ai_recommendation(destination: str, days: int, budget: float, travel_style: str = "General") -> str:
   
    prompt = build_itinerary_prompt(destination, days, budget, travel_style)

    response = client.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {"text": prompt}
                ],
            }
        ],
    )

    ai_response = response["output"]["message"]["content"][0]["text"]
    return ai_response
