-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  show_name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  questions JSONB NOT NULL,
  score DECIMAL NOT NULL,
  category TEXT NOT NULL,
  show_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create an index on show_name for faster searches
CREATE INDEX IF NOT EXISTS idx_assessments_show_name ON assessments(show_name);

-- Create an index on date for faster sorting
CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(date);

-- Enable Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since we're using the anon key)
CREATE POLICY "Allow all operations for authenticated users" ON assessments
  FOR ALL
  USING (true)
  WITH CHECK (true); 