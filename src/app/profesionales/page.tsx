'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Ajusta estas rutas según la estructura real de tu proyecto
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

// Inicializamos Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VIPInvitationPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        profesion: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // Insertamos en la tabla vip_invitations
        const { error } = await supabase
            .from('vip_invitations')
            .insert([
                {
                    name: formData.nombre,
                    email: formData.email,
                    profesion: formData.profesion
                }
            ]);

        if (error) {
            console.error('Error al guardar la invitación:', error);
            setStatus('error');
        } else {
            setStatus('success');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
            {/* Si tienes un Header genérico, colócalo aquí */}
            <Header />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-6">
                <div className="w-full max-w-lg bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">

                    {status === 'success' ? (
                        <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                            <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                                ¡Genial! Ya estás en la lista.
                            </h2>
                            <p className="text-lg text-slate-500">
                                Revisa tu email, te contactamos muy pronto con los siguientes pasos para estrenar dconfy.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#FF6600] font-bold text-sm mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    Acceso Anticipado
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                                    Buscamos a los 50 primeros profesionales para estrenar dconfy gratis.
                                </h1>
                                <p className="text-slate-500 text-lg">
                                    Únete a dconfy y deja que el boca a boca digital haga crecer tu negocio.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Tu nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        required
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none"
                                        placeholder="Ej. Laura Gómez"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="profesion" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        ¿A qué te dedicas?
                                    </label>
                                    <input
                                        type="text"
                                        id="profesion"
                                        name="profesion"
                                        required
                                        value={formData.profesion}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none"
                                        placeholder="Ej. Fisioterapeuta, Abogado..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">
                                        Email profesional
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none"
                                        placeholder="hola@tuempresa.com"
                                    />
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-medium text-center">
                                        Hubo un error al guardar tus datos. Por favor, inténtalo de nuevo.
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-gradient-to-r from-[#F05A28] to-[#E83E4C] text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Guardando sitio...
                                        </>
                                    ) : (
                                        'Quiero ser de los primeros'
                                    )}
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    Prometemos no enviar spam. Solo información sobre tu acceso.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}