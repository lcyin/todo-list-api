# Database Setup Guide

This Todo List API uses **PostgreSQL** as its primary database with Docker Compose for easy setup.

## Prerequisites

- Docker and Docker Compose installed on your system
- PostgreSQL client tools for running migrations

## Database Setup

### Using Docker (Recommended)

1. **Start the PostgreSQL database**:

```bash
docker-compose up -d postgres
```

2. **Verify database is running**:

```bash
docker-compose ps
```

3. **Run database migrations**:

```bash
npm run migrate
```

4. **Start your application**:

```bash
npm run dev
```

### Database Management Commands

```bash
# Start PostgreSQL database
docker-compose up -d postgres

# Stop database
docker-compose down

# Restart database
docker-compose restart postgres

# View database logs
docker-compose logs postgres

# Connect to database with psql
docker-compose exec postgres psql -U postgres -d todolist

# Reset database (removes all data)
docker-compose down -v && docker-compose up -d postgres
```

### Manual PostgreSQL Setup

If you prefer to use your own PostgreSQL instance:

1. Create a database and user:

```sql
CREATE DATABASE todolist;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE todolist TO postgres;
```

2. Update your `.env` file with your database credentials:

```bash
NODE_ENV=development
PORT=3000
API_VERSION=v1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=todolist
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
DB_MAX_CONNECTIONS=10
```

## Database Schema

The PostgreSQL setup automatically creates the following schema through migrations:

- `todos` table with auto-incrementing ID, title, description, completed status, and timestamps
- Proper indexes for performance
- Triggers for automatic timestamp updates

## Database Migrations

To set up or update the database schema, use the migration command:

```bash
npm run migrate
```

This command:

- Runs all SQL files in `src/db/migrations/` in alphabetical order
- Requires PostgreSQL client tools (`psql`) to be installed
- Uses environment variables from `.env` for database connection
- Executes files like `001-create-tables.sql`, `002-seed-data.sql`, etc.

**Prerequisites:**

- PostgreSQL client: `sudo apt-get install postgresql-client` (Ubuntu/Debian) or `brew install postgresql` (macOS)
- Database connection configured in `.env` file
