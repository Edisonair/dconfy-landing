"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
// Importaciones restauradas y añadidas Menu y Mail
import { Search, Users, Heart, CheckCircle2, Smartphone, Apple, Play, Check, Minus, ChevronDown, X, Instagram, MessageCircle, ArrowDown, Bookmark, Menu, Mail } from 'lucide-react';
import { motion, Variants } from "framer-motion";
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const heroProfessionals = [
  { src: "/hero_vector_yoga_mat.png", alt: "Yoga" },
  { src: "/hero_vector_gardener_relatable.png", alt: "Jardinero" },
  { src: "/hero_vector_tattoo_alt.png", alt: "Tatuador" },
  { src: "/hero_vector_painter_relatable.png", alt: "Pintor" },
  { src: "/hero_vector_dogwalker_relatable.png", alt: "Paseadora" },
  { src: "/hero_vector_vet_relatable.png", alt: "Veterinaria" },
  { src: "/hero_vector_photographer.png", alt: "Fotógrafo" },
  { src: "/hero_vector_lawyer.png", alt: "Abogada" },
  { src: "/hero_vector_physio.png", alt: "Fisioterapeuta" },
  { src: "/hero_vector_chef.png", alt: "Chef Privada" },
  { src: "/hero_vector_barber_relatable.png", alt: "Barbero" },
  { src: "/hero_vector_realestate.png", alt: "Agente Inmobiliaria" },
  { src: "/hero_vector_personaltrainer.png", alt: "Entrenador" },
  { src: "/hero_vector_thaimassage.png", alt: "Masajista" },
  { src: "/hero_vector_socialmedia.png", alt: "Experto en Redes" },
  { src: "/hero_vector_commerce_4.png", alt: "Comercios" },
  { src: "/hero_vector_wine_sommelier_final_v2.png", alt: "Bodegas" }
];

const placeholderRoles = [
  "Abogado", "Fisioterapeuta", "Fontanero", "Psicólogo", "Tatuador",
  "Electricista", "Mecánico", "Salón de Peluquería", "Entrenador Personal",
  "Fotógrafo", "Veterinario", "Clínica Estética", "Jardinero",
  "Experto en Redes", "Asesor Fiscal", "Masajista", "Agente de Seguros",
  "Tienda de Ropa", "Boutique", "Comercio Local", "Bodega", "Sumiller"
];

