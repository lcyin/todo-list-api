## Database & Migration System

The application uses PostgreSQL with a comprehensive migration system that tracks and manages database schema changes across all environments.

### Database Features

- **PostgreSQL Integration**: Full PostgreSQL support with connection pooling
- **Migration Tracking**: Database-tracked migration system prevents duplicate executions
- **Environment Isolation**: Separate databases for development, test, and production
- **Automatic Schema Management**: SQL-based migrations with rollback safety
- **Sample Data Seeding**: Pre-populated test data for development

### Migration System

#### Migration Files Structure
```
migrations/
└── 001_create_todos_table.sql    # Initial todos table creation
```

#### Migration Commands
```bash
# Run migrations for different environments
npm run migrate              # Development database
npm run migrate:test        # Test database  
npm run migrate:prod        # Production database

# Check migration status
npm run migrate:status      # View executed and pending migrations
```

#### Migration Features

1. **Automatic Tracking**: Creates `migrations` table to track executed migrations
2. **Idempotent Operations**: Safe to run multiple times without duplicating changes
3. **Transaction Safety**: Each migration runs in a database transaction
4. **Ordered Execution**: Migrations execute in alphabetical/numeric order
5. **Detailed Logging**: Comprehensive logs of migration progress and errors

#### Sample Migration Output
```bash
✅ Loaded .env.development
✅ Database connection successful
✅ Migrations tracking table ensured
✅ Migration completed: 001_create_todos_table.sql
✅ All migrations completed successfully
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Todos Table
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Database Features
- **UUID Primary Keys**: Uses PostgreSQL's `gen_random_uuid()` for unique, secure IDs
- **Automatic Timestamps**: `created_at` and `updated_at` managed by database triggers
- **Foreign Key Relationships**: Todos linked to users with CASCADE delete
- **Performance Indexes**: Optimized queries on `email`, `user_id`, `completed`, and timestamp columns
- **Data Validation**: Database-level constraints ensure data integrity
- **Email Uniqueness**: Database-enforced unique constraint on user emails
- **User Data Protection**: Cascading deletes ensure no orphaned todos
