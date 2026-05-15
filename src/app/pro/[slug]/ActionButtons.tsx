'use client';

import { Bookmark, Share } from 'lucide-react';
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 flex gap-3 justify-center pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 max-w-[200px] bg-white border border-slate-200 text-slate-700 font-bold h-[52px] rounded-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors active:scale-95 disabled:opacity-50 text-[15px] shadow-sm"
            >
                <Share className="w-5 h-5" /> Compartir
            </button>
            <button
                onClick={handleDeepLink}
                className="flex-1 max-w-[200px] bg-[#FF6600] text-white font-bold h-[52px] rounded-full shadow-lg shadow-[#FF6600]/30 flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors active:scale-95 text-[15px]"
            >
                <Bookmark className="w-5 h-5 fill-current" /> Guardar
            </button>
        </div>
    );
}