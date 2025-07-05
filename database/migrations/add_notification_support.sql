-- Add expo_push_token column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS expo_push_token TEXT;

-- Add sent column to care_reminders table to track sent notifications
ALTER TABLE care_reminders 
ADD COLUMN IF NOT EXISTS sent TIMESTAMP WITH TIME ZONE;

-- Create index for better performance on reminder queries
CREATE INDEX IF NOT EXISTS idx_care_reminders_due 
ON care_reminders (reminder_time) 
WHERE sent IS NULL;

-- Create index for user tokens
CREATE INDEX IF NOT EXISTS idx_users_expo_token 
ON users (expo_push_token) 
WHERE expo_push_token IS NOT NULL;

-- Add RLS policies for expo_push_token
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only update their own expo_push_token
CREATE POLICY "Users can update their own expo_push_token" ON users
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can only read their own expo_push_token
CREATE POLICY "Users can read their own expo_push_token" ON users
FOR SELECT USING (auth.uid() = id); 