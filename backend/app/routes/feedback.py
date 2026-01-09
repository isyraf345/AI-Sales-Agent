from fastapi import APIRouter, HTTPException
from app.models import FeedbackRequest, FeedbackResponse
from app.services.n8n_client import n8n_client

router = APIRouter()

@router.post("/analyze", response_model=FeedbackResponse)
async def analyze_feedback(feedback: FeedbackRequest):
    """
    Analyze customer feedback using AI sentiment analysis
    
    - **customer**: Customer name
    - **email**: Customer email
    - **message**: Feedback message
    
    Returns:
    - **sentiment**: Positive, Negative, or Neutral
    - **urgency**: High, Medium, or Low
    - **category**: Bug Report, Feature Request, or Praise
    - **action**: Recommended action based on analysis
    """
    try:
        result = await n8n_client.analyze_feedback(feedback.dict())
        
        # Validate response structure
        required_keys = ["sentiment", "urgency", "category", "action"]
        if not all(key in result for key in required_keys):
            raise HTTPException(
                status_code=500,
                detail="Invalid response from feedback webhook"
            )
        
        return FeedbackResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze feedback: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "feedback"}