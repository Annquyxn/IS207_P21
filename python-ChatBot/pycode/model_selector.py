from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

def get_model(model_name: str):
    model_name = model_name.lower()
    model_map = {
        "qwen": "Qwen-Qwq-32b",
        "llama3": "Llama-3.3-70b-Versatile",
        "mixtral": "Mixtral-Saba-24b",
        "gemma": "Gemma-9b-It",
        "deepseek": "Deepseek-R1-Distill-Llama-70b"
    }

    if model_name not in model_map:
        raise ValueError(f"Unsupported model: {model_name}")

    return ChatGroq(model=model_map[model_name], api_key=groq_api_key)
