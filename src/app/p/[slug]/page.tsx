import { createClient } from '@supabase/supabase-js';
import { MapPin, Quote } from 'lucide-react';
import ActionButtons from './ActionButtons';

// 1. APAGAMOS LA CACHÉ
export const dynamic = 'force-dynamic';

// Inicializa Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const checkIfUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// 🚀 CAMBIO: params ahora es una Promesa en Next.js 15
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // Esperamos a que el router nos dé el slug
    const isUUID = checkIfUUID(slug);

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq(isUUID ? 'id' : 'slug', slug)
        .single();

    if (!profile) return { title: 'Perfil no encontrado | dconfy' };

    const title = `${profile.professional_name || profile.full_name} - ${profile.specialty} | dconfy`;
    const description = `Recomendado en ${profile.location}. ${profile.bio?.substring(0, 100) || 'Descubre su perfil en dconfy.'}...`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [profile.professional_logo_url || profile.avatar_url || 'https://dconfy.app/og-default.png'],
        },
    };
}

// 🚀 CAMBIO: params ahora es una Promesa
export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // Esperamos a que el router nos dé el slug
    const isUUID = checkIfUUID(slug);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq(isUUID ? 'id' : 'slug', slug)
        .single();

    if (error) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-red-500 font-bold mb-4">Error de Supabase:</h1>
                <pre className="bg-slate-100 p-4 rounded text-left text-sm overflow-auto text-slate-800 max-w-2xl mx-auto">
                    {JSON.stringify(error, null, 2)}
                </pre>
                <p className="mt-4 text-slate-500 font-bold">Buscando slug o ID: {slug}</p>
            </div>
        );
    }

    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Perfil no encontrado.</div>;
    }

    const { data: reviews, count } = await supabase
        .from('recommendations')
        .select('*, profiles!recommendations_user_id_fkey(full_name, avatar_url)', { count: 'exact' })
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans selection:bg-violet-200">

            <header className="flex justify-center py-6">
                <img src="/logo-completo.png" alt="dconfy" className="h-8 object-contain" />
            </header>

            <main className="max-w-xl mx-auto px-4 space-y-6">

                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-violet-50 to-white"></div>

                    <img
                        src={profile.professional_logo_url || profile.avatar_url}
                        alt={profile.professional_name}
                        className="w-28 h-28 mx-auto rounded-3xl object-cover shadow-lg border-4 border-white relative z-10 bg-white"
                    />

                    <h1 className="text-2xl font-black text-slate-900 mt-4 leading-tight">
                        {profile.professional_name || profile.full_name}
                    </h1>

                    <p className="text-violet-600 font-bold text-lg mt-1">
                        {profile.specialty || profile.category}
                    </p>

                    <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium mt-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location || 'España'}</span>
                    </div>

                    <div className="mt-6 inline-flex flex-col items-center bg-violet-50 border border-violet-100 px-6 py-3 rounded-2xl">
                        <span className="text-2xl font-black text-violet-700">{count || 0}</span>
                        <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">Recomendaciones</span>
                    </div>

                    {profile.bio && (
                        <p className="text-slate-600 mt-6 leading-relaxed text-sm">
                            {profile.bio}
                        </p>
                    )}
                </div>

                {reviews && reviews.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 pl-2">Lo que dicen de su trabajo:</h2>
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${review.profiles?.full_name}`}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt="Avatar"
                                    />
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{review.profiles?.full_name}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">Recomendación verificada</p>
                                    </div>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed relative z-10">
                                    <Quote className="absolute -top-1 -left-1 w-6 h-6 text-slate-100 -z-10 transform -scale-x-100" />
                                    {review.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <ActionButtons slug={slug} />

        </div>
    );
}