import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, ChevronLeft } from 'lucide-react';
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
            {/* 🚀 NUEVA CABECERA OSCURA EXCLUSIVA PARA EL BLOG */}
            <header className="fixed top-0 w-full bg-slate-950 border-b border-slate-800 z-50 shadow-lg">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/">
                        <img src="/dconfy_logo_hibrid.png" alt="dconfy" className="h-8 md:h-9 object-contain" />
                    </Link>
                    <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2">
                        dconfy.app
                    </Link>
                </div>
            </header>

            {/* 🚀 NUEVO FONDO COLOR #faf3e5 Y MÁS ESPACIO ARRIBA */}
            <div className="min-h-screen bg-[#f5f5f7] pt-32 pb-40">
                <div className="max-w-3xl mx-auto px-6">

                    <Link href="/blog" className="inline-flex items-center gap-2 text-[#111827] hover:text-violet-600 font-semibold mb-8 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Volver al blog
                    </Link>

                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-[#FF6600] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-6 leading-tight tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-sm font-bold text-[#111827] uppercase tracking-wider">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.read_time}</span>
                        </div>
                    </div>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full aspect-[16/9] object-cover rounded-3xl mb-12 shadow-md bg-white border border-slate-200"
                        />
                    )}

                    <div className="max-w-3xl mx-auto w-full sm:px-0 contenido-blog">
                        <article
                            className="prose prose-lg prose-p:text-[#111827] prose-headings:text-[#111827] prose-headings:tracking-tight prose-a:text-violet-600 hover:prose-a:text-violet-500 prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: cleanContent }}
                        />
                    </div>

                </div>
            </div>

            <Footer />

            <style dangerouslySetInnerHTML={{
                __html: `
                .contenido-blog p {
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                }
                .contenido-blog p:empty::before {
                    content: "\\00a0";
                    display: block;
                }
            `}} />
        </>
    );
}