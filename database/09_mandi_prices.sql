-- 09_mandi_prices.sql
-- Run anywhere.

CREATE TABLE mandi_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  market_name TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_kg DECIMAL NOT NULL,
  date_recorded DATE DEFAULT CURRENT_DATE,
  trend_percentage DECIMAL,
  ai_outlook TEXT,
  UNIQUE(crop_name, market_name, date_recorded)
);

ALTER TABLE mandi_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public market prices" ON mandi_prices FOR SELECT USING (true);
