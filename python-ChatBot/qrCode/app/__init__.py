from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .router import core, mb_qr, momo_qr, health
from .config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    max_age=3600,  # Cache preflight requests for 1 hour
)

app.include_router(core.router)
app.include_router(mb_qr.router, prefix="/mb", tags=["MB Bank QR"])
app.include_router(momo_qr.router, prefix="/momo", tags=["Momo QR"])
app.include_router(health.router, prefix="/health", tags=["Health Check"])