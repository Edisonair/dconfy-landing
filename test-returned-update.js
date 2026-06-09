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
    // Let's first fetch a business to get its ID
    const { data: list } = await supabase.from('business_profiles').select('id, business_name, show_location').limit(1);
    if (!list || list.length === 0) {
        console.log("No businesses found");
        return;
    }

    const biz = list[0];
    console.log("Found business:", biz);

    // Let's attempt an update with .select() to see the returned row
    console.log("Updating show_location to false...");
    const { data: updated, error } = await supabase
        .from('business_profiles')
        .update({ show_location: false })
        .eq('id', biz.id)
        .select();

    if (error) {
        console.error("Error during update:", error);
    } else {
        console.log("Update returned data:", updated);
    }
}

run();
