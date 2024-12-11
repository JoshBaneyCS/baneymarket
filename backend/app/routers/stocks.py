# backend/app/routes/stocks.py

from fastapi import APIRouter, HTTPException
from app.services.stock_service import get_stock_data

router = APIRouter()

@router.get("/api/stocks/{symbol}")
async def fetch_stock(symbol: str):
    """
    Endpoint to fetch daily time series data for a given stock symbol.

    :param symbol: Stock ticker symbol (e.g., AAPL, GOOGL)
    :return: JSON data containing stock information
    """
    data = get_stock_data(symbol)
    return data
