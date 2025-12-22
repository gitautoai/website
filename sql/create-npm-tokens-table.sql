-- Create npm_tokens table
CREATE TABLE IF NOT EXISTS npm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id BIGINT NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  CONSTRAINT npm_tokens_owner_id_unique UNIQUE (owner_id),
  CONSTRAINT npm_tokens_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE
);

-- Create index on owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_npm_tokens_owner_id ON npm_tokens(owner_id);
