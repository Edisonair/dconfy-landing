// src/components/Header.tsx
"use client";

import Link from 'next/link';

export function Header() {
    const trackGAEvent = (eventName: string, label: string) => {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', eventName, {
                event_category: 'engagement',
                event_label: label
            });
        }
    };

    return (
        <header className="bg-[#FFF9F0] sticky top-0 z-50">
            <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                <Link href="/" className="flex-shrink-0">
                    <img
                        src="/dconfy_logo.png"
                        alt="Logo dconfy"
                        className="h-8 md:h-10 w-auto object-contain"
                    />
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                    <Link href="/#como-funciona" className="hover:text-violet-600 transition-colors">Cómo funciona</Link>
                    <Link href="/#descargar" className="hover:text-violet-600 transition-colors">Descargar</Link>
                    <Link href="/#planes" className="hover:text-violet-600 transition-colors">Planes</Link>
                    <Link href="/#faq" className="hover:text-violet-600 transition-colors">FAQ</Link>
                    <Link href="/blog" className="hover:text-violet-600 transition-colors">Blog</Link>
                </div>
                <Link href="/#descargar" onClick={() => trackGAEvent('Clic_Descargar_nav', 'Descargar')} className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
                    Muy Pronto
                </Link>
            </nav>
        </header>
    );
}