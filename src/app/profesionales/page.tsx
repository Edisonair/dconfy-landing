'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Sparkles, MapPin, TrendingUp, Coins, Award, Share, Check, Minus } from 'lucide-react';
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
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
                        ¿Ofreces algún servicio?
                    </h1>
                    <p className="text-xl md:text-2xl text-violet-100/90 font-medium max-w-2xl mx-auto leading-relaxed">
                        Convierte el boca a boca de siempre en un flujo de nuevos contactos
                    </p>
                </div>

                {/* 2. Sección Plan Profesional */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/15 text-[#FF6600] font-bold text-xs tracking-wider uppercase mb-8 border border-[#FF6600]/20 w-fit mx-auto">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        3 meses gratis por lanzamiento
                    </div>

                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Plan Profesional</h2>

                    {/* Toggle Mensual/Anual */}
                    <div className="flex justify-center mb-10">
                        <div className="relative flex items-center bg-violet-950/40 p-1.5 rounded-full w-[260px] h-[52px] border border-violet-800/50 shadow-inner">
                            <div
                                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-violet-600 rounded-full shadow-md transition-transform duration-300 left-1.5 ${isAnnual ? 'translate-x-full' : 'translate-x-0'}`}
                            ></div>
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${!isAnnual ? 'text-white' : 'text-violet-300 hover:text-white'}`}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-[15px] font-bold transition-colors select-none ${isAnnual ? 'text-white' : 'text-violet-300 hover:text-white'}`}
                            >
                                Anual
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta Plan Profesional */}
                    <div className="max-w-md mx-auto bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl text-left text-slate-900">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Plan Profesional</h3>
                        <p className="text-slate-500 text-sm mb-6 h-10">Ideal para cualquier persona o negocio que ofrezca servicios y quiera destacar.</p>
                        <div className="mb-2 flex items-baseline gap-1">
                            <span className="text-5xl font-black text-slate-950">{isAnnual ? '29,99€' : '2,99€'}</span>
                            <span className="text-slate-500 font-medium">/{isAnnual ? 'año' : 'mes'}</span>
                        </div>
                        <p className="text-sm font-bold text-[#FF6600] mb-8 h-5">{isAnnual ? '2,49€ al mes (ahorras 2 meses)' : 'Facturado mensualmente. Cancela cuando quieras.'}</p>

                        <ul className="space-y-4 mb-8">
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
                        <a href="#registro-vip" className="block w-full text-center bg-[#FF6600] hover:bg-[#E65C00] text-white py-3.5 rounded-2xl flex items-center justify-center font-[system-ui] font-bold transition-all shadow-lg shadow-[#FF6600]/20">
                            Apúntate en la lista VIP
                        </a>
                    </div>
                </div>

                {/* 3. Sección Puntos/Beneficios */}
                <div className="max-w-5xl mx-auto mb-24">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-12">
                        ¿Por qué unirte hoy?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-6 h-6 text-[#FF6600]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-100 mb-1.5">Multiplica tus recomendaciones</h3>
                                <p className="text-neutral-300 text-base leading-relaxed">
                                    Cuando un cliente te recomienda en dconfy, tu perfil se destaca automáticamente ante sus amigos, familiares, contactos directos y de su círculo.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                                <Coins className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-100 mb-1.5">Sin intermediarios ni comisiones</h3>
                                <p className="text-neutral-300 text-base leading-relaxed">
                                    Tus clientes son tuyos. Habla directamente con ellos a través de nuestro chat interno. No cobramos comisiones por cliente ni tarifas por contacto.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <Share className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-100 mb-1.5">Perfil público para compartir</h3>
                                <p className="text-neutral-300 text-base leading-relaxed">
                                    Tendrás un enlace público para compartirlo y que tus clientes te recomienden. Con acceso desde la app móvil y el portal web.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-left">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <Award className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-neutral-100 mb-1.5">Promoción de Lanzamiento</h3>
                                <p className="text-neutral-300 text-base leading-relaxed">
                                    Al estar entre los primeros profesionales, tendrás acceso gratuito de por vida a todas nuestras funciones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Formulario (Registro VIP) */}
                <div id="registro-vip" className="max-w-xl mx-auto scroll-mt-28">
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
            </main>

            <Footer />
        </div>
    );
}