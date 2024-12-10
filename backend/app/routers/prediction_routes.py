from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import get_db
from ..models.prediction_model import Prediction

router = APIRouter()

@router.get("/{symbol}")
def get_prediction(symbol: str, db: Session = Depends(get_db)):
    """
    Retrieve the most recent prediction for the given stock symbol.
    If no prediction is available, return a 404 error.
    """
    prediction = (
        db.query(Prediction)
        .filter(Prediction.symbol == symbol)
        .order_by(Prediction.prediction_date.desc())
        .first()
    )

    if not prediction:
        raise HTTPException(status_code=404, detail="No prediction found for this symbol.")
    
    return {
        "symbol": prediction.symbol,
        "predicted_price": float(prediction.predicted_price),
        "prediction_date": prediction.prediction_date.isoformat()
    }
