import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { count, error } = await supabase.from('oficios').select('*', { count: 'exact', head: true });
  if (error) {
    console.log("Error counting:", error.message);
  } else {
    console.log("Total rows:", count);
  }
}
run();
