'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ZoomableAvatarProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ZoomableAvatar({ src, alt, className = "" }: ZoomableAvatarProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            <div 
                className={`relative cursor-pointer transition-transform active:scale-95 select-none [-webkit-touch-callout:none] ${className}`}
                onClick={() => setIsOpen(true)}
                onContextMenu={(e) => e.preventDefault()}
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover pointer-events-none rounded-2xl"
                />
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 sm:right-8 top-[calc(1rem+env(safe-area-inset-top))] sm:top-[calc(2rem+env(safe-area-inset-top))] p-3 bg-white/10 hover:bg-white/20 active:scale-90 text-white rounded-full backdrop-blur-md transition-all z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={src}
                        alt={alt}
                        className="w-full max-w-2xl max-h-[85vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 select-none [-webkit-touch-callout:none]"
                        onClick={(e) => e.stopPropagation()}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />
                </div>
            )}
        </>
    );
}
