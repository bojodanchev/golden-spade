-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_score_history ENABLE ROW LEVEL SECURITY;

-- Profiles: read all, update own
CREATE POLICY "Profiles are viewable by authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- All CRM tables: full CRUD for authenticated users (small team)
-- Tags
CREATE POLICY "Tags full access" ON tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Companies
CREATE POLICY "Companies full access" ON companies FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contacts
CREATE POLICY "Contacts full access" ON contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Junction tables
CREATE POLICY "Contact tags full access" ON contact_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Company tags full access" ON company_tags FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Interactions
CREATE POLICY "Interactions full access" ON interactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Follow-ups
CREATE POLICY "Follow-ups full access" ON follow_ups FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Deals
CREATE POLICY "Deals full access" ON deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Deal history full access" ON deal_stage_history FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Events
CREATE POLICY "Events full access" ON events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Event guests: authenticated full access + public RSVP via token
CREATE POLICY "Event guests full access" ON event_guests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public RSVP read" ON event_guests FOR SELECT TO anon USING (rsvp_token IS NOT NULL);
CREATE POLICY "Public RSVP update" ON event_guests FOR UPDATE TO anon USING (rsvp_token IS NOT NULL) WITH CHECK (rsvp_token IS NOT NULL);

-- Event sponsors
CREATE POLICY "Event sponsors full access" ON event_sponsors FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Event follow-ups
CREATE POLICY "Event follow-ups full access" ON event_follow_ups FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Lead scoring
CREATE POLICY "Lead scoring rules full access" ON lead_scoring_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Lead score history full access" ON lead_score_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
