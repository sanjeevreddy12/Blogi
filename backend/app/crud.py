from sqlalchemy.orm import Session
from sqlalchemy import or_
from . import models, schemas
from .auth import get_password_hash

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_post(db: Session, post_id: int):
    return db.query(models.Post).filter(models.Post.id == post_id).first()

def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Post)\
             .order_by(models.Post.created_at.desc())\
             .offset(skip)\
             .limit(limit)\
             .all()

def get_user_posts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Post)\
             .filter(models.Post.user_id == user_id)\
             .order_by(models.Post.created_at.desc())\
             .offset(skip)\
             .limit(limit)\
             .all()

def create_post(db: Session, post: schemas.PostCreate, user_id: int):
    db_post = models.Post(**post.dict(), user_id=user_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

def update_post(db: Session, post_id: int, post: schemas.PostUpdate):
    db_post = get_post(db, post_id=post_id)
    update_data = post.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    return db_post

def delete_post(db: Session, post_id: int):
    db_post = get_post(db, post_id=post_id)
    db.delete(db_post)
    db.commit()
    return db_post

# Search functionality
def search_posts(db: Session, query: str, skip: int = 0, limit: int = 100):
    search_query = f"%{query}%"
    return db.query(models.Post)\
             .filter(
                 or_(
                     models.Post.title.ilike(search_query),
                     models.Post.content.ilike(search_query)
                 )
             )\
             .order_by(models.Post.created_at.desc())\
             .offset(skip)\
             .limit(limit)\
             .all()