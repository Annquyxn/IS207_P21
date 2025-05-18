from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
import sys
import os

current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from pycode.query_route import router as query_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    logger.info(f"Request: {request.method} {request.url}")
    logger.info(f"Headers: {request.headers}")
    
    body_bytes = await request.body()
    await request.body()
    
    if body_bytes:
        logger.info(f"Request body: {body_bytes.decode()}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"Response time: {process_time:.4f} seconds")
    
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router)

@app.get("/")
def root():
    return {"message": "Welcome to GearVN API"}

@app.get("/test")
def test_endpoint():
    logger.info("Test endpoint called")
    return {
        "status": "success",
        "message": "API is working!",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
