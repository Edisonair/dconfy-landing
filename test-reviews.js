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
        reviews!reviews_professional_id_fkey (
            profiles!reviews_author_id_fkey (full_name, avatar_url)
        )
    `).not('slug', 'is', null).limit(2);
    console.log(JSON.stringify({ data, error }, null, 2));
}

run();
