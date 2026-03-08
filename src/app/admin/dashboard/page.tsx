"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
    Users, Briefcase, Star, Mail, Plus, LogOut, CheckCircle2, Clock,
    Trash2, LayoutDashboard, Ticket, BarChart3, AlertCircle, Menu, X, Heart,
    MessageCircle, Send, TrendingUp, Share2, Network
} from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🎨 DICCIONARIO DE COLORES 
const COLOR_MAP: Record<string, string> = {
    'text-purple-400': 'bg-purple-400',
    'text-fuchsia-500': 'bg-fuchsia-500',
    'text-violet-500': 'bg-violet-500',
    'text-amber-400': 'bg-amber-400',
    'text-amber-500': 'bg-amber-500',
    'text-slate-600': 'bg-slate-400',
    'text-emerald-500': 'bg-emerald-500',
    'text-red-500': 'bg-red-500',
    'text-zinc-500': 'bg-zinc-400',
    'text-zinc-600': 'bg-zinc-400',
    'text-indigo-500': 'bg-indigo-500',
    'text-pink-500': 'bg-pink-500',
    'text-teal-500': 'bg-teal-500',
    'text-blue-700': 'bg-blue-500',
    'text-sky-500': 'bg-sky-500',
    'text-blue-600': 'bg-blue-500',
    'text-orange-500': 'bg-orange-500',
    'text-yellow-500': 'bg-yellow-500',
    'text-cyan-500': 'bg-cyan-500'
};

