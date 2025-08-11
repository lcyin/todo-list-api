-- Seed data for the todos table
-- This script inserts sample data into the database

-- Insert some sample data
INSERT INTO todos (title, description, completed) VALUES
    ('Learn TypeScript', 'Study TypeScript fundamentals', false),
    ('Build REST API', 'Create a todo list API with Express', false),
    ('Write tests', 'Add comprehensive test coverage', false),
    ('Deploy application', 'Deploy to production environment', true),
    ('Update documentation', 'Keep README and docs up to date', true);
