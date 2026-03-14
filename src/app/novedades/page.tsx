import Link from 'next/link';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { createClient } from '@supabase/supabase-js';

export const metadata = {
    title: 'Novedades y Actualizaciones | dconfy',
    description: 'Descubre las últimas funcionalidades, noticias y mejoras de dconfy.',
};

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function NovedadesPage() {
    const { data: novedades } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return (
        <>
            <Header />

            <div className="min-h-screen bg-slate-50 pt-24 pb-20">
                <div className="max-w-5xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Novedades <span className="text-[#FF6600]">dconfy</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Entérate antes que nadie de las nuevas funcionalidades, mejoras y noticias sobre nuestra plataforma.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {!novedades || novedades.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">Próximamente publicaremos nuevas noticias.</p>
                            </div>
                        ) : (
                            novedades.map((post) => (
                                <Link key={post.id} href={`/novedades/${post.slug}`} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
                                    <div className="h-64 overflow-hidden relative bg-slate-100">
                                        {/* 🚀 AQUÍ ESTÁ LA ETIQUETA EN LA ESQUINA INFERIOR (bottom-4) */}
                                        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-violet-700 shadow-sm">
                                            {post.category}
                                        </div>
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.read_time}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-violet-600 transition-colors leading-tight">
                                            {post.title}
                                        </h2>
                                        <p className="text-slate-500 mb-6 flex-1 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center text-[#FF6600] font-bold gap-2 group-hover:gap-3 transition-all">
                                            Leer artículo <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}