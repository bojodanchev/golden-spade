-- Company types
CREATE TYPE company_type AS ENUM ('gaming_operator', 'supplier', 'association', 'media', 'regulator', 'technology', 'legal', 'financial', 'other');
CREATE TYPE company_region AS ENUM ('bulgaria', 'balkans', 'europe', 'global');
CREATE TYPE company_size AS ENUM ('small', 'medium', 'large', 'enterprise');

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type company_type NOT NULL DEFAULT 'other',
  website TEXT,
  linkedin_url TEXT,
  country TEXT,
  region company_region NOT NULL DEFAULT 'bulgaria',
  size company_size,
  is_member BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Contact categories
CREATE TYPE contact_category AS ENUM ('sponsor', 'partner', 'member', 'media', 'vip', 'speaker', 'government', 'other');
CREATE TYPE lead_tier AS ENUM ('cold', 'warm', 'hot', 'qualified');

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  title TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  category contact_category NOT NULL DEFAULT 'other',
  lead_score INTEGER NOT NULL DEFAULT 0,
  lead_tier lead_tier NOT NULL DEFAULT 'cold',
  next_follow_up_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Junction tables
CREATE TABLE contact_tags (
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

CREATE TABLE company_tags (
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, tag_id)
);

-- Full-text search indexes
CREATE INDEX contacts_search_idx ON contacts USING GIN (
  to_tsvector('english', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(email, ''))
);

CREATE INDEX companies_search_idx ON companies USING GIN (
  to_tsvector('english', coalesce(name, ''))
);
