import { createClient } from '@supabase/supabase-js';
import { Quote, Heart, Image as ImageIcon } from 'lucide-react';
import ActionButtons from './ActionButtons';

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const checkIfUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
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

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
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
        <div className="min-h-screen bg-[#FFF9F2] pb-36 font-sans selection:bg-violet-200">

            <header className="flex justify-center py-6">
                <img src="/dconfy_logo.png" alt="dconfy" className="h-8 object-contain" />
            </header>

            <main className="max-w-xl mx-auto px-4 space-y-6">

                {/* TARJETA PRINCIPAL */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                    <div className="flex items-center gap-4 text-left w-full mb-6">
                        <img
                            src={profile.professional_logo_url || profile.avatar_url}
                            alt={profile.professional_name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-1 truncate">
                                {profile.professional_name || profile.full_name}
                            </h1>
                            <p className="text-violet-600 font-bold text-sm sm:text-base mb-1 truncate">
                                {profile.specialty || profile.category}
                            </p>
                            <div className="flex items-center gap-1 text-slate-500 font-medium text-sm truncate">
                                <span>📍</span>
                                <span className="truncate">{profile.location || 'España'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-orange-50/50 border border-orange-100 px-6 py-3 rounded-2xl">
                            <Heart className="w-6 h-6 fill-[#FF6600] text-[#FF6600]" />
                            <span className="text-3xl font-black text-[#FF6600]">{count || 0}</span>
                            <span className="text-[11px] font-bold text-orange-600/80 uppercase tracking-wider ml-1">Recomendaciones</span>
                        </div>
                    </div>

                    {profile.bio && (
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-slate-700 leading-relaxed text-[15px]">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {profile.gallery && profile.gallery.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex justify-center gap-3">
                                {profile.gallery.slice(0, 2).map((imgUrl: string, index: number) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`Trabajo ${index + 1}`}
                                        className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-slate-100"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {reviews && reviews.length > 0 && (
                    <div className="space-y-4">
                        {reviews?.map((review) => (
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