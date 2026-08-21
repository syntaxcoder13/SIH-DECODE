import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError
from dotenv import load_dotenv

# Load env variables
load_dotenv()

db_url = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/aegis_soc")
print(f"Original DB URL: {db_url}")

# Parse the original DB URL to connect to the default 'postgres' database
# Example: postgresql+psycopg2://postgres:postgres@localhost:5432/aegis_soc -> postgresql+psycopg2://postgres:postgres@localhost:5432/postgres
base_url, db_name = db_url.rsplit('/', 1)
default_db_url = f"{base_url}/postgres"
print(f"Connecting to default DB URL: {default_db_url}")

engine = create_engine(default_db_url)
conn = engine.connect()

# Set isolation level to AUTOCOMMIT because we cannot run CREATE DATABASE within a transaction
conn = conn.execution_options(isolation_level="AUTOCOMMIT")

try:
    conn.execute(text(f'CREATE DATABASE "{db_name}"'))
    print(f"Database '{db_name}' created successfully.")
except ProgrammingError as e:
    if "already exists" in str(e):
        print(f"Database '{db_name}' already exists.")
    else:
        raise
finally:
    conn.close()
    engine.dispose()
