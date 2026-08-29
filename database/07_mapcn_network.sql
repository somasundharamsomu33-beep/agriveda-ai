-- ============================================================================
-- 07_mapcn_network.sql (Replacing legacy seed_bank)
-- Description: MAPCN (Mandi & APMC Price Commodity Network)
--              Real-time APMC Mandi Centers, Commodity Arrivals, MSP Pricing,
--              Price Alerts, and Verified Mandi Traders.
-- Requires: 02_profiles.sql
-- ============================================================================

-- 1. APMC Mandi Centers Directory
CREATE TABLE IF NOT EXISTS mapcn_mandi_centers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  market_code VARCHAR(50) UNIQUE NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  location_address TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  secretary_name VARCHAR(255),
  contact_phone VARCHAR(50),
  official_email VARCHAR(255),
  is_enam_connected BOOLEAN DEFAULT true,
  cold_storage_available BOOLEAN DEFAULT false,
  weighbridge_available BOOLEAN DEFAULT true,
  operating_hours VARCHAR(100) DEFAULT '06:00 AM - 06:00 PM',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Live Commodity Arrivals & Modal Prices
CREATE TABLE IF NOT EXISTS mapcn_commodity_arrivals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  grade VARCHAR(20) DEFAULT 'FAQ', -- Fair Average Quality (FAQ), Grade A, Grade B
  min_price_per_quintal DECIMAL(10, 2) NOT NULL,
  max_price_per_quintal DECIMAL(10, 2) NOT NULL,
  modal_price_per_quintal DECIMAL(10, 2) NOT NULL,
  msp_price_per_quintal DECIMAL(10, 2),
  arrival_volume_metric_tons DECIMAL(10, 2) NOT NULL,
  price_date DATE DEFAULT CURRENT_DATE NOT NULL,
  trend_direction VARCHAR(10) DEFAULT 'STABLE', -- 'UP', 'DOWN', 'STABLE'
  trend_percentage DECIMAL(5, 2) DEFAULT 0.00,
  ai_market_outlook TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mandi_id, crop_name, variety, price_date)
);

-- 3. Farmer Price Alerts
CREATE TABLE IF NOT EXISTS mapcn_price_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name VARCHAR(100) NOT NULL,
  target_price_per_quintal DECIMAL(10, 2) NOT NULL,
  alert_condition VARCHAR(10) DEFAULT 'ABOVE', -- 'ABOVE', 'BELOW'
  preferred_mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Verified APMC Commission Agents & Mandi Traders
CREATE TABLE IF NOT EXISTS mapcn_mandi_traders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mandi_id UUID REFERENCES mapcn_mandi_centers(id) ON DELETE CASCADE NOT NULL,
  trader_name VARCHAR(255) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  shop_number VARCHAR(50),
  apmc_license_number VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  verified_buyer BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 4.8,
  commodities_traded JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Indexes & Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_mapcn_mandi_location ON mapcn_mandi_centers(state, district);
CREATE INDEX IF NOT EXISTS idx_mapcn_arrivals_crop_date ON mapcn_commodity_arrivals(crop_name, price_date);
CREATE INDEX IF NOT EXISTS idx_mapcn_arrivals_mandi ON mapcn_commodity_arrivals(mandi_id);
CREATE INDEX IF NOT EXISTS idx_mapcn_alerts_user ON mapcn_price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_mapcn_traders_mandi ON mapcn_mandi_traders(mandi_id);

-- ----------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE mapcn_mandi_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_commodity_arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mapcn_mandi_traders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active mandi centers" ON mapcn_mandi_centers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read commodity arrivals" ON mapcn_commodity_arrivals FOR SELECT USING (true);
CREATE POLICY "Public read verified traders" ON mapcn_mandi_traders FOR SELECT USING (is_active = true);
CREATE POLICY "Users manage own price alerts" ON mapcn_price_alerts FOR ALL USING (auth.uid() = user_id);
