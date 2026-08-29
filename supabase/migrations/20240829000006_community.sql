-- 06_community.sql
-- Requires: 02_profiles.sql

CREATE TABLE community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  crop_context TEXT,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE community_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  is_expert BOOLEAN DEFAULT false,
  is_accepted_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public community access" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public reply access" ON community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post" ON community_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can reply" ON community_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
