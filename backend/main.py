from fastapi import FastAPI 
from pydantic import BaseModel
from typing import Optional
import uvicorn
from app.main import app





if __name__ == "__main__":
    uvicorn.run(app,host="127.0.0.1",port=8000)