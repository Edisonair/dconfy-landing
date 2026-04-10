import React from 'react';
import { Megaphone, Mail, Trash2, CheckCircle2, Send, Edit } from 'lucide-react';

export function CommunicationsView({
    commTab, setCommTab, handleCreateBanner, newBanner, setNewBanner, officialCategoriesList,
    isCreatingBanner, announcements, handleToggleBanner, handleDeleteBanner,
    handleSendBroadcast, emailDraft, setEmailDraft, isSendingEmail, emailHistory,
    editingBannerId, handleEditBannerClick, handleCancelBannerEdit
}: any) {

    // =======================================================================
    // VISTA 1: EMAILS MASIVOS
    // =======================================================================
    if (commTab === 'emails') {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* PESTAÑAS (Integradas directamente) */}
                <div className="flex bg-slate-900 p-1.5 rounded-2xl w-fit shadow-lg shadow-black/20">
                    <button
                        type="button"
                        onClick={() => setCommTab('banners')}
                        className="px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50"
                    >
                        <Megaphone className="w-4 h-4" /> Banners In-App
                    </button>
                    <button
                        type="button"
                        onClick={() => setCommTab('emails')}
                        className="px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 bg-slate-800 text-white shadow-sm"
                    >
                        <Mail className="w-4 h-4" /> Enviar Emails Masivos
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-1 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Nuevo Email</h3>
                        </div>
                        <form onSubmit={handleSendBroadcast} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Asunto <span className="text-red-500">*</span></label>
                                <input type="text" required value={emailDraft.subject} onChange={e => setEmailDraft({ ...emailDraft, subject: e.target.value })} placeholder="Ej: Novedades en dconfy" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Titular interno</label>
                                <input type="text" value={emailDraft.title} onChange={e => setEmailDraft({ ...emailDraft, title: e.target.value })} placeholder="Opcional..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensaje <span className="text-red-500">*</span></label>
                                <textarea required value={emailDraft.message} onChange={e => setEmailDraft({ ...emailDraft, message: e.target.value })} placeholder="Cuerpo del mensaje..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none" />
                            </div>
                            <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-800">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Texto del botón</label>
                                    <input type="text" value={emailDraft.buttonText} onChange={e => setEmailDraft({ ...emailDraft, buttonText: e.target.value })} placeholder="Ej: Ir al cuestionario" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">URL del botón</label>
                                    <input type="url" value={emailDraft.buttonUrl} onChange={e => setEmailDraft({ ...emailDraft, buttonUrl: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none" />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-3">¿A quién va dirigido?</label>
                                <div className="flex flex-col gap-2">
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'all' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input type="radio" name="email_aud" value="all" checked={emailDraft.audience === 'all'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'all' })} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-sm font-bold text-white">Todos los Usuarios</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'pros' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input type="radio" name="email_aud" value="pros" checked={emailDraft.audience === 'pros'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'pros' })} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-sm font-bold text-white">Solo Profesionales</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'top' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input type="radio" name="email_aud" value="top" checked={emailDraft.audience === 'top'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'top' })} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-sm font-bold text-white">Top Valorados (4+⭐)</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'vip' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input type="radio" name="email_aud" value="vip" checked={emailDraft.audience === 'vip'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'vip' })} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-sm font-bold text-white">Lista VIP (Acesso anticipado)</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${emailDraft.audience === 'custom' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <input type="radio" name="email_aud" value="custom" checked={emailDraft.audience === 'custom'} onChange={() => setEmailDraft({ ...emailDraft, audience: 'custom' })} className="w-4 h-4 accent-blue-500" />
                                        <span className="text-sm font-bold text-white">Lista de emails (Personalizada)</span>
                                    </label>
                                </div>
                                {emailDraft.audience === 'custom' && (
                                    <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                                        <textarea
                                            value={emailDraft.custom_emails || ''}
                                            onChange={e => setEmailDraft({ ...emailDraft, custom_emails: e.target.value })}
                                            placeholder="ejemplo1@email.com, ejemplo2@email.com..."
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Separa los correos con comas.</p>
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={isSendingEmail} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                                {isSendingEmail ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Masivo</>}
                            </button>
                        </form>
                    </div>

                    <div className="xl:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20">
                        <h3 className="text-lg font-bold text-white mb-6">Historial de Emails Enviados</h3>
                        <div className="space-y-4">
                            {!emailHistory || emailHistory.length === 0 ? (
                                <p className="text-slate-500 py-12 text-center font-medium border border-dashed border-slate-800 rounded-2xl">Aún no has enviado ningún correo masivo.</p>
                            ) : (
                                emailHistory.map((email: any) => (
                                    <div key={email.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-950/50 hover:border-slate-700 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                            <h4 className="text-white font-bold text-lg leading-tight">{email.subject}</h4>
                                            <span className="text-xs font-bold text-slate-500 shrink-0 bg-slate-900 px-2.5 py-1 rounded-lg">
                                                {new Date(email.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{email.message}</p>
                                        <div className="flex flex-wrap items-center gap-3 border-t border-slate-800 pt-3">
                                            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                                                Aud: {email.audience === 'all' ? 'Todos' : email.audience === 'pros' ? 'Solo Profesionales' : email.audience === 'vip' ? 'Lista VIP' : email.audience === 'custom' ? 'Lista Personalizada' : 'Top Profesionales'}
                                            </span>
                                            <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Entregado a {email.sent_count}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // =======================================================================
    // VISTA 2: BANNERS IN-APP (Por Defecto)
    // =======================================================================
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* PESTAÑAS (Integradas directamente) */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl w-fit shadow-lg shadow-black/20">
                <button
                    type="button"
                    onClick={() => setCommTab('banners')}
                    className="px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 bg-slate-800 text-white shadow-sm"
                >
                    <Megaphone className="w-4 h-4" /> Banners In-App
                </button>
                <button
                    type="button"
                    onClick={() => setCommTab('emails')}
                    className="px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-slate-400 hover:text-white hover:bg-slate-800/50"
                >
                    <Mail className="w-4 h-4" /> Enviar Emails Masivos
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-1 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {editingBannerId ? <Edit className="w-5 h-5 text-blue-400" /> : <Megaphone className="w-5 h-5 text-[#FF6600]" />}
                            {editingBannerId ? 'Editando Anuncio' : 'Crear Anuncio'}
                        </h3>
                        {editingBannerId ? (
                            <button type="button" onClick={handleCancelBannerEdit} className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                                Cancelar
                            </button>
                        ) : null}
                    </div>
                    <form onSubmit={handleCreateBanner} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título Corto <span className="text-[#FF6600]">*</span></label>
                            <input type="text" required value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="Ej: ¡Nueva Versión 1.1!" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensaje <span className="text-[#FF6600]">*</span></label>
                            <textarea required value={newBanner.message} onChange={e => setNewBanner({ ...newBanner, message: e.target.value })} placeholder="Explica la novedad..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none h-20 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Color / Tipo</label>
                                <select value={newBanner.type} onChange={e => setNewBanner({ ...newBanner, type: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none appearance-none">
                                    <option value="dark">Negro Corporativo</option>
                                    <option value="promo">Naranja (Promo)</option>
                                    <option value="info">Azul (Info)</option>
                                    <option value="success">Verde (Éxito)</option>
                                    <option value="warning">Amarillo (Alerta)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Texto Botón</label>
                                <input type="text" value={newBanner.button_text} onChange={e => setNewBanner({ ...newBanner, button_text: e.target.value })} placeholder="VER MÁS" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enlace (URL Destino)</label>
                            <input type="url" value={newBanner.link_url} onChange={e => setNewBanner({ ...newBanner, link_url: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none" />
                        </div>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">¿A quién le saldrá el banner?</label>
                            <div className="flex flex-col gap-2">
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'all' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="all" checked={newBanner.audience === 'all'} onChange={() => setNewBanner({ ...newBanner, audience: 'all' })} className="w-4 h-4 accent-[#FF6600]" />
                                    <span className="text-sm font-bold text-white">Todos los Usuarios</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'pros' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="pros" checked={newBanner.audience === 'pros'} onChange={() => setNewBanner({ ...newBanner, audience: 'pros', target_sector: '' })} className="w-4 h-4 accent-[#FF6600]" />
                                    <span className="text-sm font-bold text-white">Solo Profesionales</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'sector' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="sector" checked={newBanner.audience === 'sector'} onChange={() => setNewBanner({ ...newBanner, audience: 'sector' })} className="w-4 h-4 accent-[#FF6600]" />
                                    <span className="text-sm font-bold text-white">Por Sector</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'vip' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="vip" checked={newBanner.audience === 'vip'} onChange={() => setNewBanner({ ...newBanner, audience: 'vip' })} className="w-4 h-4 accent-[#FF6600]" />
                                    <span className="text-sm font-bold text-white">Lista VIP (Acceso anticipado)</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'custom' ? 'border-[#FF6600] bg-[#FF6600]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="custom" checked={newBanner.audience === 'custom'} onChange={() => setNewBanner({ ...newBanner, audience: 'custom' })} className="w-4 h-4 accent-[#FF6600]" />
                                    <span className="text-sm font-bold text-white">Lista de emails (Personalizada)</span>
                                </label>
                            </div>

                            {newBanner.audience === 'sector' ? (
                                <select value={newBanner.target_sector} onChange={e => setNewBanner({ ...newBanner, target_sector: e.target.value })} className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none animate-in slide-in-from-top-2">
                                    <option value="">-- Elige sector --</option>
                                    {officialCategoriesList?.map((spec: string) => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                            ) : null}

                            {newBanner.audience === 'custom' && (
                                <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
                                    <textarea
                                        value={newBanner.custom_emails || ''}
                                        onChange={e => setNewBanner({ ...newBanner, custom_emails: e.target.value })}
                                        placeholder="ejemplo1@email.com, ejemplo2@email.com..."
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FF6600] outline-none text-sm h-24 resize-none"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Separa los correos con comas.</p>
                                </div>
                            )}
                        </div>
                        <button type="submit" disabled={isCreatingBanner} className={`w-full text-white py-3.5 rounded-xl font-bold mt-4 transition-colors disabled:opacity-50 active:scale-95 shadow-lg ${editingBannerId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-[#FF6600] hover:bg-[#e65c00] shadow-[#FF6600]/20'}`}>
                            {isCreatingBanner ? 'Guardando...' : editingBannerId ? 'Guardar Cambios' : 'Crear y Guardar Anuncio'}
                        </button>
                    </form>
                </div>

                <div className="xl:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20">
                    <h3 className="text-lg font-bold text-white mb-6">Banners In-App Creados</h3>
                    <div className="space-y-4">
                        {!announcements || announcements.length === 0 ? (
                            <p className="text-slate-500 py-12 text-center font-medium border border-dashed border-slate-800 rounded-2xl">No hay banners creados aún.</p>
                        ) : (
                            announcements.map((ann: any) => (
                                <div key={ann.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ann.is_active ? 'border-[#FF6600]/50 bg-[#FF6600]/10' : 'border-slate-800 bg-slate-950/50'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className={`w-2.5 h-2.5 rounded-full ${ann.type === 'promo' ? 'bg-[#FF6600]' : ann.type === 'success' ? 'bg-emerald-500' : ann.type === 'warning' ? 'bg-amber-500' : ann.type === 'dark' ? 'bg-slate-500' : 'bg-blue-500'}`}></span>
                                            <span className="font-bold text-white text-lg">{ann.title}</span>
                                            {ann.is_active ? <span className="text-[10px] bg-[#FF6600] text-white px-2 py-0.5 rounded uppercase font-black tracking-wider shadow-sm">Activo en App</span> : null}
                                        </div>
                                        <p className="text-slate-400 text-sm ml-5.5 pl-5 mb-2">{ann.message}</p>
                                        <div className="ml-5 flex gap-2">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                                Aud: {ann.audience === 'all' ? 'Todos' : ann.audience === 'pros' ? 'Profesionales' : ann.audience === 'vip' ? 'Lista VIP' : ann.audience === 'custom' ? 'Lista Personalizada' : `Sector: ${ann.target_sector}`}
                                            </span>
                                            {ann.link_url ? <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Con enlace</span> : null}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 pl-6 border-l border-slate-800/50 shrink-0">
                                        <button onClick={() => handleToggleBanner(ann.id, ann.is_active)} className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${ann.is_active ? 'bg-[#FF6600]' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${ann.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </button>
                                        <div className="flex items-center gap-1 mt-auto">
                                            <button onClick={() => handleEditBannerClick(ann)} className="text-slate-500 hover:text-blue-400 transition-colors p-1.5 bg-slate-800/40 hover:bg-slate-800 rounded-lg" title="Editar banner"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteBanner(ann.id)} className="text-slate-500 hover:text-red-500 transition-colors p-1.5 bg-slate-800/40 hover:bg-slate-800 rounded-lg" title="Borrar banner"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}