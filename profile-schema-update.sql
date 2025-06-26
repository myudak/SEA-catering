-- Add profile_picture_url column to profiles table
ALTER TABLE profiles 
ADD COLUMN profile_picture_url VARCHAR(500);

-- Add comment for documentation
COMMENT ON COLUMN profiles.profile_picture_url IS 'URL link to user profile picture image';

-- Create index for potential future queries (optional)
CREATE INDEX IF NOT EXISTS profiles_picture_url_idx ON profiles(profile_picture_url) 
WHERE profile_picture_url IS NOT NULL;


CREATE FUNCTION is_admin(uuid)
RETURNS boolean
LANGUAGE sql
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = $1 AND role = 'admin'
  )
$$;

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile; users only their own"
ON profiles
FOR UPDATE
USING (
  auth.uid() = user_id OR is_admin(auth.uid())
)
WITH CHECK (
  auth.uid() = user_id OR is_admin(auth.uid())
);
