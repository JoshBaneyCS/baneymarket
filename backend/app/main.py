import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .db import init_db
from .routers import auth_routes, user_routes, stock_routes, prediction_routes

load_dotenv()  # Load environment variables from .env file if present

# Create FastAPI instance
app = FastAPI(
    title="Stock Trading Platform Backend",
    description="This is the backend API for the stock trading platform.",
    version="1.0.0"
)

# Set up CORS (adjust domains as needed)
origins = [
    "http://localhost:3000",  # Frontend dev server
    # Add other frontend or client domains as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the database connection
init_db()

# Include routers
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(user_routes.router, prefix="/user", tags=["user"])
app.include_router(stock_routes.router, prefix="/stocks", tags=["stocks"])
app.include_router(prediction_routes.router, prefix="/prediction", tags=["prediction"])

@app.get("/", tags=["root"])
def read_root():
    return {"message": "Welcome to the Stock Trading Platform Backend API"}