// Tipado explícito Variants para evitar errores de TypeScript
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const [desktopCycle, setDesktopCycle] = useState(0);

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Corregido el error de clearInterval
  useEffect(() => {
    const timer = setInterval(() => {
      setDesktopCycle(prev => prev + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const currentWord = placeholderRoles[currentRoleIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % placeholderRoles.length);
        }
      }, 20);
    } else {
      timeout = setTimeout(() => {
        setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        if (displayedText.length === currentWord.length) {
          timeout = setTimeout(() => setIsDeleting(true), 1000);
        }
      }, 40);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex]);

  const leftIdx = (desktopCycle * 3) % heroProfessionals.length;
  const centerIdx = (desktopCycle * 3 + 1) % heroProfessionals.length;
  const rightIdx = (desktopCycle * 3 + 2) % heroProfessionals.length;

  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const faqs = [
    { q: "¿Cómo se validan las reseñas?", a: "La validación la hace tu propio círculo de confianza. Esa es la esencia de dconfy: olvídate de las reseñas falsas o anónimas de internet. Así garantizamos que cada valoración sea 100% auténtica y basada en la experiencia real de la gente en la que ya confías." },
    { q: "¿Es gratis para usuarios que buscan servicios?", a: "Totalmente. La aplicación es 100% gratuita para los usuarios que buscan y contratan profesionales." },
    { q: "¿Cómo me doy de alta como profesional?", a: "Descarga la app, selecciona 'Soy profesional' y completa tu perfil. Puedes empezar con el plan gratuito y actualizar cuando quieras." },
    { q: "¿Puedo cancelar mi suscripción en cualquier momento?", a: "Sí, no hay compromiso de permanencia. Puedes cancelar tu plan cuando quieras y seguirás teniendo acceso hasta que termine tu ciclo de facturación actual." },
    { q: "¿Cómo funciona la facturación?", a: "Recibirás una factura mensual o anual según el plan elegido. Puedes descargar tus facturas desde tu panel de profesional." },
  ];

  const trackGAEvent = (eventName: string, label: string) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, {
        event_category: 'engagement',
        event_label: label
      });
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-violet-200">

      <Header />

      <section className="bg-[#FFF9F0] pt-12 pb-12 lg:pb-24 px-6 rounded-b-[3rem] sm:rounded-b-[5rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.03)] z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          <div className="max-w-xl lg:max-w-lg">
            <h1 className="text-5xl md:text-6xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight leading-[1.1] mb-6">
              El boca a boca <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F05A28] via-[#E83E4C] to-[#BE1E8D]">de confianza,</span> ahora en una app
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-normal mb-8 leading-relaxed tracking-tight">
              Descubre profesionales y servicios recomendados por tu gente.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link onClick={() => trackGAEvent('Clic_Descargar_hero', 'Descargar')} href="#descargar" className="border-2 border-transparent bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
                  Descargar app
                </Link>
                <Link onClick={() => trackGAEvent('Clic_Planes_hero', 'Planes')} href="#planes" className="border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all text-center">
                  ¿Ofreces algún servicio?
                </Link>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-6 pl-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Tú" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 leading-none">Tú</span>
                </div>

                <div className="text-[#FF6600] mb-4">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-sm shrink-0 bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Carlos" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 leading-none">Carlos</span>
                </div>

                <div className="text-[#FF6600] mb-4">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-xl overflow-hidden shadow-sm shrink-0 bg-orange-50">
                    <img src="/fisio.jpg" alt="Elena" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-black text-slate-900 leading-none">Fisio Elena</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 lg:mt-0 relative w-full flex flex-col items-center">
            <div className="block md:hidden w-[calc(100%+3rem)] -mx-6 overflow-hidden relative pt-16 pb-4 -mt-4">
              <div className="flex w-fit animate-marquee items-center hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-grab active:cursor-grabbing mb-12">
                {heroProfessionals.map((item, i) => (
                  <div key={`group1-${i}`} className="w-[180px] sm:w-[170px] shrink-0 px-1">
                    <div className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                      <img src={item.src} alt={item.alt} draggable="false" className="w-full h-auto scale-[1.35] origin-center pointer-events-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]" />
                    </div>
                  </div>
                ))}
                {heroProfessionals.map((item, i) => (
                  <div key={`group2-${i}`} className="w-[180px] sm:w-[170px] shrink-0 px-1">
                    <div className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                      <img src={item.src} alt={item.alt} draggable="false" className="w-full h-auto scale-[1.35] origin-center pointer-events-none select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center px-4">
                <div className="bg-white border border-slate-200/60 shadow-md shadow-violet-100/50 px-5 py-2.5 rounded-full flex items-center gap-2 max-w-full">
                  <span className="text-slate-500 font-medium text-sm shrink-0">Recomendaciones de</span>
                  <div className="flex items-center overflow-hidden">
                    <span className="font-bold text-violet-600 text-sm whitespace-nowrap">{displayedText}</span>
                    <span className="w-[2px] h-4 bg-violet-500 ml-0.5 animate-[pulse_0.8s_infinite]"></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-end relative lg:translate-x-8 xl:translate-x-16 origin-center w-full">
              <div className="flex justify-end items-center relative w-full">
                <div className="w-[230px] lg:w-[320px] transition-transform duration-700 hover:-translate-y-4 shrink-0 mt-28 lg:mt-36 z-10 relative">
                  <div className="animate-float relative" style={{ animationDelay: '0s' }}>
                    {heroProfessionals.map((pro, idx) => (
                      <img
                        key={`desktop-left-${idx}`}
                        src={pro.src}
                        alt={pro.alt}
                        className={`w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_25px_40px_rgba(0,0,0,0.2)] transition-all duration-1000 ${idx === leftIdx ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 pointer-events-none scale-95'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-[280px] lg:w-[380px] transition-transform duration-700 hover:-translate-y-4 shrink-0 mb-8 lg:mb-12 z-30 -ml-16 lg:-ml-24 relative">
                  <div className="animate-float relative" style={{ animationDelay: '1.5s' }}>
                    {heroProfessionals.map((pro, idx) => (
                      <img
                        key={`desktop-center-${idx}`}
                        src={pro.src}
                        alt={pro.alt}
                        className={`w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:drop-shadow-[0_30px_50px_rgba(0,0,0,0.25)] transition-all duration-1000 ${idx === centerIdx ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 pointer-events-none scale-95'
                          }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-[230px] lg:w-[320px] transition-transform duration-700 hover:-translate-y-4 shrink-0 mt-16 lg:mt-20 z-20 -ml-16 lg:-ml-24 relative">
                  <div className="animate-float relative" style={{ animationDelay: '3s' }}>
                    {heroProfessionals.map((pro, idx) => (
                      <img
                        key={`desktop-right-${idx}`}
                        src={pro.src}
                        alt={pro.alt}
                        className={`w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:drop-shadow-[0_25px_40px_rgba(0,0,0,0.2)] transition-all duration-1000 ${idx === rightIdx ? 'opacity-100 relative' : 'opacity-0 absolute top-0 left-0 pointer-events-none scale-95'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Degradado radial restaurado */}
      <section
        className="py-24 px-6 overflow-hidden relative"
        style={{ background: 'radial-gradient(circle at center, #fafafa 10%, #ffffff 90%)' }}
      >
        <div className="max-w-4xl mx-auto z-10 relative">
          <motion.div
            className="text-center mb-16 lg:mb-24"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight">Así se ven las recomendaciones en dconfy</h2>
            <p className="mt-4 text-xl text-slate-500 font-medium">Cada recomendación viene de alguien de tu red.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-10 max-w-[1000px] mx-auto px-4 lg:px-0"
            whileInView="visible"
            initial="hidden"
            variants={staggerContainerVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInUpVariants} className="relative w-full max-w-[420px] justify-self-center md:justify-self-end flex flex-col items-center sm:items-stretch">
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600]/30 overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600]/80 via-[#FF6600]/20 to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800 leading-none mb-1.5 tracking-tight">PlusHome</h3>
                    <p className="text-violet-600 font-bold tracking-widest uppercase text-[11px] lg:text-[12px] mb-2.5">REFORMAS INTEGRALES</p>
                    <div className="flex gap-1.5 mb-3 overflow-hidden whitespace-nowrap">
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Lampistería</span>
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Fontane...</span>
                      <span className="bg-[#F3F0FF] text-[#8B5CF6] px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-bold border border-[#E9D5FF] shrink-0">+3</span>
                    </div>
                  </div>
                  <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100">
                    <img src="/home.jpg" alt="Reforma" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#FF6600]">📍</span>
                    <span className="text-[#64748b] font-medium text-xs lg:text-sm">Madrid</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100" />
                    </div>
                    <span className="text-slate-800 font-bold text-xs lg:text-sm">dconfy de Lucia, Juan y 12 más</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2 ml-4 self-start">
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-full overflow-hidden shadow-sm border-2 border-white bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Laura Gomez" className="w-full h-full object-cover" />
                  </div>

                </div>
                <div className="pt-1 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#64748b] font-medium text-sm lg:text-base">Recomendado por <strong className="text-slate-900 font-black">Laura</strong></span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#3B82F6] text-[11px] tracking-wide font-bold border border-[#BFDBFE]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      de tu amiga Susana
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>9 feb</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUpVariants} className="relative w-full max-w-[420px] justify-self-center md:justify-self-start flex flex-col items-center sm:items-stretch">
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600]/30 overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600]/80 via-[#FF6600]/20 to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800 leading-none mb-1.5 tracking-tight">Bella Donna</h3>
                    <p className="text-violet-600 font-bold tracking-widest uppercase text-[11px] lg:text-[12px] mb-2.5">MODA MUJER</p>
                    <div className="flex gap-1.5 mb-3 overflow-hidden whitespace-nowrap">
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Vestidos</span>
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Complementos</span>
                      <span className="bg-[#F3F0FF] text-[#8B5CF6] px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-bold border border-[#E9D5FF] shrink-0">+4</span>
                    </div>
                  </div>
                  <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 bg-pink-50">
                    <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Vestidos" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#FF6600]">📍</span>
                    <span className="text-[#64748b] font-medium text-xs lg:text-sm">Valencia</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100" />
                    </div>
                    <span className="text-slate-800 font-bold text-xs lg:text-sm">dconfy de Marta y 5 más</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2 ml-4 self-start">
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-full overflow-hidden shadow-sm border-2 border-white bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Marta" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="pt-1 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#64748b] font-medium text-sm lg:text-base">Recomendado por <strong className="text-slate-900 font-black">Marta</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>12 mar</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUpVariants} className="relative w-full max-w-[420px] md:col-span-2 justify-self-center flex flex-col items-center sm:items-stretch mx-auto">
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600]/30 overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600]/80 via-[#FF6600]/20 to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-800 leading-none mb-1.5 tracking-tight">Elena Gómez</h3>
                    <p className="text-violet-600 font-bold tracking-widest uppercase text-[11px] lg:text-[12px] mb-2.5">FISIOTERÁPIA</p>
                    <div className="flex gap-1.5 mb-3 overflow-hidden whitespace-nowrap">
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Traumatológica</span>
                      <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-semibold border border-slate-200 truncate">Deportiva</span>
                      <span className="bg-[#F3F0FF] text-[#8B5CF6] px-2 py-0.5 rounded-lg text-[10px] lg:text-[11px] font-bold border border-[#E9D5FF] shrink-0">+1</span>
                    </div>
                  </div>
                  <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 bg-orange-50">
                    <img src="/fisio.jpg" alt="Fisioterápia" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#FF6600]">📍</span>
                    <span className="text-[#64748b] font-medium text-xs lg:text-sm">Barcelona</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" className="w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100" />
                    </div>
                    <span className="text-slate-800 font-bold text-xs lg:text-sm">dconfy de Carlos, Sara y 23 más</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-2 ml-4 self-start">
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-full overflow-hidden shadow-sm border-2 border-white bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Edi" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#64748b] font-medium text-sm lg:text-base">Recomendado por <strong className="text-slate-900 font-black">Edgar</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>5 feb</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Orden restaurado: las ventajas vuelven aquí */}
      <motion.section
        className="bg-transparent pt-24 pb-8 px-6 max-w-7xl mx-auto relative z-20"
        whileInView="visible"
        initial="hidden"
        variants={staggerContainerVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeInUpVariants} className="flex flex-col items-center text-center bg-[#FFF9F0] p-8 rounded-3xl border border-orange-100 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(255,102,0,0.1)] border border-orange-50">
              <Users className="w-6 h-6 text-[#FF6600]" />
            </div>
            <h3 className="text-xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-3">
              Tu red primero
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Las recomendaciones de tu círculo tienen prioridad.
            </p>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="flex flex-col items-center text-center bg-violet-50 p-8 rounded-3xl border border-violet-100 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(124,58,237,0.1)] border border-violet-50">
              <CheckCircle2 className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="text-xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-3">
              Confianza visible
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Sabes quién recomienda cada servicio o profesional.
            </p>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="flex flex-col items-center text-center bg-[#FFF9F0] p-8 rounded-3xl border border-orange-100 shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_10px_rgba(255,102,0,0.1)] border border-orange-50">
              <MessageCircle className="w-6 h-6 text-[#FF6600]" />
            </div>
            <h3 className="text-xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-3">
              Habla directamente
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Chatea desde la app y contacta con confianza.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <section id="como-funciona" className="bg-white pt-12 pb-24 lg:py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          className="flex justify-center mb-6"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 1 }}
        >
          <ArrowDown className="w-10 h-10 text-[#FF6600] animate-bounce" />
        </motion.div>

        <motion.div
          className="text-center mb-16 relative flex flex-col items-center"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="relative inline-block mb-6">
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight relative z-10">Así funciona</h2>
          </div>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            dconfy recupera la forma natural de encontrar servicios y profesionales, <span className="font-bold text-slate-700">preguntando a la gente que conoces</span>, ahora con la potencia de la tecnología.
          </p>
        </motion.div>

        <div className="flex flex-col gap-20 max-w-4xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="order-1 md:order-1 max-w-sm mx-auto text-center md:text-left">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Heart className="w-8 h-8 text-[#FF6600]" />
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Recomienda en quien de verdad confías</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Tus recomendaciones ayudan a tus amigos cuando necesiten un servicio de confianza.</p>
            </div>
            <div className="order-2 md:order-2 max-w-[320px] mx-auto mix-blend-multiply hover:-translate-y-2 transition-transform duration-500">
              <img src="/comic_pebble_recommend_megaphone_final.png" alt="Recomienda y Ayuda - Forma Pebble Comic" className="w-full h-auto object-contain" />
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="order-2 md:order-1 max-w-[320px] mx-auto mix-blend-multiply hover:-translate-y-2 transition-transform duration-500">
              <img src="/comic_blob_search_photographer.png" alt="Busca en tu red - Forma Orgánica Comic" className="w-full h-auto object-contain" />
            </div>
            <div className="order-1 md:order-2 max-w-sm mx-auto text-center md:text-left">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <Search className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Encuentra servicios y profesionales recomendados por tu red.</h3>
              <p className="text-lg text-slate-500 leading-relaxed">No ves opiniones anónimas: ves a quién conoce tu gente.</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="order-1 md:order-1 max-w-sm mx-auto text-center md:text-left">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0">
                <MessageCircle className="w-8 h-8 text-[#FF6600]" />
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Contacta sin intermediarios</h3>
              <p className="text-lg text-slate-500 leading-relaxed">Habla directamente con el profesional desde la app.</p>
            </div>
            <div className="order-2 md:order-2 max-w-[320px] mx-auto hover:-translate-y-2 transition-transform duration-500">
              <img src="/comic_heart_trust_floral_clean_cream2.png" alt="Confianza Directa - Forma Corazón Comic" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nueva sección: Agenda de confianza (diseño píxel a píxel) */}
      <section className="bg-[#FFF9F0] py-24 px-6 max-w-7xl mx-auto rounded-[3rem] my-12 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100 mx-auto lg:mx-0">
              <Bookmark className="w-8 h-8 text-[#FF6600]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight leading-tight mb-6 text-center lg:text-left">Tu agenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F05A28] via-[#E83E4C] to-[#BE1E8D] [-webkit-text-stroke:0]">de confianza</span>, siempre a mano</h2>
            <p className="text-xl font-bold text-slate-700 mb-4 leading-relaxed text-center lg:text-left">
              Las recomendaciones siempre han existido.
            </p>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed text-center lg:text-left">
              En dconfy quedan guardadas automáticamente, para ti y los tuyos, siempre a mano.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700 font-medium">Lo que tú recomiendas, siempre visible en tu perfil</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700 font-medium">Lo que recomienda tu gente, accesible cuando lo necesites</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-slate-700 font-medium">Sin buscar, sin preguntar de nuevo — está ahí cuando lo necesitas</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-[340px]"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Recreación exacta del teléfono en HTML/Tailwind */}
            <div className="bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden h-[750px] flex flex-col transform hover:-translate-y-2 transition-transform duration-500">

              {/* Notch del móvil eliminado */}

              {/* Top bar (App Header) */}
              <div className="pt-6 pb-3 px-4 flex justify-between items-center border-b border-slate-50 shrink-0 bg-white relative z-10">
                <Users className="w-5 h-5 text-slate-800" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                  @mRivero
                </div>
                <div className="flex gap-3 text-slate-800">
                  <Mail className="w-5 h-5" />
                  <Menu className="w-5 h-5" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-4 py-4 flex items-center gap-3 shrink-0 bg-white">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Marta Rivero" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[17px] leading-tight mb-0.5">Marta Rivero</h3>
                  <div className="flex gap-2.5 text-[9px] font-black text-slate-400 tracking-wide">
                    <div><span className="text-slate-900 text-[10px]">11</span> DCONFY</div>
                    <div><span className="text-slate-900 text-[10px]">9</span> REFERENCIAS</div>
                  </div>
                </div>
              </div>

              {/* Grid Layout Scrollable */}
              <div className="flex-1 overflow-y-auto bg-slate-50 px-3 pt-2 pb-24 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Card 1: Clínica Estética */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Le Bonde" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">Le Bonde</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">60 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Clínica Estética</div>
                    </div>
                  </div>

                  {/* Card 2: Tatuajes */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Erick Noel" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">Erick Noel</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">147 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Tatuajes</div>
                    </div>
                  </div>

                  {/* Card 3: Fisioterapia */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="/fisio.jpg" className="w-full h-full object-cover" alt="Elena Gómez" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">Elena Gómez</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">31 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Fisioterapia</div>
                    </div>
                  </div>

                  {/* Card 4: Interiorismo */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="AKA Studio" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">AKA Studio</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">121 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Interiorismo</div>
                    </div>
                  </div>

                  {/* Card 5: Moda */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Nosso Boutique" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">Nosso Boutique</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">60 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Moda Mujer</div>
                    </div>
                  </div>

                  {/* Card 6: Inmobiliaria */}
                  <div className="bg-white rounded-[1.25rem] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
                    <div className="h-[100px] bg-slate-200 relative">
                      <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="Grupo SIL" />
                    </div>
                    <div className="p-2.5">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-slate-900 text-[11px] leading-tight truncate pr-1">Grupo SIL</div>
                        <div className="text-[#FF6600] text-[9px] font-bold flex items-center gap-0.5 shrink-0">60 <Heart className="w-2.5 h-2.5 fill-current" /></div>
                      </div>
                      <div className="text-[8px] font-black text-violet-600 tracking-widest uppercase mt-0.5">Inmobiliaria</div>
                    </div>
                  </div>
                </div>

                {/* Degradado para suavizar el final del scroll */}
                <div className="absolute bottom-[60px] left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10"></div>
              </div>

              {/* Bottom Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center pt-3 pb-6 px-2 z-20">
                <Search className="w-6 h-6 text-slate-300" />
                <Users className="w-6 h-6 text-slate-300" />
                <MessageCircle className="w-6 h-6 text-slate-300" />
                <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-violet-600 ring-offset-2">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="Perfil" />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-6 tracking-tight">¿Por qué dconfy es diferente?</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto"
          whileInView="visible"
          initial="hidden"
          variants={staggerContainerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeInUpVariants} className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-400 mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-sm">✕</span>
              Otras plataformas
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Minus className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-600 font-medium">Opiniones de desconocidos</span>
              </li>
              <li className="flex items-start gap-4">
                <Minus className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-600 font-medium">Reseñas anónimas y sin contexto</span>
              </li>
              <li className="flex items-start gap-4">
                <Minus className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-600 font-medium">Rankings impersonales</span>
              </li>
              <li className="flex items-start gap-4">
                <Minus className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-600 font-medium">Las recomendaciones se pierden entre mensajes</span>
              </li>
              <li className="flex items-start gap-4">
                <Minus className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-lg text-slate-600 font-medium">Contacto a través de intermediarios</span>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="bg-[#FFF9F0] p-10 rounded-3xl border-2 border-[#FF6600] shadow-xl shadow-orange-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/40 to-violet-200/40 blur-3xl rounded-full"></div>
            <h3 className="text-2xl font-black text-[#111827] mb-8 flex items-center gap-3 relative z-10">
              <span className="w-8 h-8 rounded-full bg-[#FF6600] flex items-center justify-center text-white">
                <Check className="w-5 h-5" />
              </span>
              dconfy
            </h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-[#111827] font-bold">Recomendaciones de tu gente</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-[#111827] font-bold">Sabes exactamente quién recomienda</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-[#111827] font-bold">Tu red primero, siempre</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-[#111827] font-bold">Todo queda guardado automáticamente en tu perfil</span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-[#FF6600] shrink-0 mt-0.5" />
                <span className="text-lg text-[#111827] font-bold">Contacto directo desde la app</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </section>

      <section id="descargar" className="bg-[#FFF9F0] py-24 px-6 text-center">

        <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto mb-8 overflow-hidden">
          <img
            src="/dconfy_icon.png"
            alt="Logo dconfy"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-4xl md:text-6xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-6 tracking-tight">Descarga la app</h2>

        <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto">
          Empieza a encontrar profesionales y servicios recomendados por tu red.
        </p>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/80 border border-orange-200/50 text-[#FF6600] text-[13px] font-bold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF6600] animate-pulse"></span>
            Disponible próximamente
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">

          <button onClick={() => trackGAEvent('Clic_appStore', 'Descargar')} className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-full flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
            <svg className="w-8 h-8 ml-1" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
              <span className="text-[18px] font-semibold leading-tight tracking-tight">App Store</span>
            </div>
          </button>

          <button onClick={() => trackGAEvent('Clic_googlePlay', 'Descargar')} className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-full flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
            <svg className="w-7 h-7 ml-1" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
              <span className="text-[18px] font-semibold leading-tight tracking-tight">Google Play</span>
            </div>
          </button>

        </div>

      </section>

      <section id="planes" className="bg-white py-24 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-4xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4 tracking-tight">¿Ofreces algún servicio?</h2>
          <p className="text-slate-500 mb-8 max-w-2xl mx-auto font-medium">Elige tu plan y convierte las recomendaciones en nuevos clientes.</p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-4 mb-16"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="text-xs font-bold text-[#F97316] bg-[#FF6600]/10 px-3 py-1 rounded-full max-sm:mb-2">3 meses gratis por lanzamiento</span>

          <div className="relative flex items-center bg-[#F4F5F8] p-1.5 rounded-full w-[260px] h-[52px]">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 left-1.5 ${!isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
            ></div>
            <button
              onClick={() => {
                if (!isAnnual) {
                  setIsAnnual(true);
                  trackGAEvent('Clic_Planes_toggle', 'Planes');
                }
              }}
              className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${isAnnual ? 'text-[#111827]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Anual
            </button>
            <button
              onClick={() => {
                if (isAnnual) {
                  setIsAnnual(false);
                  trackGAEvent('Clic_Planes_toggle', 'Planes');
                }
              }}
              className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${!isAnnual ? 'text-[#111827]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Mensual
            </button>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left"
          whileInView="visible"
          initial="hidden"
          variants={staggerContainerVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeInUpVariants} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <h3 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-2">Plan Profesional</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Ideal para profesionales, autónomos y pequeños negocios que quieren destacar.</p>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">{isAnnual ? '2.49€' : '2.99€'}</span>
              <span className="text-slate-500 font-medium">/mes</span>
            </div>
            <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? '29,99€ al año (pago anual). Ahorra 2 meses. ' : 'Facturado mensualmente. Cancela cuando quieras.'}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Perfil Profesional verificado',
                'Perfil web público para compartir',
                'Recibe recomendaciones',
                'Aparece en búsquedas de tu zona',
                'Chat con clientes habilitado',
                'Estadísticas de tu perfil'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 text-[#FF6600] shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="#descargar" onClick={() => trackGAEvent('Clic_planPro', 'Planes')} className="block w-full text-center border-2 border-slate-200 text-slate-700 hover:border-[#FF6600] hover:text-[#FF6600] py-3.5 rounded-2xl flex items-center justify-center font-[system-ui] font-bold transition-all">
              Descargar app
            </Link>
          </motion.div>

          <motion.div variants={fadeInUpVariants} className="bg-[#171A21] p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative transform md:-translate-y-4 hover:-translate-y-5 transition-transform flex flex-col text-white">
            <h3 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-white mb-2">Plan Empresa</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Para equipos y negocios que buscan máxima visibilidad.</p>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-white">{isAnnual ? '10.83€' : '12.99€'}</span>
              <span className="text-slate-400 font-medium">/mes</span>
            </div>
            <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? '129.99€ al año (pago anual). Ahorra 2 meses.' : 'Facturado mensualmente. Cancela cuando quieras.'}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Panel de control para gestionar tu negocio',
                'Perfil Corporativo para el negocio',
                'Incluye 5 perfiles Profesionales',
                'Todo lo del Plan Profesional',
                'Soporte prioritario 24/7',
                '2,49 €/mes por perfil adicional'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                  <Check className="w-5 h-5 text-[#FF6600] shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                trackGAEvent('Clic_planEmpresa', 'Planes');
                setIsContactModalOpen(true);
              }}

              className="block w-full text-center bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-2xl flex items-center justify-center font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20"
            >
              Contactar
            </button>
          </motion.div>
        </motion.div>
      </section>

      <div className="bg-[#FFF9F0] py-24">

        <motion.section
          className="px-6 max-w-4xl mx-auto mb-24"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] text-center mb-10 tracking-tight">Compara los planes</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-slate-100 bg-slate-50/50">
              <div></div>
              <div className="text-center font-bold text-[#111827]">Profesional</div>
              <div className="text-center font-bold text-[#111827]">Empresa</div>
            </div>
            {[
              { name: 'Perfil profesional', p: true, e: true },
              { name: 'Chat con clientes habilitado', p: true, e: true },
              { name: 'Recomendaciones de clientes', p: true, e: true },
              { name: 'Búsqueda por zona', p: true, e: true },
              { name: 'Estadísticas de perfil', p: true, e: true },
              { name: 'Perfil Corporativo para el negocio', p: false, e: true },
              { name: 'Hasta 5 perfiles profesionales', p: false, e: true },
              { name: 'Estadísticas avanzadas', p: false, e: true },
              { name: 'Soporte prioritario 24/7', p: false, e: true },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
                <div className="text-sm font-medium text-slate-700">{row.name}</div>
                <div className="flex justify-center">
                  {row.p ? <div className="w-5 h-5 bg-[#111827] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.e ? <div className="w-5 h-5 bg-[#111827] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>

      <div className="bg-white py-24">
        <section id="faq" className="px-6 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] text-center mb-12 tracking-tight"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            Preguntas frecuentes
          </motion.h2>

          <motion.div
            className="space-y-4"
            whileInView="visible"
            initial="hidden"
            variants={staggerContainerVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeInUpVariants} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-[#111827] pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-violet-600' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      <Footer />

      {
        isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>

            <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FFF9F0] shrink-0">
                <h3 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">Solicitar Plan Empresa</h3>
                <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white p-2 rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                {formStatus === 'success' ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold text-[#111827] mb-2">¡Solicitud recibida!</h4>
                    <p className="text-slate-500">Hemos recibido tus datos correctamente. Revisa tu email, nos pondremos en contacto contigo en las próximas 24 horas.</p>
                    <button onClick={() => setIsContactModalOpen(false)} className="mt-8 bg-[#111827] text-white px-8 py-3 rounded-full font-[system-ui] font-bold w-full">Cerrar</button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    setFormStatus('submitting');
                    const formData = new FormData(e.currentTarget);

                    try {
                      const res = await fetch('/api/contacto', {
                        method: 'POST',
                        body: JSON.stringify({
                          company: formData.get('company'),
                          name: formData.get('name'),
                          email: formData.get('email'),
                          profiles: formData.get('profiles'),
                          message: formData.get('message'),
                        }),
                      });

                      if (res.ok) setFormStatus('success');
                      else setFormStatus('idle');
                    } catch (err) {
                      setFormStatus('idle');
                      alert('Hubo un error. Por favor, inténtalo de nuevo.');
                    }
                  }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Nombre de la empresa *</label>
                        <input type="text" name="company" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Ej: Clínica Dental Madrid" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Persona de contacto *</label>
                        <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="Tu nombre" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Email corporativo *</label>
                      <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all bg-slate-50 focus:bg-white" placeholder="email@empresa.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Perfiles profesionales que necesitas *</label>
                      <select name="profiles" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all bg-slate-50 focus:bg-white text-slate-700 appearance-none bg-no-repeat pr-10" style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}>
                        <option value="">Selecciona una opción</option>
                        <option value="1-5">Entre 1 y 5 perfiles (Incluido en el plan)</option>
                        <option value="6-10">De 6 a 10 perfiles</option>
                        <option value="11-20">De 11 a 20 perfiles</option>
                        <option value="+20">Más de 20 perfiles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Cuéntanos sobre tu necesidad (Opcional)</label>
                      <textarea name="message" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 outline-none transition-all bg-slate-50 focus:bg-white resize-none" placeholder="¿Qué tipo de servicios ofrecéis? ¿Tenéis alguna necesidad especial?"></textarea>
                    </div>

                    <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-xl flex items-center justify-center font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                      {formStatus === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">Tus datos están seguros.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}