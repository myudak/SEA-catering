-- TABLE: testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name VARCHAR NOT NULL,
  email VARCHAR,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  profile_picture_url VARCHAR(500),
  is_authenticated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS testimonials_user_id_idx ON testimonials(user_id);
CREATE INDEX IF NOT EXISTS testimonials_status_idx ON testimonials(status);
CREATE INDEX IF NOT EXISTS testimonials_is_authenticated_idx ON testimonials(is_authenticated);
CREATE INDEX IF NOT EXISTS testimonials_rating_idx ON testimonials(rating);
CREATE INDEX IF NOT EXISTS testimonials_created_at_idx ON testimonials(created_at DESC);

-- ENABLE RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- ✅ POLICY: Public can view approved
CREATE POLICY "select: approved testimonials for public"
  ON testimonials
  FOR SELECT
  TO public
  USING (
    status = 'approved'
  );

-- ✅ POLICY: Authenticated users can view their own testimonials
CREATE POLICY "select: own testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (
    auth.uid() = user_id
  );

-- ✅ POLICY: Authenticated and anonymous users can insert
CREATE POLICY "insert: public and auth"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (
    (
      auth.uid() IS NOT NULL OR
      (auth.uid() IS NULL AND user_id IS NULL AND is_authenticated = FALSE)
    )
  );

-- ✅ POLICY: Authenticated users can update their own testimonials (optional)
CREATE POLICY "update: own testimonial"
  ON testimonials
  FOR UPDATE
  TO public
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

-- ✅ TRIGGER: auto update `updated_at`
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ✅ COMMENTS
COMMENT ON TABLE testimonials IS 'Customer testimonials supporting both authenticated and anonymous submissions.';
COMMENT ON COLUMN testimonials.user_id IS 'Nullable reference to auth.users for logged-in users.';
COMMENT ON COLUMN testimonials.email IS 'Optional email for anonymous users.';
COMMENT ON COLUMN testimonials.profile_picture_url IS 'Optional profile picture URL.';
COMMENT ON COLUMN testimonials.is_authenticated IS 'TRUE if user was logged in, FALSE otherwise.';
