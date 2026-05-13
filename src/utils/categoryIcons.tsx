import {
    Sparkles, GraduationCap, Heart, Dumbbell, ChefHat, Baby,
    MonitorSmartphone, Scale, Calculator, Briefcase,
    Package, PawPrint, Car, Camera, Leaf, Building, Scissors, PenTool, HelpingHand, Flower,
    Home, Zap, Droplet, Droplets, Paintbrush, Wrench, Hammer,
    Brain, Utensils, Snowflake, Thermometer, Activity, Apple,
    Bone, Flower2, Move, Stethoscope,
    HousePlug, HouseHeart, Sprout,
    Anchor, Ship,
    Truck, Music, Mic, Palette, Brush, Laptop, Code, BookOpen, TreePine, Bug,
    ShieldCheck, Shirt, Video, Film, Image as ImageIcon, Map, Key, Lock, Megaphone, Users,
    ScissorsSquare, Ruler, Bike, Coffee, Sun, Moon, Wind, Umbrella, Search,
    AirVent, Blinds, CarTaxiFront, Sofa, MoonStar, Trees, LoaderPinwheel,
    HandHeart, Orbit, ShoppingBasket, ShoppingBag, Handbag,
    PlaneTakeoff // 🚀 NUEVO ICONO IMPORTADO
} from 'lucide-react';

