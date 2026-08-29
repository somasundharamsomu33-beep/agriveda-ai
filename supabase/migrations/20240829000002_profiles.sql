-- 02_profiles.sql
-- Requires: 01_extensions_and_enums.sql

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  location TEXT,
  farm_id TEXT,
  farm_size_acres DECIMAL,
  primary_crop TEXT,
  soil_type TEXT,
  language VARCHAR(5) DEFAULT 'en',
  avatar_url TEXT,
  role user_role_enum DEFAULT 'farmer',
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users edit own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
