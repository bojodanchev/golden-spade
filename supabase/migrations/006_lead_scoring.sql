CREATE TABLE lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor TEXT NOT NULL,
  condition JSONB NOT NULL,
  points INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE lead_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  old_score INTEGER NOT NULL,
  new_score INTEGER NOT NULL,
  reason TEXT,
  scored_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default scoring rules
INSERT INTO lead_scoring_rules (factor, condition, points) VALUES
  ('company_size', '{"field": "company.size", "operator": "equals", "value": "enterprise"}', 25),
  ('company_size', '{"field": "company.size", "operator": "equals", "value": "large"}', 20),
  ('company_size', '{"field": "company.size", "operator": "equals", "value": "medium"}', 10),
  ('region', '{"field": "company.region", "operator": "equals", "value": "bulgaria"}', 15),
  ('region', '{"field": "company.region", "operator": "equals", "value": "balkans"}', 10),
  ('membership', '{"field": "company.is_member", "operator": "equals", "value": true}', 25),
  ('category', '{"field": "contact.category", "operator": "equals", "value": "sponsor"}', 20),
  ('category', '{"field": "contact.category", "operator": "equals", "value": "vip"}', 15),
  ('category', '{"field": "contact.category", "operator": "equals", "value": "partner"}', 10),
  ('engagement', '{"field": "interactions_count", "operator": "gte", "value": 5}', 20),
  ('engagement', '{"field": "interactions_count", "operator": "gte", "value": 3}', 10),
  ('industry_fit', '{"field": "company.type", "operator": "equals", "value": "gaming_operator"}', 20),
  ('industry_fit', '{"field": "company.type", "operator": "equals", "value": "supplier"}', 15);
