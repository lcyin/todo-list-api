### Database Setup Instructions

#### 1. Install PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database user (if needed)
createuser -s postgres
```

#### 2. Create Databases
```bash
# Connect to PostgreSQL
psql postgres

# Create databases for each environment
CREATE DATABASE todo_list;          -- Development
CREATE DATABASE todo_list_test;     -- Testing  
CREATE DATABASE todo_list_prod;     -- Production
```

#### 3. Configure Environment Variables
Create appropriate `.env` files with database credentials (see Environment Configuration section above).

#### 4. Run Migrations
```bash
# Development environment
npm run migrate

# Test environment  
npm run migrate:test
```

#### 5. Verify Setup
```bash
# Test database connection
npm run test:db

# Start application
npm run dev
```