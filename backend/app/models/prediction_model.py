from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..db import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(10), ForeignKey("stocks.symbol"), nullable=False)
    predicted_price = Column(Numeric(10, 2), nullable=False)
    prediction_date = Column(DateTime, default=datetime.utcnow)

    # Relationship to Stock model (if desired)
    stock = relationship("Stock", back_populates="predictions", lazy="joined")
