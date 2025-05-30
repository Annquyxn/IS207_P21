from fastapi import APIRouter
from datetime import datetime
from ..schemas import HealthCheckResponse
from ..utils.qr_generator import generate_mb_qr

router = APIRouter(tags=["Health Check"])

@router.get("/", response_model=HealthCheckResponse)
async def health_check():
    test_url = generate_mb_qr(1000, "HealthCheck")
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "qr_sample": test_url
    }