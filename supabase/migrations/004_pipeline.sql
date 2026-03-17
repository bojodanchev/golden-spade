CREATE TYPE deal_stage AS ENUM ('initial_contact', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost');
CREATE TYPE deal_type AS ENUM ('sponsorship', 'advertising', 'membership', 'event', 'partnership');

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  stage deal_stage NOT NULL DEFAULT 'initial_contact',
  deal_type deal_type NOT NULL,
  value_eur NUMERIC(12,2),
  probability INTEGER DEFAULT 10 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER deals_updated_at BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add FK from interactions to deals
ALTER TABLE interactions ADD CONSTRAINT interactions_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL;

CREATE TABLE deal_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  from_stage deal_stage,
  to_stage deal_stage NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX deal_stage_history_deal_idx ON deal_stage_history(deal_id);
