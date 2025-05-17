from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pycode.query_route import router as query_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router)

@app.get("/")
def root():
    return {"message": "Welcome to GearVN API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pycode.main:app", host="127.0.0.1", port=8000, reload=True)
