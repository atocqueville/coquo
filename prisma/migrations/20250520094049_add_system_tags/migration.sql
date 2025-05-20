-- Add system tags
INSERT INTO "Tag" ("id", "name", "color", "type")
VALUES 
  ('tag_vegetarian', 'vegetarian', '#8fdcb7', 'system'),
  ('tag_vegan', 'vegan', '#b3e194', 'system'),
  ('tag_meat', 'meat', '#fcada8', 'system'),
  ('tag_fish', 'fish', '#93dde1', 'system'),
  ('tag_gluten_free', 'gluten-free', '#2dd4bf', 'system'),
  ('tag_dairy_free', 'dairy-free', '#60a5fa', 'system'),
  ('tag_quick', 'quick', '#fb923c', 'system'),
  ('tag_summer', 'summer', '#ffdb66', 'system'),
  ('tag_winter', 'winter', '#96c1fb', 'system'),
  ('tag_autumn', 'autumn', '#ffc382', 'system'),
  ('tag_spring', 'spring', '#f9c9f5', 'system'),
  ('tag_dessert', 'dessert', '#f6b0ca', 'system'),
  ('tag_lunch', 'lunch', '#f472b6', 'system'),
  ('tag_dinner', 'dinner', '#a78bfa', 'system'),
  ('tag_spicy', 'spicy', '#f87171', 'system')
ON CONFLICT ("id") DO NOTHING;