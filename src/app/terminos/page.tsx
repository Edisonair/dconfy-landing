import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-[#FFF9F0] selection:bg-violet-200 py-12 px-6">
            <div className="max-w-4xl mx-auto">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#111827] font-medium transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la web
                </Link>

                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 lg:p-16">
                    <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 tracking-tight">Términos y Condiciones</h1>
                    <p className="text-slate-400 font-medium mb-12">Última actualización: Febrero de 2026</p>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <p>Al descargar o usar <strong>dconfy</strong>, aceptas estos términos. Léelos con atención antes de empezar a recomendar o buscar profesionales.</p>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">1. Objeto del Servicio</h2>
                            <p>dconfy es una plataforma tecnológica que conecta a usuarios con profesionales de confianza recomendados por su propio círculo. No somos una agencia de empleo, ni un contratista. Somos el directorio que facilita el contacto.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">2. Cuentas de Usuario y Profesional</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Veracidad:</strong> Te comprometes a proporcionar información real. Los perfiles falsos serán eliminados.</li>
                                <li><strong>Seguridad:</strong> Eres responsable de mantener la confidencialidad de tu contraseña.</li>
                                <li><strong>Perfiles de Empresa:</strong> Solo puedes crear un perfil de negocio si eres el titular o un representante autorizado del mismo.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">3. Política de Reseñas y Confianza</h2>
                            <p className="mb-2">La esencia de dconfy es la confianza real. Al dejar una reseña te comprometes a que:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Esté basada en una experiencia real y directa con el profesional.</li>
                                <li>No contenga lenguaje ofensivo, discriminatorio o spam.</li>
                                <li>No sea una auto-reseña encubierta o escrita a cambio de dinero.</li>
                            </ul>
                            <p className="mt-2">dconfy se reserva el derecho de eliminar reseñas que incumplan estas normas y de suspender las cuentas infractoras.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">4. Suscripciones y Pagos (Para Profesionales)</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>La app es gratuita para los usuarios que buscan servicios.</li>
                                <li>Los profesionales pueden optar por planes de pago (Mensual/Anual) para obtener más visibilidad y herramientas.</li>
                                <li><strong>Sin permanencia:</strong> Puedes cancelar tu suscripción en cualquier momento desde tu panel. Disfrutarás de las ventajas del plan hasta que finalice tu ciclo de facturación actual. No se realizan reembolsos parciales por meses no terminados.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">5. Exención de Responsabilidad</h2>
                            <p>dconfy no interviene en la relación laboral o comercial que se establezca entre el usuario y el profesional. No nos hacemos responsables de la calidad del servicio prestado, impagos, disputas o daños derivados de la contratación de los profesionales listados en la app.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">6. Modificaciones</h2>
                            <p>Podemos actualizar estos términos para reflejar cambios en la app. Te avisaremos con antelación si los cambios son significativos.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}