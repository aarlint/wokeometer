import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://olcvijkvhkndlwqhqcry.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sY3Zpamt2aGtuZGx3cWhxY3J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNTQ1NTksImV4cCI6MjA1ODYzMDU1OX0.mnteYq0a3QYXT6o_ZEPlUb-zctnB0SY6NB_1l_EzBRA'

export const supabase = createClient(supabaseUrl, supabaseKey) 