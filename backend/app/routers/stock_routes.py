from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import requests  # Assuming you might fetch live data from an external API

from ..db import get_db
from ..models.stock_model import Stock

router = APIRouter()

# In a real implementation, you'd have environment variables or configs for API keys and URLs
EXTERNAL_API_URL = "https://api.example.com/stockdata"

@router.get("/markets")
def get_markets(db: Session = Depends(get_db)):
    """
    Return a list of major indices and commodities.
    This might be cached in the DB or fetched from an external API.
    """
    # Example static data, in practice you might query from DB or external API
    markets = [
        {"symbol": "DJI", "name": "Dow Jones Industrial Average", "last_price": 35000.00},
        {"symbol": "SPX", "name": "S&P 500", "last_price": 4500.00},
        {"symbol": "COMP", "name": "Nasdaq Composite", "last_price": 14000.00},
        {"symbol": "GC=F", "name": "Gold", "last_price": 1800.00},
        {"symbol": "CL=F", "name": "Crude Oil", "last_price": 70.00}
    ]
    return markets

@router.get("/")
def search_stocks(query: Optional[str] = Query(None, description="Search term for stocks"), db: Session = Depends(get_db)):
    """
    Search for stocks by symbol or name.
    If no query is provided, return a default list of popular stocks.
    """
    if query:
        results = db.query(Stock).filter(
            (Stock.symbol.ilike(f"%{query}%")) | (Stock.name.ilike(f"%{query}%"))
        ).all()
        return [{"symbol": s.symbol, "name": s.name, "last_price": float(s.last_price)} for s in results]
    else:
        # Return some popular stocks if no query is provided
        popular = db.query(Stock).limit(10).all()
        return [{"symbol": s.symbol, "name": s.name, "last_price": float(s.last_price)} for s in popular]

@router.get("/{symbol}")
def get_stock(symbol: str, db: Session = Depends(get_db)):
    """
    Get details for a particular stock by symbol.
    """
    stock = db.query(Stock).filter(Stock.symbol == symbol).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {
        "symbol": stock.symbol,
        "name": stock.name,
        "last_price": float(stock.last_price),
        "updated_at": stock.updated_at.isoformat() if stock.updated_at else None
    }

@router.get("/{symbol}/history")
def get_stock_history(symbol: str, range: str = "1d", db: Session = Depends(get_db)):
    """
    Get historical price data for a given stock symbol over a specified range.
    range can be "1d", "1m", "1y", etc.
    In a real app, this data might be fetched from a historical database or external API.
    """

    # For demo, let's assume external API gives us OHLC data
    # Example of calling external API (pseudo-code)
    # In real usage, handle errors, timeouts, and parse response.
    url = f"{EXTERNAL_API_URL}/history?symbol={symbol}&range={range}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Unable to retrieve historical data")

    data = response.json()
    if not data:
        raise HTTPException(status_code=404, detail="No historical data found")

    return data
