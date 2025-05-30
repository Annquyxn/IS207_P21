import os
from pathlib import Path
from dotenv import load_dotenv
import logging

project_root = Path(__file__).resolve().parent.parent.parent
env_file = project_root / ".env"

if not env_file.exists():
    with open(env_file, "w") as f:
        f.write("GROQ_API_KEY=your_groq_api_key_here\n")
load_dotenv(env_file)

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
