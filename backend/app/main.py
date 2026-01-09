from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import chat, booking, etl, leads, feedback

# Create FastAPI app
app = FastAPI(
    title="Smart Sales Agent API",
    description="Backend API for Smart Sales Agent with n8n integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])
app.include_router(etl.router, prefix="/api/etl", tags=["ETL"])
app.include_router(leads.router, prefix="/api/leads", tags=["Leads"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Smart Sales Agent API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Global health check"""
    return {
        "status": "healthy",
        "n8n_base_url": settings.N8N_BASE_URL
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )