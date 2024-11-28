DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Branch;
DROP TABLE IF EXISTS Token;

-- Drop types if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'us_state') THEN
        DROP TYPE us_state;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'branch') THEN
        DROP TYPE branch;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_cat') THEN
        DROP TYPE transaction_cat;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_stat') THEN
        DROP TYPE transaction_stat;
    END IF;
END $$;

CREATE TYPE us_state AS ENUM('AZ', 'CA', 'WA', 'NY', 'TX', 'IL');
CREATE TYPE transaction_cat AS ENUM('USER_USER', 'DEPOSIT', 'WITHDRAWAL', 'CREDIT_REPAYMENT', 'FD_EXPIRY', 'FD_BREAK');
CREATE TYPE transaction_stat AS ENUM('INITIATED', 'FAILED', 'SENT', 'COMPLETE');

CREATE TABLE Branch (
  branch_id VARCHAR(255) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  balance DECIMAL(15, 2) NOT NULL
);

CREATE TABLE Customers (
  customer_id VARCHAR(255) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(255),
  last_name VARCHAR(255) NOT NULL,
  loc TEXT,
  pinCode INT,
  st us_state,
  credit_limit DECIMAL(15, 2),
  credit_usage DECIMAL(15, 2),
  credit_score INT,
  registration_time TIMESTAMP,
  branch_id VARCHAR(255),
  balance DECIMAL(15, 2),
  FOREIGN KEY (branch_id) REFERENCES Branch(branch_id)
);

CREATE TABLE Transactions (
  transaction_id VARCHAR(255) PRIMARY KEY,
  from_id VARCHAR(255),
  to_id VARCHAR(255),
  cat transaction_cat,
  amount DECIMAL(15, 2),
  timestamp_init TIMESTAMP,
  stat transaction_stat,
  timestamp_complete TIMESTAMP,
  FOREIGN KEY (from_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (to_id) REFERENCES Customers(customer_id) ON DELETE SET NULL,
  FOREIGN KEY (from_id) REFERENCES Branch(branch_id) ON DELETE SET NULL,
  FOREIGN KEY (to_id) REFERENCES Branch(branch_id) ON DELETE SET NULL
);

CREATE TABLE Token (
  token_id VARCHAR(255) UNIQUE,
  for_id VARCHAR(255) PRIMARY KEY,
  branch BOOLEAN
);

INSERT INTO Branch VALUES ('the-main-branch', '5f4dcc3b5aa765d61d8327deb882cf99', 'The Main Branch', 10000);
INSERT INTO Customers (customer_id, password_hash, first_name, middle_name, last_name, loc, pinCode, st, credit_limit, credit_usage, credit_score, registration_time, branch_id, balance) VALUES
('CUST001', '5f4dcc3b5aa765d61d8327deb882cf99', 'John', 'A.', 'Doe', '123 Elm Street, Springfield', 62701, 'AZ', 10000.00, 2000.50, 720, '2023-05-15 14:30:00', 'the-main-branch', 5000.75),
('CUST002', '5f4dcc3b5aa765d61d8327deb882cf99', 'Jane', 'B.', 'Smith', '456 Oak Avenue, Lincoln', 68508, 'TX', 15000.00, 3000.00, 680, '2022-03-20 09:15:00', 'the-main-branch', 3500.20),
('CUST003', '5f4dcc3b5aa765d61d8327deb882cf99', 'Alice', 'C.', 'Johnson', '789 Maple Drive, Denver', 80203, 'AZ', 20000.00, 5000.25, 750, '2021-08-25 16:45:00', 'the-main-branch', 8000.00),
('CUST004', '5f4dcc3b5aa765d61d8327deb882cf99', 'Robert', 'D.', 'Williams', '321 Pine Street, Austin', 73301, 'TX', 25000.00, 4500.75, 690, '2020-11-13 10:05:00', 'the-main-branch', 7000.50),
('CUST005', '5f4dcc3b5aa765d61d8327deb882cf99', 'Emily', NULL, 'Brown', '654 Cedar Lane, Portland', 97201, 'AZ', 12000.00, 2200.00, 710, '2023-02-05 11:20:00', 'the-main-branch', 4000.00),
('CUST006', '5f4dcc3b5aa765d61d8327deb882cf99', 'David', NULL, 'Davis', '987 Birch Blvd, Seattle', 98101, 'WA', 18000.00, 8000.00, 640, '2021-09-29 17:35:00', 'the-main-branch', 2000.00),
('CUST007', '5f4dcc3b5aa765d61d8327deb882cf99', 'Sarah', 'E.', 'Wilson', '258 Redwood Road, Boston', 02118, 'AZ', 22000.00, 9500.00, 700, '2022-07-12 14:55:00', 'the-main-branch', 3000.00),
('CUST008', '5f4dcc3b5aa765d61d8327deb882cf99', 'Chris', 'F.', 'Martinez', '741 Spruce Avenue, Miami', 33101, 'CA', 16000.00, 7000.00, 720, '2023-01-10 08:00:00', 'the-main-branch', 4500.00),
('CUST009', '5f4dcc3b5aa765d61d8327deb882cf99', 'Laura', NULL, 'Taylor', '963 Fir Court, Nashville', 37201, 'AZ', 13000.00, 1200.00, 760, '2021-04-22 13:45:00', 'the-main-branch', 5200.30),
('CUST010', '5f4dcc3b5aa765d61d8327deb882cf99', 'Michael', 'G.', 'Anderson', '159 Palm Street, Phoenix', 85001, 'AZ', 17000.00, 2000.00, 670, '2022-10-18 18:30:00', 'the-main-branch', 3700.00);