export default function AdminDashboard() {
    const router = useRouter();

    const [activeView, setActiveView] = useState<'dashboard' | 'invitations'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [stats, setStats] = useState({
        users: 0,
        pros: 0,
        recs: 0,
        chats: 0,
        messages: 0,
        avgChats: '0',
        shared: 0,
        connections: 0
    });

    const [invitations, setInvitations] = useState<any[]>([]);

    const [interestsData, setInterestsData] = useState<{ name: string, count: number, percentage: number, color: string }[]>([]);
    const [officialSpecialties, setOfficialSpecialties] = useState<{ name: string, count: number, percentage: number, color: string }[]>([]);
    const [customSpecialties, setCustomSpecialties] = useState<{ name: string, count: number }[]>([]);

    const [newEmail, setNewEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        checkAccessAndLoadData();
    }, []);

    const checkAccessAndLoadData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/admin');
            return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile?.role !== 'super_admin') {
            router.push('/admin');
            return;
        }

        await Promise.all([loadDashboardData(), loadInvitations()]);
        setIsLoading(false);
    };

    const loadDashboardData = async () => {
        const { data: profiles } = await supabase.from('profiles').select('role, specialty, interests');
        const { data: categories } = await supabase.from('categories').select('name, color_class');

        const categoryMap = new Map<string, string>();
        categories?.forEach(c => {
            const bgClass = c.color_class ? COLOR_MAP[c.color_class] || 'bg-slate-500' : 'bg-slate-500';
            categoryMap.set(c.name.toLowerCase().trim(), bgClass);
        });

        const officialNames = new Set(categoryMap.keys());

        // TODAS LAS CONSULTAS DE RECUENTO
        const { count: recsCount } = await supabase.from('recommendations').select('*', { count: 'exact', head: true });
        const { count: chatsCount } = await supabase.from('chats').select('*', { count: 'exact', head: true });
        const { count: messagesCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
        const { count: sharedCount } = await supabase.from('shared_profiles').select('*', { count: 'exact', head: true });
        const { count: connectionsCount } = await supabase.from('connections').select('*', { count: 'exact', head: true });

        let uCount = 0;
        let pCount = 0;
        const intCounts: Record<string, number> = {};
        const specCounts: Record<string, number> = {};

        profiles?.forEach(p => {
            if (p.role === 'user') uCount++;
            if (p.specialty) pCount++;

            if (p.interests && Array.isArray(p.interests)) {
                p.interests.forEach(interest => {
                    const clean = interest.trim();
                    intCounts[clean] = (intCounts[clean] || 0) + 1;
                });
            }

            if (p.specialty) {
                const clean = p.specialty.trim();
                specCounts[clean] = (specCounts[clean] || 0) + 1;
            }
        });

        const totalChats = chatsCount || 0;
        const avg = pCount > 0 ? (totalChats / pCount).toFixed(1) : '0';

        setStats({
            users: uCount,
            pros: pCount,
            recs: recsCount || 0,
            chats: totalChats,
            messages: messagesCount || 0,
            avgChats: avg,
            shared: sharedCount || 0,
            connections: connectionsCount || 0
        });

        const sortedInterests = Object.entries(intCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 12);
        const maxInterest = sortedInterests.length > 0 ? sortedInterests[0].count : 1;
        setInterestsData(sortedInterests.map(i => {
            const color = categoryMap.get(i.name.toLowerCase()) || 'bg-slate-500';
            return { ...i, percentage: (i.count / maxInterest) * 100, color };
        }));

        const official: { name: string, count: number }[] = [];
        const custom: { name: string, count: number }[] = [];

        Object.entries(specCounts).forEach(([name, count]) => {
            if (officialNames.has(name.toLowerCase())) {
                official.push({ name, count });
            } else {
                custom.push({ name, count });
            }
        });

        const sortedOfficial = official.sort((a, b) => b.count - a.count).slice(0, 12);
        const maxOfficial = sortedOfficial.length > 0 ? sortedOfficial[0].count : 1;
        setOfficialSpecialties(sortedOfficial.map(s => {
            const color = categoryMap.get(s.name.toLowerCase()) || 'bg-blue-500';
            return { ...s, percentage: (s.count / maxOfficial) * 100, color };
        }));

        setCustomSpecialties(custom.sort((a, b) => b.count - a.count));
    };

    const loadInvitations = async () => {
        const { data } = await supabase.from('vip_invitations').select('*').order('created_at', { ascending: false });
        if (data) setInvitations(data);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;
        setIsInviting(true);

        try {
            const { error } = await supabase.from('vip_invitations').insert([{ email: newEmail.toLowerCase() }]);
            if (error) throw error;
            setNewEmail('');
            await loadInvitations();
        } catch (error: any) {
            alert(error.message.includes('unique') ? 'Este email ya está invitado.' : 'Error al invitar.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleDeleteInvite = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar esta invitación?')) return;
        await supabase.from('vip_invitations').delete().eq('id', id);
        await loadInvitations();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-violet-500/30">

            {/* 📱 NAVBAR MÓVIL */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
                <img src="/dconfy_logo_hibrid.png" alt="dconfy" className="h-6 object-contain" />
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300 bg-slate-800 rounded-lg">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* 🖥️ SIDEBAR (Menú Lateral) */}
            <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 hidden md:block">
                    <img src="/dconfy_logo_hibrid.png" alt="dconfy" className="h-8 object-contain mb-2" />
                    <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-500/20">SuperAdmin</span>
                </div>

                <nav className="flex-1 px-4 py-6 md:py-2 space-y-2 mt-16 md:mt-0">
                    <button
                        onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeView === 'dashboard' ? 'bg-[#FF6600] text-white shadow-lg shadow-[#FF6600]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" /> Dashboard BI
                    </button>

                    <button
                        onClick={() => { setActiveView('invitations'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeView === 'invitations' ? 'bg-[#FF6600] text-white shadow-lg shadow-[#FF6600]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Ticket className="w-5 h-5" /> Invitaciones VIP
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-colors">
                        <LogOut className="w-5 h-5" /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* 📦 ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">

                {/* Cabecera de Contenido */}
                <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-5 shrink-0 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-white">
                        {activeView === 'dashboard' ? 'Dashboard & Analíticas' : 'Gestión de Invitaciones'}
                    </h1>
                </header>

                {/* Contenedor scrolleable */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10 pb-20">

                        {/* 🟢 VISTA: DASHBOARD */}
                        {activeView === 'dashboard' && (
                            <>
                                {/* 1. MÉTRICAS GLOBALES (Cuadrícula 4x2 reordenada) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                    {/* --- FILA 1: ENTIDADES Y RELACIONES --- */}

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Usuarios</p>
                                            <p className="text-2xl font-black text-white">{stats.users}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0"><Network className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Conexiones Usuarios</p>
                                            <p className="text-2xl font-black text-white">{stats.connections}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0"><Briefcase className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Profesionales</p>
                                            <p className="text-2xl font-black text-white">{stats.pros}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0"><Share2 className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">PRO Compartidos</p>
                                            <p className="text-2xl font-black text-white">{stats.shared}</p>
                                        </div>
                                    </div>

                                    {/* --- FILA 2: ACTIVIDAD Y ENGAGEMENT --- */}

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[#FF6600]/10 text-[#FF6600] rounded-2xl flex items-center justify-center shrink-0"><Star className="w-6 h-6 fill-current" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Recomendaciones</p>
                                            <p className="text-2xl font-black text-white">{stats.recs}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center shrink-0"><MessageCircle className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Chats Abiertos</p>
                                            <p className="text-2xl font-black text-white">{stats.chats}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center shrink-0"><Send className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Mensajes Enviados</p>
                                            <p className="text-2xl font-black text-white">{stats.messages}</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none"><TrendingUp className="w-24 h-24 text-amber-500" /></div>
                                        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><TrendingUp className="w-6 h-6" /></div>
                                        <div className="relative z-10">
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Media Chat / Pro</p>
                                            <p className="text-2xl font-black text-white">{stats.avgChats}</p>
                                        </div>
                                    </div>

                                </div>

                                {/* 2. GRÁFICOS DE BARRAS VERTICALES (DARK MODE) */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* Gráfico: Profesiones Oficiales */}
                                    <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                            <BarChart3 className="w-6 h-6 text-blue-400" /> Profesiones Activas
                                        </h3>

                                        {officialSpecialties.length === 0 ? (
                                            <p className="text-sm text-slate-500 font-medium">No hay datos suficientes.</p>
                                        ) : (
                                            <>
                                                <div className="h-64 w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-10">
                                                    {officialSpecialties.map((item, idx) => (
                                                        <div key={idx} className="relative group flex-1 flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-20 pointer-events-none w-max">
                                                                <div className="bg-slate-950 border border-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                                    {item.name}: <span className="text-blue-400">{item.count}</span>
                                                                </div>
                                                                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-950 -mt-[1px]"></div>
                                                            </div>
                                                            <div
                                                                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-1000 ease-out hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`}
                                                                style={{ height: `${Math.max(item.percentage, 5)}%` }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                                                    {officialSpecialties.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                                                            <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Gráfico: Intereses */}
                                    <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                            <Heart className="w-6 h-6 text-red-400 fill-current" /> Intereses Marcados
                                        </h3>

                                        {interestsData.length === 0 ? (
                                            <p className="text-sm text-slate-500 font-medium">No hay datos suficientes.</p>
                                        ) : (
                                            <>
                                                <div className="h-64 w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-10">
                                                    {interestsData.map((item, idx) => (
                                                        <div key={idx} className="relative group flex-1 flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-20 pointer-events-none w-max">
                                                                <div className="bg-slate-950 border border-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xl flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                                                    {item.name}: <span className="text-[#FF6600]">{item.count}</span>
                                                                </div>
                                                                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-950 -mt-[1px]"></div>
                                                            </div>
                                                            <div
                                                                className={`w-full max-w-[40px] rounded-t-xl transition-all duration-1000 ease-out hover:brightness-110 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`}
                                                                style={{ height: `${Math.max(item.percentage, 5)}%` }}
                                                            ></div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                                                    {interestsData.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                                                            <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>

                                {/* 3. RADAR DE TAREAS (DARK MODE) */}
                                <div className="bg-[#FF6600]/5 p-6 md:p-8 rounded-[1rem] border border-orange-500/20 shadow-xl shadow-black/10 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <AlertCircle className="w-6 h-6 text-[#FF6600]" /> Radar de Nuevas Profesiones
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1 font-medium">Especialidades escritas a mano por los usuarios. Revísalas para añadirlas a la app.</p>
                                        </div>
                                        <span className="bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/30 px-4 py-2 rounded-xl font-black text-sm shrink-0">
                                            {customSpecialties.length} por revisar
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {customSpecialties.length === 0 ? (
                                            <p className="text-sm text-slate-500 w-full text-center py-6 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 font-bold">
                                                ¡Todo al día! No hay profesiones nuevas.
                                            </p>
                                        ) : (
                                            customSpecialties.map((spec, idx) => (
                                                <div key={idx} className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl hover:border-[#FF6600]/50 transition-colors">
                                                    <span className="font-bold text-slate-200 text-sm">{spec.name}</span>
                                                    <span className="bg-[#FF6600]/10 text-[#FF6600] text-xs font-black px-2.5 py-1 rounded-lg">
                                                        {spec.count}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 🟡 VISTA: INVITACIONES VIP (DARK MODE) */}
                        {activeView === 'invitations' && (
                            <div className="bg-slate-900 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 overflow-hidden">
                                <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-slate-900/50">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">Invitaciones VIP</h2>
                                        <p className="text-slate-400 font-medium mt-2">Añade emails para que se salten la pantalla de pago al crear perfil.</p>
                                    </div>

                                    <form onSubmit={handleInvite} className="flex gap-2 w-full xl:w-auto">
                                        <div className="relative flex-1 xl:w-72">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                            <input
                                                type="email"
                                                required
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="ejemplo@email.com"
                                                className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white placeholder-slate-600 rounded-xl focus:ring-2 focus:ring-[#FF6600]/20 focus:border-[#FF6600] outline-none text-sm font-medium transition-all"
                                            />
                                        </div>
                                        <button type="submit" disabled={isInviting} className="bg-[#FF6600] hover:bg-[#E65C00] shadow-lg shadow-[#FF6600]/20 text-white px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 shrink-0">
                                            {isInviting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Invitar</>}
                                        </button>
                                    </form>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                                                <th className="px-8 py-5">Email Invitado</th>
                                                <th className="px-8 py-5">Fecha</th>
                                                <th className="px-8 py-5">Estado</th>
                                                <th className="px-8 py-5 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800 text-sm font-medium">
                                            {invitations.length === 0 ? (
                                                <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-500 font-medium">No hay invitaciones enviadas aún.</td></tr>
                                            ) : (
                                                invitations.map((inv) => (
                                                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-8 py-5 text-white font-bold">{inv.email}</td>
                                                        <td className="px-8 py-5 text-slate-400">{new Date(inv.created_at).toLocaleDateString('es-ES')}</td>
                                                        <td className="px-8 py-5">
                                                            {inv.is_used ? (
                                                                <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Registrado</span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold"><Clock className="w-4 h-4" /> Pendiente</span>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <button onClick={() => handleDeleteInvite(inv.id)} disabled={inv.is_used} className={`p-2 rounded-xl transition-colors ${inv.is_used ? 'text-slate-700 cursor-not-allowed' : 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'}`}>
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Scrollbar Custom para Dark Mode */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #475569; }
      `}} />
        </div>
    );
}