-- 03_chatbot_history.sql
-- Requires: 02_profiles.sql

CREATE TABLE chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New AI Session',
  language VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT CHECK (sender_type IN ('user', 'assistant')) NOT NULL,
  message_text TEXT NOT NULL,
  intent_category TEXT,
  action_card_json JSONB,
  audio_url TEXT,
  attached_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own chat sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own chat sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users access their own chat messages" ON chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM chat_sessions WHERE id = chat_messages.session_id AND user_id = auth.uid())
);
