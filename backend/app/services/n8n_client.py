import httpx
from typing import Dict, Any
from app.config import settings

class N8NClient:
    def __init__(self):
        self.base_url = settings.N8N_BASE_URL
        self.timeout = 30.0
    
    async def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generic request method for n8n webhooks"""
        url = f"{self.base_url}{endpoint}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=data,
                    timeout=self.timeout
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"HTTP error occurred: {e}")
                raise Exception(f"n8n webhook error: {str(e)}")
            except Exception as e:
                print(f"Error occurred: {e}")
                raise Exception(f"Request failed: {str(e)}")
    
    async def send_intent_request(self, message: str) -> Dict[str, Any]:
        """Call intent detection webhook"""
        return await self._make_request(
            settings.N8N_INTENT_WEBHOOK,
            {"message": message}
        )
    
    async def send_booking_request(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call booking webhook"""
        return await self._make_request(
            settings.N8N_BOOKING_WEBHOOK,
            booking_data
        )
    
    async def process_etl(self, records: list) -> Dict[str, Any]:
        """Call ETL processing webhook"""
        return await self._make_request(
            settings.N8N_ETL_WEBHOOK,
            {"records": records}
        )
    
    async def score_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call lead scoring webhook"""
        return await self._make_request(
            settings.N8N_LEAD_WEBHOOK,
            lead_data
        )
    
    async def analyze_feedback(self, feedback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Call feedback analysis webhook"""
        return await self._make_request(
            settings.N8N_FEEDBACK_WEBHOOK,
            feedback_data
        )

# Singleton instance
n8n_client = N8NClient()