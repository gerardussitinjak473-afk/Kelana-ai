import os
from datetime import datetime, timezone
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_serializer,
    field_validator,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import init_db
from dependencies import get_current_user, get_db
from models import Conversation, Message, Trip, User
from services.auth_service import (
    authenticate_user,
    create_access_token,
    hash_password,
    normalize_email,
)
from services.bedrock_service import (
    generate_ai_recommendation,
    generate_conversation_response,
)
from services.kb_service import KnowledgeBaseNotConfigured, ask_knowledge_base
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
    allow_origins=[origin.strip() for origin in os.getenv("FRONTEND_URL", "http://localhost:3000").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Operations"])
def health():
    return {"status": "ok", "service": "KelanaAI"}


# Importing both models above registers every table before create_all runs.
init_db()


class RegisterRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if len(normalized) < 2:
            raise ValueError("Nama minimal 2 karakter")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password_bytes(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password maksimal 72 byte")
        return value


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr
    trip_count: int = 0


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int


class TripRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    destination: str = Field(min_length=1, max_length=120)
    days: int = Field(gt=0, le=365)
    budget: float = Field(gt=0)
    travel_style: Literal["Family", "Solo", "Couple"] = "Solo"


class UpdateBudgetRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    budget: float = Field(gt=0)


class ConversationCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str | None = Field(default=None, max_length=256)

    @field_validator("title")
    @classmethod
    def normalize_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return " ".join(value.split()) or None


class MessageCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    content: str = Field(min_length=1, max_length=20_000)

    @field_validator("content")
    @classmethod
    def normalize_content(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("Message cannot be empty")
        return normalized


class TimestampedResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    created_at: datetime

    @field_serializer("created_at")
    def serialize_created_at(self, value: datetime) -> str:
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.isoformat()


class ConversationResponse(TimestampedResponse):
    id: int
    user_id: int
    title: str


class MessageResponse(TimestampedResponse):
    id: int
    conversation_id: int
    role: Literal["user", "assistant"]
    content: str


class SendMessageResponse(BaseModel):
    conversation: ConversationResponse
    user_message: MessageResponse
    assistant_message: MessageResponse


class QuestionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str = Field(min_length=3, max_length=1000)

    @field_validator("question")
    @classmethod
    def normalize_question(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if len(normalized) < 3:
            raise ValueError("Pertanyaan minimal 3 karakter")
        return normalized


def _owned_trip_or_error(
    db: Session,
    trip_id: int,
    user_id: int,
    *,
    conceal_ownership: bool = False,
) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.user_id != user_id:
        if conceal_ownership:
            raise HTTPException(status_code=404, detail="Trip not found")
        raise HTTPException(
            status_code=403,
            detail="Anda tidak memiliki akses ke perjalanan ini.",
        )
    return trip


def _owned_conversation_or_error(
    db: Session,
    conversation_id: int,
    user_id: int,
) -> Conversation:
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


def _title_from_first_message(content: str) -> str:
    title = " ".join(content.split())
    return title if len(title) <= 60 else f"{title[:57].rstrip()}..."


@app.post(
    "/api/v1/auth/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    email = normalize_email(str(request.email))
    if db.query(User).filter(User.email == email).first() is not None:
        raise HTTPException(status_code=409, detail="Email sudah terdaftar.")

    user = User(
        name=request.name,
        email=email,
        password_hash=hash_password(request.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email sudah terdaftar.") from exc
    db.refresh(user)
    return UserResponse(id=user.id, name=user.name, email=user.email, trip_count=0)


@app.post("/api/v1/auth/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, str(request.email), request.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password tidak valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token, expires_in = create_access_token(user.id)
    return TokenResponse(access_token=access_token, expires_in=expires_in)


@app.get("/api/v1/auth/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip_count = db.query(Trip).filter(Trip.user_id == current_user.id).count()
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        trip_count=trip_count,
    )


@app.post(
    "/api/v1/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    request: ConversationCreateRequest | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = Conversation(
        user_id=current_user.id,
        title=request.title if request and request.title else "New Conversation",
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@app.get(
    "/api/v1/conversations",
    response_model=list[ConversationResponse],
)
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc(), Conversation.id.desc())
        .all()
    )


@app.get(
    "/api/v1/conversations/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _owned_conversation_or_error(db, conversation_id, current_user.id)
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )


@app.post(
    "/api/v1/conversations/{conversation_id}/messages",
    response_model=SendMessageResponse,
)
def send_conversation_message(
    conversation_id: int,
    request: MessageCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conversation = _owned_conversation_or_error(
        db,
        conversation_id,
        current_user.id,
    )

    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=request.content,
    )
    db.add(user_message)
    if conversation.title == "New Conversation":
        conversation.title = _title_from_first_message(request.content)
    db.commit()
    db.refresh(conversation)
    db.refresh(user_message)

    history = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )
    try:
        answer = generate_conversation_response(
            [
                {"role": message.role, "content": message.content}
                for message in history
            ]
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=(
                "KelanaAI belum dapat menjawab. Periksa AWS credentials, "
                "region, dan akses Amazon Bedrock."
            ),
        ) from exc

    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=answer,
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return SendMessageResponse(
        conversation=conversation,
        user_message=user_message,
        assistant_message=assistant_message,
    )


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


@app.post("/api/v1/ask")
@app.post("/api/v1/assistant", include_in_schema=False)
def ask_travel_assistant(request: QuestionRequest):
    try:
        result = ask_knowledge_base(request.question)
    except KnowledgeBaseNotConfigured as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Knowledge Base belum dapat menjawab. Periksa konfigurasi dan status sinkronisasi AWS.",
        ) from exc

    return {"question": request.question, **result}


@app.get("/api/v1/trips")
def get_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.id.desc())
        .all()
    )


@app.get("/api/v1/trips/{id}")
def get_trip(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Return 404 for reads so callers cannot enumerate another user's trip IDs.
    return _owned_trip_or_error(
        db,
        id,
        current_user.id,
        conceal_ownership=True,
    )


@app.post("/api/v1/trips", status_code=status.HTTP_201_CREATED)
def create_trip(
    request: TripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
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
        # Ownership always comes from the verified JWT, never from request data.
        user_id=current_user.id,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@app.put("/api/v1/trips/{id}")
def update_trip_budget(
    id: int,
    request: UpdateBudgetRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _owned_trip_or_error(db, id, current_user.id)
    trip.budget = request.budget
    trip.category = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(request.budget, trip.days)

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{id}")
def delete_trip(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _owned_trip_or_error(db, id, current_user.id)
    db.delete(trip)
    db.commit()
    return {"message": f"Trip {id} deleted successfully"}


@app.post("/api/v1/trips/{id}/generate")
def generate_trip_recommendation(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = _owned_trip_or_error(db, id, current_user.id)
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
            detail=(
                "Layanan AI belum siap. Periksa AWS credentials, region, "
                "dan akses Amazon Bedrock."
            ),
        ) from exc

    trip.ai_recommendation = recommendation
    db.commit()
    db.refresh(trip)

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
