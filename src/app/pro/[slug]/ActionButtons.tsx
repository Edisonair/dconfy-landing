'use client';

import { Bookmark, Share, Heart } from 'lucide-react';
import { useState } from 'react';

export default function ActionButtons({ slug }: { slug: string }) {
    const [isSharing, setIsSharing] = useState(false);

    const handleDeepLink = () => {
        const appUrl = `https://app.dconfy.io/#/professional/${slug}?shared=true`;
        const iosStoreUrl = "https://apps.apple.com/app/id6759350115";
        const androidStoreUrl = "https://play.google.com/store/apps/details?id=io.dconfy.app";

        window.open(appUrl, '_top');

        setTimeout(() => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            window.open(isIOS ? iosStoreUrl : androidStoreUrl, '_top');
        }, 2500);
    };

    const handleShare = async () => {
        setIsSharing(true);
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'dconfy - Profesionales de Confianza',
                    text: 'Mira este profesional recomendado en dconfy',
                    url: window.location.href
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Enlace copiado al portapapeles");
            }
        } catch (error) {
            console.log('Error sharing:', error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-[#FAFAFA]/95 to-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex gap-3 justify-center items-center pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            {/* Botón de Compartir (Icono a la izquierda) */}
            <button
                onClick={handleShare}
                disabled={isSharing}
                title="Compartir"
                className="w-[52px] h-[52px] rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-sm shrink-0"
            >
                <Share className="w-5 h-5" />
            </button>

            {/* Botón de Recomendar (Icono Corazón + Texto en el medio) */}
            <button
                onClick={handleDeepLink}
                className="flex-grow max-w-[240px] bg-gradient-to-r from-[#FE5518] to-violet-600 text-white font-bold h-[52px] rounded-full shadow-lg shadow-violet-200/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-95 text-[15px]"
            >
                <Heart className="w-5 h-5 fill-current text-white" />
                <span>Recomendar</span>
            </button>

            {/* Botón de Guardar (Icono a la derecha) */}
            <button
                onClick={handleDeepLink}
                title="Guardar"
                className="w-[52px] h-[52px] rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 shadow-sm shrink-0"
            >
                <Bookmark className="w-5 h-5" />
            </button>
        </div>
    );
}