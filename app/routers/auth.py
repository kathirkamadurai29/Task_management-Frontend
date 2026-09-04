from sqlalchemy.orm import Session
from fastapi import APIRouter,Depends, HTTPException

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.utils.auth import hash_password,verify_password,create_access_token

from app.schemas.user import UserLogin
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authrntication"]
)

@router.get("/test")
def test():
    return{"message":"Auth router working"}

@router.post("/register")
def register(
    user:UserCreate, db:Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already Exists"
        )
    new_user = User(
        username=user.username, email=user.email, password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return{"message": "User registered successfully"}

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    db_User = db.query(User).filter(
        (User.email == form_data.username) | (User.username == form_data.username)
    ).first()
    if not db_User:
        raise HTTPException(
            status_code=401, detail= "Invalid email or password"
        )
    if not verify_password(
        form_data.password, db_User.password_hash
    ):
        raise HTTPException(
            status_code=401, detail="Invalid email or password"
        )
    token = create_access_token(
        {"sub": db_User.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username
    }