'use client';

import React, { useState, useEffect } from 'react';
import { getCategoryColor } from '../../../utils/categoryColors';

interface ProfileBackgroundProps {
    logoUrl?: string | null;
    category?: string | null;
    specialty?: string | null;
}

const mixWithWhite = (r: number, g: number, b: number, weight = 0.85) => {
    const nr = Math.round(r * (1 - weight) + 255 * weight);
    const ng = Math.round(g * (1 - weight) + 255 * weight);
    const nb = Math.round(b * (1 - weight) + 255 * weight);
    return "#" + ((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1);
};

export default function ProfileBackground({ logoUrl, category, specialty }: ProfileBackgroundProps) {
    const [extractedColors, setExtractedColors] = useState<string[]>(['#E0E7FF', '#D8B4FE', '#C7D2FE']);

    useEffect(() => {
        const hexToRgb = (hex: string) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            const cleanHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 124, g: 58, b: 237 };
        };

        const getCategoryPalette = (categoryName: string) => {
            const baseColor = getCategoryColor(categoryName || 'default');
            const rgb = hexToRgb(baseColor);
            return [
                mixWithWhite(rgb.r, rgb.g, rgb.b, 0.70),
                mixWithWhite(rgb.r, rgb.g, rgb.b, 0.80),
                mixWithWhite(rgb.r, rgb.g, rgb.b, 0.90)
            ];
        };

        const defaultPalette = getCategoryPalette(category || specialty || 'default');

        if (!logoUrl) {
            setExtractedColors(defaultPalette);
            return;
        }

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = logoUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    setExtractedColors(defaultPalette);
                    return;
                }

                canvas.width = 5;
                canvas.height = 5;
                ctx.drawImage(img, 0, 0, 5, 5);

                const imgData = ctx.getImageData(0, 0, 5, 5).data;

                const r1 = imgData[24];
                const g1 = imgData[25];
                const b1 = imgData[26];

                const rCenter = imgData[48];
                const gCenter = imgData[49];
                const bCenter = imgData[50];

                const r2 = imgData[72];
                const g2 = imgData[73];
                const b2 = imgData[74];

                const color1 = mixWithWhite(r1, g1, b1, 0.70);
                const colorCenter = mixWithWhite(rCenter, gCenter, bCenter, 0.70);
                const color2 = mixWithWhite(r2, g2, b2, 0.70);

                setExtractedColors([color1, colorCenter, color2]);
            } catch (err) {
                console.error("Error al extraer colores:", err);
                setExtractedColors(defaultPalette);
            }
        };

        img.onerror = () => {
            setExtractedColors(defaultPalette);
        };
    }, [logoUrl, category, specialty]);

    return (
        <div
            className="absolute top-0 left-0 right-0 h-[290px] transition-all duration-700 ease-out pointer-events-none z-0"
            style={{
                background: `linear-gradient(to bottom, ${extractedColors[0]} 0%, ${extractedColors[1]} 50%, ${extractedColors[2]} 80%, transparent 100%)`
            }}
        />
    );
}
