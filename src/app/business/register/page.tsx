"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { 
  Lock, 
  Mail, 
  User, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Briefcase
} from 'lucide-react';

export default function BusinessRegister() {
    const router = useRouter();
    
    // Form fields
    const [fullName, setFullName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [sector, setSector] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Status states
    const [sectorsList, setSectorsList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Fetch sectors for select dropdown
    useEffect(() => {
        async function loadSectors() {
            try {
                const { data, error } = await supabase
                    .from('sectors')
                    .select('name')
                    .order('name');
                if (!error && data) {
                    setSectorsList(data.map(s => s.name));
                }
            } catch (err) {
                console.error('Error loading sectors:', err);
            }
        }
        loadSectors();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);

        try {
            // 1. Sign Up the user via Supabase Auth
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (signUpError) throw signUpError;
            
            const userId = signUpData.user?.id;
            if (!userId) throw new Error('No se pudo inicializar la cuenta del usuario.');

            // 2. Insert/Upsert into profiles setting B2B specific flags
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: fullName,
                    email: email,
                    account_type: 'business',
                    is_business_admin: true,
                    role: 'professional',
                    is_professional: true
                });

            if (profileError) throw profileError;

            // 3. Create the business profile row in business_profiles
            const { data: bizData, error: bizError } = await supabase
                .from('business_profiles')
                .insert({
                    business_name: businessName,
                    sector: sector,
                    category: '', // initialized empty
                    email: email,
                    show_location: true
                })
                .select('id')
                .single();

            if (bizError || !bizData) {
                throw bizError || new Error('No se pudo registrar la empresa.');
            }

            // 4. Link the new business_profiles row ID to the user's business_id in profiles
            const { error: linkError } = await supabase
                .from('profiles')
                .update({
                    business_id: bizData.id
                })
                .eq('id', userId);

            if (linkError) throw linkError;

            // 5. Success feedback
            if (signUpData.session) {
                // If auto-logged in, navigate to profile
                setSuccessMsg('Registro completado con éxito. Redirigiendo...');
                setTimeout(() => {
                    router.push('/business/profile');
                }, 1500);
            } else {
                // If email confirmation is required
                setSuccessMsg('¡Registro completado! Por favor, verifica tu bandeja de entrada para confirmar tu correo e iniciar sesión.');
                // Clear fields
                setFullName('');
                setBusinessName('');
                setSector('');
                setEmail('');
                setPassword('');
            }
        } catch (err: any) {
            console.error('Registration B2B error:', err);
            setErrorMsg(err.message || 'Ocurrió un error al registrar la cuenta corporativa.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-violet-500/30">
            {/* Background blobs */}
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-lg relative z-10 my-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-3xl flex items-center justify-center mx-auto mb-6 overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                            src="/dconfy_icon.png"
                            alt="Logo dconfy"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "/logo-icono.png";
                            }}
                        />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        Registrar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE5518] to-[#CD1F8B]">Empresa</span>
                    </h1>
                    <p className="text-slate-400 font-medium mt-2">Crea tu portal de empresa en dconfy</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/85 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-slate-800">
                    <form onSubmit={handleRegister} className="space-y-5">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Administrador</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FE5518] focus:ring-2 focus:ring-[#FE5518]/10 outline-none transition-all font-medium text-white text-sm"
                                        placeholder="Nombre completo"
                                    />
                                </div>
                            </div>

                            {/* Business Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre de Empresa</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FE5518] focus:ring-2 focus:ring-[#FE5518]/10 outline-none transition-all font-medium text-white text-sm"
                                        placeholder="Nombre comercial"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sector Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sector</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Briefcase className="h-4 w-4 text-slate-500" />
                                </div>
                                <select
                                    required
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FE5518] focus:ring-2 focus:ring-[#FE5518]/10 outline-none transition-all font-medium text-white text-sm cursor-pointer"
                                >
                                    <option value="" className="bg-slate-950 text-slate-500">Selecciona sector corporativo...</option>
                                    {sectorsList.map((sectName) => (
                                        <option key={sectName} value={sectName} className="bg-slate-950 text-white font-medium">
                                            {sectName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Correo corporativo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FE5518] focus:ring-2 focus:ring-[#FE5518]/10 outline-none transition-all font-medium text-white text-sm"
                                    placeholder="admin@empresa.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FE5518] focus:ring-2 focus:ring-[#FE5518]/10 outline-none transition-all font-medium text-white text-sm"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        {/* Success Notification */}
                        {successMsg && (
                            <div className="bg-emerald-950/40 text-emerald-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-emerald-900/50 animate-in fade-in">
                                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                                <p>{successMsg}</p>
                            </div>
                        )}

                        {errorMsg && (
                            <div className="bg-red-950/50 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border border-red-900/50 animate-in fade-in">
                                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                                <p>{errorMsg}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FE5518] hover:bg-[#E44911] text-white py-3.5 rounded-full font-bold transition-all shadow-lg shadow-[#FE5518]/10 mt-4 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creando cuenta B2B...
                                </>
                            ) : (
                                <>
                                    <span>Registrar Empresa</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm border-t border-slate-850 pt-5">
                        <span className="text-slate-400">¿Ya tienes cuenta de empresa? </span>
                        <Link href="/business/login" className="text-[#FE5518] hover:text-[#E44911] font-bold hover:underline transition-all">
                            Inicia sesión
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
