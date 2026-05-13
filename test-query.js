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
    const { data, error } = await supabase.from('profiles').select(`
        id, slug,
        recommendations!recommendations_profile_id_fkey (
            id, author_name,
            profiles!recommendations_user_id_fkey (id, full_name, avatar_url)
        )
    `).not('slug', 'is', null).limit(2);
    console.log(JSON.stringify({ data, error }, null, 2));
}

run();
