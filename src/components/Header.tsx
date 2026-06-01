// src/components/Header.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        // Check scroll position immediately on mount
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const trackGAEvent = (eventName: string, label: string) => {
        if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', eventName, {
                event_category: 'engagement',
                event_label: label
            });
        }
    };

    return (
        <>
            <header className={`bg-[#FFF9F0] fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-100/70 shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'border-b border-transparent shadow-none'}`}>
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
                        <Link href="/#descargar" className="hover:text-violet-600 transition-colors">Descargar app</Link>
                        <Link href="/#planes" className="hover:text-violet-600 transition-colors">Plan Profesional</Link>
                        {/* <Link href="/#faq" className="hover:text-violet-600 transition-colors">FAQ</Link> */}
                        <Link href="/blog" className="hover:text-violet-600 transition-colors">Blog</Link>
                    </div>
                    <Link href="/" onClick={() => trackGAEvent('Clic_Descargar_nav', 'Descargar')} className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
                        Llega en Junio
                    </Link>
                </nav>
            </header>
            {/* Espaciador para evitar solapamientos debido a la cabecera fija */}
            <div className="h-[72px] md:h-[80px] shrink-0" />
        </>
    );
}