// Map icon names from DB to Lucide components
export const ICON_MAP: Record<string, React.ElementType> = {
    // 1. DIRECT LUCIDE ICON NAMES (Crucial for DB mapping)
    'Scale': Scale,
    'Calculator': Calculator,
    'Baby': Baby,
    'ChefHat': ChefHat,
    'PawPrint': PawPrint,
    'MonitorSmartphone': MonitorSmartphone,
    'Dumbbell': Dumbbell,
    'Camera': Camera,
    'Sparkles': Sparkles,
    'Car': Car,
    'Package': Package,
    'Leaf': Leaf,
    'GraduationCap': GraduationCap,
    'Heart': Heart,
    'Building': Building,
    'Scissors': Scissors,
    'PenTool': PenTool,
    'HelpingHand': HelpingHand,
    'Flower': Flower,
    'Home': Home,
    'Zap': Zap,
    'Droplet': Droplet,
    'Paintbrush': Paintbrush,
    'Wrench': Wrench,
    'Briefcase': Briefcase,
    'Brain': Brain,
    'Utensils': Utensils,
    'Snowflake': Snowflake,
    'Thermometer': Thermometer,
    'Activity': Activity,
    'Apple': Apple,
    'Bone': Bone,
    'Hammer': Hammer,
    'Droplets': Droplets,
    'Stethoscope': Stethoscope,
    'Move': Move,
    'Flower2': Flower2,

    // --- MAPEOS DE LOS ICONOS ANTERIORES ---
    'Truck': Truck,
    'Music': Music,
    'Mic': Mic,
    'Palette': Palette,
    'Brush': Brush,
    'Laptop': Laptop,
    'Code': Code,
    'BookOpen': BookOpen,
    'TreePine': TreePine,
    'Bug': Bug,
    'Shirt': Shirt,
    'Video': Video,
    'Film': Film,
    'ImageIcon': ImageIcon,
    'Map': Map,
    'Key': Key,
    'Lock': Lock,
    'Megaphone': Megaphone,
    'Users': Users,
    'ScissorsSquare': ScissorsSquare,
    'Ruler': Ruler,
    'Bike': Bike,
    'Coffee': Coffee,
    'Sun': Sun,
    'Moon': Moon,
    'Wind': Wind,
    'Umbrella': Umbrella,
    'Search': Search,

    // --- MAPEOS RECIENTES (Permitimos CamelCase y Kebab-case) ---
    'AirVent': AirVent, 'air-vent': AirVent, 'Ventilacion': AirVent,
    'Blinds': Blinds, 'blinds': Blinds, 'Persianas': Blinds,
    'CarTaxiFront': CarTaxiFront, 'car-taxi-front': CarTaxiFront, 'Taxi': CarTaxiFront,
    'Sofa': Sofa, 'sofa': Sofa, 'Tapiceria': Sofa, 'Muebles': Sofa,
    'MoonStar': MoonStar, 'moon-star': MoonStar, 'Tarot': MoonStar, 'zodiac-ophiuchus': MoonStar, 'ZodiacOphiuchus': MoonStar,
    'Trees': Trees, 'trees': Trees, 'Paisajismo': Trees,
    'LoaderPinwheel': LoaderPinwheel, 'loader-pinwheel': LoaderPinwheel,

    // Escudo y Mano con corazón
    'ShieldCheck': ShieldCheck, 'shield-check': ShieldCheck, 'Seguridad': ShieldCheck,
    'HandHeart': HandHeart, 'hand-heart': HandHeart, 'Cuidado': HandHeart,

    // 🚀 MAPEO DIRECTO DEL NUEVO ICONO Y TU CATEGORÍA MANUAL
    'PlaneTakeoff': PlaneTakeoff, 'plane-takeoff': PlaneTakeoff, 'Avion': PlaneTakeoff, 'Vuelos': PlaneTakeoff,
    'Salidas en velero': Anchor, // Asigna directamente el ancla a la frase exacta

    // --- ICONOS ESPECÍFICOS DE TU BD ---
    'HousePlug': HousePlug,
    'HouseHeart': HouseHeart,
    'house-heart': HouseHeart,
    'sprout': Sprout,
    'Sprout': Sprout,
    'Anchor': Anchor,
    'Ship': Ship,

    // Categorías específicas en español por si las metes a mano
    'Jardinería': Sprout,
    'Jardin': Sprout,
    'Lampista': HousePlug,
    'Navegación': Anchor,
    'Clases de navegación': Anchor,
    'Patrón de barco': Ship,
    'Electricista': Zap,
    'Fontanero': Droplets,
    'Cerrajero': Key,
    'Cerrajería': Lock,
    'Mudanzas': Truck,
    'Transporte': Truck,
    'Informática': Laptop,
    'Marketing': Megaphone,
    'Plagas': Bug,

    // HOGAR
    'Carpintero': Hammer,
    'Carpintería': Hammer,
    'Reformas Integrales': HouseHeart,
    'Albañil': Hammer,

    // SALUD
    'Fisioterapia': Activity,
    'Osteópata': Bone,
    'Pilates': Move,
    'Entrenadores Personales': Dumbbell,
    'Nutricionistas': Leaf,
    'Psicología': Brain,

    // MASCOTAS
    'Veterinarios': Stethoscope,
    'Veterinario': Stethoscope,
    'Peluquería Canina': Scissors,
    'Canguros': Baby,

    // OTROS (Alias comunes)
    'Cámara': Camera, 'Camara': Camera,
    'Coche': Car, 'Auto': Car,
    'Casa': Home,
    'Edificio': Building, 'Construccion': Building,
    'Mascota': PawPrint, 'Perro': PawPrint, 'Gato': PawPrint,
    'Bebe': Baby, 'Bebé': Baby,
    'Salud': Heart,
    'Libro': GraduationCap, 'Educacion': GraduationCap,
    'Tijeras': Scissors, 'Peluqueria': Scissors,
    'Pesa': Dumbbell, 'Gimnasio': Dumbbell, 'Deporte': Dumbbell,
    'Comida': ChefHat, 'Chef': ChefHat, 'Cocina': ChefHat,
    'Ordenador': MonitorSmartphone, 'Movil': MonitorSmartphone, 'Tecnologia': MonitorSmartphone,
    'Calculadora': Calculator, 'Contabilidad': Calculator,
    'Balanza': Scale, 'Justicia': Scale, 'Legal': Scale,
    'Hoja': Leaf,
    'Paquete': Package, 'Logistica': Package,
    'Herramienta': Wrench, 'Arreglo': Wrench, 'Mecanica': Wrench, 'Taller': Wrench,
    'Pintura': Paintbrush, 'Pintor': Paintbrush,
    'Gota': Droplet, 'Agua': Droplet,
    'Rayo': Zap, 'Electricidad': Zap,
    'Mano': HelpingHand, 'Ayuda': HelpingHand,
    'Pluma': PenTool, 'Diseño': PenTool,
    'Maletin': Briefcase, 'Negocios': Briefcase,
    'Aire': Snowflake, 'Climatizacion': Snowflake,
    'Manzana': Apple, 'Fruta': Apple,
    'Orbit': Orbit, 'orbit': Orbit, 'Mindfulness': Orbit,
    'ShoppingBasket': ShoppingBasket,
    'ShoppingBag': ShoppingBag,
    'handbag': Handbag
};

