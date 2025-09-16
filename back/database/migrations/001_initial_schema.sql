-- Initial database schema for ChatMesh user registration system

-- Companies that have employee (must be created first due to foreign key)
CREATE TABLE IF NOT EXISTS company (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  logo TEXT,
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
  platform TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  platform_channel_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customer(customer_id);

-- Conversations (For now, convo can be created to a single platform customer. All employees can see it.)
CREATE TABLE IF NOT EXISTS convo (
  id INTEGER PRIMARY KEY,
  customer_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  assigned_to INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES employee (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_convos_customer_id ON convo(customer_id);

-- Messages (All messages in a convo. They can be sent either by a customer or an employee)
CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    employee_id TEXT,
    customer_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employee(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    CHECK (employee_id IS NOT NULL OR customer_id IS NOT NULL),
    CHECK (employee_id IS NULL OR customer_id IS NULL)
);