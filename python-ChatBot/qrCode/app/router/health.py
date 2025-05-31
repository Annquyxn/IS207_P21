from fastapi import APIRouter, Response
from datetime import datetime
from ..schemas import HealthCheckResponse
from ..utils.qr_generator import generate_mb_qr

router = APIRouter(tags=["Health Check"])

def add_cors_headers(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "3600"
    return response

@router.get("/", response_model=HealthCheckResponse)
async def health_check(response: Response):
    test_url = generate_mb_qr(1000, "HealthCheck")
    add_cors_headers(response)
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "qr_sample": test_url
    }