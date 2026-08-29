-- 05_marketplace.sql
-- Requires: 01_extensions_and_enums.sql, 02_profiles.sql

CREATE TABLE marketplace_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL NOT NULL,
  retail_price DECIMAL,
  unit TEXT NOT NULL,
  available_qty DECIMAL NOT NULL,
  min_order_qty DECIMAL DEFAULT 1,
  trade_type TEXT CHECK (trade_type IN ('b2b', 'b2c', 'both')) DEFAULT 'both',
  is_certified BOOLEAN DEFAULT false,
  subsidy_info TEXT,
  image_url TEXT,
  location TEXT,
  harvest_date TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE price_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quoted_price DECIMAL NOT NULL,
  quantity DECIMAL NOT NULL,
  status quote_status_enum DEFAULT 'Open',
  negotiation_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marketplace_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES marketplace_products(id) NOT NULL,
  buyer_id UUID REFERENCES profiles(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  final_price DECIMAL NOT NULL,
  quantity DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  status order_status_enum DEFAULT 'Pending',
  shipping_address TEXT NOT NULL,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public marketplace products" ON marketplace_products FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers manage own products" ON marketplace_products FOR ALL USING (auth.uid() = seller_id);

ALTER TABLE price_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quote parties can view quotes" ON price_quotes FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));

ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order parties can manage orders" ON marketplace_orders FOR ALL USING (auth.uid() IN (buyer_id, seller_id));
