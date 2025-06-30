-- Add new columns for dynamic display data
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS badge_text TEXT DEFAULT 'Available';
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS color_scheme TEXT DEFAULT 'gray';
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS icon_emoji TEXT DEFAULT '🍽️';
ALTER TABLE meal_plans ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{"freshness": "Fresh Daily", "serving": "1 Person"}'::jsonb;

-- Update existing records with proper display data
UPDATE meal_plans SET 
    badge_text = 'Most Popular',
    color_scheme = 'green',
    icon_emoji = '🥗',
    specs = '{"freshness": "Made Fresh", "serving": "1-2 People"}'::jsonb
WHERE name = 'Diet Plan';

UPDATE meal_plans SET 
    badge_text = 'Best for Fitness',
    color_scheme = 'blue',
    icon_emoji = '💪',
    specs = '{"freshness": "Daily Prep", "serving": "1 Person"}'::jsonb
WHERE name = 'Protein Plan';

UPDATE meal_plans SET 
    badge_text = 'Premium Choice',
    color_scheme = 'purple',
    icon_emoji = '👑',
    specs = '{"freshness": "Chef Prepared", "serving": "2-4 People"}'::jsonb
WHERE name = 'Royal Plan';

-- Update image URLs with actual database values
UPDATE meal_plans SET 
    image_url = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&auto=format'
WHERE name = 'Diet Plan';

UPDATE meal_plans SET 
    image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format'
WHERE name = 'Protein Plan';

UPDATE meal_plans SET 
    image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&auto=format'
WHERE name = 'Royal Plan';
