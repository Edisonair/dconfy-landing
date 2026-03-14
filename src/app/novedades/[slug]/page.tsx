import { novedades } from '../../../data/novedades';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export function generateStaticParams() {
    return novedades.map((post) => ({
        slug: post.slug,
    }));
}

// 🚀 AQUÍ ESTÁ EL CAMBIO: Añadimos async y Promise para Next.js 15
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    // 🚀 Resolvemos la promesa de los parámetros de la URL
    const resolvedParams = await params;

    const post = novedades.find((p) => p.slug === resolvedParams.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-3xl mx-auto px-6">

                <Link href="/novedades" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Volver a novedades
                </Link>

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {post.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                    </div>
                </div>

                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-80 md:h-[400px] object-cover rounded-3xl mb-12 shadow-md"
                />

                <article
                    className="prose prose-lg prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-600 hover:prose-a:text-violet-500 prose-img:rounded-2xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

            </div>
        </div>
    );
}