-- Initial database schema for ChatMesh user registration system

-- Companies that have agents (must be created first due to foreign key)
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- agents
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  firstName TEXT,
  lastName TEXT,
  avatar TEXT,
  company_id INTEGER,
  position TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- SESSIONS (LOGGED IN USER SESSIONS)
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES agents (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Auth Codes
CREATE TABLE IF NOT EXISTS auth_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_email ON auth_codes(email);
CREATE INDEX IF NOT EXISTS idx_auth_codes_created_at ON auth_codes(created_at);

-- Customers (customers are on a chat platform)
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY,
  platform TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  platform_channel_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);

-- Conversations (For now, convo can be created to a single platform user. All agents can see it.)
CREATE TABLE IF NOT EXISTS convos (
  id INTEGER PRIMARY KEY,
  customer_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_to INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES agents (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_convos_customer_id ON convos(customer_id);

-- Messages (All messages in a convo. They can be sent either by a customer (customer) or a user (agent))
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agent_id INTEGER,
    customer_id INTEGER,
    FOREIGN KEY (agent_id) REFERENCES agents(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    CHECK (agent_id IS NOT NULL OR customer_id IS NOT NULL),
    CHECK (agent_id IS NULL OR customer_id IS NULL)
);