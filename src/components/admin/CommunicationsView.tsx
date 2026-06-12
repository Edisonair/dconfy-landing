import React, { useState, useEffect } from 'react';
import { Megaphone, Mail, Trash2, CheckCircle2, Send, Edit, PlusCircle, History } from 'lucide-react';

export function CommunicationsView({
    commTab, setCommTab, handleCreateBanner, newBanner, setNewBanner, officialCategoriesList,
    isCreatingBanner, announcements, handleToggleBanner, handleDeleteBanner,
    handleSendBroadcast, emailDraft, setEmailDraft, isSendingEmail, emailHistory,
    editingBannerId, handleEditBannerClick, handleCancelBannerEdit
}: any) {

    const [emailSubTab, setEmailSubTab] = useState<'new' | 'history'>('new');
    const [customTemplates, setCustomTemplates] = useState<{ id: string, name: string, subject: string, title: string, message: string, buttonText: string, buttonUrl: string, audience: string }[]>([]);

    const getPreviewText = (text: string) => {
        if (!text) return '';
        return text
            .replace(/\{\{nombre\}\}/gi, 'Juan')
            .replace(/\{\{name\}\}/gi, 'Juan')
            .replace(/\{nombre\}/gi, 'Juan')
            .replace(/\{name\}/gi, 'Juan');
    };

    useEffect(() => {
        try {
            const saved = localStorage.getItem('dconfy_email_templates');
            if (saved) {
                setCustomTemplates(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Error al cargar plantillas locales:', e);
        }
    }, []);

    const handleSaveTemplate = () => {
        const name = prompt('Introduce un nombre para guardar esta plantilla:');
        if (!name) return;

        const newTemplate = {
            id: 'template_' + Date.now(),
            name: name,
            subject: emailDraft.subject || '',
            title: emailDraft.title || '',
            message: emailDraft.message || '',
            buttonText: emailDraft.buttonText || '',
            buttonUrl: emailDraft.buttonUrl || '',
            audience: emailDraft.audience || 'all'
        };

        const updated = [...customTemplates, newTemplate];
        setCustomTemplates(updated);
        localStorage.setItem('dconfy_email_templates', JSON.stringify(updated));
        alert(`Plantilla "${name}" guardada con éxito.`);
    };

    const handleDeleteTemplate = (id: string, name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`¿Estás seguro de que quieres eliminar la plantilla "${name}"?`)) return;

        const updated = customTemplates.filter(t => t.id !== id);
        setCustomTemplates(updated);
        localStorage.setItem('dconfy_email_templates', JSON.stringify(updated));
    };

    // =======================================================================
    // VISTA 1: EMAILS MASIVOS
    // =======================================================================
    if (commTab === 'emails') {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                {/* PESTAÑAS INTERNAS DE EMAILS */}
                <div className="flex bg-slate-900 p-1.5 rounded-2xl w-fit shadow-lg shadow-black/20">
                    <button
                        type="button"
                        onClick={() => setEmailSubTab('new')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${emailSubTab === 'new' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <PlusCircle className="w-4 h-4" /> Nuevo
                    </button>
                    <button
                        type="button"
                        onClick={() => setEmailSubTab('history')}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${emailSubTab === 'history' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <History className="w-4 h-4" /> Historial
                    </button>
                </div>

                {emailSubTab === 'new' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* COLUMNA 1: FORMULARIO */}
                        <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-blue-400" /> Crear Correo Masivo
                                </h3>
                            </div>

                            {/* Selector de Plantillas */}
                            <div className="mb-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                                    Plantillas de Email
                                </label>
                                
                                <div className="flex gap-2">
                                    <select
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === 'vip_welcome') {
                                                setEmailDraft({
                                                    subject: '¡Ya puedes acceder a dconfy, {{nombre}}! 🚀 Crea tu perfil profesional VIP',
                                                    title: '¡Te damos la bienvenida a la lista VIP, {{nombre}}! 👋',
                                                    message: `¡Hola, {{nombre}}! 👋

Estamos encantados de darte la bienvenida a nuestra lista de profesionales VIP. Ya puedes acceder a dconfy para empezar a digitalizar el boca a boca y conseguir que tu negocio crezca gracias a las recomendaciones de tus clientes.

Para activar tu perfil profesional gratis en menos de 2 minutos, sigue estos sencillos pasos:

<strong>1️⃣ Descarga la app</strong>
Instala dconfy en tu dispositivo iOS o Android de forma rápida.

<strong>2️⃣ Cuenta Personal</strong>
Crea tu cuenta personal para poder ver y hacer recomendaciones de tus profesionales de confianza.

<strong>3️⃣ Perfil Profesional</strong>
Una vez dentro, la app te preguntará si <strong>"¿Ofreces algún servicio?"</strong>. Crea tu perfil profesional de manera gratuita.

¡Y listo! Ya podrás compartir tu enlace público para que tus clientes te recomienden y empezar a destacar en tu zona.`,
                                                    audience: 'vip',
                                                    buttonText: 'Descargar dconfy',
                                                    buttonUrl: 'https://dconfy.app'
                                                });
                                            } else if (val === 'app_news') {
                                                setEmailDraft({
                                                    subject: '📢 ¡Nuevas mejoras y actualización en dconfy!',
                                                    title: '¡Tenemos novedades interesantes para ti! 🚀',
                                                    message: `¡Hola!

Queremos contarte las últimas novedades que hemos incorporado a dconfy para mejorar tu experiencia:

🌟 <strong>Nueva búsqueda avanzada:</strong> Encuentra a tus profesionales de confianza más rápido.
💬 <strong>Mejoras en el chat:</strong> Comunicación más rápida e intuitiva con tus clientes.
⚡ <strong>Perfil más rápido:</strong> Hemos optimizado los tiempos de carga de la aplicación.

Te invitamos a abrir la aplicación para probar estas mejoras hoy mismo.`,
                                                    audience: 'all',
                                                    buttonText: 'Ver novedades',
                                                    buttonUrl: 'https://dconfy.app'
                                                });
                                            } else {
                                                const found = customTemplates.find(t => t.id === val);
                                                if (found) {
                                                    setEmailDraft({
                                                        subject: found.subject,
                                                        title: found.title,
                                                        message: found.message,
                                                        buttonText: found.buttonText,
                                                        buttonUrl: found.buttonUrl,
                                                        audience: found.audience
                                                    });
                                                }
                                            }
                                            e.target.value = ""; // Reset value so they can select it again
                                        }}
                                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                    >
                                        <option value="">📋 Cargar una plantilla...</option>
                                        <optgroup label="Plantillas de Sistema" className="text-slate-500 font-bold bg-slate-900">
                                            <option value="vip_welcome">✨ Bienvenida VIP</option>
                                            <option value="app_news">📢 Novedades de la App</option>
                                        </optgroup>
                                        {customTemplates.length > 0 && (
                                            <optgroup label="Tus Plantillas Guardadas" className="text-slate-500 font-bold bg-slate-900">
                                                {customTemplates.map(t => (
                                                    <option key={t.id} value={t.id}>👤 {t.name}</option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>
                                    
                                    <button
                                        type="button"
                                        onClick={handleSaveTemplate}
                                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
                                        title="Guardar borrador actual como plantilla"
                                    >
                                        Guardar Borrador
                                    </button>
                                </div>

                                {/* Mostrar plantillas guardadas para poder borrarlas */}
                                {customTemplates.length > 0 && (
                                    <div className="pt-2 border-t border-slate-800/80">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Gestionar tus plantillas</span>
                                        <div className="flex flex-wrap gap-2">
                                            {customTemplates.map(t => (
                                                <div key={t.id} className="group flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-medium text-slate-300 transition-colors">
                                                    <span className="cursor-pointer" onClick={() => setEmailDraft({
                                                        subject: t.subject,
                                                        title: t.title,
                                                        message: t.message,
                                                        buttonText: t.buttonText,
                                                        buttonUrl: t.buttonUrl,
                                                        audience: t.audience
                                                    })}>
                                                        {t.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteTemplate(t.id, t.name, e)}
                                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                                        title="Eliminar plantilla"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                    <textarea required value={emailDraft.message} onChange={e => setEmailDraft({ ...emailDraft, message: e.target.value })} placeholder="Cuerpo del mensaje (soporta HTML)..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-48" />
                                    <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                                        💡 Puedes usar etiquetas HTML como <code>&lt;strong&gt;</code> para negrita, <code>&lt;br /&gt;</code>, o enlaces <code>&lt;a href="..."&gt;</code>. Los saltos de línea se convierten automáticamente en saltos visibles.
                                    </p>
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
                                            <span className="text-sm font-bold text-white">Lista VIP (Acceso anticipado)</span>
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

                        {/* COLUMNA 2: VISTA PREVIA EN VIVO */}
                        <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 flex flex-col h-full min-h-[500px]">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Vista Previa en Vivo
                            </h3>
                            
                            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col flex-grow select-none">
                                {/* Email Client Header Bar */}
                                <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bandeja de Entrada</span>
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                                        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                                        <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                                    </div>
                                </div>
                                
                                {/* Email Metadata */}
                                <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 text-xs space-y-1.5">
                                    <div className="text-slate-400"><span className="font-bold text-slate-500">De:</span> dconfy &lt;hola@dconfy.app&gt;</div>
                                    <div className="text-slate-400">
                                        <span className="font-bold text-slate-500">Para:</span>{' '}
                                        <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide">
                                            {emailDraft.audience === 'all' ? 'Todos los Usuarios' : 
                                             emailDraft.audience === 'pros' ? 'Solo Profesionales' : 
                                             emailDraft.audience === 'vip' ? 'Lista VIP' : 
                                             emailDraft.audience === 'custom' ? 'Lista Personalizada' : 'Top Profesionales'}
                                        </span>
                                    </div>
                                    <div className="text-slate-400"><span className="font-bold text-slate-500">Asunto:</span> <span className="text-slate-200 font-semibold">{emailDraft.subject ? getPreviewText(emailDraft.subject) : '(Sin asunto)'}</span></div>
                                </div>
                                
                                {/* Email Body Canvas */}
                                <div className="flex-grow bg-[#FFF9F0] p-4 overflow-y-auto max-h-[550px] custom-scrollbar text-left">
                                    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm max-w-md mx-auto">
                                        {/* Logo */}
                                        <div className="text-center pb-4 border-b border-slate-100 mb-6">
                                            <img src="https://dconfy.app/dconfy_logo_hibrid.png" alt="dconfy logo" className="h-7 mx-auto block" />
                                        </div>
                                        
                                        {/* Title / Headline */}
                                        {emailDraft.title && (
                                            <h2 className="text-slate-900 text-lg font-bold tracking-tight mb-4 leading-snug">{getPreviewText(emailDraft.title)}</h2>
                                        )}
                                        
                                        {/* Message Body */}
                                        <div 
                                            className="text-slate-600 text-sm leading-relaxed"
                                            dangerouslySetInnerHTML={{ 
                                                __html: emailDraft.message 
                                                    ? getPreviewText(emailDraft.message).replace(/\n/g, '<br />') 
                                                    : '<span class="text-slate-400 italic">Escribe un mensaje en el editor para ver el resultado aquí...</span>' 
                                            }}
                                        />
                                        
                                        {/* CTA Button */}
                                        {emailDraft.buttonText && emailDraft.buttonUrl && (
                                            <div className="mt-6 text-center">
                                                <a 
                                                    href={emailDraft.buttonUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="bg-[#F97316] text-white text-xs font-bold px-6 py-3 rounded-full inline-block shadow-md shadow-orange-500/10 cursor-pointer pointer-events-none"
                                                >
                                                    {emailDraft.buttonText}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="text-center py-6 text-slate-500 leading-normal">
                                        <p className="text-[10px] margin-0 mb-1">Has recibido este correo porque formas parte de la comunidad de dconfy.</p>
                                        <p className="text-[10px] margin-0">© {new Date().getFullYear()} dconfy. Todos los derechos reservados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* HISTORIAL COMPLETO DE EMAILS */
                    <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 w-full animate-in fade-in duration-200">
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
                                        <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed whitespace-pre-line">{email.message}</p>
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
                )}
            </div>
        );
    }

    // =======================================================================
    // VISTA 2: BANNERS IN-APP
    // =======================================================================
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Formulario de Anuncio */}
                <div className="xl:col-span-1 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 h-fit shadow-xl shadow-black/20">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {editingBannerId ? <Edit className="w-5 h-5 text-blue-400" /> : <Megaphone className="w-5 h-5 text-[#FE5518]" />}
                            {editingBannerId ? 'Editando Anuncio' : 'Crear Anuncio In-App'}
                        </h3>
                        {editingBannerId ? (
                            <button type="button" onClick={handleCancelBannerEdit} className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
                                Cancelar
                            </button>
                        ) : null}
                    </div>
                    <form onSubmit={handleCreateBanner} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Título Corto <span className="text-[#FE5518]">*</span></label>
                            <input type="text" required value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} placeholder="Ej: ¡Nueva Versión 1.1!" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FE5518] outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mensaje <span className="text-[#FE5518]">*</span></label>
                            <textarea required value={newBanner.message} onChange={e => setNewBanner({ ...newBanner, message: e.target.value })} placeholder="Explica la novedad..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FE5518] outline-none h-20 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Color / Tipo</label>
                                <select value={newBanner.type} onChange={e => setNewBanner({ ...newBanner, type: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FE5518] outline-none appearance-none">
                                    <option value="dark">Negro Corporativo</option>
                                    <option value="promo">Naranja (Promo)</option>
                                    <option value="info">Azul (Info)</option>
                                    <option value="success">Verde (Éxito)</option>
                                    <option value="warning">Amarillo (Alerta)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Texto Botón</label>
                                <input type="text" value={newBanner.button_text} onChange={e => setNewBanner({ ...newBanner, button_text: e.target.value })} placeholder="VER MÁS" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FE5518] outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Enlace (URL Destino)</label>
                            <input type="url" value={newBanner.link_url} onChange={e => setNewBanner({ ...newBanner, link_url: e.target.value })} placeholder="https://..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-[#FE5518] outline-none" />
                        </div>
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mt-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-3">¿A quién le saldrá el banner?</label>
                            <div className="flex flex-col gap-2">
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'all' ? 'border-[#FE5518] bg-[#FE5518]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="all" checked={newBanner.audience === 'all'} onChange={() => setNewBanner({ ...newBanner, audience: 'all' })} className="w-4 h-4 accent-[#FE5518]" />
                                    <span className="text-sm font-bold text-white">Todos los Usuarios</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'pros' ? 'border-[#FE5518] bg-[#FE5518]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="pros" checked={newBanner.audience === 'pros'} onChange={() => setNewBanner({ ...newBanner, audience: 'pros', target_sector: '' })} className="w-4 h-4 accent-[#FE5518]" />
                                    <span className="text-sm font-bold text-white">Solo Profesionales</span>
                                </label>
                                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newBanner.audience === 'sector' ? 'border-[#FE5518] bg-[#FE5518]/10' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <input type="radio" name="banner_aud" value="sector" checked={newBanner.audience === 'sector'} onChange={() => setNewBanner({ ...newBanner, audience: 'sector' })} className="w-4 h-4 accent-[#FE5518]" />
                                    <span className="text-sm font-bold text-white">Por Sector</span>
                                </label>
                            </div>

                            {newBanner.audience === 'sector' ? (
                                <select value={newBanner.target_sector} onChange={e => setNewBanner({ ...newBanner, target_sector: e.target.value })} className="w-full mt-3 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none animate-in slide-in-from-top-2">
                                    <option value="">-- Elige sector --</option>
                                    {officialCategoriesList?.map((spec: string) => <option key={spec} value={spec}>{spec}</option>)}
                                </select>
                            ) : null}
                        </div>
                        <button type="submit" disabled={isCreatingBanner} className={`w-full text-white py-3.5 rounded-xl font-bold mt-4 transition-colors disabled:opacity-50 active:scale-95 shadow-lg ${editingBannerId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-[#FE5518] hover:bg-[#E44911] shadow-[#FE5518]/20'}`}>
                            {isCreatingBanner ? 'Guardando...' : editingBannerId ? 'Guardar Cambios' : 'Crear y Guardar Anuncio'}
                        </button>
                    </form>
                </div>

                {/* Lista de Banners */}
                <div className="xl:col-span-2 bg-slate-900 p-6 md:p-8 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 w-full animate-in fade-in duration-200">
                    <h3 className="text-lg font-bold text-white mb-6">Banners In-App Creados</h3>
                    <div className="space-y-4">
                        {!announcements || announcements.length === 0 ? (
                            <p className="text-slate-500 py-12 text-center font-medium border border-dashed border-slate-800 rounded-2xl">No hay banners creados aún.</p>
                        ) : (
                            announcements.map((ann: any) => (
                                <div key={ann.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ann.is_active ? 'border-[#FE5518]/50 bg-[#FE5518]/10' : 'border-slate-800 bg-slate-950/50'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className={`w-2.5 h-2.5 rounded-full ${ann.type === 'promo' ? 'bg-[#FE5518]' : ann.type === 'success' ? 'bg-emerald-500' : ann.type === 'warning' ? 'bg-amber-500' : ann.type === 'dark' ? 'bg-slate-500' : 'bg-blue-500'}`}></span>
                                            <span className="font-bold text-white text-lg">{ann.title}</span>
                                            {ann.is_active ? <span className="text-[10px] bg-[#FE5518] text-white px-2 py-0.5 rounded uppercase font-black tracking-wider shadow-sm">Activo en App</span> : null}
                                        </div>
                                        <p className="text-slate-400 text-sm ml-5.5 pl-5 mb-2">{ann.message}</p>
                                        <div className="ml-5 flex gap-2">
                                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                                Aud: {ann.audience === 'all' ? 'Todos' : ann.audience === 'pros' ? 'Profesionales' : ann.audience === 'sector' ? `Sector: ${ann.target_sector}` : ann.audience}
                                            </span>
                                            {ann.link_url ? <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">Con enlace</span> : null}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 pl-6 border-l border-slate-800/50 shrink-0">
                                        <button onClick={() => handleToggleBanner(ann.id, ann.is_active)} className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${ann.is_active ? 'bg-[#FE5518]' : 'bg-slate-700'}`}>
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