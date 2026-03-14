import React from 'react';
import { FileText, Plus, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';

export function BlogManagerView({
    blogPosts, handleCreatePost, handleDeletePost, isCreatingPost,
    newPost, setNewPost, showPostForm, setShowPostForm
}: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 border border-slate-800">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#FF6600]" /> Blog y Novedades
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">Crea y gestiona los artículos que aparecen en dconfy.app/novedades</p>
                </div>
                <button
                    onClick={() => setShowPostForm(!showPostForm)}
                    className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                    {showPostForm ? 'Cancelar' : <><Plus className="w-5 h-5" /> Nuevo Artículo</>}
                </button>
            </div>

            {/* FORMULARIO DE CREACIÓN */}
            {showPostForm && (
                <form onSubmit={handleCreatePost} className="bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 space-y-5 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título <span className="text-[#FF6600]">*</span></label>
                            <input type="text" required value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Ej: Nueva función de IA disponible" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Slug (URL amigable) <span className="text-[#FF6600]">*</span></label>
                            <input type="text" required value={newPost.slug} onChange={e => setNewPost({ ...newPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="ej: nueva-funcion-ia" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:ring-2 focus:ring-[#FF6600] outline-none" />
                            <p className="text-[10px] text-slate-500 mt-1">Se usará para dconfy.app/novedades/<strong>tu-slug</strong></p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Categoría</label>
                                <input type="text" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} placeholder="Ej: Actualizaciones" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tiempo Lectura</label>
                                <input type="text" value={newPost.read_time} onChange={e => setNewPost({ ...newPost, read_time: e.target.value })} placeholder="Ej: 3 min" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">URL de la Imagen de Portada</label>
                            <input type="url" value={newPost.image} onChange={e => setNewPost({ ...newPost, image: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Resumen (Para la tarjeta) <span className="text-[#FF6600]">*</span></label>
                            <textarea required value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} placeholder="Un texto breve para enganchar..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none h-20 resize-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Contenido (Admite HTML) <span className="text-[#FF6600]">*</span></label>
                            <textarea required value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} placeholder="<p>Escribe tu artículo aquí...</p>" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none h-48 font-mono text-sm resize-none" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-800">
                        <button type="submit" disabled={isCreatingPost} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black transition-all disabled:opacity-50 hover:bg-slate-200">
                            {isCreatingPost ? 'Guardando...' : 'Publicar Artículo'}
                        </button>
                    </div>
                </form>
            )}

            {/* LISTA DE ARTÍCULOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogPosts.length === 0 ? (
                    <div className="md:col-span-2 xl:col-span-3 text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium text-lg">Aún no hay ningún artículo publicado.</p>
                    </div>
                ) : (
                    blogPosts.map((post: any) => (
                        <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col group">
                            {post.image ? (
                                <div className="h-40 overflow-hidden relative">
                                    <img src={post.image} alt="portada" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border border-slate-700">{post.category}</div>
                                </div>
                            ) : (
                                <div className="h-20 bg-slate-800 flex items-center px-5"><span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">{post.category}</span></div>
                            )}

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">{post.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

                                <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                                        {post.is_published ? (
                                            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Público</span>
                                        ) : (
                                            <span className="text-amber-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Borrador</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}