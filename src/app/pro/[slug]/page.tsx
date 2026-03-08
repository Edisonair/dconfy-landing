import { createClient } from '@supabase/supabase-js';
import * as LucideIcons from 'lucide-react';
import ActionButtons from './ActionButtons';
import PublicGallery from './PublicGallery';
import ContactButtons from './ContactButtons'; // 🚀 IMPORTAMOS EL NUEVO COMPONENTE

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const checkIfUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const PROVINCES: Record<string, string> = {
    '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería', '05': 'Ávila',
    '06': 'Badajoz', '07': 'Islas Baleares', '08': 'Barcelona', '09': 'Burgos', '10': 'Cáceres',
    '11': 'Cádiz', '12': 'Castellón', '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña',
    '16': 'Cuenca', '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Guipúzcoa',
    '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lleida',
    '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '29': 'Málaga', '30': 'Murcia',
    '31': 'Navarra', '32': 'Ourense', '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas',
    '36': 'Pontevedra', '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
    '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel', '45': 'Toledo',
    '46': 'Valencia', '47': 'Valladolid', '48': 'Vizcaya', '49': 'Zamora', '50': 'Zaragoza',
    '51': 'Ceuta', '52': 'Melilla'
};

const getIconForCategoryFallback = (category: string) => {
    if (!category) return <LucideIcons.Briefcase className="w-4 h-4" />;

    const cat = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    if (cat.includes('abogad') || cat.includes('legal') || cat.includes('ley') || cat.includes('juridic')) return <LucideIcons.Scale className="w-4 h-4" />;
    if (cat.includes('asesor') || cat.includes('gestor') || cat.includes('financier') || cat.includes('contable') || cat.includes('banco') || cat.includes('econom') || cat.includes('consultor')) return <LucideIcons.Briefcase className="w-4 h-4" />;
    if (cat.includes('seguro')) return <LucideIcons.Shield className="w-4 h-4" />;
    if (cat.includes('psicolog') || cat.includes('terap') || cat.includes('mente') || cat.includes('coach') || cat.includes('psiquiatr')) return <LucideIcons.Brain className="w-4 h-4" />;
    if (cat.includes('fontaner') || cat.includes('reform') || cat.includes('construc') || cat.includes('obras') || cat.includes('albanil') || cat.includes('arquitect') || cat.includes('instalador')) return <LucideIcons.Wrench className="w-4 h-4" />;
    if (cat.includes('electri') || cat.includes('iluminacion') || cat.includes('energia')) return <LucideIcons.Zap className="w-4 h-4" />;
    if (cat.includes('pintor') || cat.includes('pintura') || cat.includes('decoracion')) return <LucideIcons.Paintbrush className="w-4 h-4" />;
    if (cat.includes('limpiez') || cat.includes('asistent')) return <LucideIcons.Sparkles className="w-4 h-4" />;
    if (cat.includes('fisioterap') || cat.includes('salud') || cat.includes('medic') || cat.includes('bienestar') || cat.includes('enfermer') || cat.includes('clinic') || cat.includes('dental') || cat.includes('dentist') || cat.includes('nutricion') || cat.includes('osteopat') || cat.includes('quiropractic')) return <LucideIcons.Heart className="w-4 h-4" />;
    if (cat.includes('entrenador') || cat.includes('deport') || cat.includes('fitness') || cat.includes('gimnasio') || cat.includes('yoga') || cat.includes('pilates') || cat.includes('personal trainer')) return <LucideIcons.Dumbbell className="w-4 h-4" />;
    if (cat.includes('peluquer') || cat.includes('estetic') || cat.includes('belleza') || cat.includes('barber') || cat.includes('maquillaj') || cat.includes('unas') || cat.includes('salon') || cat.includes('laser')) return <LucideIcons.Scissors className="w-4 h-4" />;
    if (cat.includes('motor') || cat.includes('coche') || cat.includes('mecanic') || cat.includes('taller') || cat.includes('vehiculo') || cat.includes('moto') || cat.includes('chapista')) return <LucideIcons.Car className="w-4 h-4" />;
    if (cat.includes('mensajer') || cat.includes('reparto') || cat.includes('logistic') || cat.includes('envio') || cat.includes('transporte') || cat.includes('mudanz') || cat.includes('porte')) return <LucideIcons.Package className="w-4 h-4" />;
    if (cat.includes('mascot') || cat.includes('veterinar') || cat.includes('perro') || cat.includes('animal') || cat.includes('gato') || cat.includes('adiestrador') || cat.includes('paseador')) return <LucideIcons.Dog className="w-4 h-4" />;
    if (cat.includes('informatic') || cat.includes('ordenador') || cat.includes('tech') || cat.includes('desarrollador') || cat.includes('programador') || cat.includes('web') || cat.includes('software') || cat.includes('tecnolog') || cat.includes('reparacion movil')) return <LucideIcons.Laptop className="w-4 h-4" />;
    if (cat.includes('fotograf') || cat.includes('audiovisual') || cat.includes('video') || cat.includes('produccion') || cat.includes('camarograf')) return <LucideIcons.Camera className="w-4 h-4" />;
    if (cat.includes('diseno') || cat.includes('grafico') || cat.includes('ilustrador') || cat.includes('creativo') || cat.includes('arte') || cat.includes('artista') || cat.includes('artesan')) return <LucideIcons.Palette className="w-4 h-4" />;
    if (cat.includes('marketing') || cat.includes('publicidad') || cat.includes('seo') || cat.includes('redes sociales') || cat.includes('comunicacion') || cat.includes('agencia')) return <LucideIcons.Megaphone className="w-4 h-4" />;
    if (cat.includes('inmobiliar') || cat.includes('bienes raices') || cat.includes('propiedad') || cat.includes('alquiler') || cat.includes('real estate')) return <LucideIcons.Building className="w-4 h-4" />;
    if (cat.includes('tienda') || cat.includes('comercio') || cat.includes('retail') || cat.includes('ventas') || cat.includes('florister')) return <LucideIcons.Store className="w-4 h-4" />;
    if (cat.includes('profesor') || cat.includes('clase') || cat.includes('educacion') || cat.includes('idiom') || cat.includes('ingles') || cat.includes('docent') || cat.includes('academia') || cat.includes('tutor')) return <LucideIcons.GraduationCap className="w-4 h-4" />;
    if (cat.includes('evento') || cat.includes('fiesta') || cat.includes('boda') || cat.includes('dj') || cat.includes('music') || cat.includes('animacion') || cat.includes('espectacul') || cat.includes('wedding')) return <LucideIcons.PartyPopper className="w-4 h-4" />;
    if (cat.includes('restauran') || cat.includes('comida') || cat.includes('chef') || cat.includes('catering') || cat.includes('pasteler') || cat.includes('hosteleria') || cat.includes('bar') || cat.includes('cafeteria') || cat.includes('reposteria')) return <LucideIcons.Utensils className="w-4 h-4" />;
    if (cat.includes('cuidador') || cat.includes('ninera') || cat.includes('canguro') || cat.includes('mayores') || cat.includes('infantil')) return <LucideIcons.Users className="w-4 h-4" />;
    if (cat.includes('hogar') || cat.includes('casa')) return <LucideIcons.Home className="w-4 h-4" />;

    return <LucideIcons.Briefcase className="w-4 h-4" />;
};

