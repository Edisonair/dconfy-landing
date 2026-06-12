'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Loader2, ArrowRight, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// @ts-ignore
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/categoryColors';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    '51': 'Ceuta', '52': 'Melilla', 'AD': 'Andorra'
};

const GROUP_ORDER = [
    "Salud y Bienestar",
    "Belleza y Estética",
    "Hogar y Propiedades",
    "Reformas y Trabajos del Hogar",
    "Eventos y Ocio",
    "Comercios y Tiendas",
    "Mascotas",
    "Legal y Financiero",
    "Motor y Transporte",
];

const getValidHexColor = (colorString?: string | null): string | null => {
    if (!colorString) return null;
    const cleanString = colorString.trim().toLowerCase();
    if (cleanString.startsWith('#')) return cleanString;
    const colorName = cleanString.replace('text-', '').replace('bg-', '').replace('border-', '');
    const colorMap: Record<string, string> = {
        'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569',
        'red-500': '#ef4444', 'orange-500': '#f97316', 'amber-500': '#f59e0b',
        'yellow-500': '#eab308', 'green-500': '#22c55e', 'emerald-500': '#10b981',
        'teal-500': '#14b8a6', 'cyan-500': '#06b6d4', 'sky-500': '#0ea5e9',
        'blue-500': '#3b82f6', 'indigo-500': '#6366f1', 'violet-500': '#8b5cf6',
        'purple-500': '#a855f7', 'fuchsia-500': '#d946ef', 'pink-500': '#ec4899',
        'rose-500': '#f43f5e'
    };
    return colorMap[colorName] || null;
};

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return `rgba(148, 163, 184, ${alpha})`;
    let r, g, b;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function DirectoryClient() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedProSlug, setSelectedProSlug] = useState<string | null>(null);
    const [isDrawerScrolled, setIsDrawerScrolled] = useState(false);
    const [selectedProName, setSelectedProName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categorySearchQuery, setCategorySearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: catData } = await supabase.from('categories').select('*').order('name');
                if (catData) setCategories(catData);

                // Fetch profiles (with slugs, so they are public)
                const { data: profData, error: profError } = await supabase
                    .from('profiles')
                    .select('id, full_name, professional_name, slug, specialty, category, location, zip_code, avatar_url, professional_logo_url, services_tags, subscription_status, is_vip, price_per_hour, managed_by_business, recommendations!recommendations_profile_id_fkey(id, author_name, profiles!recommendations_user_id_fkey(id, full_name, avatar_url))')
                    .not('slug', 'is', null);

                if (profError) {
                    console.error("Error fetching profiles:", profError);
                }

                if (profData) {
                    // Filter out expired professionals unless they are VIP or managed by a business
                    const activeProfiles = profData.filter(p => {
                        if (p.subscription_status === 'expired' && p.is_vip !== true && p.managed_by_business !== true) {
                            return false;
                        }
                        return true;
                    });
                    setProfiles(activeProfiles);
                }
            } catch (error) {
                console.error("Error fetching directory data", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedProSlug) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setIsDrawerScrolled(false);
            setSelectedProName('');
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedProSlug]);

    const filteredCategories = useMemo(() => {
        if (!categorySearchQuery) return categories;
        return categories.filter(c => c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()));
    }, [categories, categorySearchQuery]);

    const groupedCategories = useMemo(() => {
        const groups: Record<string, any[]> = {};
        filteredCategories.forEach(cat => {
            const groupName = cat.group_name || "Otros Servicios";
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(cat);
        });
        return groups;
    }, [filteredCategories]);

    const sortedGroupKeys = Object.keys(groupedCategories).sort((a, b) => {
        const indexA = GROUP_ORDER.indexOf(a);
        const indexB = GROUP_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        if (a === "Otros Servicios") return 1;
        if (b === "Otros Servicios") return -1;
        return a.localeCompare(b);
    });

    const availableTags = useMemo(() => {
        if (!selectedCategory) return [];
        const tags = new Set<string>();
        profiles.forEach(p => {
            if (p.category === selectedCategory && Array.isArray(p.services_tags)) {
                p.services_tags.forEach((t: string) => tags.add(t));
            }
        });
        return Array.from(tags).sort();
    }, [profiles, selectedCategory]);

    const getProvince = (profile: any) => {
        if (profile.province) return profile.province;
        if (profile.zip_code && profile.zip_code.length >= 2) {
            return PROVINCES[profile.zip_code.substring(0, 2).toUpperCase()] || '';
        }
        return '';
    };

    const filteredProfiles = useMemo(() => {
        return profiles.filter(p => {
            if (selectedCategory && p.category !== selectedCategory) return false;
            if (selectedTag && (!Array.isArray(p.services_tags) || !p.services_tags.includes(selectedTag))) return false;
            if (locationQuery) {
                const query = locationQuery.toLowerCase();
                const province = getProvince(p).toLowerCase();
                const city = (p.location || '').toLowerCase();
                if (!city.includes(query) && !province.includes(query)) return false;
            }
            return true;
        });
    }, [profiles, selectedCategory, selectedTag, locationQuery]);

    if (isLoading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
                <p className="text-slate-500 font-bold text-lg">Cargando profesionales...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto mb-10 pt-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Explorar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE5518] to-[#CD1F8B]">Profesionales</span></h1>
                <p className="text-slate-600 text-lg md:text-xl font-medium">Busca, filtra y encuentra servicios de confianza cerca de ti.</p>
            </div>

            {/* SEARCH / CATEGORY & LOCATION */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto mb-8 z-20 relative px-2">

                {/* CATEGORY DROPDOWN */}
                <div className="relative flex-1">
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-12 text-[17px] font-medium cursor-pointer flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-violet-300 transition-all"
                    >
                        {selectedCategory ? (
                            <div className="flex items-center gap-3">
                                <span className="text-slate-900 font-bold truncate">
                                    {selectedCategory}
                                </span>
                            </div>
                        ) : (
                            <span className="text-slate-400 truncate">
                                ¿Qué servicio estás buscando?
                            </span>
                        )}
                        {selectedCategory ? (
                            <div
                                onClick={(e) => { e.stopPropagation(); setSelectedCategory(null); setSelectedTag(null); }}
                                className="absolute right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-slate-700"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </div>
                        ) : (
                            <Search className="absolute right-6 w-5 h-5 text-slate-400" />
                        )}
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                            <div className="p-4 border-b border-slate-50 sticky top-0 bg-white z-10">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Escribe para filtrar profesiones..."
                                        value={categorySearchQuery}
                                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 text-slate-900 text-base font-medium rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-violet-50 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto p-4 no-scrollbar space-y-6">
                                {sortedGroupKeys.map((groupTitle) => {
                                    const groupCats = groupedCategories[groupTitle];
                                    if (!groupCats || groupCats.length === 0) return null;

                                    return (
                                        <div key={groupTitle}>
                                            <h3 className="text-[13px] font-black text-slate-400 mb-2 px-2 uppercase tracking-wider">
                                                {groupTitle}
                                            </h3>
                                            <div className="flex flex-col gap-1">
                                                {groupCats.map((cat) => {
                                                    const isSelected = selectedCategory === cat.name;
                                                    const dbRawColor = cat.color_class;
                                                    const fallbackRawColor = getCategoryColor(cat.name);
                                                    const catColorHex = getValidHexColor(dbRawColor) || getValidHexColor(fallbackRawColor) || '#8b5cf6';

                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                setSelectedCategory(cat.name);
                                                                setSelectedTag(null);
                                                                setIsDropdownOpen(false);
                                                                setCategorySearchQuery('');
                                                            }}
                                                            className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer ${isSelected ? 'bg-slate-50 border border-slate-100' : 'hover:bg-slate-50 border border-transparent'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div
                                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors`}
                                                                    style={{
                                                                        backgroundColor: isSelected ? hexToRgba(catColorHex, 0.2) : hexToRgba(catColorHex, 0.1),
                                                                        color: isSelected ? catColorHex : catColorHex
                                                                    }}
                                                                >
                                                                    {getCategoryIcon(cat.icon_name || cat.name, "w-6 h-6")}
                                                                </div>
                                                                <span className={`text-[16px] text-left ${isSelected ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                                                    {cat.name}
                                                                </span>
                                                            </div>
                                                            {isSelected && (
                                                                <Check className="w-5 h-5 text-slate-900 mr-2" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {sortedGroupKeys.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 font-medium">No se encontraron profesiones.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* LOCATION INPUT */}
                <div className="relative sm:w-1/3 shrink-0">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Ciudad o Provincia..."
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        className="w-full h-full bg-white border border-slate-200 rounded-2xl py-4 pl-11 pr-4 text-[16px] font-medium outline-none focus:border-violet-300 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                    />
                </div>
            </div>

            {/* TAGS SELECTOR (IF CATEGORY HAS TAGS) */}
            {selectedCategory && availableTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0 animate-in fade-in slide-in-from-top-2 duration-300 max-w-3xl mx-auto justify-center mb-10 px-4">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-5 py-2 rounded-full text-[15px] font-bold transition-all ${!selectedTag ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        Todas
                    </button>
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-5 py-2 rounded-full text-[15px] font-bold transition-all ${selectedTag === tag ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {/* RESULTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6 relative z-10 px-4">
                {filteredProfiles.length > 0 ? filteredProfiles.map(profile => {
                    const province = getProvince(profile);
                    const locationDisplay = `${profile.location || 'España'}${province ? `, ${province}` : ''}`;
                    const slugToUse = profile.slug || profile.id; // Fallback to id if slug is missing to prevent breaking
                    const avatar = profile.professional_logo_url || profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.professional_name || profile.full_name || 'Pro')}&background=random&color=fff`;

                    return (
                        <div
                            key={profile.id}
                            onClick={() => setSelectedProSlug(slugToUse)}
                            className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 transition-all flex flex-col h-full relative overflow-hidden cursor-pointer"
                        >
                            <div className="flex items-end justify-between gap-4 mb-3 relative z-10">
                                <div className="flex-1 min-w-0">
                                    {profile.price_per_hour > 0 && (
                                        <div className="inline-flex items-center bg-slate-50 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-black tracking-tight mb-2 border border-slate-200">
                                            {profile.price_per_hour}€<span className="text-slate-400 font-bold ml-0.5">/h</span>
                                        </div>
                                    )}
                                    <h3 className="font-extrabold text-[19px] text-slate-900 truncate leading-tight mb-1 group-hover:text-violet-700 transition-colors">
                                        {profile.professional_name || profile.full_name}
                                    </h3>
                                    <p className="text-violet-600 text-sm font-bold truncate uppercase tracking-wide">
                                        {profile.specialty || profile.category}
                                    </p>
                                </div>
                                <img src={avatar} alt={profile.professional_name || profile.full_name} className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300" />
                            </div>

                            <div className="mt-auto flex flex-col w-full relative z-10">
                                {Array.isArray(profile.services_tags) && profile.services_tags.length > 0 && (
                                    <div className="flex flex-nowrap items-center gap-1.5 w-full mb-3 pr-10">
                                        {profile.services_tags.slice(0, 3).map((tag: string, i: number) => (
                                            <span key={i} title={tag} className="bg-violet-50 text-violet-700 border border-violet-100 px-2 py-1 rounded-xl text-[11px] font-bold capitalize truncate shrink">
                                                {tag}
                                            </span>
                                        ))}
                                        {profile.services_tags.length > 3 && (
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-xl text-[11px] font-bold shrink-0">
                                                +{profile.services_tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold mb-4">
                                    <span>📍</span>
                                    <span className="truncate">{locationDisplay}</span>
                                </div>

                                <div className="pt-4 border-t border-slate-100 pr-10">
                                    {profile.recommendations && profile.recommendations.length > 0 ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex -space-x-2 shrink-0">
                                                {profile.recommendations.slice(0, 3).map((review: any, i: number) => (
                                                    <img
                                                        key={i}
                                                        src={review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.profiles?.full_name || review.author_name || 'U')}&background=random&color=fff`}
                                                        alt={review.profiles?.full_name || review.author_name}
                                                        className={`w-6 h-6 rounded-full border-2 border-[#FAFAFA] object-cover relative ${i === 0 ? 'z-10' : i === 1 ? 'z-[9]' : 'z-[8]'}`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-[12px] text-slate-600 font-medium leading-tight truncate">
                                                dconfy de <span className="font-bold text-slate-900">{profile.recommendations[0]?.profiles?.full_name?.split(' ')[0] || profile.recommendations[0]?.author_name?.split(' ')[0]}</span>
                                                {profile.recommendations.length > 1 && profile.recommendations[1] && (
                                                    <>
                                                        {profile.recommendations.length === 2 ? ' y ' : ', '}
                                                        <span className="font-bold text-slate-900">{profile.recommendations[1]?.profiles?.full_name?.split(' ')[0] || profile.recommendations[1]?.author_name?.split(' ')[0]}</span>
                                                    </>
                                                )}
                                                {profile.recommendations.length > 2 && (
                                                    <> y <span className="font-bold text-slate-900">{profile.recommendations.length - 2} más</span></>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-6 h-6 rounded-full bg-slate-50 border-2 border-[#FAFAFA] flex items-center justify-center shrink-0 z-10 shadow-sm">
                                                <LucideIcons.User className="w-3 h-3 text-slate-300" />
                                            </div>
                                            <div className="text-[12px] text-slate-400 font-medium leading-tight truncate">
                                                Sin recomendaciones
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-20">
                                <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No hemos encontrado profesionales</h3>
                        <p className="text-slate-500 text-lg">Prueba con otros términos de búsqueda o elimina algunos filtros.</p>
                        <button
                            onClick={() => { setSelectedCategory(null); setSelectedTag(null); setLocationQuery(''); }}
                            className="mt-8 font-bold text-violet-600 bg-violet-50 px-8 py-3.5 rounded-full hover:bg-violet-100 transition-colors shadow-sm"
                        >
                            Limpiar todos los filtros
                        </button>
                    </div>
                )}
            </div>

            {/* DRAWER FOR PROFESSIONAL PROFILE */}
            {selectedProSlug && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/60 z-[100] animate-fade-in"
                        onClick={() => {
                            setSelectedProSlug(null);
                            setIsDrawerScrolled(false);
                            setSelectedProName('');
                        }}
                    />
                    <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#FAFAFA] z-[110] animate-slide-in-right flex flex-col h-screen shadow-2xl">
                        {/* Transparent Blur Header */}
                        <div 
                            className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 flex justify-between items-center p-4 ${
                                isDrawerScrolled 
                                    ? 'bg-[#FAFAFA]/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' 
                                    : 'bg-transparent'
                            }`}
                        >
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                {isDrawerScrolled && selectedProName && (
                                    <span className="text-sm font-bold text-slate-700 animate-in fade-in duration-300">
                                        {selectedProName}
                                    </span>
                                )}
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedProSlug(null);
                                    setIsDrawerScrolled(false);
                                    setSelectedProName('');
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-500 hover:bg-slate-200 shadow-sm transition-colors border border-slate-200/50"
                                title="Cerrar"
                            >
                                <LucideIcons.X className="w-5 h-5" />
                            </button>
                        </div>
                        <iframe
                            id="pro-profile-iframe"
                            src={`/pro/${selectedProSlug}?embed=true`}
                            className="w-full h-full flex-1 border-none bg-[#FAFAFA]"
                            onLoad={(e) => {
                                const iframe = e.currentTarget;
                                try {
                                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                                    if (iframeDoc) {
                                        const h1 = iframeDoc.querySelector('h1');
                                        if (h1) {
                                            setSelectedProName(h1.textContent || '');
                                        }

                                        const handleScroll = () => {
                                            const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
                                            setIsDrawerScrolled(scrollTop > 20);
                                        };

                                        iframe.contentWindow?.addEventListener('scroll', handleScroll, { passive: true });
                                        handleScroll();
                                    }
                                } catch (error) {
                                    console.error("Iframe scroll tracking restricted:", error);
                                }
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
