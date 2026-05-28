"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
// Importaciones restauradas y añadidas Menu y Mail
import { Search, Users, Heart, CheckCircle2, Smartphone, Apple, Play, Check, Minus, ChevronDown, X, Instagram, MessageCircle, ArrowDown, Bookmark, Menu, Mail, Sparkles, Star, ArrowRight } from 'lucide-react';
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
  "Electricista", "Mecánico", "Salón de Belleza", "Entrenador Personal",
  "Fotógrafo", "Veterinario", "Clínica Estética", "Jardinero",
  "Gestor", "Masajista", "Seguros",
  "Moda", "Boutique", "Restaurant"
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

  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const faqs = [
    { q: "¿Cómo se validan las recomendaciones?", a: "La validación la hace tu propio círculo de confianza. Esa es la esencia de dconfy: olvídate de las reseñas falsas o anónimas de internet. Así garantizamos que cada valoración sea 100% auténtica y basada en la experiencia real de la gente en la que ya confías." },
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

      <div className="min-h-screen flex flex-col bg-[#FFF9F0]">
        <Header />

        <section className="flex-1 flex items-center bg-[#FFF9F0] pt-12 pb-12 lg:pb-24 px-6 overflow-hidden relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative w-full">
            <div className="max-w-xl lg:max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight leading-[1.1] mb-12">
                El boca a boca <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B]">de siempre,</span> ahora en una app
              </h1>

              <p className="text-2xl md:text-3xl text-[#111827] mb-12 font-bold leading-tight tracking-tight">
                {/*Descubre Profesionales y Servicios <span className="text-[#111827] font-black decoration-[#111827] decoration-6 underline-offset-2">de confianza</span>, recomendados por tu gente.*/}
                Recomienda a tus profesionales y servicios de confianza y descubre los de tu gente.
              </p>

              {/*<div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-12 pl-2">
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
            </div>*/}

              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center sm:flex-row sm:justify-center lg:justify-start gap-4 w-full">
                  <Link onClick={() => trackGAEvent('Clic_Descargar_hero', 'Descargar')} href="#descargar" className="w-full max-w-xs sm:w-auto border-2 border-transparent bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
                    Descargar app
                  </Link>
                  <Link onClick={() => trackGAEvent('Clic_Planes_hero', 'Planes')} href="#planes" className="w-full max-w-xs sm:w-auto border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-3.5 rounded-full font-[system-ui] font-bold transition-all text-center">
                    ¿Ofreces algún Servicio?
                  </Link>
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

                <div className="mt-8 flex justify-center w-full -translate-x-12 lg:-translate-x-24">
                  <div className="bg-white border border-slate-200/60 shadow-md shadow-violet-100/50 px-6 py-3 rounded-full flex items-center gap-2.5 max-w-full">
                    <span className="text-slate-500 font-medium text-sm lg:text-base shrink-0">Recomendaciones de</span>
                    <div className="flex items-center overflow-hidden">
                      <span className="font-bold text-violet-600 text-sm lg:text-base whitespace-nowrap">{displayedText}</span>
                      <span className="w-[2px] h-4 lg:h-5 bg-violet-500 ml-0.5 animate-[pulse_0.8s_infinite]"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Nuevo Banner: Por qué nace dconfy */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes moveGradient {
            0% { background-position: 0% center; }
            100% { background-position: -200% center; }
          }
          .animate-gradient-text {
            background-image: linear-gradient(to right, #F05A28, #BE1E8D, #F05A28, #BE1E8D, #F05A28);
            background-size: 200% auto;
            animation: moveGradient 4s linear infinite;
          }
          .animate-dark-purple-gradient-text {
            background-image: linear-gradient(to right, #2E1065, #4C1D95, #1E1B4B, #4C1D95, #2E1065);
            background-size: 200% auto;
            animation: moveGradient 4s linear infinite;
          }
          @keyframes morphBlob1 {
            0% {
              border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
            33% {
              border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%;
              transform: translate(40px, -60px) rotate(120deg) scale(1.15);
            }
            66% {
              border-radius: 50% 50% 30% 70% / 40% 60% 40% 60%;
              transform: translate(-40px, 40px) rotate(240deg) scale(0.95);
            }
            100% {
              border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
              transform: translate(0px, 0px) rotate(360deg) scale(1);
            }
          }
          @keyframes morphBlob2 {
            0% {
              border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%;
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
            33% {
              border-radius: 30% 70% 70% 30% / 50% 30% 70% 50%;
              transform: translate(-50px, 50px) rotate(-120deg) scale(1.1);
            }
            66% {
              border-radius: 70% 30% 40% 60% / 60% 50% 50% 40%;
              transform: translate(50px, -40px) rotate(-240deg) scale(0.95);
            }
            100% {
              border-radius: 50% 50% 30% 70% / 50% 60% 40% 50%;
              transform: translate(0px, 0px) rotate(-360deg) scale(1);
            }
          }
          @keyframes morphBlob3 {
            0% {
              border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
            50% {
              border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%;
              transform: translate(60px, 60px) rotate(180deg) scale(1.2);
            }
            100% {
              border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%;
              transform: translate(0px, 0px) rotate(360deg) scale(1);
            }
          }
          .animate-morph-1 {
            animation: morphBlob1 18s infinite ease-in-out;
          }
          .animate-morph-2 {
            animation: morphBlob2 22s infinite ease-in-out;
          }
          .animate-morph-3 {
            animation: morphBlob3 20s infinite ease-in-out;
          }
          @keyframes waveMotion1 {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(-10px) scaleY(1.03); }
          }
          @keyframes waveMotion2 {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(12px) scaleY(0.97); }
          }
          @keyframes waveMotion3 {
            0%, 100% { transform: translateY(0px) scaleY(1); }
            50% { transform: translateY(-8px) scaleY(1.02); }
          }
          .animate-wave-1 {
            animation: waveMotion1 18s infinite ease-in-out;
            transform-origin: center bottom;
          }
          .animate-wave-2 {
            animation: waveMotion2 22s infinite ease-in-out;
            transform-origin: center bottom;
          }
          .animate-wave-3 {
            animation: waveMotion3 26s infinite ease-in-out;
            transform-origin: center bottom;
          }
        `}} />
      <section className="py-20 px-6 max-w-6xl mx-auto rounded-[3rem] my-12 relative overflow-hidden">
        <div className="relative z-10 text-center max-w-4xl mx-auto pt-8 pb-16">

          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="mb-10 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF9F0] border border-[#FF6600] text-[#FF6600] text-xs font-bold tracking-wider uppercase shadow-sm">

              Por qué nace dconfy
            </span>
          </motion.div>

          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="mb-32 md:mb-48"
          >
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] leading-tight" >
              Cada vez que necesitamos un servicio o profesional de confianza, acabamos preguntando a amigos, familia o conocidos.
            </h2>
          </motion.div>

          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="my-48 md:my-64 max-w-3xl mx-auto bg-white py-16 px-10 md:py-24 md:px-16 rounded-[2.5rem]"
          >
            <h2 className="text-4xl md:text-5xl font-black text-violet-800 leading-tight [-webkit-text-stroke:0]">
              Recomiéndame un fisio, un restaurante, un seguro, un masajista...
            </h2>
          </motion.div>

          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="mb-0"
          >
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] leading-tight">
              Porque confiamos más en nuestra gente que en cualquier anuncio o reseña.
            </h2>
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-[#FFF9F0] py-24 md:py-48 px-6 relative z-10 mb-24 overflow-hidden">
        {/* Soft organic blobs with violet and orange tones */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 opacity-60">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/15 blur-[100px] animate-morph-1"></div>
          <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF6600]/10 blur-[120px] animate-morph-2"></div>
          <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/10 blur-[80px] animate-morph-3"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto mb-8 overflow-hidden">
              <img
                src="/dconfy_icon.png"
                alt="Logo dconfy"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] leading-tight py-2">
              dconfy te ayuda a descubrir y guardar esas recomendaciones <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B]">de confianza</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Degradado radial restaurado */}
      <section
        className="py-24 px-6 overflow-hidden relative"

      >
        <div className="max-w-4xl mx-auto z-10 relative">
          <motion.div
            className="text-center mb-16 lg:mb-24"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >

            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] leading-tight">
              Ve lo que tu gente recomienda y cómo está conectado contigo
            </h2>

          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-10 max-w-[1000px] mx-auto px-4 lg:px-0"
            whileInView="visible"
            initial="hidden"
            variants={staggerContainerVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInUpVariants} className="relative w-full max-w-[420px] justify-self-center md:justify-self-end flex flex-col items-center sm:items-stretch">
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600] overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600] via-[#FF6600] to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-none mb-1.5 tracking-tight">PlusHome</h3>
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
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Laura Gomez" className="w-full h-full object-cover" />
                  </div>

                </div>
                <div className="pt-1 flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#64748b] font-medium text-sm lg:text-base">Recomendado por <strong className="text-slate-900 font-black">Laura</strong></span>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#3B82F6] text-[11px] tracking-wide font-bold border border-[#BFDBFE]">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                      contacto de Susana
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
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600] overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600] via-[#FF6600] to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-none mb-1.5 tracking-tight">Bella Donna</h3>
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
              <div className="bg-white rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative border border-[#FF6600] overflow-hidden w-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#FF6600] via-[#FF6600] to-transparent"></div>

                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1 pr-3">
                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-none mb-1.5 tracking-tight">Elena Gómez</h3>
                    <p className="text-violet-600 font-bold tracking-widest uppercase text-[11px] lg:text-[12px] mb-2.5">FISIOTERAPIA</p>
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

      <section className="bg-[#FFF9F0] py-24 px-6 max-w-7xl mx-auto rounded-[3rem] my-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto lg:mx-0 mb-8 overflow-hidden">
              <img
                src="/dconfy_icon.png"
                alt="Logo dconfy"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] tracking-tight leading-tight mb-6 text-center lg:text-left">Una agenda<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B] [-webkit-text-stroke:1px]">de confianza</span> <br />siempre a mano</h2>

            <ul className="space-y-4 pt-8">
              <li className="flex items-start gap-5 bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_10px_rgba(255,102,0,0.02)] border border-[#FF6601]/15 hover:border-[#FF6601]/40 hover:shadow-[0_15px_35px_rgba(255,102,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out cursor-default transform-gpu">
                <div className="w-12 h-12 bg-[#FF6601]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-6 h-6 text-[#FF6601] fill-[#FF6601]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl md:text-xl font-bold text-slate-900 leading-tight">
                    Lo que tú recomiendas
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                    En tu perfil, para ti y los tuyos.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-5 bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_10px_rgba(255,102,0,0.02)] border border-[#FF6601]/15 hover:border-[#FF6601]/40 hover:shadow-[0_15px_35px_rgba(255,102,0,0.08)] hover:-translate-y-1 transition-all duration-300 ease-out cursor-default transform-gpu">
                <div className="w-12 h-12 bg-[#FF6601]/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-6 h-6 text-[#FF6601] fill-[#FF6601]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl md:text-xl font-bold text-slate-900 leading-tight">
                    Lo que recomienda tu gente
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed">
                    Guardado para cuando lo necesites.
                  </p>
                </div>
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
            <div className="bg-white rounded-[2.5rem] border-[8px] border-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden h-[750px] flex flex-col transform hover:-translate-y-2 transition-transform duration-500">

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

      <section id="como-funciona" className="bg-white pt-16 pb-24 lg:py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-6 relative flex flex-col items-center"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] leading-tight">
              ¿Cómo funciona dconfy?</h2>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mb-16"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 1 }}
        >
          <ArrowDown className="w-10 h-10 text-[#FF6600] animate-bounce" />
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
              <div className="relative w-24 h-24 bg-white border border-slate-100/80 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-[0_12px_30px_rgba(79,70,229,0.08)]">
                <div className="w-16 h-16 bg-[#FFF5EB] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#FF6600]" strokeWidth={2.2} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-[#0F172A] text-white text-base font-bold rounded-full flex items-center justify-center shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Recomienda y Ayuda</h3>
              <p className="text-lg text-slate-700 leading-relaxed">Tu opinión cuenta. Recomienda a tu fontanero, osteópata, gestor o cualquier profesional que te haya gustado.</p>
            </div>
            <div className="order-2 md:order-2 max-w-[320px] mx-auto mix-blend-multiply hover:-translate-y-2 transition-transform duration-500">
              <img src="/recomendaciones.png" alt="Recomienda y Ayuda - Forma Pebble Comic" className="w-full h-auto object-contain" />
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
              <img src="/profesionales-servicios.png" alt="Busca en tu red - Forma Orgánica Comic" className="w-full h-auto object-contain" />
            </div>
            <div className="order-1 md:order-2 max-w-sm mx-auto text-center md:text-left">
              <div className="relative w-24 h-24 bg-white border border-slate-100/80 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-[0_12px_30px_rgba(79,70,229,0.08)]">
                <div className="w-16 h-16 bg-[#F5F3FF] rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-violet-600" strokeWidth={2.2} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-[#0F172A] text-white text-base font-bold rounded-full flex items-center justify-center shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Busca en tu Red</h3>
              <p className="text-lg text-slate-700 leading-relaxed">Nuestros resultados priorizan a los profesionales y servicios que tus contactos o su círculo han recomendado.</p>
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
              <div className="relative w-24 h-24 bg-white border border-slate-100/80 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-[0_12px_30px_rgba(79,70,229,0.08)]">
                <div className="w-16 h-16 bg-[#FFF5EB] rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-[#FF6600]" strokeWidth={2.2} />
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-8 h-8 bg-[#0F172A] text-white text-base font-bold rounded-full flex items-center justify-center shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-4">Elige con tranquilidad</h3>
              <p className="text-lg text-slate-700 leading-relaxed">Accede al chat directo de profesionales verificados y pregunta lo que necesites saber.</p>
            </div>
            <div className="order-2 md:order-2 max-w-[320px] mx-auto hover:-translate-y-2 transition-transform duration-500">
              <img src="/habla-confianza.png" alt="Confianza Directa - Forma Corazón Comic" className="w-full h-auto object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Historias reales de dconfy */}
      <section className="hidden bg-white pb-16 lg:pb-24 px-6 max-w-[1000px] mx-auto relative z-20">
        <motion.div
          className="text-center mb-8"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-slate-800 ">Historias reales de dconfy</h3>
        </motion.div>

        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <motion.div
            className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-slate-100 shadow-sm"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="flex items-center gap-3 shrink-0 sm:w-44">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Lucía" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm leading-tight">Laura</p>
                <p className="text-[#FF6600] text-[11px] font-bold uppercase tracking-wider mt-0.5">Madrid</p>
              </div>
            </div>
            <p className="text-slate-600 italic sm:text-lg font-medium leading-relaxed flex-1">
              "Necesitaba una reforma integral. En vez de preguntar en cuatro grupos de WhatsApp, abrió dconfy y encontró PlusHome, recomendado por 14 personas de su red."
            </p>
          </motion.div>

          <motion.div
            className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-slate-100 shadow-sm"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <div className="flex items-center gap-3 shrink-0 sm:w-44">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-slate-100">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Marta" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm leading-tight">Edgar</p>
                <p className="text-[#FF6600] text-[11px] font-bold uppercase tracking-wider mt-0.5">Barcelona</p>
              </div>
            </div>
            <p className="text-slate-600 italic sm:text-lg font-medium leading-relaxed flex-1">
              "Buscaba un fisio deportivo de confianza. dconfy le mostró a Elena Gómez, recomendada por 17 personas y 8 amigos."
            </p>
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
          <h2 className="text-4xl md:text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] leading-tight">
            ¿Por qué dconfy es diferente?</h2>
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

        <h2 className="text-4xl md:text-6xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-6 tracking-tight">
          Descarga la app</h2>

        <p className="text-xl text-slate-500 font-medium mb-12 max-w-xl mx-auto">
          Recomienda a tus profesionales y servicios de confianza y descubre los de tu gente.
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

      <section id="planes" className="bg-gradient-to-b from-violet-950 via-[#1b0d3a] to-violet-900 py-28 px-6 text-center relative overflow-hidden">
        {/* Fondos decorativos mejorados con orbes brillantes y rejilla */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[130px] opacity-25"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-700 rounded-full blur-[130px] opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-600 rounded-full blur-[120px] opacity-15"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 min-h-[400px] flex items-center justify-center">

          {/* Tarjeta Flotante Izquierda - Solo Desktop */}
          <div className="hidden lg:flex flex-col items-start gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 w-[280px] text-left rotate-[-3deg] hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all duration-500 transform-gpu pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" alt="Laura Gómez" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base leading-tight">Elena Gómez</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#FF6600] font-bold mt-0.5">
                  <Heart className="w-3.5 h-3.5 fill-current text-[#FF6600]" />
                  <span>dconfy de Edgar y 23 más</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <span className="text-[10px] bg-violet-600/30 text-violet-200 border border-violet-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Fisioterapia</span>
              <span className="text-[10px] bg-emerald-500/25 text-emerald-200 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Verificado</span>
            </div>
            <div className="border-t border-white/10 w-full pt-3 mt-1">
              <p className="text-xs text-slate-300 italic font-medium">"Elena es una fisio increíble. En solo dos sesiones alivió mi dolor de espalda."</p>
            </div>
          </div>

          {/* Bloque Central de CTA */}
          <motion.div
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-xs tracking-wider uppercase mb-8 border border-white/15 shadow-inner">
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>Plan Profesional</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black [-webkit-text-stroke:1px_currentColor] text-white mb-6 leading-tight tracking-tight">
              ¿Ofreces algún servicio?
            </h2>

            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
              Descubre el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B] [-webkit-text-stroke:0px]">Plan Profesional</span>
            </h3>

            <p className="text-base md:text-lg text-slate-300 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              Ideal para cualquier persona o negocio que ofrezca servicios y quiera destacar.
            </p>

            <div className="flex justify-center">
              <Link href="/profesionales" onClick={() => trackGAEvent('Clic_SaberMas_planes', 'Planes')} className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-[#FF6600] to-[#E65C00] hover:from-[#FF751A] hover:to-[#F56E0A] text-white px-9 py-4 rounded-full font-[system-ui] font-black tracking-wide transition-all shadow-lg shadow-[#FF6600]/30 hover:shadow-[#FF6600]/50 hover:scale-105 active:scale-[0.98] duration-300 text-center">
                <span>Saber más</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Tarjeta Flotante Derecha - Solo Desktop */}
          <div className="hidden lg:flex flex-col items-start gap-3.5 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl absolute right-4 xl:right-12 top-1/2 -translate-y-1/2 w-[280px] text-left rotate-[3deg] hover:rotate-0 hover:scale-105 hover:bg-white/10 transition-all duration-500 transform-gpu pointer-events-auto">
            <h4 className="font-bold text-white text-base leading-tight">Ventajas Perfil Profesional</h4>
            <ul className="space-y-2.5 w-full">
              {[
                'Sin intermediarios ni comisiones',
                'Perfil público para compartir',
                'Multiplica tus recomendaciones',
                'Chat directo habilitado'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                  <span className="w-4 h-4 rounded-full bg-[#FF6600]/20 flex items-center justify-center text-[#FF6600] shrink-0 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            whileInView="visible"
            initial="hidden"
            variants={fadeInUpVariants}
            viewport={{ once: true, amount: 0.5 }}
          >
            <span className="text-sm font-bold text-[#111827] uppercase bg-[#FF6600] px-4 py-2.5 rounded-full shadow-md max-sm:mb-2 tracking-wide">3 meses gratis por lanzamiento</span>

            <div className="relative flex items-center bg-violet-950/40 p-1.5 rounded-full w-[260px] h-[52px] border border-violet-800/50 shadow-inner">
              <div
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-violet-600 rounded-full shadow-md transition-transform duration-300 left-1.5 ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
              ></div>
              <button
                onClick={() => {
                  if (isAnnual) {
                    setIsAnnual(false);
                    trackGAEvent('Clic_Planes_toggle', 'Planes');
                  }
                }}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${!isAnnual ? 'text-white' : 'text-violet-300 hover:text-white'}`}
              >
                Mensual
              </button>
              <button
                onClick={() => {
                  if (!isAnnual) {
                    setIsAnnual(true);
                    trackGAEvent('Clic_Planes_toggle', 'Planes');
                  }
                }}
                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${isAnnual ? 'text-white' : 'text-violet-300 hover:text-white'}`}
              >
                Anual
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
              <p className="text-slate-500 text-sm mb-6 h-10">Ideal para cualquier persona o negocio que ofrezca servicios y quiera destacar.</p>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827]">{isAnnual ? '29,99€' : '2.99€'}</span>
                <span className="text-slate-500 font-medium">/{isAnnual ? 'año' : 'mes'}</span>
              </div>
              <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? '2,49€ al mes (ahorras 2 meses)' : 'Facturado mensualmente. Cancela cuando quieras.'}</p>

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
              <Link href="/profesionales" onClick={() => trackGAEvent('Clic_planPro', 'Planes')} className="block w-full text-center border-2 border-slate-200 text-slate-700 hover:border-[#FF6600] hover:text-[#FF6600] py-3.5 rounded-2xl flex items-center justify-center font-[system-ui] font-bold transition-all">
                Apúntate en la lista VIP
              </Link>
            </motion.div>

            <motion.div variants={fadeInUpVariants} className="bg-slate-950 p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative transform md:-translate-y-4 hover:-translate-y-5 transition-transform flex flex-col text-white">
              <h3 className="text-2xl font-black [-webkit-text-stroke:1px_currentColor] text-white mb-2">Plan Empresa</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">Para equipos que gestionan varios profesionales y quieren generar más clientes.</p>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-5xl font-black [-webkit-text-stroke:1px_currentColor] text-white">{isAnnual ? '129.99€' : '12.99€'}</span>
                <span className="text-slate-400 font-medium">/{isAnnual ? 'año' : 'mes'}</span>
              </div>
              <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? '10,83 € al mes (ahorras 2 meses)' : 'Facturado mensualmente. Cancela cuando quieras.'}</p>

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
        </div>
      </section> */}

      {/* <div className="bg-violet-200 py-24">

        <motion.section
          className="px-6 max-w-4xl mx-auto mb-24"
          whileInView="visible"
          initial="hidden"
          variants={fadeInUpVariants}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-3xl font-black [-webkit-text-stroke:1px_currentColor] text-violet-950 text-center mb-10 tracking-tight">Compara los planes</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-slate-100 bg-violet-50/50">
              <div></div>
              <div className="text-center font-bold text-violet-950">Profesional</div>
              <div className="text-center font-bold text-violet-950">Empresa</div>
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
                  {row.p ? <div className="w-5 h-5 bg-[#FF6600] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.e ? <div className="w-5 h-5 bg-[#FF6600] rounded-full flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /></div> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div> */}

      {/* <div className="bg-white py-24">
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
      </div> */}

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