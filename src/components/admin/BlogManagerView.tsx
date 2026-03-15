import React, { useState } from 'react';
import { FileText, Plus, Trash2, Edit, CheckCircle2, EyeOff, Code, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <p className="text-slate-400 p-4">Cargando editor visual...</p>
});

export function BlogManagerView({
    blogPosts, handleCreatePost, handleDeletePost, handleEditClick, handleCancelEdit, handleTogglePublish,
    isCreatingPost, newPost, setNewPost, showPostForm, editingPostId
}: any) {

    const [showHtmlView, setShowHtmlView] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 border border-slate-800">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#FF6600]" /> Blog y Novedades
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">Crea y gestiona los artículos que aparecen en dconfy.app/blog</p>
                </div>
                <button
                    onClick={handleCancelEdit}
                    className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                    {showPostForm ? 'Cancelar Edición' : <><Plus className="w-5 h-5" /> Nuevo Artículo</>}
                </button>
            </div>

            {showPostForm && (
                <form onSubmit={handleCreatePost} className="bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 space-y-5 animate-in fade-in slide-in-from-top-4">
                    <div className="border-b border-slate-800 pb-4 mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {editingPostId ? <><Edit className="w-5 h-5 text-blue-400" /> Editando Artículo</> : <><Plus className="w-5 h-5 text-[#FF6600]" /> Crear Nuevo Artículo</>}
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título <span className="text-[#FF6600]">*</span></label>
                            <input type="text" required value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Ej: Nueva función de IA disponible" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Slug (URL amigable) <span className="text-[#FF6600]">*</span></label>
                            <input type="text" required value={newPost.slug} onChange={e => setNewPost({ ...newPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="ej: nueva-funcion-ia" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>

                        {/* 🚀 AQUÍ AÑADIMOS EL SELECTOR DE FECHA */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Fecha Publicación <span className="text-[#FF6600]">*</span></label>
                                <input type="date" required value={newPost.created_at} onChange={e => setNewPost({ ...newPost, created_at: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                            </div>
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
                            <input type="text" value={newPost.image} onChange={e => setNewPost({ ...newPost, image: e.target.value })} placeholder="Ej: /blog/imagen.jpg o https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Resumen (Para la tarjeta) <span className="text-[#FF6600]">*</span></label>
                            <textarea required value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} placeholder="Un texto breve para enganchar..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none h-20 resize-none" />
                        </div>

                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase">Contenido de la Noticia <span className="text-[#FF6600]">*</span></label>
                                <button
                                    type="button"
                                    onClick={() => setShowHtmlView(!showHtmlView)}
                                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                                >
                                    <Code className="w-3.5 h-3.5" />
                                    {showHtmlView ? 'Volver al Editor Visual' : 'Ver Código HTML'}
                                </button>
                            </div>

                            <div className="bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-800">
                                {showHtmlView ? (
                                    <textarea
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        className="w-full h-[400px] p-4 bg-slate-950 text-emerald-400 font-mono text-sm resize-none focus:outline-none"
                                        placeholder="<p>Escribe tu código HTML aquí...</p>"
                                    />
                                ) : (
                                    <ReactQuill
                                        theme="snow"
                                        value={newPost.content}
                                        onChange={(value) => setNewPost({ ...newPost, content: value })}
                                        className="h-[400px] pb-[42px]"
                                        placeholder="Escribe tu artículo aquí con todo lujo de detalles..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-2 border-t border-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-800/50 transition-colors w-fit">
                            <div className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${newPost.is_published ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${newPost.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
                            </div>
                            <span className="text-sm font-bold text-white">
                                {newPost.is_published ? 'Visible en la web (Público)' : 'Oculto (Borrador)'}
                            </span>
                        </label>

                        <button type="submit" disabled={isCreatingPost} className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-black transition-all disabled:opacity-50 hover:bg-slate-200 active:scale-95 shadow-lg">
                            {isCreatingPost ? 'Guardando...' : editingPostId ? 'Guardar Cambios' : 'Guardar Artículo'}
                        </button>
                    </div>
                </form>
            )}

            {!showPostForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                    {blogPosts.length === 0 ? (
                        <div className="md:col-span-2 xl:col-span-3 text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-medium text-lg">Aún no hay ningún artículo publicado.</p>
                        </div>
                    ) : (
                        blogPosts.map((post: any) => (
                            <div key={post.id} className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all flex flex-col group ${post.is_published ? 'border-slate-800 hover:border-slate-700 shadow-lg shadow-black/10' : 'border-slate-800/50 opacity-80'}`}>
                                {post.image ? (
                                    <div className="relative overflow-hidden aspect-[16/9]">
                                        <img src={post.image} alt="portada" className={`w-full h-full object-cover transition-transform duration-500 ${post.is_published ? 'group-hover:scale-105' : 'grayscale-[30%]'}`} />
                                        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border border-slate-700">{post.category}</div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-800 flex items-center px-5 aspect-[16/9]"><span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase">{post.category}</span></div>
                                )}

                                <div className="p-5 flex-1 flex flex-col">
                                    {/* 🚀 FECHA EN LA TARJETA */}
                                    <span className="text-[11px] font-black text-slate-500 mb-2.5 flex items-center gap-1.5 tracking-wider uppercase">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(post.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>

                                    <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">{post.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>

                                    <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePublish(post.id, post.is_published)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${post.is_published ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${post.is_published ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                                                {post.is_published ? (
                                                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Público</span>
                                                ) : (
                                                    <span className="text-amber-500 flex items-center gap-1"><EyeOff className="w-3.5 h-3.5" /> Borrador</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleEditClick(post)} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Editar artículo"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeletePost(post.id)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Borrar artículo"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}