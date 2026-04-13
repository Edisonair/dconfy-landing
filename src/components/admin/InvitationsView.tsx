import React from 'react';
import { Mail, Plus, CheckCircle2, Clock, Trash2, User, Briefcase, MapPin } from 'lucide-react';

export function InvitationsView({
    handleInvite,
    newEmail,
    setNewEmail,
    newName,
    setNewName,
    newProfession,
    setNewProfession,
    newZipCode,       // 🚀 NUEVO ESTADO (Añádelo en el componente padre)
    setNewZipCode,    // 🚀 NUEVO ESTADO (Añádelo en el componente padre)
    isInviting,
    invitations,
    handleDeleteInvite
}: any) {
    return (
        <div className="bg-slate-900 rounded-[1rem] border border-slate-800 shadow-xl shadow-black/20 overflow-hidden">

            {/* 🚀 CABECERA Y FORMULARIO APILADOS */}
            <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col gap-6 bg-slate-900/50">
                <div>
                    <h2 className="text-2xl font-black text-white">Invitaciones VIP</h2>
                    <p className="text-slate-400 font-medium mt-2">Gestiona los accesos anticipados y añade profesionales manualmente.</p>
                </div>

                <form onSubmit={handleInvite} className="flex flex-col md:flex-row flex-wrap gap-3 w-full">
                    <div className="relative flex-1 min-w-[150px]">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            required
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Nombre"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-[#FF6600] outline-none text-sm"
                        />
                    </div>

                    <div className="relative flex-1 min-w-[150px]">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={newProfession}
                            onChange={(e) => setNewProfession(e.target.value)}
                            placeholder="Profesión"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-[#FF6600] outline-none text-sm"
                        />
                    </div>

                    {/* 🚀 NUEVO INPUT DE CÓDIGO POSTAL */}
                    <div className="relative flex-1 md:max-w-[140px]">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            maxLength={5}
                            value={newZipCode}
                            onChange={(e) => {
                                // Permite solo escribir números
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setNewZipCode(val);
                            }}
                            placeholder="C. Postal"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-[#FF6600] outline-none text-sm"
                        />
                    </div>

                    <div className="relative flex-1 min-w-[200px]">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            required
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="ejemplo@email.com"
                            className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-[#FF6600] outline-none text-sm"
                        />
                    </div>

                    <button type="submit" disabled={isInviting} className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2 justify-center w-full md:w-auto shrink-0">
                        {isInviting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Plus className="w-5 h-5" /> Invitar</>}
                    </button>
                </form>
            </div>

            {/* 🚀 TABLA CON LA NUEVA COLUMNA DE UBICACIÓN */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-800 whitespace-nowrap">
                            <th className="px-8 py-5">Nombre</th>
                            <th className="px-8 py-5">Profesión</th>
                            <th className="px-8 py-5">Ubicación</th>
                            <th className="px-8 py-5">Email Invitado</th>
                            <th className="px-8 py-5">Fecha</th>
                            <th className="px-8 py-5">Estado</th>
                            <th className="px-8 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-sm font-medium">
                        {invitations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-8 py-16 text-center text-slate-500 font-medium">
                                    No hay invitaciones registradas aún.
                                </td>
                            </tr>
                        ) : invitations.map((inv: any) => (
                            <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors whitespace-nowrap">
                                <td className="px-8 py-5 text-white font-bold">{inv.name || 'Sin nombre'}</td>
                                <td className="px-8 py-5 text-slate-300">{inv.profesion || '-'}</td>

                                {/* 🚀 CELDA DE UBICACIÓN EN DOS LÍNEAS */}
                                <td className="px-8 py-5">
                                    {inv.city ? (
                                        <div className="flex flex-col">
                                            <span className="text-slate-200">{inv.city}</span>
                                            <span className="text-xs text-slate-500">{inv.province || inv.zip_code}</span>
                                        </div>
                                    ) : inv.zip_code ? (
                                        <span className="text-slate-400">CP: {inv.zip_code}</span>
                                    ) : (
                                        <span className="text-slate-600">-</span>
                                    )}
                                </td>

                                <td className="px-8 py-5 text-slate-400">{inv.email}</td>
                                <td className="px-8 py-5 text-slate-400">{new Date(inv.created_at).toLocaleDateString('es-ES')}</td>
                                <td className="px-8 py-5">
                                    {inv.is_used ? (
                                        <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4" /> Registrado
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <Clock className="w-4 h-4" /> Pendiente
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => handleDeleteInvite(inv.id)}
                                        disabled={inv.is_used}
                                        className={`p-2 rounded-xl transition-colors ${inv.is_used ? 'text-slate-700 cursor-not-allowed' : 'text-slate-500 hover:text-red-400'}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}