"use client";

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export default function PublicGallery({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!images || !Array.isArray(images) || images.length === 0) return null;

    // Mostramos máximo 3 en el escaparate público para la cuadrícula principal
    const gridImages = images.slice(0, 3);
    const totalImages = images.length;

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
        if (selectedIndex !== null && selectedIndex < images.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    // 🚀 LÓGICA DE RENDERIZADO DE LA CUADRÍCULA SEGÚN CANTIDAD DE IMÁGENES
    const renderGrid = () => {

        // CASO 1: Exactamente 1 imagen -> Respeta proporción original
        if (gridImages.length === 1) {
            return (
                <div
                    onClick={() => openLightbox(0)}
                    className="w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                >
                    {/* Al no fijar una altura (h-full), la imagen dicta su propia altura manteniendo su ratio. Se usa max-h para que fotos verticales no rompan la vista */}
                    <img
                        src={gridImages[0]}
                        alt="Trabajo principal"
                        className="w-full h-auto max-h-[500px] object-contain sm:object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
            );
        }

        // CASO 2: Exactamente 2 imágenes -> Diseño Asimétrico Simple (3/4 y 1/4)
        if (gridImages.length === 2) {
            return (
                <div className="flex gap-2 sm:gap-3 w-full h-64 sm:h-80">
                    {/* Imagen Izquierda (3/4 - 75%) */}
                    <div
                        onClick={() => openLightbox(0)}
                        className="w-3/4 h-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img
                            src={gridImages[0]}
                            alt="Trabajo 1"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Imagen Derecha (1/4 - 25%) */}
                    <div
                        onClick={() => openLightbox(1)}
                        className="w-1/4 h-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img
                            src={gridImages[1]}
                            alt="Trabajo 2"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                </div>
            );
        }

        // CASO 3: 3 o más imágenes -> Diseño Asimétrico Complejo (3/4 y 1/4 apilado)
        return (
            <div className="flex gap-2 sm:gap-3 w-full h-64 sm:h-80">

                {/* Imagen Grande Izquierda (3/4 - 75%) */}
                <div
                    onClick={() => openLightbox(0)}
                    className="w-3/4 h-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                >
                    <img
                        src={gridImages[0]}
                        alt="Trabajo principal"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Columna Derecha (1/4 - 25%) con las otras dos apiladas */}
                <div className="w-1/4 h-full flex flex-col gap-2 sm:gap-3">

                    <div
                        onClick={() => openLightbox(1)}
                        className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img
                            src={gridImages[1]}
                            alt="Trabajo 2"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div
                        onClick={() => openLightbox(2)}
                        className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img
                            src={gridImages[2]}
                            alt="Trabajo 3"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        {totalImages > 3 && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center">
                                <LayoutGrid className="w-5 h-5 mb-1 opacity-80" />
                                <span className="text-xl sm:text-2xl font-black">+{totalImages - 3}</span>
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline">Ver todas</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="mt-6 pt-6">
                {renderGrid()}
            </div>

            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={closeLightbox}
                >
                    <div className="absolute top-4 left-4 z-[210] bg-white/10 text-white text-sm font-bold px-4 py-2 rounded-full backdrop-blur-md">
                        {selectedIndex + 1} / {images.length}
                    </div>

                    <button onClick={closeLightbox} className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[210] backdrop-blur-md">
                        <X className="w-6 h-6" />
                    </button>

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
                            src={images[selectedIndex]}
                            alt={`Vista completa ${selectedIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />

                        {selectedIndex < images.length - 1 && (
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