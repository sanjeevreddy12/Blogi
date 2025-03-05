import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_Po57hbnpUKYf@ep-plain-unit-a8zun7cf-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sanju")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()