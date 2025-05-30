from fastapi import FastAPI
from app.api.endpoints import router as api_router
from app.core.startup import configure_startup

app = FastAPI(title="TechBot API")
configure_startup(app)
app.include_router(api_router)
