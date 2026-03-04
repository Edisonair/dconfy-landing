import { createClient } from '@supabase/supabase-js';
import { Quote, Heart } from 'lucide-react';
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
    const imageUrl = profile.professional_logo_url || profile.avatar_url || 'https://dconfy.app/dconfy_logo.png';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://dconfy.app/pro/${slug}`,
            siteName: 'dconfy',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `Perfil de ${profile.professional_name || profile.full_name}`,
                }
            ],
            locale: 'es_ES',
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        }
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

            {/* 🚀 NUEVO HEADER: Logo a la izquierda, Botón a la derecha */}
            <header className="flex justify-between items-center py-6 max-w-xl mx-auto px-4">
                <img src="/dconfy_logo.png" alt="dconfy" className="h-7 sm:h-8 object-contain" />
                <a
                    href="https://dconfy.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-600 text-[13px] font-bold px-4 py-1.5 rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                >
                    dconfy.app
                </a>
            </header>

            <main className="max-w-xl mx-auto px-4 space-y-6">

                {/* TARJETA PRINCIPAL */}
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                    <div className="flex items-center gap-4 text-left w-full mb-4">
                        <img
                            src={profile.professional_logo_url || profile.avatar_url}
                            alt={profile.professional_name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
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

                    {/* INDICADOR DE RECOMENDACIONES */}
                    <div className="flex items-center justify-start gap-2 mb-6 ml-1">
                        <Heart className="w-5 h-5 fill-[#FF6600] text-[#FF6600]" />
                        <span className="text-[16px] font-black text-[#FF6600]">{count || 0}</span>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recomendaciones</span>
                    </div>

                    {profile.bio && (
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-slate-700 leading-relaxed text-[15px]">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* IMÁGENES DE GALERÍA */}
                    {profile.gallery && profile.gallery.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-3 w-full">
                                {profile.gallery.slice(0, 2).map((imgUrl: string, index: number) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`Trabajo ${index + 1}`}
                                        className="w-full h-48 sm:h-56 object-cover rounded-2xl shadow-sm border border-slate-100"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* REVIEWS */}
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