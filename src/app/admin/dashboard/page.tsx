"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Users, Briefcase, Star, Mail, Plus, LogOut, CheckCircle2, Clock, Trash2 } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ users: 0, pros: 0, recs: 0 });
    const [invitations, setInvitations] = useState<any[]>([]);
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

        await Promise.all([loadStats(), loadInvitations()]);
        setIsLoading(false);
    };

    const loadStats = async () => {
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user');
        const { count: prosCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('specialty', null);
        const { count: recsCount } = await supabase.from('recommendations').select('*', { count: 'exact', head: true });

        setStats({
            users: usersCount || 0,
            pros: prosCount || 0,
            recs: recsCount || 0
        });
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

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0]"><div className="w-8 h-8 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-[#FFF9F0] selection:bg-violet-200 pb-24">
            {/* NAVBAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/dconfy_logo.png" alt="dconfy" className="h-8 object-contain" />
                        <span className="hidden sm:inline-flex items-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold tracking-tight">
                            SuperAdmin
                        </span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 font-medium text-sm flex items-center gap-2 transition-colors">
                        <LogOut className="w-4 h-4" /> Salir
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">

                {/* MÉTRICAS GLOBALES */}
                <div>
                    <h2 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-6 tracking-tight">Métricas Globales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
                            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center shrink-0"><Users className="w-7 h-7" /></div>
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Usuarios</p>
                                <p className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">{stats.users}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0"><Briefcase className="w-7 h-7" /></div>
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Profesionales</p>
                                <p className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">{stats.pros}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-5">
                            <div className="w-14 h-14 bg-orange-50 text-[#FF6600] rounded-2xl flex items-center justify-center shrink-0"><Star className="w-7 h-7 fill-current" /></div>
                            <div>
                                <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Recomendaciones</p>
                                <p className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">{stats.recs}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GESTIÓN DE INVITACIONES VIP */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                        <div>
                            <h2 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">Invitaciones VIP</h2>
                            <p className="text-slate-500 font-medium mt-2">Añade emails para que se salten la pantalla de pago al crear su perfil.</p>
                        </div>

                        <form onSubmit={handleInvite} className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="ejemplo@email.com"
                                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#FF6600]/20 focus:border-[#FF6600] outline-none text-sm font-medium shadow-sm transition-all"
                                />
                            </div>
                            <button type="submit" disabled={isInviting} className="bg-[#FF6600] hover:bg-[#E65C00] shadow-lg shadow-[#FF6600]/20 text-white px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2 shrink-0">
                                {isInviting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Invitar</>}
                            </button>
                        </form>
                    </div>

                    {/* LISTA DE INVITADOS */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                                    <th className="px-8 py-5">Email Invitao</th>
                                    <th className="px-8 py-5">Fecha</th>
                                    <th className="px-8 py-5">Estado</th>
                                    <th className="px-8 py-5 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm font-medium">
                                {invitations.length === 0 ? (
                                    <tr><td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-medium">No hay invitaciones enviadas aún.</td></tr>
                                ) : (
                                    invitations.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5 text-slate-900 font-bold">{inv.email}</td>
                                            <td className="px-8 py-5 text-slate-500">{new Date(inv.created_at).toLocaleDateString('es-ES')}</td>
                                            <td className="px-8 py-5">
                                                {inv.is_used ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Registrado</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold"><Clock className="w-4 h-4" /> Pendiente</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button onClick={() => handleDeleteInvite(inv.id)} disabled={inv.is_used} className={`p-2 rounded-xl transition-colors ${inv.is_used ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:bg-red-50 hover:text-red-600'}`}>
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

            </main>
        </div>
    );
}