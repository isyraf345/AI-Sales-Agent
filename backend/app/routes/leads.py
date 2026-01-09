from fastapi import APIRouter, HTTPException
from app.models import LeadScoreRequest, LeadScoreResponse
from app.services.n8n_client import n8n_client

router = APIRouter()

@router.post("/score", response_model=LeadScoreResponse)
async def score_lead(lead: LeadScoreRequest):
    """
    Score and categorize a lead using AI
    
    - **name**: Lead name
    - **email**: Lead email
    - **jobTitle**: Lead's job title
    - **company**: Company name and size
    - **message**: Lead's inquiry message
    
    Returns:
    - **score**: Lead score (0-100)
    - **category**: HOT, WARM, or COLD
    - **reasoning**: AI's reasoning for the score
    - **action**: Recommended action to take
    """
    try:
        result = await n8n_client.score_lead(lead.dict())
        
        # Validate response structure
        required_keys = ["score", "category", "reasoning", "action"]
        if not all(key in result for key in required_keys):
            raise HTTPException(
                status_code=500,
                detail="Invalid response from lead scoring webhook"
            )
        
        return LeadScoreResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to score lead: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "leads"}