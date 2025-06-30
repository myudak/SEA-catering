
-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  value NUMERIC NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_to TIMESTAMP WITH TIME ZONE,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add promo_code_id to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN promo_code_id UUID REFERENCES promo_codes(id) ON DELETE SET NULL;

-- Create trigger to automatically update updated_at on promo_codes
DROP TRIGGER IF EXISTS handle_updated_at ON promo_codes;
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS for promo_codes
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "Admins can manage promo codes"
ON promo_codes FOR ALL
USING (public.is_admin(auth.uid()));


-- Authenticated users can view active codes
CREATE POLICY "Authenticated users can view active promo codes"
ON promo_codes FOR SELECT
USING (is_active = true AND (valid_to IS NULL OR valid_to > NOW()));
