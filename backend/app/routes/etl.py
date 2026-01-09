from fastapi import APIRouter, HTTPException
from app.models import ETLRequest, ETLResponse
from app.services.n8n_client import n8n_client

router = APIRouter()

@router.post("/process", response_model=ETLResponse)
async def process_customer_data(etl_request: ETLRequest):
    """
    Process and transform customer data
    
    - **records**: List of customer records with name and email
    
    Returns:
    - **valid**: List of validated and transformed records
    - **invalid**: List of invalid records with error messages
    - **summary**: Summary statistics (total, valid, invalid counts)
    """
    try:
        records_list = [record.dict() for record in etl_request.records]
        result = await n8n_client.process_etl(records_list)
        
        # Validate response structure
        required_keys = ["valid", "invalid", "summary"]
        if not all(key in result for key in required_keys):
            raise HTTPException(
                status_code=500,
                detail="Invalid response from ETL webhook"
            )
        
        return ETLResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process ETL: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "etl"}