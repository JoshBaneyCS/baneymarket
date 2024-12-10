import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

def init_db():
    """
    This function can be called at startup to ensure that
    the database is initialized. For example, you can run
    this after migrations or to create tables if not using Alembic.
    """
    # If you are not using migrations and want to create tables directly:
    # Base.metadata.create_all(bind=engine)
    pass

def get_db():
    """
    Dependency function for getting a DB session in FastAPI endpoints.
    Example:
        @app.get("/items")
        def read_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
