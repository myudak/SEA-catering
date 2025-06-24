-- Add profile_picture_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN profile_picture_url VARCHAR(500);

-- Add comment for documentation
COMMENT ON COLUMN profiles.profile_picture_url IS 'URL link to user profile picture image';

-- Create index for potential future queries (optional)
CREATE INDEX IF NOT EXISTS profiles_picture_url_idx ON profiles(profile_picture_url) 
WHERE profile_picture_url IS NOT NULL;
