-- Initial database schema for ChatMesh user registration system

-- Companies that have employee (must be created first due to foreign key)
CREATE TABLE IF NOT EXISTS company (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE IF NOT EXISTS employee (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar TEXT,
  company_id INTEGER,
  position TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES company (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_employee_email ON employee(email);

-- sessions (LOGGED IN employee session)
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employee (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_employee_id ON session(employee_id);
CREATE INDEX IF NOT EXISTS idx_session_expires_at ON session(expires_at);

-- Auth Codes
CREATE TABLE IF NOT EXISTS auth_code (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_code_email ON auth_code(email);
CREATE INDEX IF NOT EXISTS idx_auth_code_created_at ON auth_code(created_at);

-- Customers (customers are on a chat platform)
CREATE TABLE IF NOT EXISTS customer (
  id INTEGER PRIMARY KEY,
  customer_id TEXT NOT NULL,
  company_id INTEGER NOT NULL,
  platform TEXT NOT NULL,
  name TEXT,
  avatar TEXT,
  platform_channel_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customer(customer_id, company_id);

-- Messages (All messages in a convo. They can be sent either by a customer or an employee)
CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    company_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- set which employee sent the message. If not set, then the customer sent them essage
    employee_id TEXT 
    -- FOREIGN KEY (employee_id) REFERENCES employee(id),
    -- FOREIGN KEY (customer_id) REFERENCES customers(id),
    -- CHECK (employee_id IS NOT NULL OR customer_id IS NOT NULL),
    -- CHECK (employee_id IS NULL OR customer_id IS NULL)
);