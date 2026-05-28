"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function BusinessLogin() {
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
                .select('is_business_admin, business_id, account_type')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                await supabase.auth.signOut();
                throw new Error('Error al verificar tus permisos de acceso.');
            }

            if (profile?.is_business_admin && profile?.business_id && profile?.account_type === 'business') {
                router.push('/business/profile');
            } else {
                await supabase.auth.signOut();
                throw new Error('Acceso restringido. Este portal es exclusivo para cuentas de empresa.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-violet-500/30">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-3xl flex items-center justify-center mx-auto mb-6 overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                            src="/dconfy_icon.png"
                            alt="Logo dconfy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // fallback if icon isn't found
                                e.currentTarget.src = "/logo-icono.png";
                            }}
                        />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        dconfy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] to-[#CD1F8B]">Business</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-2">Portal de administración para empresas</p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/85 backdrop-blur-md rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-800">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correo corporativo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all font-medium text-white"
                                    placeholder="contacto@empresa.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all font-medium text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-950/50 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-900/50 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-full font-bold transition-all shadow-lg shadow-[#FF6600]/10 mt-4 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando acceso...
                                </>
                            ) : (
                                'Iniciar Sesión B2B'
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center text-sm border-t border-slate-850 pt-5">
                        <span className="text-slate-400">¿No tienes cuenta de empresa? </span>
                        <Link href="/business/register" className="text-[#FF6600] hover:text-[#E65C00] font-bold hover:underline transition-all">
                            Regístrate aquí
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-xs text-slate-500 font-medium">dconfy.app © {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
