import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();

    if (!post || !post.is_published) {
        notFound();
    }

    const cleanContent = post?.content ? post.content.replace(/&nbsp;/g, ' ') : '';

    return (
        <>
            <Header />

            <div className="min-h-screen bg-white pt-24 pb-40">
                <div className="max-w-3xl mx-auto px-6">

                    <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Volver a blog
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
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.read_time}</span>
                        </div>
                    </div>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-80 md:h-[400px] object-cover rounded-3xl mb-12 shadow-md bg-slate-100"
                        />
                    )}

                    {/* 🚀 AÑADIMOS LA CLASE "contenido-blog" PARA DOMAR EL TEXTO */}
                    <div className="max-w-3xl mx-auto w-full sm:px-0 contenido-blog">
                        <article
                            className="prose prose-lg prose-slate prose-headings:font-black prose-headings:tracking-tight prose-a:text-violet-600 hover:prose-a:text-violet-500 prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: cleanContent }}
                        />
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}