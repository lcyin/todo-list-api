-- Initial migration for todos table
-- File: 001_create_todos_table.sql

-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at 
    BEFORE UPDATE ON todos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO todos (id, title, description, completed) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Learn Node.js', 'Study Node.js fundamentals', false),
    ('550e8400-e29b-41d4-a716-446655440002', 'Build a REST API', 'Use Express.js to create a robust API', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'Explore TypeScript', 'Deep dive into TypeScript features and best practices', false),
    ('550e8400-e29b-41d4-a716-446655440004', 'Set up CI/CD', 'Implement continuous integration and deployment pipelines', false)
ON CONFLICT (id) DO NOTHING;
