import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-[#FFF9F0] selection:bg-violet-200 flex flex-col">

            <Header />

            <main className="flex-grow py-12 px-6 mt-16 md:mt-20">
                <div className="max-w-4xl mx-auto">

                    <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#111827] font-medium transition-colors mb-8">
                        <ArrowLeft className="w-5 h-5" />
                        Volver a la web
                    </Link>

                    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 lg:p-16">
                        <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 tracking-tight">Soporte y Contacto</h1>
                        <p className="text-slate-500 text-lg mb-12 leading-relaxed">
                            ¿Necesitas ayuda con la app, tienes problemas con tu cuenta profesional o quieres reportar un error? Estamos aquí para ayudarte.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* CAJA DE EMAIL */}
                            <div className="bg-violet-50 rounded-3xl p-8 border border-violet-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-violet-600 rotate-3">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Envíanos un correo</h3>
                                <p className="text-slate-600 font-medium mb-6">
                                    Te responderemos lo antes posible, normalmente en menos de 24 horas laborables.
                                </p>
                                <a
                                    href="mailto:info@dconfy.io"
                                    className="inline-flex items-center justify-center bg-violet-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors w-full"
                                >
                                    info@dconfy.io
                                </a>
                            </div>

                            {/* CAJA DE PREGUNTAS (Opcional, pero da buen aspecto de soporte) */}
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-slate-700 -rotate-3">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">¿Problemas con la App?</h3>
                                <p className="text-slate-600 font-medium mb-6">
                                    Si la app se cierra inesperadamente, asegúrate de tenerla actualizada a la última versión en la App Store.
                                </p>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-auto">
                                    Equipo Técnico
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />

        </div>
    );
}