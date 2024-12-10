from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from datetime import timedelta

from ..db import get_db
from ..models.user_model import User
from ..auth import create_access_token, verify_password, hash_password

router = APIRouter()

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    cell_number: str
    password: str
    date_of_birth: str
    address: str
    country: str
    # theme_preference default True for light mode
    theme_preference: bool = True

class LoginRequest(BaseModel):
    identifier: str
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

@router.post("/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if username/email/cell_number already exists
    if db.query(User).filter((User.username == req.username) | (User.email == req.email) | (User.cell_number == req.cell_number)).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with provided username/email/phone already exists.")

    new_user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        username=req.username,
        email=req.email,
        cell_number=req.cell_number,
        password_hash=hash_password(req.password),
        date_of_birth=req.date_of_birth,
        address=req.address,
        country=req.country,
        theme_preference=req.theme_preference
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == req.identifier) | (User.email == req.identifier) | (User.cell_number == req.identifier)
    ).first()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token_expires = timedelta(hours=12)
    access_token = create_access_token(data={"user_id": user.id}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/request-password-reset")
def request_password_reset(req: PasswordResetRequest, db: Session = Depends(get_db)):
    # In a real scenario, you'd generate a token and send it via email.
    # Here, we simply pretend we did that.
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    # Generate a reset token (in practice, store it and send it to user via email)
    reset_token = "fake_reset_token"  
    return {"message": "Password reset email sent", "reset_token": reset_token}

@router.post("/reset-password")
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    # Validate the token. Here we just trust it as "fake_reset_token"
    if req.token != "fake_reset_token":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    # Since this is a mock-up, let's just assume we know which user to reset:
    # In a real scenario, decode token to get the user_id.
    user = db.query(User).filter(User.email == "example@domain.com").first()  # Replace with actual logic.
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.password_hash = hash_password(req.new_password)
    db.commit()
    return {"message": "Password has been reset successfully"}
