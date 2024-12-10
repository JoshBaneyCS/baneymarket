from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from ..auth import get_current_user
from ..db import get_db
from ..models.user_model import User

router = APIRouter()

class UserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    cell_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    theme_preference: Optional[bool] = None  # True for light mode, False for dark mode

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "email": user.email,
        "cell_number": user.cell_number,
        "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
        "address": user.address,
        "country": user.country,
        "theme_preference": user.theme_preference
    }

@router.patch("/me")
def update_me(req: UserUpdateRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if req.first_name is not None:
        user.first_name = req.first_name
    if req.last_name is not None:
        user.last_name = req.last_name
    if req.cell_number is not None:
        # In a production setting, validate unique cell_number constraint
        user.cell_number = req.cell_number
    if req.date_of_birth is not None:
        # Parse date if needed or ensure front-end sends ISO format
        from datetime import datetime
        try:
            user.date_of_birth = datetime.fromisoformat(req.date_of_birth).date()
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format")
    if req.address is not None:
        user.address = req.address
    if req.country is not None:
        user.country = req.country
    if req.theme_preference is not None:
        user.theme_preference = req.theme_preference

    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully"}
