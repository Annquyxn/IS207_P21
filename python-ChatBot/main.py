from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    username: str
    message: str

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI"}

@app.post("/api/data")
async def get_data(data: Message):
    print("React Message:", data)
    return {"status": "OK", "received": data}
