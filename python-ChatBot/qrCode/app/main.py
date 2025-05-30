from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .router import core, mb_qr, momo_qr
from .config import settings

app = FastAPI(title="QR Code Payment API", version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
    allow_headers=["*"],
    max_age=3600, 
)

app.include_router(core.router)
app.include_router(mb_qr.router)
app.include_router(momo_qr.router)

@app.options("/{full_path:path}")
async def options_route(request: Request, full_path: str):
    response = JSONResponse(content={"detail": "OK"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, DELETE, PUT, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "3600"
    return response

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "timestamp": "2023-11-15T12:00:00Z"
    } 