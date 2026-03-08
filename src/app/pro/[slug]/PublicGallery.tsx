"use client";

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PublicGallery({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!images || !Array.isArray(images) || images.length === 0) return null;

    // Mostramos máximo 3 en el escaparate público
    const displayImages = images.slice(0, 3);

    const openLightbox = (index: number) => {
        setSelectedIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedIndex(null);
        document.body.style.overflow = '';
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null && selectedIndex < displayImages.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    return (
        <>
            <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex gap-2 sm:gap-3 w-full h-40 sm:h-48">
                    {displayImages.map((imgUrl: string, index: number) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(index)}
                            className="flex-1 h-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                        >
                            <img
                                src={imgUrl}
                                alt={`Trabajo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 🚀 MODAL PANTALLA COMPLETA (RATIO ORIGINAL) */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    {/* Contador de fotos */}
                    <div className="absolute top-4 left-4 z-[210] bg-white/10 text-white text-sm font-bold px-4 py-2 rounded-full backdrop-blur-md">
                        {selectedIndex + 1} / {displayImages.length}
                    </div>

                    {/* Botón Cerrar */}
                    <button onClick={closeLightbox} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[210] backdrop-blur-md">
                        <X className="w-6 h-6" />
                    </button>

                    {/* Contenedor de la Imagen */}
                    <div className="relative flex items-center justify-center w-full h-full max-w-5xl">
                        {selectedIndex > 0 && (
                            <button
                                onClick={prevImage}
                                className="absolute left-0 sm:left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-[210] backdrop-blur-md"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        <img
                            onClick={(e) => e.stopPropagation()}
                            src={displayImages[selectedIndex]}
                            alt={`Vista completa ${selectedIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />

                        {selectedIndex < displayImages.length - 1 && (
                            <button
                                onClick={nextImage}
                                className="absolute right-0 sm:right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors z-[210] backdrop-blur-md"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}