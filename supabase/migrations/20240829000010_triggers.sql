-- 10_triggers_and_realtime.sql
-- Run this LAST. Requires all previous tables.

-- Function for Auto-Profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'AgriVeda User'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update `updated_at` function
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

DROP TRIGGER IF EXISTS update_marketplace_modtime ON marketplace_products;
CREATE TRIGGER update_marketplace_modtime BEFORE UPDATE ON marketplace_products FOR EACH ROW EXECUTE PROCEDURE public.update_modified_column();

-- Enable Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE price_quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_products;
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE community_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE crop_calendars;
ALTER PUBLICATION supabase_realtime ADD TABLE seed_exchange_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE mandi_prices;
