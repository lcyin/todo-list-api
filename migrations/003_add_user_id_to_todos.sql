-- Add user_id column to todos table to establish relationship
ALTER TABLE todos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index on user_id for faster todos queries by user
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
