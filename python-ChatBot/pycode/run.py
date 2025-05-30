import uvicorn
import logging
import os
from dotenv import load_dotenv
from pathlib import Path

project_root = Path(__file__).resolve().parent
load_dotenv(project_root / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting TechBot API...")
    
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        logger.warning("GROQ_API_KEY not found in environment variables!")
        logger.warning("AI features will not work without an API key.")
        logger.warning("Please create a .env file with GROQ_API_KEY=your_api_key")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    ) 