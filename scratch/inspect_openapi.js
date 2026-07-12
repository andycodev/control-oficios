import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim();
const supabaseAnonKey = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim();

async function run() {
  const url = `${supabaseUrl}/rest/v1/`;
  const response = await fetch(url, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  console.log("Status:", response.status);
  const text = await response.text();
  console.log("Response text first 1000 chars:", text.substring(0, 1000));
}
run();
