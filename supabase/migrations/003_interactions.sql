CREATE TYPE interaction_type AS ENUM ('email', 'call', 'meeting', 'linkedin', 'note', 'whatsapp');
CREATE TYPE interaction_direction AS ENUM ('inbound', 'outbound');

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  deal_id UUID, -- FK added after deals table
  type interaction_type NOT NULL,
  direction interaction_direction,
  subject TEXT,
  content TEXT,
  outcome TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX interactions_contact_idx ON interactions(contact_id);
CREATE INDEX interactions_occurred_at_idx ON interactions(occurred_at DESC);

CREATE TYPE follow_up_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE follow_up_status AS ENUM ('pending', 'completed', 'overdue');

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority follow_up_priority NOT NULL DEFAULT 'medium',
  status follow_up_status NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX follow_ups_due_date_idx ON follow_ups(due_date);
CREATE INDEX follow_ups_status_idx ON follow_ups(status);
