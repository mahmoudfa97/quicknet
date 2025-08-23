-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users table policies (users can only access their own data)
CREATE POLICY "Users can view their own data" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Clients table policies (users can only access their own clients)
CREATE POLICY "Users can view their own clients" ON clients 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON clients 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON clients 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON clients 
  FOR DELETE USING (auth.uid() = user_id);

-- Payments table policies (users can only access payments for their clients)
CREATE POLICY "Users can view their own payments" ON payments 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payments" ON payments 
  FOR DELETE USING (auth.uid() = user_id);
