from fastapi import FastAPI
from .router import core, mb_qr, momo_qr, health
from .config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

app.include_router(core.router)
app.include_router(mb_qr.router, prefix="/mb", tags=["MB Bank QR"])
app.include_router(momo_qr.router, prefix="/momo", tags=["Momo QR"])
app.include_router(health.router, prefix="/health", tags=["Health Check"])