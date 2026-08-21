import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/aegis_soc"

def create_db_engine(url: str):
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})
    return create_engine(url, pool_pre_ping=True, pool_recycle=3600)

try:
    engine = create_db_engine(DATABASE_URL)
    # Test connection if using external database like PostgreSQL
    if not DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
except Exception as e:
    print(f"[!] Database connection to PostgreSQL failed ({e}). Falling back to SQLite.")
    sqlite_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "aegis_soc.db")
    DATABASE_URL = f"sqlite:///{sqlite_db_path}"
    engine = create_db_engine(DATABASE_URL)

# Session local factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base
Base = declarative_base()

# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

