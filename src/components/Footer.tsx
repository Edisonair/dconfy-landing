// src/components/Footer.tsx
"use client";

import Link from 'next/link';
import { Instagram } from 'lucide-react';

export function Footer() {
    const trackGAEvent = (eventName: string, label: string) => {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', eventName, {
                event_category: 'engagement',
                event_label: label
            });
        }
    };

    return (
        <footer className="bg-[#171721] text-white pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-2xl font-medium text-slate-300 mb-6">Estamos construyendo la red de servicios más confiable y queremos que seas parte de nuestro lanzamiento.</h2>
                    <Link href="/#descargar" className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20">
                        Descargar app Gratis
                    </Link>
                </div>

                <div className="border-t border-slate-800 pt-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-2">
                        <img src="/dconfy_logo_dark.png" alt="Logo dconfy" className="h-8 md:h-10 w-auto object-contain mb-6" />
                        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Profesionales y servicios recomendados por gente de tu confianza.</p>
                        <div className="mt-6 flex items-center gap-3">
                            <a onClick={() => trackGAEvent('Clic_Social_Instagram', 'Social')} href="https://www.instagram.com/dconfy.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 rounded-full bg-slate-800 hover:bg-[#FF6600] text-slate-400 hover:text-white transition-all group" aria-label="Instagram de dconfy">
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a onClick={() => trackGAEvent('Clic_Social_TikTok', 'Social')} href="https://www.tiktok.com/@dconfy.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2 rounded-full bg-slate-800 hover:bg-[#FF6600] text-slate-400 hover:text-white transition-all group" aria-label="TikTok de dconfy">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 group-hover:scale-110 transition-transform">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link href="/#como-funciona" className="text-slate-400 hover:text-white text-sm transition-colors">Cómo funciona</Link>
                        <Link href="/#planes" className="text-slate-400 hover:text-white text-sm transition-colors">Planes</Link>
                        <Link href="/#faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
                        <Link href="/admin" className="text-slate-400 hover:text-white text-sm transition-colors">Acceso Empresas</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Link href="/privacidad" className="text-slate-400 hover:text-white text-sm transition-colors">Política de privacidad</Link>
                        <Link href="/terminos" className="text-slate-400 hover:text-white text-sm transition-colors">Términos y condiciones</Link>
                        <a href="mailto:info@dconfy.io" className="text-slate-400 hover:text-white text-sm transition-colors">Contacto</a>
                    </div>
                </div>

                <div className="text-center text-xs text-slate-600 pt-8 border-t border-slate-800">
                    © {new Date().getFullYear()} dconfy. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}