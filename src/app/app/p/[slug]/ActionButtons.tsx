'use client';

import { Heart, Smartphone } from 'lucide-react';

export default function ActionButtons({ slug }: { slug: string }) {
    const handleDeepLink = () => {
        // 1. Intentamos abrir la App usando el Universal Link
        const appUrl = `https://app.dconfy.io/#/professional/${slug}?shared=true`;

        // 2. Enlaces a las tiendas (con tu ID real de Apple)
        const iosStoreUrl = "https://apps.apple.com/app/id6759350115";
        const androidStoreUrl = "https://play.google.com/store/apps/details?id=io.dconfy.app";

        // Lanzamos la app
        window.location.href = appUrl;

        // Si en 2.5 segundos no se ha salido de la web (porque no tiene la app), le mandamos a la tienda
        setTimeout(() => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            window.location.href = isIOS ? iosStoreUrl : androidStoreUrl;
        }, 2500);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 flex gap-3 justify-center pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button
                onClick={handleDeepLink}
                className="flex-1 max-w-[200px] bg-slate-100 text-slate-700 font-bold py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
            >
                <Smartphone className="w-5 h-5" /> Abrir App
            </button>
            <button
                onClick={handleDeepLink}
                className="flex-1 max-w-[200px] bg-violet-600 text-white font-bold py-3.5 rounded-full shadow-lg shadow-violet-200 flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors"
            >
                <Heart className="w-5 h-5" /> Recomendar
            </button>
        </div>
    );
}