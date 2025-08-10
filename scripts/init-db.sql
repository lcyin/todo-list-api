-- Initialize the todo database
-- This script runs when the PostgreSQL container starts for the first time

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the completed column for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create an index on the created_at column for sorting
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Insert some sample data
INSERT INTO todos (title, description, completed) VALUES
    ('Learn TypeScript', 'Study TypeScript fundamentals', false),
    ('Build REST API', 'Create a todo list API with Express', false),
    ('Write tests', 'Add comprehensive test coverage', false),
    ('Deploy application', 'Deploy to production environment', true),
    ('Update documentation', 'Keep README and docs up to date', true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function before any update
CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
