-- Enable UUID support
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------------------------------------------------
-- 1. ORGANIZERS (Profile Layer)
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizers (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  pin_hash TEXT NOT NULL, -- Stored as bcrypt hash
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizers ENABLE ROW LEVEL SECURITY;

-- Policies for Organizers
CREATE POLICY "Organizers can view own profile" ON organizers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow registration" ON organizers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Organizers can update own profile" ON organizers
  FOR UPDATE USING (auth.uid() = id);

------------------------------------------------------------------
-- 2. TOURNAMENTS
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES organizers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  status TEXT DEFAULT 'upcoming', -- upcoming, live, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tournaments" ON tournaments
  FOR SELECT USING (true);

CREATE POLICY "Organizers can manage own tournaments" ON tournaments
  FOR ALL USING (auth.uid() = creator_id);

------------------------------------------------------------------
-- 3. MATCHES
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  team_a TEXT NOT NULL,
  team_b TEXT NOT NULL,
  match_type TEXT DEFAULT 'T20',
  overs_per_innings INT DEFAULT 20,
  status TEXT DEFAULT 'upcoming', -- upcoming, live, completed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Tournament creators can manage matches" ON matches
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE tournaments.id = matches.tournament_id 
      AND tournaments.creator_id = auth.uid()
    )
  );

------------------------------------------------------------------
-- 4. BALL EVENTS (Real-Time Write Layer - INDUSTRY STANDARD)
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ball_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  inning INT NOT NULL, -- 1 or 2
  over_num INT NOT NULL,
  ball_num INT NOT NULL,
  runs_scored INT DEFAULT 0,
  is_extra BOOLEAN DEFAULT false,
  extra_type TEXT, -- wide, no-ball, bye, leg-bye
  is_wicket BOOLEAN DEFAULT false,
  wicket_type TEXT,
  batsman_name TEXT,
  bowler_name TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ball_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ball events" ON ball_events
  FOR SELECT USING (true);

CREATE POLICY "Authorized scorers can insert ball events" ON ball_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM matches
      JOIN tournaments ON matches.tournament_id = tournaments.id
      WHERE matches.id = ball_events.match_id
      AND tournaments.creator_id = auth.uid()
    )
  );

-- Index for fast retrieval of match history
CREATE INDEX IF NOT EXISTS idx_ball_events_match_id ON ball_events(match_id, timestamp DESC);

------------------------------------------------------------------
-- 5. MATCH SUMMARY (Read-Optimized / Cache Layer)
------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS match_summary (
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE PRIMARY KEY,
  current_inning INT DEFAULT 1,
  total_runs INT DEFAULT 0,
  total_wickets INT DEFAULT 0,
  total_overs FLOAT DEFAULT 0.0,
  batsman_stats JSONB DEFAULT '[]'::jsonb, -- Cache current batsman
  bowler_stats JSONB DEFAULT '[]'::jsonb,   -- Cache current bowler
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE match_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view summaries" ON match_summary
  FOR SELECT USING (true);

CREATE POLICY "Automated or Authorized updates" ON match_summary
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM matches
      JOIN tournaments ON matches.tournament_id = tournaments.id
      WHERE matches.id = match_summary.match_id
      AND tournaments.creator_id = auth.uid()
    )
  );

------------------------------------------------------------------
-- 6. REALTIME REPLICATION
------------------------------------------------------------------
-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE ball_events;
ALTER PUBLICATION supabase_realtime ADD TABLE match_summary;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
