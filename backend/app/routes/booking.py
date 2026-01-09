from fastapi import APIRouter, HTTPException
from app.models import BookingRequest, BookingResponse
from app.services.n8n_client import n8n_client

router = APIRouter()

@router.post("/create", response_model=BookingResponse)
async def create_booking(booking: BookingRequest):
    """
    Book an appointment and send confirmation email
    
    - **name**: Customer name
    - **email**: Customer email
    - **contact**: Customer contact number
    - **requirement**: Customer requirement/need
    
    Returns booking confirmation and email status
    """
    try:
        result = await n8n_client.send_booking_request(booking.dict())
        
        return BookingResponse(
            status="success",
            message="Booking confirmed. Confirmation email sent.",
            data=result
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create booking: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "booking"}