import uvicorn
from fastapi import FastAPI
from routes.routes import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from storage.redis import get_redis_client
app = FastAPI(
    title="Shashtra API",
    description="API for chat application with authentication",
    version="1.0.0"
)
origins = [
    "http://localhost:3000",  # React frontend default
    "http://localhost:8000",  # FastAPI backend default
    "http://localhost",
    "https://yourdomain.com",  # Replace with your production domain
    "*",  # For development - remove in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")

@app.get("/", tags=["Health"])
async def health_check():
    try:
        print("Checking Redis connection")
        get_redis_client().ping()
        print("Redis connection successful")
        return {"status": "healthy"}
    except Exception as e:
        print(f"Redis connection failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)