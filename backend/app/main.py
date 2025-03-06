from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import os
import shutil
from uuid import uuid4

from . import models, schemas, crud
from .database import engine, get_db
from .auth import create_access_token, get_current_user, get_password_hash, verify_password
from .config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blogi API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "Bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/posts", response_model=schemas.Post)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_post(db=db, post=post, user_id=current_user.id)

@app.get("/posts", response_model=List[schemas.Post])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = crud.get_posts(db, skip=skip, limit=limit)
    return posts

@app.get("/posts/{post_id}", response_model=schemas.Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@app.put("/posts/{post_id}", response_model=schemas.Post)
def update_post(post_id: int, post: schemas.PostUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this post")
    return crud.update_post(db=db, post_id=post_id, post=post)

@app.delete("/posts/{post_id}", response_model=schemas.Post)
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_post = crud.get_post(db, post_id=post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if db_post.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    return crud.delete_post(db=db, post_id=post_id)

@app.get("/users/{user_id}/posts", response_model=List[schemas.Post])
def read_user_posts(user_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = crud.get_user_posts(db, user_id=user_id, skip=skip, limit=limit)
    return posts

@app.post("/uploads/", response_model=schemas.ImageUpload)
async def upload_image(file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)):
    # Check if the file is an image
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(400, detail="File must be an image (jpeg, png, gif)")
    
    # Create a unique filename
    filename = f"{uuid4()}{os.path.splitext(file.filename)[1]}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    
    return {
        "filename": filename,
        "file_url": f"/uploads/{filename}"
    }

@app.get("/posts/search/", response_model=List[schemas.Post])
def search_posts(
    query: str, 
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db)
):
    posts = crud.search_posts(db=db, query=query, skip=skip, limit=limit)
    return posts


@app.get("/uploads/{filename}")
async def get_uploaded_file(filename: str):
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Check if file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return the file
    return FileResponse(file_path)