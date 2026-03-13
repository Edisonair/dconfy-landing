"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
    Users, Briefcase, Star, Mail, Plus, LogOut, CheckCircle2, Clock,
    Trash2, LayoutDashboard, Ticket, BarChart3, AlertCircle, Menu, X, Heart,
    MessageCircle, Send, TrendingUp, Share2, Network, ChevronLeft, ChevronRight, Trophy, MapPin,
    Megaphone, Radio
} from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const COLOR_MAP: Record<string, string> = {
    'text-purple-400': 'bg-purple-400', 'text-fuchsia-500': 'bg-fuchsia-500', 'text-violet-500': 'bg-violet-500',
    'text-amber-400': 'bg-amber-400', 'text-amber-500': 'bg-amber-500', 'text-slate-600': 'bg-slate-400',
    'text-emerald-500': 'bg-emerald-500', 'text-red-500': 'bg-red-500', 'text-zinc-500': 'bg-zinc-400',
    'text-zinc-600': 'bg-zinc-400', 'text-indigo-500': 'bg-indigo-500', 'text-pink-500': 'bg-pink-500',
    'text-teal-500': 'bg-teal-500', 'text-blue-700': 'bg-blue-500', 'text-sky-500': 'bg-sky-500',
    'text-blue-600': 'bg-blue-500', 'text-orange-500': 'bg-orange-500', 'text-yellow-500': 'bg-yellow-500',
    'text-cyan-500': 'bg-cyan-500'
};

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

const getProvinceName = (zip?: string) => {
    if (!zip || zip.length < 2) return 'Desconocida';
    return PROVINCES[zip.substring(0, 2)] || 'Desconocida';
};