export const getCategoryIcon = (categoryNameOrIcon: string, className: string = "w-6 h-6"): React.ReactElement => {
    // 0. Normalize Input
    const cleanName = categoryNameOrIcon?.trim() || '';

    // 1. Try Direct Match (Exact or Capitalized)
    let Component = ICON_MAP[cleanName] || ICON_MAP[cleanName.charAt(0).toUpperCase() + cleanName.slice(1)];

    // 2. Try Fuzzy Match if no direct match
    if (!Component) {
        const cat = cleanName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (cat.includes('hand-helping')) Component = HelpingHand;
        else if (cat.includes('sprout')) Component = Sprout;
        else if (cat.includes('house-plug')) Component = HousePlug;
        else if (cat.includes('house-heart')) Component = HouseHeart;

        // --- LÓGICA DE LOS NUEVOS ICONOS AÑADIDA ---
        else if (cat.includes('taxi') || cat.includes('chofer') || cat.includes('conductor')) Component = CarTaxiFront;
        else if (cat.includes('persiana') || cat.includes('toldo')) Component = Blinds;
        else if (cat.includes('mueble') || cat.includes('tapic') || cat.includes('sofa')) Component = Sofa;
        else if (cat.includes('ventila') || cat.includes('conducto') || cat.includes('extraccion')) Component = AirVent;
        else if (cat.includes('paisaj') || cat.includes('arbol') || cat.includes('bosque')) Component = Trees;
        else if (cat.includes('astrolog') || cat.includes('tarot') || cat.includes('vidente') || cat.includes('esoter')) Component = MoonStar;
        else if (cat.includes('segur') || cat.includes('alarm') || cat.includes('vigil')) Component = ShieldCheck;
        else if (cat.includes('cuidad') || cat.includes('acompañ') || cat.includes('dependen') || cat.includes('mayor')) Component = HandHeart;
        // 🚀 Búsqueda dinámica del avión
        else if (cat.includes('avion') || cat.includes('vuelo') || cat.includes('viaje')) Component = PlaneTakeoff;

        // --- LÓGICA EXTENDIDA POR PALABRAS CLAVE ---
        // 🚀 Añadida la palabra "velero" para el ancla
        else if (cat.includes('navega') || cat.includes('barco') || cat.includes('mar') || cat.includes('nautic') || cat.includes('velero')) Component = Anchor;
        else if (cat.includes('mudanza') || cat.includes('porte') || cat.includes('transporte')) Component = Truck;
        else if (cat.includes('cerraje') || cat.includes('llave')) Component = Key;
        else if (cat.includes('plaga') || cat.includes('fumiga')) Component = Bug;
        else if (cat.includes('informa') || cat.includes('ordenador') || cat.includes('comput')) Component = Laptop;
        else if (cat.includes('musica') || cat.includes('dj') || cat.includes('cantan')) Component = Music;
        else if (cat.includes('video') || cat.includes('audiovisual')) Component = Video;
        else if (cat.includes('ropa') || cat.includes('costura') || cat.includes('plancha')) Component = Shirt;

        else if (cat.includes('jardin')) Component = Sprout;
        else if (cat.includes('ayuda') || cat.includes('social') || cat.includes('ong')) Component = HelpingHand;
        else if (cat.includes('lampista')) Component = HousePlug;
        else if (cat.includes('nutric') || cat.includes('aliment') || cat.includes('diet')) Component = Utensils;
        else if (cat.includes('fisio') || cat.includes('rehab') || cat.includes('osteop')) Component = Activity;
        else if (cat.includes('psico') || cat.includes('mental') || cat.includes('terapia')) Component = Brain;
        else if (cat.includes('mindful') || cat.includes('meditacion')) Component = Orbit;
        else if (cat.includes('aire') || cat.includes('clima') || cat.includes('frio')) Component = Snowflake;
        else if (cat.includes('electric') || cat.includes('luz')) Component = Zap;
        else if (cat.includes('fontane') || cat.includes('agua')) Component = Droplets;
        else if (cat.includes('carpin') || cat.includes('mader')) Component = Hammer;
        else if (cat.includes('limpie')) Component = Sparkles;
        else if (cat.includes('veterin')) Component = Stethoscope;
        else if (cat.includes('pilates')) Component = Move;
        else if (cat.includes('yoga')) Component = Flower2;

        else if (cat.includes('reforma')) Component = Hammer;
        else if (cat.includes('hogar') || cat.includes('casa')) Component = Home;

        else if (cat.includes('mecanic') || cat.includes('taller') || cat.includes('coche')) Component = Wrench;
        else if (cat.includes('salud') || cat.includes('medic') || cat.includes('doctor')) Component = Heart;
        else if (cat.includes('legal') || cat.includes('abogad')) Component = Scale;
        else if (cat.includes('gestor') || cat.includes('asesor')) Component = Briefcase;
        else if (cat.includes('belleza') || cat.includes('estetic') || cat.includes('pelu')) Component = Scissors;
        else if (cat.includes('animal') || cat.includes('mascota')) Component = PawPrint;
        else if (cat.includes('foto') || cat.includes('video')) Component = Camera;

        else Component = Briefcase; // Ultimate Fallback (Maletín)
    }

    return <Component className={className} />;
};