'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Users, CheckCircle2, Smartphone, Apple, Play, Check, Minus, ChevronDown, X } from 'lucide-react';
import { sendGAEvent } from '@next/third-parties/google';

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const faqs = [
    { q: "¿Cómo se validan las reseñas?", a: "La validación la hace tu propio círculo de confianza. Esa es la esencia de dconfy: olvídate de las reseñas falsas o anónimas de internet. Así garantizamos que cada valoración sea 100% auténtica y basada en la experiencia real de la gente en la que ya confías." },
    { q: "¿Puedo cancelar mi suscripción en cualquier momento?", a: "Sí, no hay compromiso de permanencia. Puedes cancelar tu plan cuando quieras y seguirás teniendo acceso hasta que termine tu ciclo de facturación actual." },
    { q: "¿Cómo funciona la facturación?", a: "Recibirás una factura mensual o anual según el plan elegido. Puedes descargar tus facturas desde tu panel de profesional." },
    { q: "¿Es gratis para usuarios que buscan servicios?", a: "Totalmente. La aplicación es 100% gratuita para los usuarios que buscan y contratan profesionales." },
    { q: "¿Cómo me doy de alta como profesional?", a: "Descarga la app, selecciona 'Soy profesional' y completa tu perfil. Puedes empezar con el plan gratuito y actualizar cuando quieras." }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-violet-200">

      {/* 1. NAVBAR (FONDO CREMA) */}
      <header className="bg-[#FFF9F0] sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/dconfy_logo.png"
              alt="Logo dconfy"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#como-funciona" className="hover:text-violet-600 transition-colors">Cómo funciona</Link>
            <Link href="#descargar" className="hover:text-violet-600 transition-colors">Descargar</Link>
            <Link href="#planes" className="hover:text-violet-600 transition-colors">Planes</Link>
            <Link href="#faq" className="hover:text-violet-600 transition-colors">FAQ</Link>
          </div>
          <Link href="#descargar" onClick={() => sendGAEvent({ event: 'Clic_Descargar_Navbar' })} className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
            Descargar app
          </Link>
        </nav>
      </header>

      {/* 2. HERO SECTION (FONDO CREMA CON CORTE REDONDEADO) */}
      <section className="bg-[#FFF9F0] pt-12 pb-24 px-6 rounded-b-[3rem] sm:rounded-b-[5rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.03)] z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black text-[#111827] tracking-tight leading-[1.1] mb-6">
              El boca a boca <span className="bg-gradient-to-r from-violet-600 to-[#FF6600] text-transparent bg-clip-text">de confianza</span> ahora en una app.
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed">
              dconfy recupera la forma natural de encontrar profesionales y servicios: preguntando a la gente que conoces, con la ayuda de la tecnología.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link onClick={() => sendGAEvent({ event: 'Clic_Descargar_Hero' })} href="#descargar" className="border-2 border-transparent bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-[#FF6600]/30 text-center">
                Descargar app
              </Link>
              <Link onClick={() => sendGAEvent({ event: 'Clic_Planes_Hero' })} href="#planes" className="border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-3.5 rounded-full font-bold transition-all text-center">
                Planes para profesionales
              </Link>
            </div>
          </div>

          {/* Hero Images (Avatares ovalados XL) */}
          <div className="flex justify-center items-center gap-4 lg:gap-6 lg:justify-end mt-12 lg:mt-0">

            {/* Izquierda */}
            <div className="w-[100px] h-[190px] sm:w-[140px] sm:h-[260px] lg:w-[180px] lg:h-[340px] rounded-full overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mt-16 lg:mt-24 transition-transform hover:-translate-y-2 shrink-0">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="Profesional" className="w-full h-full object-cover" />
            </div>

            {/* Centro (Más grande y elevada) */}
            <div className="w-[120px] h-[230px] sm:w-[170px] sm:h-[320px] lg:w-[220px] lg:h-[400px] rounded-full overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] z-10 mb-12 lg:mb-20 transition-transform hover:-translate-y-2 shrink-0">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Profesional" className="w-full h-full object-cover" />
            </div>

            {/* Derecha */}
            <div className="w-[100px] h-[190px] sm:w-[140px] sm:h-[260px] lg:w-[180px] lg:h-[340px] rounded-full overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mt-16 lg:mt-24 transition-transform hover:-translate-y-2 shrink-0">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Profesional" className="w-full h-full object-cover" />
            </div>

          </div>

        </div>
      </section>

      {/* 3. CÓMO FUNCIONA (FONDO BLANCO) */}
      <section id="como-funciona" className="bg-white py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black text-[#111827] mb-4 tracking-tight">¿Cómo funciona?</h2>
        <p className="text-slate-500 mb-16 max-w-2xl mx-auto font-medium">Encontrar profesionales y servicios de confianza nunca fue tan fácil.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Busca en tu Red</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Olvídate de las listas de desconocidos. Nuestros resultados priorizan a los profesionales que tus amigos ya han contratado y validado.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Confianza Directa</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Accede al contacto directo de profesionales verificados. Sin intermediarios, sin comisiones ocultas.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Recomienda y Ayuda</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Tu opinión cuenta. Ayuda a tu círculo dejando reseñas honestas y cortas sobre los profesionales que han hecho un buen trabajo.</p>
          </div>
        </div>
      </section>

      {/* 4. DESCARGAR APP (FONDO CREMA) */}
      <section id="descargar" className="bg-[#FFF9F0] py-24 px-6 text-center">

        {/* Logo App */}
        <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto mb-8 overflow-hidden">
          <img
            src="/dconfy_icon.png"
            alt="Logo dconfy"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-4xl md:text-6xl font-black text-[#111827] mb-6 tracking-tight">Descarga la app</h2>

        <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto">
          Disponible en iOS y Android. Empieza a encontrar profesionales recomendados por tu red hoy mismo.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">

          {/* Botón App Store */}
          <button onClick={() => sendGAEvent({ event: 'clic_appstore' })} className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-[14px] flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
            {/* SVG Oficial de Apple */}
            <svg className="w-8 h-8 ml-1" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
              <span className="text-[18px] font-semibold leading-tight tracking-tight">App Store</span>
            </div>
          </button>

          {/* Botón Google Play */}
          <button onClick={() => sendGAEvent({ event: 'clic_googleplay' })} className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-[14px] flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
            {/* SVG Oficial de Google Play */}
            <svg className="w-7 h-7 ml-1" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
            </svg>
            <div className="text-left flex flex-col justify-center">
              <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
              <span className="text-[18px] font-semibold leading-tight tracking-tight">Google Play</span>
            </div>
          </button>

        </div>

        <p className="text-[15px] text-[#8C98A9] mt-6 font-medium">Próximamente disponible</p>

      </section>

      {/* 5. PLANES PARA PROFESIONALES */}
      <section id="planes" className="bg-white py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black text-[#111827] mb-4 tracking-tight">Planes para profesionales</h2>
        <p className="text-slate-500 mb-8 max-w-2xl mx-auto font-medium">Elige el plan que mejor se adapta a tu situación. Sin compromisos.</p>

        {/* Toggle Mensual/Anual */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-[#111827]' : 'text-slate-400'}`}>Mensual</span>
          <button
            onClick={() => {
              setIsAnnual(!isAnnual);
              sendGAEvent({ event: 'clic_toggle_plan' });
            }}

            className="w-14 h-8 bg-[#FF6600] rounded-full p-1 transition-colors relative"
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-[#111827]' : 'text-slate-400'}`}>Anual</span>
          <span className="text-xs font-bold text-[#F97316] bg-[#FF6600]/10 px-3 py-1 rounded-full ml-2">3 meses gratis</span>
        </div>

        {/* Tarjetas de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">

          {/* Plan Profesional */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <h3 className="text-2xl font-black text-[#111827] mb-2">Plan Profesional</h3>
            <p className="text-slate-500 text-sm mb-6 h-10">Ideal para autónomos y freelancers que quieren destacar.</p>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-black text-[#111827]">{isAnnual ? '29.99€' : '2.99€'}</span>
              <span className="text-slate-500 font-medium">/{isAnnual ? 'año' : 'mes'}</span>
            </div>
            <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? 'Equivale a 2.49€ al mes' : 'Ahorra 2 meses con el plan anual'}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Perfil profesional verificado',
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
            <Link href="#descargar" onClick={() => sendGAEvent({ event: 'clic_descargar_planes' })} className="block w-full text-center border-2 border-slate-200 text-slate-700 hover:border-[#FF6600] hover:text-[#FF6600] py-3.5 rounded-2xl font-bold transition-all">
              Descargar app
            </Link>
          </div>

          {/* Plan Empresa (Diseño Prestigio) */}
          <div className="bg-[#171A21] p-8 rounded-[2rem] border border-slate-800 shadow-2xl relative transform md:-translate-y-4 hover:-translate-y-5 transition-transform flex flex-col text-white">
            <h3 className="text-2xl font-black text-white mb-2">Plan Empresa</h3>
            <p className="text-slate-400 text-sm mb-6 h-10">Para equipos y negocios que buscan máxima visibilidad.</p>
            <div className="mb-2 flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">{isAnnual ? '129.99€' : '12.99€'}</span>
              <span className="text-slate-400 font-medium">/{isAnnual ? 'año' : 'mes'}</span>
            </div>
            <p className="text-sm font-bold text-[#FF6600]/80 mb-8 h-5">{isAnnual ? 'Equivale a 10.83€ al mes' : 'Ahorra 2 meses con el plan anual'}</p>

            <ul className="space-y-4 mb-8 flex-1">
              {[
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
                sendGAEvent({ event: 'clic_contactar_plan_empresa' });
                setIsContactModalOpen(true);
              }}

              className="block w-full text-center bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-[#FF6600]/20"
            >
              Contactar
            </button>
          </div>
        </div>
      </section>

      {/* BLOQUE FINAL (FONDO CREMA PARA COMPARADOR Y FAQ) */}
      <div className="bg-[#FFF9F0] py-24">

        {/* 6. TABLA COMPARATIVA */}
        <section className="px-6 max-w-4xl mx-auto mb-24">
          <h3 className="text-3xl font-black text-[#111827] text-center mb-10 tracking-tight">Compara los planes</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-slate-100 bg-slate-50/50">
              <div></div>
              <div className="text-center font-bold text-[#111827]">Profesional</div>
              <div className="text-center font-bold text-[#FF6600]">Empresa</div>
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
                  {row.p ? <Check className="w-5 h-5 text-[#FF6600]" /> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.e ? <Check className="w-5 h-5 text-[#FF6600]" /> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>


      <div className="bg-white py-24">
        {/* 7. FAQ */}
        <section id="faq" className="px-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-[#111827] text-center mb-12 tracking-tight">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 8. FOOTER OSCURO */}
      <footer className="bg-[#171721] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-medium text-slate-300 mb-6">Estamos construyendo la red de servicios más confiable y queremos que seas parte de nuestro lanzamiento.</h2>
            <Link href="#descargar" className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-[#FF6600]/20">
              Descargar app Gratis
            </Link>
          </div>

          <div className="border-t border-slate-800 pt-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <img src="/dconfy_logo_dark.png" alt="Logo dconfy" className="h-8 md:h-10 w-auto object-contain mb-6" />
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Profesionales recomendados por gente de tu confianza.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="#como-funciona" className="text-slate-400 hover:text-white text-sm transition-colors">Cómo funciona</Link>
              <Link href="#planes" className="text-slate-400 hover:text-white text-sm transition-colors">Planes</Link>
              <Link href="#faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/privacidad" className="text-slate-400 hover:text-white text-sm transition-colors">Política de privacidad</Link>
              <Link href="/terminos" className="text-slate-400 hover:text-white text-sm transition-colors">Términos y condiciones</Link>
              <a href="mailto:info@dconfy.io" className="text-slate-400 hover:text-white text-sm transition-colors">Contacto</a>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 pt-8 border-t border-slate-800">
            © {new Date().getFullYear()} dconfy. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODAL DE CONTACTO EMPRESA */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>

          <div className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#FFF9F0] shrink-0">
              <h3 className="text-2xl font-black text-[#111827]">Solicitar Plan Empresa</h3>
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
                  <button onClick={() => setIsContactModalOpen(false)} className="mt-8 bg-[#111827] text-white px-8 py-3 rounded-full font-bold w-full">Cerrar</button>
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

                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[#FF6600]/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    {formStatus === 'submitting' ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4">Tus datos están seguros.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}