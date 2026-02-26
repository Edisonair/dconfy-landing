'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Users, CheckCircle2, Smartphone, Apple, Play, Check, Minus, ChevronDown } from 'lucide-react';

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "¿Cómo se validan las reseñas?", a: "Solo permitimos reseñas de usuarios que han contratado realmente el servicio a través de la plataforma o mediante invitaciones directas de clientes verificados." },
    { q: "¿Puedo cancelar mi suscripción en cualquier momento?", a: "Sí, no hay compromiso de permanencia. Puedes cancelar tu plan cuando quieras y seguirás teniendo acceso hasta que termine tu ciclo de facturación actual." },
    { q: "¿Cómo funciona la facturación?", a: "Puedes elegir facturación mensual o anual. El cobro se realiza automáticamente en tu tarjeta al inicio de cada ciclo." },
    { q: "¿Es gratis para usuarios que buscan servicios?", a: "Totalmente. La aplicación es 100% gratuita para los usuarios que buscan y contratan profesionales." },
    { q: "¿Cómo me doy de alta como profesional?", a: "Solo tienes que elegir un plan, rellenar tus datos fiscales y tu perfil pasará a revisión. En menos de 24h estarás visible." }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-violet-200">

      {/* 1. NAVBAR (FONDO CREMA) */}
      <header className="bg-[#FFF9F0] sticky top-0 z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="font-black text-2xl text-violet-700 tracking-tight">dconfy</div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#como-funciona" className="hover:text-violet-600 transition-colors">Cómo funciona</Link>
            <Link href="#descargar" className="hover:text-violet-600 transition-colors">Descargar</Link>
            <Link href="#planes" className="hover:text-violet-600 transition-colors">Planes</Link>
            <Link href="#faq" className="hover:text-violet-600 transition-colors">FAQ</Link>
          </div>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md shadow-violet-200">
            Descargar app
          </button>
        </nav>
      </header>

      {/* 2. HERO SECTION (FONDO CREMA CON CORTE REDONDEADO) */}
      <section className="bg-[#FFF9F0] pt-12 pb-24 px-6 rounded-b-[3rem] sm:rounded-b-[5rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.03)] z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Tu app de confianza <br /> para encontrar <br /> <span className="text-violet-600">profesionales.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed">
              dconfy te conecta con los mejores servicios a través de las recomendaciones de tu red. Se acabaron las dudas, hola a la confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-violet-200 text-center">
                Descargar app
              </button>
              <Link href="/profesionales" className="border-2 border-violet-600 text-violet-700 hover:bg-violet-50 px-8 py-3.5 rounded-full font-bold transition-all text-center">
                Planes para profesionales
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-4 lg:justify-end">
            <div className="w-32 h-64 bg-violet-200 rounded-full mt-12 overflow-hidden border-4 border-white shadow-xl">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" alt="Prof" className="w-full h-full object-cover" />
            </div>
            <div className="w-36 h-72 bg-orange-200 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" alt="Prof" className="w-full h-full object-cover" />
            </div>
            <div className="w-32 h-64 bg-cyan-200 rounded-full mt-8 overflow-hidden border-4 border-white shadow-xl">
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" alt="Prof" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CÓMO FUNCIONA (FONDO BLANCO) */}
      <section id="como-funciona" className="bg-white py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Cómo funciona</h2>
        <p className="text-slate-500 mb-16 max-w-2xl mx-auto font-medium">Encontrar profesionales de confianza nunca fue tan fácil. Sigue estos tres simples pasos.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Busca el servicio que necesitas</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Desde un fontanero hasta un diseñador gráfico. Encuentra lo que buscas en segundos.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ver recomendados por tu red</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Te mostramos los profesionales que tus amigos y contactos ya han probado y valorado positivamente.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-5 h-5 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Contacta con total confianza</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Elige al profesional con las mejores referencias de tu círculo y contrata sus servicios con seguridad.</p>
          </div>
        </div>
      </section>

      {/* 4. DESCARGAR APP (FONDO CREMA) */}
      <section id="descargar" className="bg-[#FFF9F0] py-24 px-6 text-center">
        <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Smartphone className="w-8 h-8 text-violet-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Descarga la app</h2>
        <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto">
          Disponible en iOS y Android. Empieza a encontrar profesionales recomendados por tu red hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <button className="bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors min-w-[220px] justify-center">
            <Apple className="w-6 h-6" fill="currentColor" />
            <div className="text-left">
              <div className="text-[10px] text-slate-300 font-medium">Disponible en</div>
              <div className="text-sm">App Store</div>
            </div>
          </button>
          <button className="bg-slate-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors min-w-[220px] justify-center">
            <Play className="w-5 h-5" fill="currentColor" />
            <div className="text-left">
              <div className="text-[10px] text-slate-300 font-medium">Disponible en</div>
              <div className="text-sm">Google Play</div>
            </div>
          </button>
        </div>
        <p className="text-sm text-slate-400 mt-6 font-medium">Próximamente disponible</p>
      </section>

      {/* 5. PLANES PARA PROFESIONALES (FONDO BLANCO) */}
      <section id="planes" className="bg-white py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Planes para profesionales</h2>
        <p className="text-slate-500 mb-8 max-w-2xl mx-auto font-medium">Elige el plan que mejor se adapta a tu negocio. Cancela cuando quieras.</p>

        {/* Toggle Mensual/Anual */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Mensual</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-violet-600 rounded-full p-1 transition-colors relative"
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Anual</span>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full ml-2">Ahorra hasta 25%</span>
        </div>

        {/* Tarjetas de Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {/* Plan Profesional */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Plan Profesional</h3>
            <p className="text-slate-500 text-sm mb-6">Ideal para autónomos y freelancers que quieren destacar.</p>
            <div className="mb-2">
              <span className="text-5xl font-black text-slate-900">{isAnnual ? '7.49€' : '9.99€'}</span>
              <span className="text-slate-500 font-medium">/mes</span>
            </div>
            <p className="text-sm font-bold text-orange-500 mb-8 h-5">{isAnnual ? 'Facturado 89.88€ anualmente' : 'Ahorra 33% con el plan anual'}</p>

            <ul className="space-y-4 mb-8">
              {['Perfil profesional verificado', 'Recibe recomendaciones de clientes', 'Aparece en búsquedas de tu zona', 'Estadísticas básicas', 'Soporte por email'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 text-violet-600 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="/profesionales" className="block w-full text-center border-2 border-violet-600 text-violet-700 hover:bg-violet-50 py-3.5 rounded-2xl font-bold transition-all">
              Empezar ahora
            </Link>
          </div>

          {/* Plan Empresa */}
          <div className="bg-white p-8 rounded-[2rem] border-2 border-violet-600 shadow-2xl shadow-violet-200 relative transform md:-translate-y-4 hover:shadow-violet-300 transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              Más popular
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Plan Empresa</h3>
            <p className="text-slate-500 text-sm mb-6">Para equipos y negocios que buscan máxima visibilidad.</p>
            <div className="mb-2">
              <span className="text-5xl font-black text-slate-900">{isAnnual ? '22.49€' : '29.99€'}</span>
              <span className="text-slate-500 font-medium">/mes</span>
            </div>
            <p className="text-sm font-bold text-orange-500 mb-8 h-5">{isAnnual ? 'Facturado 269.88€ anualmente' : 'Ahorra 25% con el plan anual'}</p>

            <ul className="space-y-4 mb-8">
              {['Todo lo del Plan Profesional', 'Múltiples miembros del equipo', 'Posicionamiento destacado', 'Estadísticas avanzadas', 'Soporte prioritario 24/7', 'Insignia de empresa verificada'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 text-violet-600 shrink-0" /> {feature}
                </li>
              ))}
            </ul>
            <Link href="/profesionales" className="block w-full text-center bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-violet-200">
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* BLOQUE FINAL (FONDO CREMA PARA COMPARADOR Y FAQ) */}
      <div className="bg-[#FFF9F0] py-24">

        {/* 6. TABLA COMPARATIVA */}
        <section className="px-6 max-w-4xl mx-auto mb-32">
          <h3 className="text-3xl font-black text-slate-900 text-center mb-10 tracking-tight">Compara los planes</h3>
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-3 p-6 border-b border-slate-100 bg-slate-50/50">
              <div></div>
              <div className="text-center font-bold text-violet-600">Profesional</div>
              <div className="text-center font-bold text-violet-600">Empresa</div>
            </div>
            {[
              { name: 'Perfil profesional', p: true, e: true },
              { name: 'Recomendaciones de clientes', p: true, e: true },
              { name: 'Búsqueda por zona', p: true, e: true },
              { name: 'Estadísticas básicas', p: true, e: true },
              { name: 'Miembros del equipo', p: false, e: true },
              { name: 'Posicionamiento destacado', p: false, e: true },
              { name: 'Estadísticas avanzadas', p: false, e: true },
              { name: 'Soporte prioritario 24/7', p: false, e: true },
              { name: 'Insignia verificada', p: false, e: true },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 border-b border-slate-50 items-center hover:bg-slate-50 transition-colors">
                <div className="text-sm font-medium text-slate-700">{row.name}</div>
                <div className="flex justify-center">
                  {row.p ? <Check className="w-5 h-5 text-violet-600" /> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
                <div className="flex justify-center">
                  {row.e ? <Check className="w-5 h-5 text-violet-600" /> : <Minus className="w-5 h-5 text-slate-300" />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FAQ */}
        <section id="faq" className="px-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12 tracking-tight">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
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
            <h2 className="text-2xl font-medium text-slate-300 mb-6">Únete a miles de personas que ya confían en las recomendaciones de su red.</h2>
            <button className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-violet-900/50">
              Descargar app gratis
            </button>
          </div>

          <div className="border-t border-slate-800 pt-16 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="font-black text-3xl mb-4 tracking-tight">dconfy</div>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Profesionales recomendados por gente de tu confianza.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="#como-funciona" className="text-slate-400 hover:text-white text-sm transition-colors">Cómo funciona</Link>
              <Link href="#planes" className="text-slate-400 hover:text-white text-sm transition-colors">Planes</Link>
              <Link href="#faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Política de privacidad</Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Términos y condiciones</Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contacto</Link>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 pt-8 border-t border-slate-800">
            © {new Date().getFullYear()} dconfy. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}