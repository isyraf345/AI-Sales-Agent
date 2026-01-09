from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # n8n Configuration
    N8N_BASE_URL: str = "https://isyraf345.app.n8n.cloud"
    N8N_INTENT_WEBHOOK: str = "/webhook/intent"
    N8N_BOOKING_WEBHOOK: str = "/webhook/send-appointment"
    N8N_ETL_WEBHOOK: str = "/webhook/etl"
    N8N_LEAD_WEBHOOK: str = "/webhook/score-lead"
    N8N_FEEDBACK_WEBHOOK: str = "/webhook/feedback"
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Optional
    API_KEY: str = ""
    
    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()