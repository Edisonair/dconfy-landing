"use client";

import React, { useState } from 'react';
import { Globe, Mail, Phone, Instagram, MessageCircle, MoreHorizontal } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
);

interface ContactButtonsProps {
    profile: any;
    slug: string;
}

export default function ContactButtons({ profile, slug }: ContactButtonsProps) {
    const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);

    const hasWeb = !!profile.website;
    const hasEmail = profile.show_email === true && !!profile.email_professional;
    const hasTikTok = !!profile.tiktok_url;
    const hasInsta = !!profile.instagram_url;
    const hasWa = !!profile.whatsapp_number;
    const hasChat = true; // Siempre true en web pública porque redirige a la app

    const totalButtons = (hasTikTok ? 1 : 0) + (hasInsta ? 1 : 0) + (hasWa ? 1 : 0) + (hasChat ? 1 : 0) + (hasWeb ? 1 : 0) + (hasEmail ? 1 : 0);

    // Si hay más de 4 botones en total, agrupamos la Web y el Email
    const collapseSecondary = totalButtons > 4;
    const hiddenCount = (hasWeb ? 1 : 0) + (hasEmail ? 1 : 0);

    return (
        <div className="flex gap-2 sm:gap-3 justify-end flex-1 flex-nowrap relative items-center">

            {/* 🚀 BOTONES SECUNDARIOS (WEB Y EMAIL) - LOS PRIMEROS */}
            {collapseSecondary ? (
                <>
                    {/* En PC se muestran normales al principio */}
                    <div className="hidden sm:flex gap-2 sm:gap-3 shrink-0">
                        {hasWeb && (
                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform">
                                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                        )}
                        {hasEmail && (
                            <a href={`mailto:${profile.email_professional}`} className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-800 text-white hover:bg-slate-900 rounded-full flex items-center justify-center shadow-md shrink-0 transition-colors active:scale-95">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                        )}
                    </div>

                    {/* En Móvil se agrupan en el menú */}
                    {(hasWeb || hasEmail) && (
                        <div className="sm:hidden relative shrink-0">
                            <button
                                onClick={() => setIsContactMenuOpen(!isContactMenuOpen)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 border-white active:scale-95 transition-colors ${isContactMenuOpen ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                            >
                                <span className="font-black text-[13px]">+{hiddenCount}</span>
                            </button>

                            {isContactMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsContactMenuOpen(false)} />
                                    <div className="absolute right-0 top-12 z-50 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 flex flex-col gap-2 min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
                                        {hasWeb && (
                                            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-700">
                                                <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center shrink-0">
                                                    <Globe className="w-4 h-4" />
                                                </div>
                                                Sitio Web
                                            </a>
                                        )}
                                        {hasEmail && (
                                            <a href={`mailto:${profile.email_professional}`} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-bold text-slate-700">
                                                <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center shrink-0">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                Enviar Email
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            ) : (
                // Si NO hay sobrecarga, se muestran normales al principio
                <>
                    {hasWeb && (
                        <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                    )}
                    {hasEmail && (
                        <a href={`mailto:${profile.email_professional}`} className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-800 text-white hover:bg-slate-900 rounded-full flex items-center justify-center shadow-md shrink-0 transition-colors active:scale-95">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                    )}
                </>
            )}

            {hasTikTok && (
                <a href={`https://tiktok.com/@${profile.tiktok_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md shrink-0 active:scale-95 transition-transform">
                    <TikTokIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
            )}
            {hasInsta && (
                <a href={`https://instagram.com/${profile.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md shadow-red-200 shrink-0 active:scale-95 transition-transform">
                    <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
            )}
            {hasWa && (
                <a href={`tel:${profile.whatsapp_number.replace(/\s+/g, '')}`} className="w-10 h-10 sm:w-11 sm:h-11 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md shadow-green-200 shrink-0 active:scale-95 transition-transform">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
            )}

            {/* EL CHAT SIEMPRE VISIBLE AL FINAL */}
            <a href={`https://app.dconfy.io/#/pro/${slug}`} className="w-10 h-10 sm:w-11 sm:h-11 bg-violet-600 text-white rounded-full flex shrink-0 items-center justify-center shadow-md shadow-violet-200 active:scale-95 transition-transform">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
        </div>
    );
}