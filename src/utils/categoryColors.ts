export const CATEGORY_COLORS: Record<string, string> = {
    // General / Home
    'Home': '#ea580c', // Orange-600
    'Hogar': '#ea580c',
    'Reformas': '#ea580c',
    'Jardín': '#65a30d', // Lime-600
    'Jardin': '#65a30d',

    // HOGAR
    'Lampista': '#f59e0b', // Amber
    'Electricista': '#eab308', // Yellow
    'Fontanero': '#3b82f6', // Blue
    'Carpintero': '#c2410c', // Orange-700

    // Health / Wellness
    'Salud': '#db2777', // Pink-600
    'Bienestar': '#db2777',

    'Psicología': '#7c3aed', // Violet-600
    'Nutrición': '#16a34a', // Green-600

    // SALUD (New)
    'Fisioterapia': '#14b8a6', // Teal
    'Osteópata': '#0d9488', // Teal-600
    'Yoga': '#fb7185', // Rose
    'Pilates': '#ec4899', // Pink

    // Tech / Professional
    'Tecnología': '#2563eb', // Blue-600
    'Informática': '#2563eb',
    'Legal': '#475569', // Slate-600
    'Finanzas': '#059669', // Emerald-600
    'Banca': '#059669',

    // Services
    'Limpieza': '#06b6d4', // Cyan-500
    'Eventos': '#9333ea', // Purple-600
    'Educación': '#ca8a04', // Yellow-600
    'Mascotas': '#fbbf24', // Amber-400
    // MASCOTAS (Specifics)
    'Veterinarios': '#16a34a', // Green
    'Peluquería Canina': '#ff6600', // Orange

    'Automoción': '#dc2626', // Red-600
    'Transporte': '#dc2626',

    // Default fallback
    'default': '#475569' // Slate-600
};

export const getCategoryColor = (name: string): string => {
    // 1. Normalización estricta (minúsculas, sin acentos)
    const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 2. Búsqueda más flexible en las keys
    const key = Object.keys(CATEGORY_COLORS).find(k => {
        const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return normalizedName.includes(normKey);
    });

    if (key) return CATEGORY_COLORS[key];

    // 3. Fallback determinista (basado en charCode)
    // Para que "Yoga" siempre sea el mismo color, aunque no esté en la lista, y no sea siempre gris.
    const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const fallbacks = ['#2563eb', '#db2777', '#059669', '#ca8a04', '#9333ea', '#ea580c'];
    return fallbacks[charCode % fallbacks.length];
};
