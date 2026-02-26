import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function VerificadoPage() {
    return (
        <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-6 selection:bg-violet-200">

            {/* Tarjeta central */}
            <div className="bg-white max-w-md w-full rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 text-center transform transition-all">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/dconfy_logo.png"
                        alt="Logo dconfy"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                {/* Icono de éxito */}
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                {/* Textos */}
                <h1 className="text-3xl font-black text-[#111827] mb-4 tracking-tight">
                    ¡Email verificado!
                </h1>
                <p className="text-slate-500 text-base leading-relaxed mb-10">
                    Tu cuenta ha sido confirmada correctamente. Ya puedes volver a la app y empezar a recomendar a tus profesionales de confianza sin límites.
                </p>

                {/* Botón de acción */}
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full bg-[#111827] hover:bg-[#222630] text-white py-4 rounded-xl font-bold transition-all shadow-lg"
                    >
                        Volver a la web
                    </Link>
                    <p className="text-xs text-slate-400 font-medium">
                        Ya puedes cerrar esta ventana y abrir la app de dconfy en tu móvil.
                    </p>
                </div>

            </div>
        </div>
    );
}