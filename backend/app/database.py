from contextlib import asynccontextmanager
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client: AsyncIOMotorClient | None = None
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client.get_default_database(default="jobtracker")
    await db["applications"].create_index("created_at")
    await db["applications"].create_index("status")
    print("✅ MongoDB connected")
    yield
    client.close()
    print("MongoDB disconnected")

def get_db():
    return db
