'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Sparkles, MapPin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

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
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-violet-900 to-violet-950">
            <Header />

            <main className="flex-grow flex items-center justify-center pt-20 pb-20 px-6">
                <div className="w-full max-w-lg bg-slate-950 rounded-3xl p-8 md:p-12 rounded-[2rem] border border-slate-800 shadow-2xl">

                    {/* 🚀 NUEVO: Comprobaciones previas al formulario */}
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
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6600]/10 text-[#FF6600] font-bold text-sm mb-6 border border-[#FF6600]/20">
                                    <Sparkles className="w-4 h-4" />
                                    Acceso Anticipado
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-neutral-200 mb-4 tracking-tight leading-tight">
                                    Buscamos a los <span className="text-[#FF6600]">50 primeros</span> profesionales para estrenar dconfy <span className="text-[#FF6600]">Gratis</span>.
                                </h1>
                                <p className="text-neutral-400 text-lg mb-6">
                                    Únete a dconfy y deja que el boca a boca digital haga crecer tu negocio.
                                </p>
                                <p className="text-[#FF6600] font-bold text-[13px] uppercase tracking-wider">
                                    Ideal para profesionales, autónomos y pequeños negocios que quieren destacar.
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
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-slate-950 text-neutral-200 focus:bg-[#161616] focus:ring-2 focus:ring-[#FF6600] focus:border-transparent transition-all outline-none appearance-none disabled:opacity-50"
                                        >
                                            <option value="" disabled>
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
            </main>

            <Footer />
        </div>
    );
}