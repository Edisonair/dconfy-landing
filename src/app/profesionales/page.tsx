'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Sparkles, MapPin, TrendingUp, Coins, Award, Share, Check, Minus, Heart, Briefcase, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { getCategoryColor } from '../../utils/categoryColors';

const ROTATING_SERVICES = [
    { name: 'Reformas y Mantenimiento', iconName: 'Hammer' },
    { name: 'Fisioterapia', iconName: 'Activity' },
    { name: 'Electricista', iconName: 'Zap' },
    { name: 'Peluquería y Estética', iconName: 'Scissors' },
    { name: 'Veterinario', iconName: 'Stethoscope' },
    { name: 'Jardinería', iconName: 'Sprout' },
    { name: 'Limpieza Profesional', iconName: 'Sparkles' },
    { name: 'Clases Particulares', iconName: 'GraduationCap' },
    { name: 'Entrenador Personal', iconName: 'Dumbbell' },
    { name: 'Nutricionista', iconName: 'Leaf' }
];

const hexToRgba = (hex: string, alpha: number): string => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return `rgba(148, 163, 184, ${alpha})`;
    let r, g, b;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Ajusta estas rutas según la estructura real de tu proyecto
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

// Inicializamos Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PROVINCES: Record<string, string> = {
    '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería', '05': 'Ávila',
    '06': 'Badajoz', '07': 'Islas Baleares', '08': 'Barcelona', '09': 'Burgos', '10': 'Cáceres',
    '11': 'Cádiz', '12': 'Castellón', '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña',
    '16': 'Cuenca', '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Guipúzcoa',
    '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lleida',
    '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '29': 'Málaga', '30': 'Murcia',
    '31': 'Navarra', '32': 'Ourense', '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas',
    '36': 'Pontevedra', '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
    '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel', '45': 'Toledo',
    '46': 'Valencia', '47': 'Valladolid', '48': 'Vizcaya', '49': 'Zamora', '50': 'Zaragoza',
    '51': 'Ceuta', '52': 'Melilla'
};

