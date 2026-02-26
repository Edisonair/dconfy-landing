import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-[#FFF9F0] selection:bg-violet-200 py-12 px-6">
            <div className="max-w-4xl mx-auto">

                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#111827] font-medium transition-colors mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la web
                </Link>

                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 lg:p-16">
                    <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-4 tracking-tight">Política de Privacidad</h1>
                    <p className="text-slate-400 font-medium mb-12">Última actualización: Febrero de 2026</p>

                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <p>En <strong>dconfy</strong> valoramos y protegemos tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tus datos cuando usas nuestra aplicación y sitio web (dconfy.io).</p>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">1. Responsable de los datos</h2>
                            <p>El responsable del tratamiento de tus datos es el equipo de dconfy. Puedes contactarnos en cualquier momento escribiendo a <strong>info@dconfy.io</strong>.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">2. ¿Qué datos recopilamos?</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Datos de cuenta (Usuarios):</strong> Nombre, correo electrónico y contraseña (encriptada).</li>
                                <li><strong>Datos de perfil (Profesionales):</strong> Además de lo anterior, recabamos el nombre comercial, especialidad, dirección/zona de trabajo, teléfono y fotografías.</li>
                                <li><strong>Datos de uso:</strong> Las reseñas que publicas, los profesionales que guardas o buscas.</li>
                                <li><strong>Datos de pago:</strong> Si eres profesional con un plan de pago, la información de facturación es gestionada de forma segura por nuestra pasarela de pagos (Stripe). Nosotros no almacenamos los datos de tu tarjeta de crédito.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">3. ¿Para qué usamos tus datos?</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Para crear y gestionar tu cuenta en dconfy.</li>
                                <li>Para mostrar tu perfil a otros usuarios (si eres profesional).</li>
                                <li>Para enviarte correos de verificación, restablecimiento de contraseña y notificaciones importantes del servicio.</li>
                                <li>Para procesar los pagos de las suscripciones.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">4. ¿Con quién compartimos tus datos?</h2>
                            <p className="mb-2">No vendemos tus datos a terceros. Solo los compartimos con los proveedores de tecnología estrictamente necesarios para que la app funcione:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Supabase:</strong> Alojamiento de bases de datos y autenticación segura.</li>
                                <li><strong>Resend:</strong> Envío de correos transaccionales (bienvenidas, contraseñas).</li>
                                <li><strong>Stripe:</strong> Procesamiento seguro de pagos.</li>
                                <li><strong>Vercel:</strong> Alojamiento web y analíticas de rendimiento.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-[#111827] mb-3">5. Tus Derechos</h2>
                            <p>Tienes derecho a acceder, rectificar, limitar, exportar o eliminar tus datos en cualquier momento. Para ejercer tus derechos o darte de baja definitivamente, solo tienes que escribirnos a info@dconfy.io desde el correo asociado a tu cuenta o usar la opción "Eliminar cuenta" dentro de la app.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}