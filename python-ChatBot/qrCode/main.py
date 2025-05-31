import uvicorn
from app import app

if __name__ == "__main__":
    print("Starting QR Code Payment API server on http://0.0.0.0:8001")
    print("Press Ctrl+C to stop the server")
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)