const renderIcon = (dbIconName: string | null, categoryText: string) => {
    if (dbIconName && (LucideIcons as any)[dbIconName]) {
        const IconComponent = (LucideIcons as any)[dbIconName];
        return <IconComponent className="w-4 h-4" />;
    }
    return getIconForCategoryFallback(categoryText);
};

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
            images: [{ url: imageUrl, width: 1200, height: 630, alt: `Perfil de ${profile.professional_name || profile.full_name}` }],
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
        .select('*, categories(*)')
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

    let dbIconName = null;
    if (profile.categories) {
        const catArray = Array.isArray(profile.categories) ? profile.categories[0] : profile.categories;
        dbIconName = catArray?.icon_name || null;
    }

    if (!dbIconName && profile.category) {
        const { data: catData } = await supabase.from('categories').select('icon_name').eq('name', profile.category).maybeSingle();
        if (catData) dbIconName = catData.icon_name;
    }

    const { data: reviews, count } = await supabase
        .from('recommendations')
        .select('*, profiles!recommendations_user_id_fkey(full_name, avatar_url)', { count: 'exact' })
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(3);

    const provinceFromZip = profile.zip_code && profile.zip_code.length === 5 ? PROVINCES[profile.zip_code.substring(0, 2)] : '';
    const finalProvince = profile.province || provinceFromZip || '';
    const displayLocation = `${profile.location || 'España'}${finalProvince ? `, ${finalProvince}` : ''}`;

    return (
        <div className="min-h-screen bg-[#FFF9F2] pb-36 font-sans selection:bg-violet-200">

            <header className="flex justify-between items-center py-6 max-w-xl mx-auto px-4">
                <img src="/icon.png" alt="dconfy" className="h-11 sm:h-11 object-contain" />
                <a
                    href="https://dconfy.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-600 text-[13px] font-bold px-4 py-1.5 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 shadow-sm"
                >
                    Profesional en <span className="text-orange-600">dconfy.app</span>
                </a>
            </header>

            <main className="max-w-xl mx-auto px-4 space-y-6">

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">

                    <div className="flex items-center gap-4 text-left w-full mb-4">
                        <img
                            src={profile.professional_logo_url || profile.avatar_url}
                            alt={profile.professional_name}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-sm border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2 truncate">
                                {profile.professional_name || profile.full_name}
                            </h1>

                            <div className="flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-200/60 px-3 py-1 rounded-full w-fit mb-2">
                                {renderIcon(dbIconName, profile.specialty || profile.category)}
                                <span className="font-bold text-sm tracking-tight">{profile.specialty || profile.category}</span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-500 font-medium text-sm truncate">
                                <span>📍</span>
                                <span className="truncate">{displayLocation}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50/50 border border-slate-100 p-4 rounded-2xl mb-6">
                        <div className="flex-none">
                            {profile.price_per_hour > 0 ? (
                                <>
                                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{profile.price_per_hour}€</span>
                                    <span className="text-slate-500 font-medium ml-1">/h</span>
                                </>
                            ) : (
                                <div className="flex flex-col text-[11px] font-black text-slate-400 uppercase tracking-widest leading-snug">
                                    <span>Precio a</span>
                                    <span>Consultar</span>
                                </div>
                            )}
                        </div>

                        {/* 🚀 INVOCAMOS A NUESTRO NUEVO COMPONENTE DE BOTONES */}
                        <ContactButtons profile={profile} slug={slug} />

                    </div>

                    <div className="flex items-center justify-start gap-2 mb-6 ml-1">
                        <LucideIcons.Heart className="w-6 h-6 fill-[#FF6600] text-[#FF6600]" />
                        <span className="text-[16px] font-black text-[#FF6600]">{count || 0}</span>
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Recomendaciones</span>
                    </div>

                    {profile.bio && (
                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-slate-700 leading-relaxed text-[15px]">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {profile.services_tags && Array.isArray(profile.services_tags) && profile.services_tags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                            {profile.services_tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="bg-violet-100 text-violet-700 px-3.5 py-1.5 rounded-lg text-xs font-bold"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <PublicGallery images={profile.gallery} />

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
                                <p className="text-slate-700 text-sm leading-relaxed">
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