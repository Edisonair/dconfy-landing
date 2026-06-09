const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Fetching RLS policies for business_profiles...");
    
    // We can execute a simple select on a system view via rpc or just try to see if it allows it.
    // If there is no custom SQL RPC, we can check by selecting pg_policies.
    // Let's see if we can do it via a postgres query. Since pg_policies is a table, PostgREST might expose it if it's in the API schema (unlikely), 
    // but let's try querying pg_policies via supabase.from.
    const { data: policies, error: policiesError } = await supabase.from('pg_policies').select('*');
    if (policiesError) {
        console.log("Could not query pg_policies directly via PostgREST (expected):", policiesError.message);
    } else {
        console.log("Policies:", policies);
    }
}

run();
