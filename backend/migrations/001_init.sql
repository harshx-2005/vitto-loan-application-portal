-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_reference VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  purpose TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for status, name, and mobile searches
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_name ON applications(name);
CREATE INDEX IF NOT EXISTS idx_applications_mobile ON applications(mobile);
