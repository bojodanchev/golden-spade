CREATE TYPE event_type AS ENUM ('gala_dinner', 'conference', 'networking', 'workshop', 'awards');
CREATE TYPE event_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE guest_tier AS ENUM ('vip', 'sponsor', 'speaker', 'media', 'partner', 'member', 'general');
CREATE TYPE rsvp_status AS ENUM ('pending', 'confirmed', 'declined', 'tentative');
CREATE TYPE sponsor_tier AS ENUM ('title', 'gold', 'silver', 'bronze', 'media');

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_type event_type NOT NULL,
  venue TEXT,
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  max_capacity INTEGER,
  dress_code TEXT,
  status event_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE event_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  tier guest_tier NOT NULL DEFAULT 'general',
  table_number INTEGER,
  dietary_requirements TEXT,
  plus_one BOOLEAN NOT NULL DEFAULT false,
  plus_one_name TEXT,
  rsvp_status rsvp_status NOT NULL DEFAULT 'pending',
  rsvp_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  invitation_sent_at TIMESTAMPTZ,
  rsvp_responded_at TIMESTAMPTZ,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  qr_code_data TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX event_guests_event_idx ON event_guests(event_id);
CREATE INDEX event_guests_rsvp_token_idx ON event_guests(rsvp_token);

CREATE TABLE event_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  sponsor_tier sponsor_tier NOT NULL,
  amount_eur NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  type TEXT,
  notes TEXT,
  status follow_up_status NOT NULL DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
