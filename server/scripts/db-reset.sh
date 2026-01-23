#!/usr/bin/env bash
set -e

# --- Config ---
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_NAME="commentary_db"
DB_HOST="localhost"  
DB_PORT=5432

SCHEMA_FILE="./src/db/postgresql/db-init.sql"

echo "Waiting for Postgres to be ready..."
until PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; do
  echo -n "."
  sleep 0.2
done


echo "Dropping database if exists..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Creating database..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "Running schema..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f $SCHEMA_FILE

echo "DB reset and seeded successfully!"
