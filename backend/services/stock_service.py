# backend/app/services/stock_service.py

import requests
from fastapi import HTTPException
from app.config import ALPHA_VANTAGE_API_KEY

def get_stock_data(symbol: str):
    """
    Fetches daily time series data for a given stock symbol from Alpha Vantage.

    :param symbol: Stock ticker symbol (e.g., AAPL, GOOGL)
    :return: JSON data containing stock information
    """
    url = "https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_DAILY",
        "symbol": symbol,
        "apikey": ALPHA_VANTAGE_API_KEY
    }
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        raise HTTPException(status_code=503, detail="External API service unavailable")
    
    data = response.json()
    
    # Handle API-specific error messages
    if "Error Message" in data:
        raise HTTPException(status_code=400, detail="Invalid stock symbol")
    if "Note" in data:
        raise HTTPException(status_code=429, detail="API call frequency exceeded")
    
    return data
