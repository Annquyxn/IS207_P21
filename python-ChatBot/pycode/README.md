# Product Consultation Chatbot

This project contains a chatbot system that provides product recommendations from the GearVN dataset.

## Requirements

To run the chatbot backend, you need:

- Python 3.8+ 
- FastAPI
- LangChain
- Ollama (local LLM server)

For the frontend:
- Node.js 14+
- React
- Axios

## Installation

### Backend Setup

1. Install the required Python packages:

```bash
pip install fastapi uvicorn langchain langchain-community pydantic python-multipart python-dotenv
```

2. Ensure you have Ollama installed and running: https://ollama.ai/

3. Make sure you have the following models available in Ollama:
   - gemma
   - llama
   - deepseek
   - moondream

   You can install these models using: `ollama pull modelname`

### Running the Backend

From the project directory, run:

```bash
cd IS207_P21/python-ChatBot/pycode
uvicorn app:app --reload
```

The backend will start running on http://127.0.0.1:8000

## API Endpoints

- `GET /test` - Test if the API is running
- `POST /direct-query` - Send a product query to get recommendations

## Usage with React Frontend

The React frontend in `IS207_P21/srcs/components/features/chatBot/ChatTab.jsx` is already configured to connect to the Python backend via Axios.

Make sure the backend is running when you start your React app. 