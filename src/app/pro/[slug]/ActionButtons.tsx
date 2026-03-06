'use client';

import { Heart } from 'lucide-react';

export default function ActionButtons({ slug }: { slug: string }) {
    const handleDeepLink = () => {
        const appUrl = `https://app.dconfy.io/#/professional/${slug}?shared=true`;
        const iosStoreUrl = "https://apps.apple.com/app/id6759350115";
        const androidStoreUrl = "https://play.google.com/store/apps/details?id=io.dconfy.app";

        window.location.href = appUrl;

        setTimeout(() => {
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            window.location.href = isIOS ? iosStoreUrl : androidStoreUrl;
        }, 2500);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 flex gap-3 justify-center pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button
                onClick={handleDeepLink}
                className="flex-1 max-w-[200px] bg-slate-100 text-slate-700 font-bold py-3.5 rounded-full flex font-[system-ui] items-center justify-center gap-2 hover:bg-slate-200 transition-colors active:scale-95 text-[13px] sm:text-sm"
            >
                <img src="/icon.png" alt="dconfy" className="w-5 h-5 rounded-[4px] object-contain" />
                Abrir en dconfy
            </button>
            <button
                onClick={handleDeepLink}
                className="flex-1 max-w-[200px] bg-[#FF6600] text-white font-bold py-3.5 rounded-full shadow-lg shadow-[#FF6600]/30 flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors active:scale-95 text-[13px] sm:text-sm"
            >
                <Heart className="w-5 h-5 fill-current" /> Recomendar
            </button>
        </div>
    );
}