export default function AdminDashboard() {
    const router = useRouter();

    const [activeView, setActiveView] = useState<'dashboard' | 'invitations' | 'communications'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [rawData, setRawData] = useState<{
        profiles: any[], categories: any[], recommendations: any[], chats: any[], messages: any[], shared: any[], connections: any[]
    } | null>(null);

    const [selectedProvince, setSelectedProvince] = useState<string>('Global');
    const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
    const [officialCategoriesList, setOfficialCategoriesList] = useState<string[]>([]);

    const [stats, setStats] = useState({ users: 0, pros: 0, recs: 0, chats: 0, messages: 0, avgChats: '0', shared: 0, connections: 0 });
    const [invitations, setInvitations] = useState<any[]>([]);
    const [interestsData, setInterestsData] = useState<any[]>([]);
    const [unifiedSpecialties, setUnifiedSpecialties] = useState<any[]>([]);
    const [topRecommendedPros, setTopRecommendedPros] = useState<any[]>([]);
    const [customSpecialties, setCustomSpecialties] = useState<any[]>([]);

    // 🚀 NUEVO ESTADO PARA EL GRÁFICO DE RANGOS
    const [recsByUserRange, setRecsByUserRange] = useState<any[]>([]);

    const [newEmail, setNewEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    const [commTab, setCommTab] = useState<'banners' | 'emails'>('banners');
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [newBanner, setNewBanner] = useState({ title: '', message: '', type: 'dark', link_url: '', button_text: '', audience: 'all', target_sector: '' });
    const [isCreatingBanner, setIsCreatingBanner] = useState(false);

    const [emailDraft, setEmailDraft] = useState({ subject: '', title: '', message: '', audience: 'all', buttonText: '', buttonUrl: '' });
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailHistory, setEmailHistory] = useState<any[]>([]);

    useEffect(() => {
        checkAccessAndLoadData();
    }, []);

    const checkAccessAndLoadData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/admin'); return; }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role !== 'super_admin') { router.push('/admin'); return; }

        await Promise.all([loadRawData(), loadInvitations(), loadAnnouncements(), loadEmailHistory()]);
        setIsLoading(false);
    };

    const loadRawData = async () => {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name, professional_name, role, specialty, interests, avatar_url, zip_code');
        const { data: categories } = await supabase.from('categories').select('name, color_class');

        // 🚀 AHORA TAMBIÉN PEDIMOS EL user_id PARA SABER QUIÉN RECOMIENDA
        const { data: recommendations } = await supabase.from('recommendations').select('profile_id, user_id');

        const { data: chats } = await supabase.from('chats').select('id, professional_id');
        const { data: messages } = await supabase.from('messages').select('chat_id');
        const { data: shared } = await supabase.from('shared_profiles').select('professional_id');
        const { data: connections } = await supabase.from('connections').select('user_id, friend_id');

        const provSet = new Set<string>();
        profiles?.forEach(p => {
            const prov = getProvinceName(p.zip_code);
            if (prov !== 'Desconocida') provSet.add(prov);
        });

        setAvailableProvinces(Array.from(provSet).sort());
        if (categories) setOfficialCategoriesList(categories.map(c => c.name).sort());

        setRawData({
            profiles: profiles || [], categories: categories || [], recommendations: recommendations || [],
            chats: chats || [], messages: messages || [], shared: shared || [], connections: connections || []
        });
    };

    const loadAnnouncements = async () => {
        const { data } = await supabase.from('app_announcements').select('*').order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
    };

    const loadEmailHistory = async () => {
        const { data } = await supabase.from('broadcast_email_history').select('*').order('created_at', { ascending: false });
        if (data) setEmailHistory(data);
    };

    const handleCreateBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBanner.title || !newBanner.message) return;
        if (newBanner.audience === 'sector' && !newBanner.target_sector) {
            alert('Debes seleccionar un sector.'); return;
        }

        setIsCreatingBanner(true);
        try {
            await supabase.from('app_announcements').insert([newBanner]);
            setNewBanner({ title: '', message: '', type: 'dark', link_url: '', button_text: '', audience: 'all', target_sector: '' });
            await loadAnnouncements();
        } catch (err) { alert('Error al crear anuncio'); }
        finally { setIsCreatingBanner(false); }
    };

    const handleToggleBanner = async (id: string, currentStatus: boolean) => {
        await supabase.from('app_announcements').update({ is_active: !currentStatus }).eq('id', id);
        await loadAnnouncements();
    };

    const handleDeleteBanner = async (id: string) => {
        if (!confirm('¿Eliminar este banner para siempre?')) return;
        await supabase.from('app_announcements').delete().eq('id', id);
        await loadAnnouncements();
    };

    const handleSendBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailDraft.subject || !emailDraft.message) return;
        if (!confirm(`¿Estás seguro de enviar este email a la audiencia: ${emailDraft.audience}? Esta acción no se puede deshacer.`)) return;

        setIsSendingEmail(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const { data, error } = await supabase.functions.invoke('broadcast-email', {
                body: emailDraft,
                headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            alert(`¡Email masivo enviado con éxito a ${data.count} destinatarios! 🚀`);
            setEmailDraft({ subject: '', title: '', message: '', audience: 'all', buttonText: '', buttonUrl: '' });

            await loadEmailHistory();
        } catch (err: any) {
            console.error(err);
            alert(`Error al enviar el email: ${err.message}`);
        } finally {
            setIsSendingEmail(false);
        }
    };

    useEffect(() => {
        if (!rawData) return;
        processDashboardData();
    }, [rawData, selectedProvince]);

    const getDynamicColor = (str: string) => {
        const availableColors = Object.values(COLOR_MAP);
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return availableColors[Math.abs(hash) % availableColors.length];
    };

    const processDashboardData = () => {
        if (!rawData) return;
        const { profiles, categories, recommendations, chats, messages, shared, connections } = rawData;

        const filteredProfiles = selectedProvince === 'Global' ? profiles : profiles.filter(p => getProvinceName(p.zip_code) === selectedProvince);
        const validProfileIds = new Set(filteredProfiles.map(p => p.id));

        const filteredRecommendations = selectedProvince === 'Global' ? recommendations : recommendations.filter(r => validProfileIds.has(r.profile_id));
        const filteredConnections = selectedProvince === 'Global' ? connections : connections.filter(c => validProfileIds.has(c.user_id) || validProfileIds.has(c.friend_id));
        const filteredShared = selectedProvince === 'Global' ? shared : shared.filter(s => validProfileIds.has(s.professional_id));
        const filteredChats = selectedProvince === 'Global' ? chats : chats.filter(c => validProfileIds.has(c.professional_id));
        const validChatIds = new Set(filteredChats.map(c => c.id));
        const filteredMessages = selectedProvince === 'Global' ? messages : messages.filter(m => validChatIds.has(m.chat_id));

        const categoryMap = new Map<string, string>();
        categories?.forEach(c => { categoryMap.set(c.name.toLowerCase().trim(), c.color_class ? COLOR_MAP[c.color_class] || 'bg-slate-500' : 'bg-slate-500'); });
        const officialNames = new Set(categoryMap.keys());

        let uCount = 0, pCount = 0;
        const intCounts: Record<string, number> = {}, specCounts: Record<string, number> = {}, customMap: Record<string, { id: string, name: string }[]> = {};
        const profileSpecMap = new Map<string, string>();

        filteredProfiles.forEach(p => {
            if (p.role === 'user') uCount++;
            if (p.specialty) {
                pCount++;
                const cleanSpec = p.specialty.trim();
                specCounts[cleanSpec] = (specCounts[cleanSpec] || 0) + 1;
                profileSpecMap.set(p.id, cleanSpec);
                if (!officialNames.has(cleanSpec.toLowerCase())) {
                    if (!customMap[cleanSpec]) customMap[cleanSpec] = [];
                    customMap[cleanSpec].push({ id: p.id, name: p.professional_name || p.full_name || 'Usuario' });
                }
            }
            if (p.interests && Array.isArray(p.interests)) {
                p.interests.forEach((interest: string) => {
                    const clean = interest.trim();
                    if (clean) intCounts[clean] = (intCounts[clean] || 0) + 1;
                });
            }
        });

        const proRecsCount: Record<string, number> = {};
        const recsSpecCount: Record<string, number> = {};
        const userRecsCount: Record<string, number> = {}; // 🚀 CONTADOR PARA USUARIOS
        const topProsBySpec: Record<string, { name: string, recs: number, avatar: string }> = {};

        filteredRecommendations.forEach(r => {
            proRecsCount[r.profile_id] = (proRecsCount[r.profile_id] || 0) + 1;
            const spec = profileSpecMap.get(r.profile_id) || 'Desconocido';
            recsSpecCount[spec] = (recsSpecCount[spec] || 0) + 1;

            // 🚀 Contar recomendaciones DADAS por cada usuario
            if (r.user_id) {
                userRecsCount[r.user_id] = (userRecsCount[r.user_id] || 0) + 1;
            }
        });

        // 🚀 PROCESAR RANGOS DE USUARIOS
        const ranges = { '1-10': 0, '11-20': 0, '21-30': 0, '31-40': 0, '+40': 0 };
        Object.values(userRecsCount).forEach(count => {
            if (count >= 1 && count <= 10) ranges['1-10']++;
            else if (count >= 11 && count <= 20) ranges['11-20']++;
            else if (count >= 21 && count <= 30) ranges['21-30']++;
            else if (count >= 31 && count <= 40) ranges['31-40']++;
            else if (count > 40) ranges['+40']++;
        });

        const maxRange = Math.max(...Object.values(ranges), 1);
        setRecsByUserRange([
            { range: '1 a 10', count: ranges['1-10'], percentage: (ranges['1-10'] / maxRange) * 100, color: 'bg-blue-500' },
            { range: '11 a 20', count: ranges['11-20'], percentage: (ranges['11-20'] / maxRange) * 100, color: 'bg-emerald-500' },
            { range: '21 a 30', count: ranges['21-30'], percentage: (ranges['21-30'] / maxRange) * 100, color: 'bg-amber-500' },
            { range: '31 a 40', count: ranges['31-40'], percentage: (ranges['31-40'] / maxRange) * 100, color: 'bg-purple-500' },
            { range: '+ de 40', count: ranges['+40'], percentage: (ranges['+40'] / maxRange) * 100, color: 'bg-[#FF6600]' }
        ]);

        filteredProfiles.forEach(p => {
            if (p.specialty) {
                const cleanSpec = p.specialty.trim();
                const currentRecs = proRecsCount[p.id] || 0;
                if (currentRecs > 0 && (!topProsBySpec[cleanSpec] || currentRecs > topProsBySpec[cleanSpec].recs)) {
                    topProsBySpec[cleanSpec] = { name: p.professional_name || p.full_name || 'Usuario', recs: currentRecs, avatar: p.avatar_url || '' };
                }
            }
        });

        setStats({
            users: uCount, pros: pCount, recs: filteredRecommendations.length, chats: filteredChats.length, messages: filteredMessages.length,
            avgChats: pCount > 0 ? (filteredChats.length / pCount).toFixed(1) : '0', shared: filteredShared.length, connections: filteredConnections.length
        });

        const sortedInterests = Object.entries(intCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 24);
        const maxInterest = sortedInterests.length > 0 ? sortedInterests[0].count : 1;
        setInterestsData(sortedInterests.map(i => ({ ...i, percentage: (i.count / maxInterest) * 100, color: categoryMap.get(i.name.toLowerCase()) || getDynamicColor(i.name), isCustom: !officialNames.has(i.name.toLowerCase()) })));

        const unifiedMap = new Map<string, { proCount: number, recsCount: number, color: string }>();
        Object.entries(specCounts).forEach(([name, count]) => { if (officialNames.has(name.toLowerCase())) unifiedMap.set(name, { proCount: count, recsCount: 0, color: categoryMap.get(name.toLowerCase()) || 'bg-blue-500' }); });
        Object.entries(recsSpecCount).forEach(([name, count]) => {
            if (officialNames.has(name.toLowerCase())) {
                if (unifiedMap.has(name)) unifiedMap.get(name)!.recsCount = count;
                else unifiedMap.set(name, { proCount: 0, recsCount: count, color: categoryMap.get(name.toLowerCase()) || 'bg-blue-500' });
            }
        });

        const unifiedArray = Array.from(unifiedMap.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => (b.recsCount + b.proCount) - (a.recsCount + a.proCount)).slice(0, 24);
        const maxPros = Math.max(...unifiedArray.map(u => u.proCount), 1), maxRecs = Math.max(...unifiedArray.map(u => u.recsCount), 1);
        setUnifiedSpecialties(unifiedArray.map(u => ({ ...u, proPercentage: (u.proCount / maxPros) * 100, recsPercentage: (u.recsCount / maxRecs) * 100 })));

        const custom: { name: string, count: number, users: { id: string, name: string }[] }[] = [];
        Object.entries(customMap).forEach(([name, users]) => custom.push({ name, count: users.length, users }));
        setCustomSpecialties(custom.sort((a, b) => b.count - a.count));

        setTopRecommendedPros(Object.entries(topProsBySpec).map(([specialty, data]) => ({ specialty, ...data })).sort((a, b) => b.recs - a.recs));
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
            setNewEmail(''); await loadInvitations();
        } catch (error: any) { alert('Error al invitar.'); } finally { setIsInviting(false); }
    };

    const handleDeleteInvite = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar esta invitación?')) return;
        await supabase.from('vip_invitations').delete().eq('id', id); await loadInvitations();
    };

    const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin'); };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div></div>;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard BI', icon: LayoutDashboard },
        { id: 'communications', label: 'Comunicaciones', icon: Radio },
        { id: 'invitations', label: 'Invitaciones VIP', icon: Ticket },
    ];

    return (
        <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-violet-500/30">

            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
                <img src="/dconfy_logo_hibrid.png" alt="dconfy" className="h-6 object-contain" />
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300 bg-slate-800 rounded-lg">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'} ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden md:flex absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-300 rounded-full p-1 z-50 hover:bg-slate-700 hover:text-white transition-colors shadow-lg">
                    {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <div className={`p-6 hidden md:flex flex-col ${isSidebarCollapsed ? 'items-center' : 'items-start'}`}>
                    <img src={isSidebarCollapsed ? "/logo-icono.png" : "/dconfy_logo_hibrid.png"} alt="dconfy" className={`${isSidebarCollapsed ? 'h-8' : 'h-8 mb-2'} object-contain transition-all`} />
                    {!isSidebarCollapsed && <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-violet-500/20 mt-1">SuperAdmin</span>}
                </div>

                <nav className={`flex-1 px-4 py-6 md:py-2 space-y-2 mt-16 md:mt-0 ${isSidebarCollapsed ? 'items-center flex flex-col' : ''}`}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <button key={item.id} onClick={() => { setActiveView(item.id as any); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 py-3.5 rounded-2xl font-bold transition-all ${isSidebarCollapsed ? 'w-12 justify-center px-0' : 'w-full px-4'} ${activeView === item.id ? 'bg-[#FF6600] text-white shadow-lg shadow-[#FF6600]/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <Icon className="w-5 h-5 shrink-0" /> {!isSidebarCollapsed && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className={`flex items-center gap-2 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-colors ${isSidebarCollapsed ? 'w-full justify-center px-0' : 'w-full justify-center'}`}>
                        <LogOut className="w-5 h-5 shrink-0" /> {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 bg-slate-950">
                <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between z-10 gap-4">
                    <h1 className="text-2xl font-black text-white">
                        {activeView === 'dashboard' ? 'Dashboard & Analíticas' : activeView === 'communications' ? 'Centro de Comunicaciones' : 'Gestión de Invitaciones'}
                    </h1>

                    {activeView === 'dashboard' && (
                        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-xl shadow-lg">
                            <MapPin className="text-[#FF6600] w-5 h-5 shrink-0" />
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="bg-transparent text-white font-bold outline-none cursor-pointer text-sm w-full min-w-[140px]"
                            >
                                <option value="Global">📍 Todas (Global)</option>
                                <option disabled>──────────</option>
                                {availableProvinces.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-10 pb-20">

                        {/* 🟢 VISTA: DASHBOARD */}
                        {activeView === 'dashboard' && (
                            <>
                                {/* 1. MÉTRICAS GLOBALES */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Usuarios</p><p className="text-2xl font-black text-white">{stats.users}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0"><Network className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Conexiones</p><p className="text-2xl font-black text-white">{stats.connections}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0"><Briefcase className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Profesionales</p><p className="text-2xl font-black text-white">{stats.pros}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0"><Share2 className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">PRO Compartidos</p><p className="text-2xl font-black text-white">{stats.shared}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[#FF6600]/10 text-[#FF6600] rounded-2xl flex items-center justify-center shrink-0"><Heart className="w-6 h-6 fill-current" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Recomendaciones</p><p className="text-2xl font-black text-white">{stats.recs}</p></div>
                                    </div>

                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center shrink-0"><MessageCircle className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Chats Abiertos</p><p className="text-2xl font-black text-white">{stats.chats}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                                        <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center shrink-0"><Send className="w-6 h-6" /></div>
                                        <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Mensajes Enviados</p><p className="text-2xl font-black text-white">{stats.messages}</p></div>
                                    </div>
                                    <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none"><TrendingUp className="w-24 h-24 text-amber-500" /></div>
                                        <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><TrendingUp className="w-6 h-6" /></div>
                                        <div className="relative z-10"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Media Chat / Pro</p><p className="text-2xl font-black text-white">{stats.avgChats}</p></div>
                                    </div>
                                </div>

                                {/* 2. GRÁFICO UNIFICADO */}
                                <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-800 pb-6 gap-4">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <BarChart3 className="w-6 h-6 text-blue-400" /> Profesiones Activas vs Recomendaciones {selectedProvince !== 'Global' && <span className="text-[#FF6600] ml-1">en {selectedProvince}</span>}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 rounded-sm bg-slate-500"></div><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profesionales Activos</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3.5 h-3.5 rounded-sm border border-[#FF6600]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,102,0,0.5) 2px, rgba(255,102,0,0.5) 4px)' }}></div><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recomendaciones</span>
                                            </div>
                                        </div>
                                    </div>

                                    {unifiedSpecialties.length === 0 ? (
                                        <p className="text-sm text-slate-500 font-medium">No hay datos suficientes para {selectedProvince}.</p>
                                    ) : (
                                        <>
                                            <div className="h-[350px] w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-2 overflow-x-auto custom-scrollbar pt-32 px-2">
                                                {unifiedSpecialties.map((item, idx) => (
                                                    <div key={idx} className="relative group flex-1 min-w-[50px] max-w-[80px] flex justify-center items-end h-full bg-slate-800/10 rounded-t-xl hover:bg-slate-800/30 transition-colors gap-1 px-1">
                                                        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                                            <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[150px]">
                                                                <span className="text-slate-200 border-b border-slate-700 pb-1.5 mb-1 text-center text-sm">{item.name}</span>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div><span className="text-slate-400 font-medium">Profesionales</span></div>
                                                                    <span className="text-white text-sm">{item.proCount}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FF6600]"></div><span className="text-slate-400 font-medium">Recomendaciones</span></div>
                                                                    <span className="text-[#FF6600] text-sm">{item.recsCount}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                                        </div>
                                                        <div className={`w-1/2 rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.proPercentage, 2)}%` }}></div>
                                                        <div className="w-1/2 rounded-t-md transition-all duration-1000 ease-out border border-[#FF6600]" style={{ height: `${Math.max(item.recsPercentage, 2)}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,102,0,0.5) 4px, rgba(255,102,0,0.5) 8px)' }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 px-2">
                                                {unifiedSpecialties.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                                                        <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1 font-medium">({item.proCount}/{item.recsCount})</span></span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* 3. GRÁFICO INTERESES */}
                                <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-800 pb-6 gap-4">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            <Star className="w-6 h-6 text-yellow-400 fill-current" /> Intereses {selectedProvince !== 'Global' && <span className="text-[#FF6600] ml-1">en {selectedProvince}</span>}
                                        </h3>
                                    </div>
                                    {interestsData.length === 0 ? (
                                        <p className="text-sm text-slate-500 font-medium">No hay datos suficientes para {selectedProvince}.</p>
                                    ) : (
                                        <>
                                            <div className="h-[300px] w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-2 overflow-x-auto custom-scrollbar pt-28 px-2">
                                                {interestsData.map((item, idx) => (
                                                    <div key={idx} className="relative group flex-1 min-w-[40px] max-w-[80px] flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                                        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                                            <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                                                <span className="text-sm">{item.name}:</span> <span className="text-[#FF6600] text-sm">{item.count}</span>
                                                                {item.isCustom && <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded ml-2 uppercase tracking-wider border border-slate-600">Manual</span>}
                                                            </div>
                                                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                                        </div>
                                                        <div className={`w-full max-w-[50px] rounded-t-xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.percentage, 5)}%`, ...(item.isCustom ? { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25) 4px, transparent 4px, transparent 8px)' } : {}) }}></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 px-2">
                                                {interestsData.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-sm ${item.color} shadow-sm`} style={item.isCustom ? { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)' } : {}}></div>
                                                        <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* 4. TOP PROFESIONALES Y RANGO USUARIOS (NUEVO) */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Trophy className="w-6 h-6 text-red-400" /> Top por Profesión {selectedProvince !== 'Global' && <span className="text-[#FF6600] text-base">({selectedProvince})</span>}
                                        </h3>
                                        {topRecommendedPros.length === 0 ? (
                                            <p className="text-sm text-slate-500 font-medium py-4">Aún no hay profesionales recomendados aquí.</p>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {topRecommendedPros.map((pro, idx) => (
                                                    <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800 transition-colors shadow-sm">
                                                        <img src={pro.avatar || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover bg-slate-900 border border-slate-700 shrink-0" alt={pro.name} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white font-black text-[15px] leading-tight truncate mb-0.5">{pro.specialty}</p>
                                                            <p className="text-slate-400 text-xs font-medium truncate">{pro.name}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2.5 py-1.5 rounded-lg border border-red-500/20 shrink-0">
                                                            <Heart className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-black">{pro.recs}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* 🚀 NUEVO GRÁFICO: RANGOS DE RECOMENDACIONES POR USUARIO */}
                                    <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Users className="w-6 h-6 text-emerald-400" /> Rango de Recomendaciones dadas por Usuario
                                        </h3>

                                        {recsByUserRange.reduce((acc, curr) => acc + curr.count, 0) === 0 ? (
                                            <p className="text-sm text-slate-500 font-medium py-4">No hay datos suficientes para {selectedProvince}.</p>
                                        ) : (
                                            <>
                                                <div className="h-[250px] w-full flex items-end gap-4 md:gap-8 border-b-2 border-slate-800 pb-2 relative mt-10 px-4">
                                                    {recsByUserRange.map((item, idx) => (
                                                        <div key={idx} className="relative group flex-1 flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                                            <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                                                <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                                                                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                                                    <span>Recomiendan a {item.range}:</span> <span className="text-[#FF6600]">{item.count} usuarios</span>
                                                                </div>
                                                                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                                            </div>
                                                            <div className={`w-full max-w-[60px] rounded-t-xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.percentage, 5)}%` }}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 px-2">
                                                    {recsByUserRange.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className={`w-3 h-3 rounded-sm ${item.color} shadow-sm`}></div>
                                                            <span className="text-xs font-bold text-slate-300">{item.range} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* RADAR CUSTOM PASA A OCUPAR ANCHO COMPLETO ABAJO */}
                                <div className="bg-[#FF6600]/5 p-6 md:p-8 rounded-[1rem] border border-orange-500/20 shadow-xl shadow-black/10 w-full mt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <AlertCircle className="w-6 h-6 text-[#FF6600]" /> Radar de Nuevas Profesiones
                                            </h3>
                                            <p className="text-slate-400 text-sm mt-1 font-medium">Especialidades escritas a mano que están pendientes de añadir oficialmente.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {customSpecialties.length === 0 ? (
                                            <p className="text-sm text-slate-500 w-full text-center py-6 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 font-bold sm:col-span-2 lg:col-span-3 xl:col-span-4">¡Todo al día!</p>
                                        ) : (
                                            customSpecialties.map((spec, idx) => (
                                                <div key={idx} className="flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-[#FF6600]/50 transition-colors shadow-sm">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                                                        <span className="font-bold text-slate-200 text-sm">{spec.name}</span>
                                                        <span className="bg-[#FF6600]/10 text-[#FF6600] text-xs font-black px-2.5 py-1 rounded-lg ml-3 shrink-0">{spec.count}</span>
                                                    </div>
                                                    <div className="px-4 py-3 bg-slate-900/30 flex flex-col gap-2 border-t border-slate-800/50 max-h-32 overflow-y-auto custom-scrollbar">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Usuarios:</span>
                                                        {spec.users.map((u: any) => (
                                                            <div key={u.id} className="text-xs text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-700 rounded-full shrink-0" /><span className="truncate">{u.name}</span></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 📢 VISTA: COMUNICACIONES Y MARKETING */}
                        {activeView === 'communications' && (
                            <div className="space-y-6">
                                <div className="flex bg-slate-900 p-1.5 rounded-2xl w-fit shadow-lg shadow-black/20">
                                    <button
                                        onClick={() => setCommTab('banners')}
                                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${commTab === 'banners' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                    >
                                        <Megaphone className="w-4 h-4" /> Banners In-App
                                    </button>
                                    <button
                                        onClick={() => setCommTab('emails')}
                                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${commTab === 'emails' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                    >
                                        <Mail className="w-4 h-4" /> Enviar Emails Masivos
                                    </button>
                                </div>

                                {/* BANNERS */}
                                {commTab === 'banners' && (
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                        <div className="xl:col-span-1 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Megaphone className="w-5 h-5 text-[#FF6600]" /> Crear Anuncio In-App</h3>
                                            <form onSubmit={handleCreateBanner} className="space-y-5">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título Corto <span className="text-[#FF6600]">*</span></label>
                                                    <input type="text" required value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="Ej: ¡Nueva Versión 1.1!" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensaje <span className="text-[#FF6600]">*</span></label>
                                                    <textarea required value={newBanner.message} onChange={e => setNewBanner({ ...newBanner, message: e.target.value })} placeholder="Explica la novedad..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none h-20 resize-none" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Color / Tipo</label>
                                                        <select value={newBanner.type} onChange={e => setNewBanner({ ...newBanner, type: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none appearance-none">
                                                            <option value="dark">Negro Corporativo</option>
                                                            <option value="promo">Naranja (Promo)</option>
                                                            <option value="info">Azul (Info)</option>
                                                            <option value="success">Verde (Éxito)</option>
                                                            <option value="warning">Amarillo (Alerta)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Texto Botón</label>
                                                        <input type="text" value={newBanner.button_text} onChange={e => setNewBanner({ ...newBanner, button_text: e.target.value })} placeholder="VER MÁS" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enlace (URL Destino)</label>
                                                    <input type="url" value={newBanner.link_url} onChange={e => setNewBanner({ ...newBanner, link_url: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                                                </div>
                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-4">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-3">¿A quién le saldrá el banner?</label>
                                                    <div className="flex flex-col gap-2">
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'all' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="banner_aud" value="all" checked={newBanner.audience === 'all'} onChange={() => setNewBanner({ ...newBanner, audience: 'all' })} className="w-4 h-4 accent-[#FF6600]" />
                                                            <span className="text-sm font-bold text-white">Todos los Usuarios</span>
                                                        </label>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'pros' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="banner_aud" value="pros" checked={newBanner.audience === 'pros'} onChange={() => setNewBanner({ ...newBanner, audience: 'pros', target_sector: '' })} className="w-4 h-4 accent-[#FF6600]" />
                                                            <span className="text-sm font-bold text-white">Solo Profesionales</span>
                                                        </label>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'sector' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="banner_aud" value="sector" checked={newBanner.audience === 'sector'} onChange={() => setNewBanner({ ...newBanner, audience: 'sector' })} className="w-4 h-4 accent-[#FF6600]" />
                                                            <span className="text-sm font-bold text-white">Por Sector</span>
                                                        </label>
                                                    </div>
                                                    {newBanner.audience === 'sector' && (
                                                        <select value={newBanner.target_sector} onChange={e => setNewBanner({ ...newBanner, target_sector: e.target.value })} className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none">
                                                            <option value="">-- Elige sector --</option>
                                                            {officialCategoriesList.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                                                        </select>
                                                    )}
                                                </div>
                                                <button type="submit" disabled={isCreatingBanner} className="w-full bg-[#FF6600] text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-[#e65c00] transition-colors disabled:opacity-50 active:scale-95 shadow-lg shadow-[#FF6600]/20">
                                                    {isCreatingBanner ? 'Guardando...' : 'Crear y Guardar Anuncio'}
                                                </button>
                                            </form>
                                        </div>

                                        <div className="xl:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20">
                                            <h3 className="text-lg font-bold text-white mb-6">Banners In-App Creados</h3>
                                            <div className="space-y-4">
                                                {announcements.length === 0 ? (
                                                    <p className="text-slate-500 py-12 text-center font-medium border border-dashed border-slate-800 rounded-2xl">No hay banners creados aún.</p>
                                                ) : (
                                                    announcements.map(ann => (
                                                        <div key={ann.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ann.is_active ? 'border-[#FF6600]/50 bg-[#FF6600]/10' : 'border-slate-800 bg-slate-950/50'}`}>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-1.5">
                                                                    <span className={`w-2.5 h-2.5 rounded-full ${ann.type === 'promo' ? 'bg-[#FF6600]' : ann.type === 'success' ? 'bg-emerald-500' : ann.type === 'warning' ? 'bg-amber-500' : ann.type === 'dark' ? 'bg-slate-500' : 'bg-blue-500'}`}></span>
                                                                    <span className="font-bold text-white text-lg">{ann.title}</span>
                                                                    {ann.is_active && <span className="text-[10px] bg-[#FF6600] text-white px-2 py-0.5 rounded uppercase font-black tracking-wider shadow-sm">Activo en App</span>}
                                                                </div>
                                                                <p className="text-slate-400 text-sm ml-5.5 pl-5 mb-2">{ann.message}</p>
                                                                <div className="ml-5 flex gap-2">
                                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                                                        Aud: {ann.audience === 'all' ? 'Todos' : ann.audience === 'pros' ? 'Profesionales' : `Sector: ${ann.target_sector}`}
                                                                    </span>
                                                                    {ann.link_url && <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Con enlace</span>}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-4 pl-6 border-l border-slate-800/50 shrink-0">
                                                                <button onClick={() => handleToggleBanner(ann.id, ann.is_active)} className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${ann.is_active ? 'bg-[#FF6600]' : 'bg-slate-700'}`}>
                                                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${ann.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                                </button>
                                                                <button onClick={() => handleDeleteBanner(ann.id)} className="text-slate-500 hover:text-red-500 transition-colors p-1"><Trash2 className="w-5 h-5" /></button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* EMAILS MASIVOS CON HISTORIAL */}
                                {commTab === 'emails' && (
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                        <div className="xl:col-span-1 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Nuevo Email</h3>
                                            </div>
                                            <form onSubmit={handleSendBroadcast} className="space-y-5">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Asunto <span className="text-red-500">*</span></label>
                                                    <input type="text" required value={emailDraft.subject} onChange={e => setEmailDraft({ ...emailDraft, subject: e.target.value })} placeholder="Ej: Novedades en dconfy" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Titular interno</label>
                                                    <input type="text" value={emailDraft.title} onChange={e => setEmailDraft({ ...emailDraft, title: e.target.value })} placeholder="Opcional..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensaje <span className="text-red-500">*</span></label>
                                                    <textarea required value={emailDraft.message} onChange={e => setEmailDraft({ ...emailDraft, message: e.target.value })} placeholder="Cuerpo del mensaje..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none" />
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-800">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Texto del botón</label>
                                                        <input type="text" value={emailDraft.buttonText} onChange={e => setEmailDraft({ ...emailDraft, buttonText: e.target.value })} placeholder="Ej: Ir al cuestionario" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">URL del botón</label>
                                                        <input type="url" value={emailDraft.buttonUrl} onChange={e => setEmailDraft({ ...emailDraft, buttonUrl: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none" />
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-3">¿A quién va dirigido?</label>
                                                    <div className="flex flex-col gap-2">
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'all' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="email_aud" value="all" checked={emailDraft.audience === 'all'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'all' })} className="w-4 h-4 accent-blue-500" />
                                                            <span className="text-sm font-bold text-white">Todos los Usuarios</span>
                                                        </label>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'pros' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="email_aud" value="pros" checked={emailDraft.audience === 'pros'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'pros' })} className="w-4 h-4 accent-blue-500" />
                                                            <span className="text-sm font-bold text-white">Solo Profesionales</span>
                                                        </label>
                                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'top' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                                            <input type="radio" name="email_aud" value="top" checked={emailDraft.audience === 'top'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'top' })} className="w-4 h-4 accent-blue-500" />
                                                            <span className="text-sm font-bold text-white">Top Valorados (4+⭐)</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <button type="submit" disabled={isSendingEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                                                    {isSendingEmail ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Masivo</>}
                                                </button>
                                            </form>
                                        </div>

                                        <div className="xl:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20">
                                            <h3 className="text-lg font-bold text-white mb-6">Historial de Emails Enviados</h3>
                                            <div className="space-y-4">
                                                {emailHistory.length === 0 ? (
                                                    <p className="text-slate-500 py-12 text-center font-medium border border-dashed border-slate-800 rounded-2xl">Aún no has enviado ningún correo masivo.</p>
                                                ) : (
                                                    emailHistory.map(email => (
                                                        <div key={email.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors">
                                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                                                <h4 className="text-white font-bold text-lg leading-tight">{email.subject}</h4>
                                                                <span className="text-xs font-bold text-slate-500 shrink-0 bg-slate-900 px-2.5 py-1 rounded-lg">
                                                                    {new Date(email.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{email.message}</p>
                                                            <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3">
                                                                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                                                                    Aud: {email.audience === 'all' ? 'Todos los Usuarios' : email.audience === 'pros' ? 'Solo Profesionales' : 'Top Profesionales'}
                                                                </span>
                                                                <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Entregado a {email.sent_count} usuarios
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 🟡 VISTA: INVITACIONES VIP */}
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
                                            <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="ejemplo@email.com" className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-[#FF6600] outline-none text-sm" />
                                        </div>
                                        <button type="submit" disabled={isInviting} className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2">
                                            {isInviting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Invitar</>}
                                        </button>
                                    </form>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800">
                                                <th className="px-8 py-5">Email Invitado</th><th className="px-8 py-5">Fecha</th><th className="px-8 py-5">Estado</th><th className="px-8 py-5 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800 text-sm font-medium">
                                            {invitations.length === 0 ? <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-500 font-medium">No hay invitaciones enviadas aún.</td></tr> : invitations.map((inv) => (
                                                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-8 py-5 text-white font-bold">{inv.email}</td>
                                                    <td className="px-8 py-5 text-slate-400">{new Date(inv.created_at).toLocaleDateString('es-ES')}</td>
                                                    <td className="px-8 py-5">{inv.is_used ? <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Registrado</span> : <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold"><Clock className="w-4 h-4" /> Pendiente</span>}</td>
                                                    <td className="px-8 py-5 text-right"><button onClick={() => handleDeleteInvite(inv.id)} disabled={inv.is_used} className={`p-2 rounded-xl transition-colors ${inv.is_used ? 'text-slate-700 cursor-not-allowed' : 'text-slate-500 hover:text-red-400'}`}><Trash2 className="w-5 h-5" /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <style dangerouslySetInnerHTML={{ __html: ` .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #475569; } ` }} />
        </div>
    );
}