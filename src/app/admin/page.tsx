"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw new Error('Correo o contraseña incorrectos.');
            if (!authData.user) throw new Error('No se pudo iniciar sesión.');

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) throw new Error('Error al verificar tus permisos de acceso.');

            const userRole = profile?.role;

            if (userRole === 'super_admin') {
                router.push('/admin/dashboard');
            } else if (userRole === 'company_admin') {
                router.push('/admin/empresa');
            } else {
                await supabase.auth.signOut();
                throw new Error('Acceso denegado. No tienes permisos para acceder a este portal.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center items-center p-4 selection:bg-violet-200">
            <div className="w-full max-w-md">

                {/* Cabecera del Portal con Icono de dconfy */}
                <div className="text-center mb-8">
                    <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 overflow-hidden bg-white">
                        <img
                            src="/dconfy_icon.png"
                            alt="Logo dconfy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight">Portal de Gestión</h1>
                    <p className="text-slate-500 font-medium mt-2">Acceso exclusivo para administradores</p>
                </div>

                {/* Tarjeta de Login */}
                <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Correo corporativo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all font-medium text-slate-900"
                                    placeholder="admin@dconfy.io"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all font-medium text-slate-900"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20 mt-4 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                'Acceder al Portal'
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-slate-400 font-medium">dconfy.app © {new Date().getFullYear()}</p>
                </div>

            </div>
        </div>
    );
}