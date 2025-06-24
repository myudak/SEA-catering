-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- stored in rupiah (no decimals needed)
  description TEXT NOT NULL,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb, -- store plan-specific features as JSON array
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (for ISR and public viewing)
CREATE POLICY "Anyone can view active meal plans" 
ON meal_plans FOR SELECT 
USING (is_active = true);

-- Policy for admins to view all meal plans (including inactive)
CREATE POLICY "Admins can view all meal plans" 
ON meal_plans FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to insert meal plans
CREATE POLICY "Admins can insert meal plans" 
ON meal_plans FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to update meal plans
CREATE POLICY "Admins can update meal plans" 
ON meal_plans FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy for admins to delete meal plans
CREATE POLICY "Admins can delete meal plans" 
ON meal_plans FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT ALL ON TABLE meal_plans TO authenticated;
GRANT SELECT ON TABLE meal_plans TO anon;

-- Insert default meal plans data
INSERT INTO meal_plans (name, price, description, features, sort_order) VALUES
(
  'Diet Plan',
  45000,
  'Perfect for weight management and healthy lifestyle. Our diet plan features calorie-controlled portions with fresh vegetables, lean proteins, and balanced nutrition to help you achieve your fitness goals.',
  '["Calorie-controlled portions", "Weight management focus", "Fresh vegetables & lean proteins", "Nutritionist approved", "Low-carb options available"]'::jsonb,
  1
),
(
  'Protein Plan',
  65000,
  'Designed for fitness enthusiasts and muscle building. High-protein meals with premium ingredients to support your workout routine and recovery. Each meal contains 30g+ of quality protein.',
  '["High-protein content (30g+ per meal)", "Perfect for fitness enthusiasts", "Muscle building support", "Post-workout recovery meals", "Premium protein sources"]'::jsonb,
  2
),
(
  'Royal Plan',
  85000,
  'Our premium offering with gourmet ingredients and chef-curated recipes. Experience luxury dining with organic ingredients, larger portions, and exclusive seasonal menus.',
  '["Gourmet ingredients & preparation", "Chef-curated recipes", "Premium organic ingredients", "Larger portion sizes", "Exclusive seasonal menus"]'::jsonb,
  3
)
ON CONFLICT DO NOTHING;
