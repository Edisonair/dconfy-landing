'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Rocket, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProfesionalesForm() {
    const [formData, setFormData] = useState({
        business_name: '', contact_name: '', email: '', phone: '', specialty: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('business_leads').insert([formData]);
            if (error) throw error;
            setSuccess(true);
        } catch (error) {
            console.error('Error guardando lead:', error);
            alert('Hubo un error. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="max-w-4xl w-full">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-violet-600 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Lado Izquierdo: Textos de Venta */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-bold mb-4">
                            <Rocket className="w-4 h-4" /> Para Profesionales
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Consigue clientes gracias a la confianza de tus amigos.
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Únete a dconfy y deja que el boca a boca digital haga crecer tu negocio. Sin comisiones ocultas, solo recomendaciones reales.
                        </p>
                    </div>

                    {/* Lado Derecho: Formulario */}
                    <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
                        {success ? (
                            <div className="text-center py-8 animate-in zoom-in duration-300">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Solicitud enviada!</h3>
                                <p className="text-slate-500">Nos pondremos en contacto contigo muy pronto para activar tu perfil profesional.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nombre de la Empresa</label>
                                    <input required type="text" name="business_name" value={formData.business_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="Ej: Reformas García" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tu Nombre</label>
                                    <input required type="text" name="contact_name" value={formData.contact_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="Ej: Juan Pérez" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="correo@empresa.com" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Teléfono</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="600 000 000" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Especialidad</label>
                                    <input required type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all" placeholder="Ej: Abogado, Fontanero, Fisioterapeuta..." />
                                </div>
                                <button disabled={loading} type="submit" className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-200 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Solicitar Acceso Profesional'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}