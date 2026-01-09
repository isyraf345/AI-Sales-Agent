from fastapi import APIRouter, HTTPException
from app.models import ChatMessage, ChatResponse
from app.services.n8n_client import n8n_client

router = APIRouter()

@router.post("/send", response_model=ChatResponse)
async def send_message(msg: ChatMessage):
    """
    Send a chat message and get AI response with intent detection
    
    - **message**: User's chat message
    
    Returns:
    - **reply**: AI generated response
    - **intent**: SALES or SUPPORT
    - **confidence**: Confidence score (0-1)
    """
    try:
        result = await n8n_client.send_intent_request(msg.message)
        
        # Validate response structure
        if not all(key in result for key in ["reply", "intent", "confidence"]):
            raise HTTPException(
                status_code=500,
                detail="Invalid response from n8n webhook"
            )
        
        return ChatResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process message: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "chat"}