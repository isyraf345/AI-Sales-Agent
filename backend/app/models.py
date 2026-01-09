from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

# ============= Chat Models =============
class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, description="User message")

class ChatResponse(BaseModel):
    reply: str
    intent: str
    confidence: float

# ============= Booking Models =============
class BookingRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    contact: str = Field(..., min_length=1)
    requirement: str = Field(..., min_length=1)

class BookingResponse(BaseModel):
    status: str
    message: str
    data: Optional[Dict[str, Any]] = None

# ============= ETL Models =============
class CustomerRecord(BaseModel):
    name: str
    email: str

class ETLRequest(BaseModel):
    records: List[CustomerRecord]

class ETLResponse(BaseModel):
    valid: List[Dict[str, Any]]
    invalid: List[Dict[str, Any]]
    summary: Dict[str, int]

# ============= Lead Scoring Models =============
class LeadScoreRequest(BaseModel):
    name: str
    email: EmailStr
    jobTitle: str
    company: str
    message: str

class LeadScoreResponse(BaseModel):
    score: int
    category: str
    reasoning: str
    action: str

# ============= Feedback Models =============
class FeedbackRequest(BaseModel):
    customer: str
    email: EmailStr
    message: str

class FeedbackResponse(BaseModel):
    sentiment: str
    urgency: str
    category: str
    action: str