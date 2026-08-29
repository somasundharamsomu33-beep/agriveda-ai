-- 04_pathology.sql
-- Requires: 02_profiles.sql, 01_extensions_and_enums.sql

CREATE TABLE crop_diagnosis_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_type TEXT NOT NULL,
  soil_type TEXT,
  location TEXT,
  detected_issue TEXT NOT NULL,
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),
  risk_level risk_level_enum DEFAULT 'Medium',
  farm_health_score INT,
  image_url TEXT NOT NULL,
  cause TEXT,
  treatment_json JSONB,
  prevention_json JSONB,
  fertilizer_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crop_diagnosis_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Farmers can manage own scan reports" ON crop_diagnosis_reports FOR ALL USING (auth.uid() = farmer_id);
