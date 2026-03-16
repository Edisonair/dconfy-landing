"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

// 🚀 COMPONENTE INTELIGENTE PARA 1 Y 2 IMÁGENES
const SmartGalleryImage = ({ src, onClick }: { src: string; onClick: () => void }) => {
    const [flexRatio, setFlexRatio] = useState<number>(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleLoad = (img: HTMLImageElement) => {
        const { naturalWidth, naturalHeight } = img;
        if (naturalWidth && naturalHeight) {
            let ratio = naturalWidth / naturalHeight;
            if (ratio > 2.5) ratio = 2.5;
            if (ratio < 0.5) ratio = 0.5;
            setFlexRatio(ratio);
        }
        setIsLoaded(true);
    };

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            handleLoad(imgRef.current);
        }
    }, [src]);

    return (
        <div
            onClick={onClick}
            className="h-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 transition-all duration-500 ease-out relative cursor-zoom-in group"
            style={{ flex: `${flexRatio} 1 0%` }}
        >
            {!isLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse" />}

            <img
                ref={imgRef}
                src={src}
                alt="Trabajo de galería"
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={(e) => handleLoad(e.currentTarget)}
                onError={() => setIsLoaded(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
    );
};

export default function PublicGallery({ images }: { images: string[] }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    if (!images || !Array.isArray(images) || images.length === 0) return null;

    const gridImages = images.slice(0, 3);
    const totalImages = images.length;
    const extraImagesCount = totalImages - 3;

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

    // 🚀 LÓGICA MIXTA: Proporcional (1 o 2 fotos) vs Mosaico (3 o más fotos)
    const renderGrid = () => {
        // CASO 1: Una foto (Se ajusta a su proporción natural)
        if (totalImages === 1) {
            return (
                <div className="flex w-full h-64 sm:h-80">
                    <SmartGalleryImage src={gridImages[0]} onClick={() => openLightbox(0)} />
                </div>
            );
        }

        // CASO 2: Dos fotos (Se reparten el ancho inteligentemente según su proporción)
        if (totalImages === 2) {
            return (
                <div className="flex gap-2 sm:gap-3 w-full h-48 sm:h-64">
                    <SmartGalleryImage src={gridImages[0]} onClick={() => openLightbox(0)} />
                    <SmartGalleryImage src={gridImages[1]} onClick={() => openLightbox(1)} />
                </div>
            );
        }

        // CASO 3: Tres o más fotos (Efecto Mosaico Clásico 75% / 25%)
        return (
            <div className="flex gap-2 sm:gap-3 w-full h-64 sm:h-80">
                {/* 75% Izquierda */}
                <div
                    onClick={() => openLightbox(0)}
                    className="w-3/4 h-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                >
                    <img src={gridImages[0]} alt="Trabajo principal" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* 25% Derecha Apilada */}
                <div className="w-1/4 h-full flex flex-col gap-2 sm:gap-3">
                    <div
                        onClick={() => openLightbox(1)}
                        className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img src={gridImages[1]} alt="Trabajo 2" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    <div
                        onClick={() => openLightbox(2)}
                        className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative cursor-zoom-in group"
                    >
                        <img src={gridImages[2]} alt="Trabajo 3" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        {/* Cartelito de +X fotos */}
                        {extraImagesCount > 0 && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center transition-colors group-hover:bg-black/60">
                                <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 opacity-90" />
                                <span className="text-2xl md:text-3xl font-black">+{extraImagesCount}</span>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 opacity-90 hidden sm:block">Ver todas</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Galería</h3>
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