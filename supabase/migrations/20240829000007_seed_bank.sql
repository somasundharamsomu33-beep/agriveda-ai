-- 07_seed_bank.sql
-- Requires: 02_profiles.sql

CREATE TABLE seed_vault_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  custodian_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seed_variety TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  seed_bank_name TEXT NOT NULL,
  location TEXT NOT NULL,
  available_qty_kg DECIMAL NOT NULL,
  is_heritage BOOLEAN DEFAULT true,
  germination_rate_percent INT,
  preservation_method TEXT,
  storage_condition_json JSONB, 
  is_available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seed_exchange_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seed_id UUID REFERENCES seed_vault_items(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES profiles(id) NOT NULL,
  custodian_id UUID REFERENCES profiles(id) NOT NULL,
  requested_qty_kg DECIMAL NOT NULL,
  intended_use TEXT NOT NULL,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seed_vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE seed_exchange_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public seed vault view" ON seed_vault_items FOR SELECT USING (true);
CREATE POLICY "Users can request seeds" ON seed_exchange_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