export default function VIPInvitationPage() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        profesion: '',
        customProfesion: '', // 🚀 NUEVO: Para guardar la profesión escrita a mano
        codigoPostal: '',
        ciudad: '',
        provincia: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Estados para los errores de validación
    const [isZipLoading, setIsZipLoading] = useState(false);
    const [zipError, setZipError] = useState('');
    const [emailError, setEmailError] = useState('');

    // Estados para las categorías de la BD
    const [groupedCategories, setGroupedCategories] = useState<Record<string, string[]>>({});
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // 🚀 NUEVO: Estados para controlar el límite de 50 usuarios
    const [isLimitReached, setIsLimitReached] = useState(false);
    const [isLoadingLimit, setIsLoadingLimit] = useState(true);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ROTATING_SERVICES.length);
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const currentService = ROTATING_SERVICES[currentIndex] || ROTATING_SERVICES[0] || { name: '', iconName: '' };
    const serviceColor = getCategoryColor(currentService.name);
    const badgeBgColor = hexToRgba(serviceColor, 0.08);
    const badgeBorderColor = hexToRgba(serviceColor, 0.18);

    // Cargar categorías desde Supabase al iniciar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Buscamos group_name y name tal cual están en tu tabla
                const { data, error } = await supabase
                    .from('categories')
                    .select('group_name, name')
                    .order('group_name')
                    .order('name');

                if (data && !error) {
                    // Agrupamos los datos por group_name
                    const grouped = data.reduce((acc, curr) => {
                        // Si por algún casual la categoría no tiene group_name, la mandamos a 'Otros'
                        const sector = curr.group_name || 'Otros';
                        if (!acc[sector]) acc[sector] = [];
                        acc[sector].push(curr.name);
                        return acc;
                    }, {} as Record<string, string[]>);

                    setGroupedCategories(grouped);
                }
            } catch (error) {
                console.error('Error al cargar categorías:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // 🚀 NUEVO: Comprobar si ya se han registrado 50 profesionales
    useEffect(() => {
        const checkLimit = async () => {
            try {
                const { count, error } = await supabase
                    .from('vip_invitations')
                    .select('*', { count: 'exact', head: true });

                if (!error && count !== null && count >= 50) {
                    setIsLimitReached(true);
                }
            } catch (error) {
                console.error('Error al comprobar el límite:', error);
            } finally {
                setIsLoadingLimit(false);
            }
        };

        checkLimit();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, email: val }));

        if (val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            setEmailError('Formato de email inválido');
        } else {
            setEmailError('');
        }
    };

    const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const zip = e.target.value.replace(/[^0-9]/g, '').slice(0, 5);

        setFormData(prev => ({ ...prev, codigoPostal: zip, ciudad: '', provincia: '' }));
        setZipError('');

        if (zip.length === 5) {
            setIsZipLoading(true);
            try {
                const response = await fetch(`https://api.zippopotam.us/es/${zip}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.places && data.places.length > 0) {
                        const cityName = data.places[0]['place name'];
                        const provinceName = PROVINCES[zip.substring(0, 2)] || data.places[0]['state'] || '';

                        setFormData(prev => ({
                            ...prev,
                            codigoPostal: zip,
                            ciudad: cityName,
                            provincia: provinceName
                        }));
                    }
                } else {
                    setZipError('Código postal no encontrado');
                }
            } catch (error) {
                console.error('Error fetching city:', error);
                setZipError('Error al verificar');
            } finally {
                setIsZipLoading(false);
            }
        }
    };

    const handleZipBlur = () => {
        if (formData.codigoPostal.length > 0 && formData.codigoPostal.length < 5) {
            setZipError('Debe tener 5 dígitos');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (zipError || emailError || isZipLoading || formData.codigoPostal.length !== 5) {
            return;
        }

        setStatus('loading');

        // Determinamos qué profesión guardar
        const finalProfesion = formData.profesion === 'Otra'
            ? formData.customProfesion.trim()
            : formData.profesion;

        const { error } = await supabase
            .from('vip_invitations')
            .insert([
                {
                    name: formData.nombre,
                    email: formData.email,
                    profesion: finalProfesion, // Guardamos la real o la escrita a mano
                    zip_code: formData.codigoPostal,
                    city: formData.ciudad,
                    province: formData.provincia
                }
            ]);

        if (error) {
            console.error('Error al guardar la invitación:', error);

            if (error.code === '23505') {
                setEmailError('Este email ya está en la lista de acceso anticipado.');
                setStatus('idle');
            } else {
                setStatus('error');
            }
        } else {
            setStatus('success');
        }
    };

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    // Validación ajustada para exigir el campo customProfesion si elige "Otra"
    const isFormValid =
        formData.nombre.trim() !== '' &&
        formData.profesion.trim() !== '' &&
        (formData.profesion !== 'Otra' || formData.customProfesion.trim() !== '') &&
        formData.codigoPostal.length === 5 &&
        !zipError &&
        isValidEmail &&
        !emailError;

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-950 via-[#1b0d3a] to-violet-900 relative overflow-hidden">
            {/* Fondos decorativos mejorados con orbes brillantes y rejilla */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-600 rounded-full blur-[130px] opacity-25"></div>
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-700 rounded-full blur-[130px] opacity-20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-600 rounded-full blur-[120px] opacity-15"></div>
            </div>
            <Header />

            <main className="flex-grow pt-32 pb-24 px-6 w-full relative z-10">
                {/* 1. Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-10 relative z-10 flex flex-col items-center">
                    <span className="inline-block bg-violet-600/30 text-white border border-violet-500/30 rounded-full px-6 py-2.5 text-md md:text-base font-bold mb-6">
                        ¿Ofreces algún servicio?
                    </span>
                    <p className="text-xl md:text-2xl text-violet-200/90 font-bold max-w-2xl mx-auto leading-relaxed mb-6">
                        Únete a dconfy y deja que el <span className="underline decoration-4 decoration-white/40 underline-offset-4">boca a boca digital</span> haga crecer tu negocio.
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B] [-webkit-text-stroke:0px]">
                        Plan Profesional
                    </h1>
                </div>

                {/* 2. Sección Plan Profesional */}
                <div className="max-w-5xl mx-auto mb-40 relative z-10">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        {/* Cajas a la izquierda: iconos arriba, texto abajo */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Tarjeta 1 */}
                            <div className="flex flex-col gap-4 items-start bg-[#FF6600]/10 backdrop-blur-sm p-6 rounded-3xl text-left hover:bg-[#FF6600]/15 hover:border-[#FF6600]/30 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-[#FF6600] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF6600]/20">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-100 mb-1.5">Multiplica tus recomendaciones</h3>
                                    <p className="text-neutral-300 text-md leading-relaxed">
                                        Cuando un cliente te recomienda en dconfy, tu perfil se destaca automáticamente ante sus amigos, familiares y contactos de su círculo.
                                    </p>
                                </div>
                            </div>

                            {/* Tarjeta 2 */}
                            <div className="flex flex-col gap-4 items-start bg-[#E83E4C]/10 backdrop-blur-sm p-6 rounded-3xl  text-left hover:bg-[#E83E4C]/15 hover:border-[#E83E4C]/30 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-[#E83E4C] flex items-center justify-center shrink-0 shadow-lg shadow-[#E83E4C]/20">
                                    <Coins className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-100 mb-1.5">Sin comisiones ni intermediarios</h3>
                                    <p className="text-neutral-300 text-md leading-relaxed">
                                        Tus clientes son tuyos. Habla directamente con ellos a través del chat interno. No cobramos comisiones por cliente ni tarifas por contacto.
                                    </p>
                                </div>
                            </div>

                            {/* Tarjeta 3 */}
                            <div className="flex flex-col gap-4 items-start bg-[#CD1F8B]/10 backdrop-blur-sm p-6 rounded-3xl text-left hover:bg-[#CD1F8B]/15 hover:border-[#CD1F8B]/30 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-[#CD1F8B] flex items-center justify-center shrink-0 shadow-lg shadow-[#CD1F8B]/20">
                                    <Share className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-100 mb-1.5">Perfil público profesional</h3>
                                    <p className="text-neutral-300 text-md leading-relaxed">
                                        Comparte tu enlace público para que tus clientes te recomienden fácilmente con acceso directo desde la app y la web.
                                    </p>
                                </div>
                            </div>

                            {/* Tarjeta 4 */}
                            <div className="flex flex-col gap-4 items-start bg-amber-500/10 backdrop-blur-sm p-6 rounded-3xl  text-left hover:bg-amber-500/15 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-100 mb-1.5">Destaca en tu zona</h3>
                                    <p className="text-neutral-300 text-md leading-relaxed">
                                        Aparece de forma prioritaria en las búsquedas locales cuando los usuarios necesiten profesionales recomendados por sus conocidos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Suscripción a la derecha */}
                        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl text-left text-slate-900 hover:scale-[1.01] transition-transform duration-300 relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6600]/10 rounded-full blur-2xl"></div>

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black text-slate-900">Plan Profesional</h3>
                                </div>

                                <p className="text-slate-600 text-md mb-6 leading-relaxed">
                                    Ideal para cualquier persona o negocio que ofrezca servicios y quiera destacar.
                                </p>

                                <div className="flex items-center gap-3 mb-6 select-none h-14">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ x: -12, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 12, opacity: 0 }}
                                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                                            style={{
                                                backgroundColor: badgeBgColor,
                                                borderColor: badgeBorderColor,
                                                color: serviceColor
                                            }}
                                            className="inline-flex items-center gap-3 border shadow-sm rounded-2xl px-5 h-14"
                                        >
                                            <div className="flex items-center justify-center shrink-0">
                                                {getCategoryIcon(currentService.iconName, "w-6 h-6")}
                                            </div>
                                            <span className="font-extrabold text-xs tracking-wider uppercase">
                                                {currentService.name}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="mb-6 flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-slate-950">0€</span>
                                    <span className="text-slate-500 font-medium">/mes</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Perfil Profesional verificado',
                                        'Perfil web público para compartir',
                                        'Recibe recomendaciones',
                                        'Aparece en búsquedas de tu zona',
                                        'Chat con clientes habilitado',
                                        'Estadísticas de tu perfil'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-md text-slate-700 font-medium">
                                            <Check className="w-5 h-5 text-[#FF6600] shrink-0" /> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a href="#como-crear" className="block w-full text-center bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-full flex items-center justify-center font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20">
                                Cómo empezar
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. Sección Cómo crear tu perfil profesional */}
                <div id="como-crear" className="max-w-5xl mx-auto mb-24 scroll-mt-28 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Cómo crear tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6601] via-[#E83E4C] to-[#CD1F8B]">Perfil Profesional</span>
                        </h2>
                        <p className="text-xl md:text-2xl text-violet-200/90 font-bold max-w-xl mx-auto">
                            Sigue estos sencillos pasos para activar tu perfil en menos de 2 minutos
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Paso 1 */}
                        <div className="flex flex-col items-center text-center bg-[#FF6600]/10 backdrop-blur-sm p-8 rounded-3xl hover:bg-[#FF6600]/15 hover:border-[#FF6600]/30 hover:-translate-y-1 transition-all duration-300 relative group">
                            <div className="w-16 h-16 rounded-2xl bg-[#FF6600] flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#FF6600]/20">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                                    <path d="M12 18h.01" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-100 mb-3">1. Descarga la app</h3>
                            <p className="text-neutral-300 text-md leading-relaxed">
                                Instálate la aplicación de dconfy en tu dispositivo iOS o Android de forma rápida y sencilla.
                            </p>
                        </div>

                        {/* Paso 2 */}
                        <div className="flex flex-col items-center text-center bg-[#E83E4C]/10 backdrop-blur-sm p-8 rounded-3xl  hover:bg-[#E83E4C]/15 hover:border-[#E83E4C]/30 hover:-translate-y-1 transition-all duration-300 relative group">
                            <div className="w-16 h-16 rounded-2xl bg-[#E83E4C] flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#E83E4C]/20">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-100 mb-3">2. Cuenta Personal</h3>
                            <p className="text-neutral-300 text-md leading-relaxed">
                                Crea tu cuenta personal para poder ver y hacer recomendaciones de tus profesionales de confianza.
                            </p>
                        </div>

                        {/* Paso 3 */}
                        <div className="flex flex-col items-center text-center bg-[#CD1F8B]/10 backdrop-blur-sm p-8 rounded-3xl  hover:bg-[#CD1F8B]/15 hover:border-[#CD1F8B]/30 hover:-translate-y-1 transition-all duration-300 relative group">
                            <div className="w-16 h-16 rounded-2xl bg-[#CD1F8B] flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#CD1F8B]/20">
                                <Rocket className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-100 mb-3">3. Perfil Profesional</h3>
                            <p className="text-neutral-300 text-md leading-relaxed">
                                Una vez dentro, la app te preguntará si <strong>"¿Ofreces algún servicio?"</strong>. Crea tu perfil profesional gratuitamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. Formulario (Registro VIP) - Oculto condicionalmente */}
                {false && (
                    <div id="registro-vip" className="max-w-xl mx-auto scroll-mt-28 relative z-10">
                        <div className="w-full bg-slate-950 rounded-3xl p-8 md:p-10 border border-slate-800 shadow-2xl text-left">
                            {isLoadingLimit ? (
                                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
                                    <Loader2 className="w-10 h-10 animate-spin text-[#FF6600] mb-4" />
                                    <p className="text-neutral-400 font-medium">Comprobando plazas disponibles...</p>
                                </div>
                            ) : isLimitReached ? (
                                <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                                    <div className="mx-auto w-20 h-20 bg-[#FF6600]/10 rounded-full flex items-center justify-center mb-6">
                                        <Sparkles className="w-10 h-10 text-[#FF6600]" />
                                    </div>
                                    <h2 className="text-3xl font-black text-neutral-200 mb-4 tracking-tight">
                                        ¡Plazas agotadas! 🚀
                                    </h2>
                                    <p className="text-lg text-neutral-400 mb-6">
                                        Ya hemos alcanzado los 50 primeros profesionales fundadores. ¡Ha sido visto y no visto!
                                    </p>
                                    <p className="text-sm text-neutral-500">
                                        Mantente atento a nuestras redes, muy pronto abriremos el acceso para todo el mundo.
                                    </p>
                                </div>
                            ) : status === 'success' ? (
                                <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                                    <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h2 className="text-3xl font-black text-neutral-200 mb-4 tracking-tight">
                                        ¡Genial! Ya estás en la lista.
                                    </h2>
                                    <p className="text-lg text-neutral-400">
                                        Revisa tu email, te contactamos muy pronto con los siguientes pasos para estrenar dconfy.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-10">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-[#FF6600] font-bold text-xs tracking-wider uppercase mb-6 border border-[#FF6600]/20 w-fit">
                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                            Gratis para los primeros
                                        </div>
                                        <h2 className="text-3xl font-black text-neutral-200 mb-6 tracking-relaxed leading-tight" >
                                            Únete a los <span className="text-[#FF6600]">primeros</span> profesionales para lanzar dconfy.
                                        </h2>
                                        <p className="text-slate-400 font-bold text-[13px] uppercase tracking-wider">
                                            Ideal para cualquier persona o negocio que ofrezca servicios y quiera destacar.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label htmlFor="nombre" className="block text-sm font-bold text-neutral-400 mb-1.5">
                                                Tu nombre
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                required
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-slate-950 text-neutral-200 placeholder:text-neutral-600 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none"
                                                placeholder="Ej. Laura Gómez"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-2/3">
                                                <label htmlFor="profesion" className="block text-sm font-bold text-neutral-400 mb-1.5">
                                                    ¿A qué te dedicas?
                                                </label>

                                                {/* Selector de profesiones con OptGroups */}
                                                <select
                                                    id="profesion"
                                                    name="profesion"
                                                    required
                                                    value={formData.profesion}
                                                    onChange={handleChange}
                                                    disabled={isLoadingCategories}
                                                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-slate-950 text-neutral-200 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none appearance-none disabled:opacity-50 text-slate-200"
                                                >
                                                    <option value="" disabled className="text-neutral-600">
                                                        {isLoadingCategories ? 'Cargando profesiones...' : 'Selecciona una profesión'}
                                                    </option>

                                                    {Object.entries(groupedCategories).map(([sector, profesiones]) => (
                                                        <optgroup key={sector} label={sector} className="bg-slate-900 text-neutral-400 font-bold">
                                                            {profesiones.map(p => (
                                                                <option key={p} value={p} className="text-neutral-200 font-normal">
                                                                    {p}
                                                                </option>
                                                            ))}
                                                        </optgroup>
                                                    ))}

                                                    <option value="Otra" className="font-bold text-[#FF6600]">
                                                        Otra profesión...
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="w-1/3">
                                                <label htmlFor="codigoPostal" className="block text-sm font-bold text-neutral-400 mb-1.5">
                                                    C. Postal
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        id="codigoPostal"
                                                        name="codigoPostal"
                                                        required
                                                        maxLength={5}
                                                        value={formData.codigoPostal}
                                                        onChange={handleZipChange}
                                                        onBlur={handleZipBlur}
                                                        className={`w-full px-4 py-3 rounded-xl border bg-slate-950 text-neutral-200 placeholder:text-neutral-600 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none text-center ${zipError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-neutral-800'}`}
                                                        placeholder="28001"
                                                    />
                                                    {isZipLoading && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-[#FF6600]" />
                                                        </div>
                                                    )}
                                                </div>
                                                {zipError ? (
                                                    <p className="text-[10px] font-bold text-red-500 mt-1.5 text-center">
                                                        {zipError}
                                                    </p>
                                                ) : formData.ciudad ? (
                                                    <p className="text-[10px] font-bold text-neutral-400 mt-1.5 flex items-center justify-center gap-1 truncate">
                                                        <MapPin className="w-3 h-3 text-[#FF6600]" />
                                                        {formData.ciudad}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Input condicional que solo aparece si se selecciona "Otra" */}
                                        {formData.profesion === 'Otra' && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label htmlFor="customProfesion" className="block text-sm font-bold text-[#FF6600] mb-1.5">
                                                    Escribe tu profesión
                                                </label>
                                                <input
                                                    type="text"
                                                    id="customProfesion"
                                                    name="customProfesion"
                                                    required
                                                    value={formData.customProfesion}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-[#FF6600]/50 bg-slate-950 text-neutral-200 placeholder:text-neutral-600 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none"
                                                    placeholder="Ej. Tatuador, Entrenador Personal..."
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-neutral-400 mb-1.5">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleEmailChange}
                                                className={`w-full px-4 py-3 rounded-xl border bg-slate-950 text-neutral-200 placeholder:text-neutral-600 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none ${emailError ? 'border-red-500 ring-1 ring-red-500/50' : 'border-neutral-800'}`}
                                                placeholder="hola@tmail.com"
                                            />
                                            {emailError && (
                                                <p className="text-[10px] font-bold text-red-500 mt-1.5">
                                                    {emailError}
                                                </p>
                                            )}
                                        </div>

                                        {status === 'error' && (
                                            <p className="text-red-500 text-sm font-medium text-center">
                                                Hubo un error al guardar tus datos. Por favor, inténtalo de nuevo.
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading' || !isFormValid}
                                            className="w-full bg-gradient-to-r from-[#F05A28] to-[#E83E4C] text-white font-bold text-lg py-4 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-[0.98] flex justify-center items-center gap-2 mt-6 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Guardando sitio...
                                                </>
                                            ) : (
                                                'Quiero ser de los primeros'
                                            )}
                                        </button>
                                        <p className="text-center text-xs text-neutral-600 mt-4">
                                            Prometemos no enviar spam. Solo información sobre tu acceso.
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Banner de Descarga de la App */}
            <section id="descargar" className="bg-[#FFF9F0] py-24 px-6 text-center w-full relative z-10">
                <div className="w-[84px] h-[84px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-[1.75rem] flex items-center justify-center mx-auto mb-8 overflow-hidden">
                    <img
                        src="/dconfy_icon.png"
                        alt="Logo dconfy"
                        className="w-full h-full object-cover"
                    />
                </div>

                <h2 className="text-4xl md:text-6xl font-black [-webkit-text-stroke:1px_currentColor] text-[#111827] mb-6 tracking-tight">
                    Descarga la app
                </h2>

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
                    <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-full flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
                        <svg className="w-8 h-8 ml-1" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        <div className="text-left flex flex-col justify-center">
                            <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
                            <span className="text-[18px] font-semibold leading-tight tracking-tight">App Store</span>
                        </div>
                    </a>

                    <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="bg-[#171A21] hover:bg-[#222630] text-white px-5 py-2.5 rounded-full flex items-center justify-start gap-3.5 transition-colors w-[200px] shadow-sm">
                        <svg className="w-7 h-7 ml-1" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                        </svg>
                        <div className="text-left flex flex-col justify-center">
                            <span className="text-[10px] text-slate-300 font-normal leading-tight mb-0.5">Disponible en</span>
                            <span className="text-[18px] font-semibold leading-tight tracking-tight">Google Play</span>
                        </div>
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}