import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

export const supabase = createClient(
  'https://iexiqtweyghgmnpxtdzc.supabase.co', // 🔁 reemplaza por tu URL real
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlxdHdleWdoZ21ucHh0ZHpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk2MjA1OSwiZXhwIjoyMDY1NTM4MDU5fQ.6poniaVI7atEffBvuXJmmwNFpEgAmwqy_2i9J0TWLiU'               // 🔁 reemplaza por tu API Key pública
)