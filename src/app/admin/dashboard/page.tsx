"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Ticket, LogOut, Menu, X, ChevronLeft, ChevronRight, MapPin, Radio, FileText } from 'lucide-react';

import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { CommunicationsView } from '@/components/admin/CommunicationsView';
import { InvitationsView } from '@/components/admin/InvitationsView';
import { BlogManagerView } from '@/components/admin/BlogManagerView';

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

    const [activeView, setActiveView] = useState<'dashboard' | 'invitations' | 'communications' | 'blog'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [rawData, setRawData] = useState<{ profiles: any[], categories: any[], recommendations: any[], chats: any[], messages: any[], shared: any[], connections: any[] } | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string>('Global');
    const [availableProvinces, setAvailableProvinces] = useState<string[]>([]);
    const [officialCategoriesList, setOfficialCategoriesList] = useState<string[]>([]);
    const [stats, setStats] = useState({ users: 0, pros: 0, recs: 0, chats: 0, messages: 0, avgChats: '0', shared: 0, connections: 0 });
    const [interestsData, setInterestsData] = useState<any[]>([]);
    const [unifiedSpecialties, setUnifiedSpecialties] = useState<any[]>([]);
    const [topRecommendedPros, setTopRecommendedPros] = useState<any[]>([]);
    const [customSpecialties, setCustomSpecialties] = useState<any[]>([]);
    const [recsByUserRange, setRecsByUserRange] = useState<any[]>([]);

    const [invitations, setInvitations] = useState<any[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newProfession, setNewProfession] = useState('');
    const [newZipCode, setNewZipCode] = useState('');
    const [isInviting, setIsInviting] = useState(false);

    const [commTab, setCommTab] = useState<'banners' | 'emails'>('banners');
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [newBanner, setNewBanner] = useState({ title: '', message: '', type: 'dark', link_url: '', button_text: '', audience: 'all', target_sector: '' });
    const [isCreatingBanner, setIsCreatingBanner] = useState(false);
    const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

    const [emailDraft, setEmailDraft] = useState({ subject: '', title: '', message: '', audience: 'all', buttonText: '', buttonUrl: '' });
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailHistory, setEmailHistory] = useState<any[]>([]);

    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);

    const [newPost, setNewPost] = useState({
        title: '', slug: '', category: 'Novedades', read_time: '2 min', image: '', excerpt: '', content: '', is_published: false,
        created_at: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        checkAccessAndLoadData();
    }, []);

    const loadRawData = async () => {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name, professional_name, role, specialty, interests, avatar_url, professional_logo_url, zip_code');
        const { data: categories } = await supabase.from('categories').select('name, color_class');
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

    const loadInvitations = async () => {
        const { data } = await supabase.from('vip_invitations').select('*').order('created_at', { ascending: false });
        if (data) setInvitations(data);
    };

    const loadBlogPosts = async () => {
        const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (data) setBlogPosts(data);
    };

    const checkAccessAndLoadData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push('/admin'); return; }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role !== 'super_admin') { router.push('/admin'); return; }

        await Promise.all([loadRawData(), loadInvitations(), loadAnnouncements(), loadEmailHistory(), loadBlogPosts()]);
        setIsLoading(false);
    };

    const handleCreateBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBanner.title || !newBanner.message) return;
        if (newBanner.audience === 'sector' && !newBanner.target_sector) { alert('Debes seleccionar un sector.'); return; }

        setIsCreatingBanner(true);
        try {
            if (editingBannerId) {
                const { error } = await supabase.from('app_announcements').update(newBanner).eq('id', editingBannerId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('app_announcements').insert([newBanner]);
                if (error) throw error;
            }

            setNewBanner({ title: '', message: '', type: 'dark', link_url: '', button_text: '', audience: 'all', target_sector: '' });
            setEditingBannerId(null);
            await loadAnnouncements();
        } catch (err) { alert('Error al guardar anuncio'); }
        finally { setIsCreatingBanner(false); }
    };

    const handleEditBannerClick = (banner: any) => {
        setEditingBannerId(banner.id);
        setNewBanner({
            title: banner.title,
            message: banner.message,
            type: banner.type || 'dark',
            button_text: banner.button_text || '',
            link_url: banner.link_url || '',
            audience: banner.audience || 'all',
            target_sector: banner.target_sector || ''
        });
        document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelBannerEdit = () => {
        setEditingBannerId(null);
        setNewBanner({ title: '', message: '', type: 'dark', link_url: '', button_text: '', audience: 'all', target_sector: '' });
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
        } finally { setIsSendingEmail(false); }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newName) return;
        setIsInviting(true);
        try {
            // 🚀 LÓGICA AUTOMÁTICA: Convertir CP en Población y Provincia
            let city = '';
            let province = getProvinceName(newZipCode); // Asignamos la provincia por defecto con nuestro diccionario

            if (newZipCode && newZipCode.length === 5) {
                try {
                    // Llamamos a la API gratuita para sacar la ciudad exacta
                    const zipRes = await fetch(`https://api.zippopotam.us/es/${newZipCode}`);
                    if (zipRes.ok) {
                        const zipData = await zipRes.json();
                        if (zipData.places && zipData.places.length > 0) {
                            city = zipData.places[0]['place name'];
                            if (zipData.places[0]['state']) {
                                province = zipData.places[0]['state'];
                            }
                        }
                    }
                } catch (apiError) {
                    console.log("No se pudo obtener la ciudad de la API externa", apiError);
                }
            }

            const { error } = await supabase.from('vip_invitations').insert([{
                email: newEmail.toLowerCase(),
                name: newName,
                profesion: newProfession,
                zip_code: newZipCode,
                city: city || null,
                province: province !== 'Desconocida' ? province : null
            }]);

            if (error) throw error;

            setNewEmail('');
            setNewName('');
            setNewProfession('');
            setNewZipCode('');

            await loadInvitations();
        } catch (error: any) {
            alert('Error al invitar.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleDeleteInvite = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar esta invitación?')) return;
        await supabase.from('vip_invitations').delete().eq('id', id); await loadInvitations();
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.title || !newPost.slug || !newPost.content) return;
        setIsCreatingPost(true);
        try {
            if (editingPostId) {
                const { error } = await supabase.from('blog_posts').update(newPost).eq('id', editingPostId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('blog_posts').insert([newPost]);
                if (error) throw error;
            }

            setNewPost({ title: '', slug: '', category: 'Novedades', read_time: '2 min', image: '', excerpt: '', content: '', is_published: false, created_at: new Date().toISOString().split('T')[0] });
            setShowPostForm(false);
            setEditingPostId(null);
            await loadBlogPosts();
        } catch (error: any) { alert('Error al guardar post: ' + error.message); }
        finally { setIsCreatingPost(false); }
    };

    const handleEditClick = (post: any) => {
        setNewPost({
            title: post.title,
            slug: post.slug,
            category: post.category || 'Novedades',
            read_time: post.read_time || '2 min',
            image: post.image || '',
            excerpt: post.excerpt || '',
            content: post.content || '',
            is_published: post.is_published,
            created_at: post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setEditingPostId(post.id);
        setShowPostForm(true);
        document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        if (showPostForm) {
            setNewPost({ title: '', slug: '', category: 'Novedades', read_time: '2 min', image: '', excerpt: '', content: '', is_published: false, created_at: new Date().toISOString().split('T')[0] });
            setShowPostForm(false);
            setEditingPostId(null);
        } else {
            setShowPostForm(true);
        }
    };

    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        try {
            await supabase.from('blog_posts').update({ is_published: !currentStatus }).eq('id', id);
            await loadBlogPosts();
        } catch (err: any) {
            alert('Error al cambiar visibilidad: ' + err.message);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm('¿Seguro que quieres borrar este artículo?')) return;
        await supabase.from('blog_posts').delete().eq('id', id);
        await loadBlogPosts();
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

        // PRIMER BUCLE: Conteo general
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

        // 1. PRIMERO declaramos las variables
        const proRecsCount: Record<string, number> = {};
        const recsSpecCount: Record<string, number> = {};
        const userRecsCount: Record<string, number> = {};

        const topProsBySpec: Record<string, { name: string, recs: number, avatar: string, professional_logo_url?: string }> = {};

        // 2. LUEGO rellenamos los conteos
        filteredRecommendations.forEach(r => {
            proRecsCount[r.profile_id] = (proRecsCount[r.profile_id] || 0) + 1;
            const spec = profileSpecMap.get(r.profile_id) || 'Desconocido';
            recsSpecCount[spec] = (recsSpecCount[spec] || 0) + 1;

            if (r.user_id) {
                userRecsCount[r.user_id] = (userRecsCount[r.user_id] || 0) + 1;
            }
        });

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

        // 3. SEGUNDO BUCLE: Y AHORA calculamos el top, porque proRecsCount ya existe
        filteredProfiles.forEach(p => {
            if (p.specialty) {
                const cleanSpec = p.specialty.trim();
                const currentRecs = proRecsCount[p.id] || 0;
                if (currentRecs > 0 && (!topProsBySpec[cleanSpec] || currentRecs > topProsBySpec[cleanSpec].recs)) {
                    topProsBySpec[cleanSpec] = {
                        name: p.professional_name || p.full_name || 'Usuario',
                        recs: currentRecs,
                        avatar: p.avatar_url || '',
                        professional_logo_url: p.professional_logo_url || ''
                    };
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

    const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin'); };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div></div>;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard BI', icon: LayoutDashboard },
        { id: 'communications', label: 'Comunicaciones', icon: Radio },
        { id: 'invitations', label: 'Invitaciones VIP', icon: Ticket },
        { id: 'blog', label: 'Gestor del Blog', icon: FileText },
    ];

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <DashboardMetrics
                        stats={stats}
                        unifiedSpecialties={unifiedSpecialties}
                        selectedProvince={selectedProvince}
                        interestsData={interestsData}
                        topRecommendedPros={topRecommendedPros}
                        recsByUserRange={recsByUserRange}
                        customSpecialties={customSpecialties}
                    />
                );
            case 'communications':
                return (
                    <CommunicationsView
                        commTab={commTab}
                        setCommTab={setCommTab}
                        handleCreateBanner={handleCreateBanner}
                        newBanner={newBanner}
                        setNewBanner={setNewBanner}
                        officialCategoriesList={officialCategoriesList}
                        isCreatingBanner={isCreatingBanner}
                        announcements={announcements}
                        handleToggleBanner={handleToggleBanner}
                        handleDeleteBanner={handleDeleteBanner}
                        handleSendBroadcast={handleSendBroadcast}
                        emailDraft={emailDraft}
                        setEmailDraft={setEmailDraft}
                        isSendingEmail={isSendingEmail}
                        emailHistory={emailHistory}
                        editingBannerId={editingBannerId}
                        handleEditBannerClick={handleEditBannerClick}
                        handleCancelBannerEdit={handleCancelBannerEdit}
                    />
                );
            case 'invitations':
                return (
                    <InvitationsView
                        handleInvite={handleInvite}
                        newEmail={newEmail}
                        setNewEmail={setNewEmail}
                        newName={newName}
                        setNewName={setNewName}
                        newProfession={newProfession}
                        setNewProfession={setNewProfession}
                        newZipCode={newZipCode}
                        setNewZipCode={setNewZipCode}
                        isInviting={isInviting}
                        invitations={invitations}
                        handleDeleteInvite={handleDeleteInvite}
                    />
                );
            case 'blog':
                return (
                    <BlogManagerView
                        blogPosts={blogPosts}
                        handleCreatePost={handleCreatePost}
                        handleDeletePost={handleDeletePost}
                        handleEditClick={handleEditClick}
                        handleCancelEdit={handleCancelEdit}
                        handleTogglePublish={handleTogglePublish}
                        editingPostId={editingPostId}
                        isCreatingPost={isCreatingPost}
                        newPost={newPost}
                        setNewPost={setNewPost}
                        showPostForm={showPostForm}
                        setShowPostForm={setShowPostForm}
                    />
                );
            default:
                return <div>Vista no encontrada</div>;
        }
    };

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
                        {activeView === 'dashboard' ? 'Dashboard & Analíticas' : activeView === 'communications' ? 'Centro de Comunicaciones' : activeView === 'invitations' ? 'Gestión de Invitaciones' : 'Gestor del Blog'}
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
                        {renderActiveView()}
                    </div>
                </div>
            </main>
            <style dangerouslySetInnerHTML={{ __html: ` .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #475569; } ` }} />
        </div>
    );
}