from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import lifespan
from .routers import applications, ai

app = FastAPI(
    title="Job Application Tracker AI",
    description="Track job applications and get AI-powered CV & interview advice",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(ai.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
