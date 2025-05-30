from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from font.download_noto import download_noto_sans_fonts
from font.register_fonts import register_fonts
from api.routes import router

app = FastAPI(title="Invoice Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

download_noto_sans_fonts()
register_fonts()

app.include_router(router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
