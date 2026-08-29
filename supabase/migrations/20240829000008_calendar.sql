-- 08_crop_calendar.sql
-- Requires: 02_profiles.sql

CREATE TABLE crop_calendars (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  crop_name TEXT NOT NULL,
  sowing_date DATE NOT NULL,
  total_duration_days INT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID REFERENCES crop_calendars(id) ON DELETE CASCADE NOT NULL,
  day_number INT NOT NULL,
  event_date DATE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, 
  description TEXT,
  recommended_time TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crop_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers manage their own calendars" ON crop_calendars FOR ALL USING (auth.uid() = farmer_id);
CREATE POLICY "Farmers manage calendar events" ON calendar_events FOR ALL USING (
  EXISTS (SELECT 1 FROM crop_calendars WHERE id = calendar_events.calendar_id AND farmer_id = auth.uid())
);
