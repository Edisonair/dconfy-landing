import React from 'react';
import { Users, Network, Briefcase, Share2, Heart, MessageCircle, Send, TrendingUp, BarChart3, Star, Trophy, AlertCircle } from 'lucide-react';

export function DashboardMetrics({ stats, unifiedSpecialties, selectedProvince, interestsData, topRecommendedPros, recsByUserRange, customSpecialties, customInterests }: any) {

    // 🚀 NUEVO: Calculamos el total de intereses sumando los conteos
    const totalInterests = interestsData?.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0) || 0;

    return (
        <>
            {/* 1. MÉTRICAS GLOBALES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center shrink-0"><Users className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Usuarios</p><p className="text-2xl font-black text-white">{stats.users}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center shrink-0"><Network className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Conexiones</p><p className="text-2xl font-black text-white">{stats.connections}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0"><Briefcase className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Profesionales</p><p className="text-2xl font-black text-white">{stats.pros}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center shrink-0"><Share2 className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">PRO Compartidos</p><p className="text-2xl font-black text-white">{stats.shared}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-[#FF6600]/10 text-[#FF6600] rounded-2xl flex items-center justify-center shrink-0"><Heart className="w-6 h-6 fill-current" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Recomendaciones</p><p className="text-2xl font-black text-white">{stats.recs}</p></div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center shrink-0"><MessageCircle className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Chats Abiertos</p><p className="text-2xl font-black text-white">{stats.chats}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5">
                    <div className="w-12 h-12 bg-teal-500/10 text-teal-400 rounded-2xl flex items-center justify-center shrink-0"><Send className="w-6 h-6" /></div>
                    <div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Mensajes Enviados</p><p className="text-2xl font-black text-white">{stats.messages}</p></div>
                </div>
                <div className="bg-slate-900 p-6 rounded-[1rem] shadow-xl shadow-black/20 flex items-center gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none"><TrendingUp className="w-24 h-24 text-amber-500" /></div>
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><TrendingUp className="w-6 h-6" /></div>
                    <div className="relative z-10"><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Media Chat / Pro</p><p className="text-2xl font-black text-white">{stats.avgChats}</p></div>
                </div>
            </div>

            {/* 2. GRÁFICO UNIFICADO */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-800 pb-6 gap-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-blue-400" /> Profesiones Activas vs Recomendaciones {selectedProvince !== 'Global' && <span className="text-[#FF6600] ml-1">en {selectedProvince}</span>}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-sm bg-slate-500"></div><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profesionales Activos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 rounded-sm border border-[#FF6600]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,102,0,0.5) 2px, rgba(255,102,0,0.5) 4px)' }}></div><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recomendaciones</span>
                        </div>
                    </div>
                </div>

                {unifiedSpecialties.length === 0 ? (
                    <p className="text-sm text-slate-500 font-medium">No hay datos suficientes para {selectedProvince}.</p>
                ) : (
                    <>
                        <div className="h-[350px] w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-2 overflow-x-auto custom-scrollbar pt-32 px-2">
                            {unifiedSpecialties.map((item: any, idx: number) => (
                                <div key={idx} className="relative group flex-1 min-w-[50px] max-w-[80px] flex justify-center items-end h-full bg-slate-800/10 rounded-t-xl hover:bg-slate-800/30 transition-colors gap-1 px-1">
                                    <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                        <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[150px]">
                                            <span className="text-slate-200 border-b border-slate-700 pb-1.5 mb-1 text-center text-sm">{item.name}</span>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div><span className="text-slate-400 font-medium">Profesionales</span></div>
                                                <span className="text-white text-sm">{item.proCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#FF6600]"></div><span className="text-slate-400 font-medium">Recomendaciones</span></div>
                                                <span className="text-[#FF6600] text-sm">{item.recsCount}</span>
                                            </div>
                                        </div>
                                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                    </div>
                                    <div className={`w-1/2 rounded-t-md transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.proPercentage, 2)}%` }}></div>
                                    <div className="w-1/2 rounded-t-md transition-all duration-1000 ease-out border border-[#FF6600]" style={{ height: `${Math.max(item.recsPercentage, 2)}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,102,0,0.5) 4px, rgba(255,102,0,0.5) 8px)' }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 px-2">
                            {unifiedSpecialties.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                                    <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1 font-medium">({item.proCount}/{item.recsCount})</span></span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 3. GRÁFICO INTERESES */}
            <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-slate-800 pb-6 gap-4">
                    {/* 🚀 NUEVO: Título con el total de intereses */}
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                        Intereses
                        <span className="text-slate-400 font-medium ml-1">({totalInterests})</span>
                        {selectedProvince !== 'Global' && <span className="text-[#FF6600] ml-1 text-base">en {selectedProvince}</span>}
                    </h3>
                </div>
                {interestsData.length === 0 ? (
                    <p className="text-sm text-slate-500 font-medium">No hay datos suficientes para {selectedProvince}.</p>
                ) : (
                    <>
                        <div className="h-[300px] w-full flex items-end gap-2 md:gap-4 border-b-2 border-slate-800 pb-2 relative mt-2 overflow-x-auto custom-scrollbar pt-28 px-2">
                            {interestsData.map((item: any, idx: number) => (
                                <div key={idx} className="relative group flex-1 min-w-[40px] max-w-[80px] flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                    <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                        <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                            <span className="text-sm">{item.name}:</span> <span className="text-[#FF6600] text-sm">{item.count}</span>
                                            {item.isCustom && <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded ml-2 uppercase tracking-wider border border-slate-600">Manual</span>}
                                        </div>
                                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                    </div>
                                    <div className={`w-full max-w-[50px] rounded-t-xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.percentage, 5)}%`, ...(item.isCustom ? { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.25), rgba(0,0,0,0.25) 4px, transparent 4px, transparent 8px)' } : {}) }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 px-2">
                            {interestsData.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-sm ${item.color} shadow-sm`} style={item.isCustom ? { backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)' } : {}}></div>
                                    <span className="text-xs font-bold text-slate-300">{item.name} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 4. TOP PROFESIONALES Y RANGO USUARIOS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
                <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Trophy className="w-6 h-6 text-red-400" /> Top Recomendados por Profesión {selectedProvince !== 'Global' && <span className="text-[#FF6600] text-base">({selectedProvince})</span>}
                    </h3>
                    {topRecommendedPros.length === 0 ? (
                        <p className="text-sm text-slate-500 font-medium py-4">Aún no hay profesionales recomendados aquí.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {topRecommendedPros.map((pro: any, idx: number) => (
                                <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800 transition-colors shadow-sm">
                                    <img src={pro.professional_logo_url || pro.avatar || '/default-avatar.png'} className="w-12 h-12 rounded-full object-cover bg-slate-900 border border-slate-700 shrink-0" alt={pro.name} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-black text-[15px] leading-tight truncate mb-0.5">{pro.specialty}</p>
                                        <p className="text-slate-400 text-xs font-medium truncate">{pro.name}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 px-2.5 py-1.5 rounded-lg border border-red-500/20 shrink-0">
                                        <Heart className="w-3.5 h-3.5 fill-current" /><span className="text-xs font-black">{pro.recs}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 p-6 md:p-8 rounded-[1rem] shadow-xl shadow-black/20 w-full">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Users className="w-6 h-6 text-emerald-400" /> Rango de Recomendaciones dadas por Usuario
                    </h3>

                    {recsByUserRange.reduce((acc: number, curr: any) => acc + curr.count, 0) === 0 ? (
                        <p className="text-sm text-slate-500 font-medium py-4">No hay datos suficientes para {selectedProvince}.</p>
                    ) : (
                        <>
                            <div className="h-[250px] w-full flex items-end gap-4 md:gap-8 border-b-2 border-slate-800 pb-2 relative mt-10 px-4">
                                {recsByUserRange.map((item: any, idx: number) => (
                                    <div key={idx} className="relative group flex-1 flex flex-col justify-end items-center h-full bg-slate-800/20 rounded-t-xl hover:bg-slate-800/40 transition-colors">
                                        <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center z-50 pointer-events-none w-max">
                                            <div className="bg-slate-800 border border-slate-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                                                <span>Recomiendan a {item.range}:</span> <span className="text-[#FF6600]">{item.count} usuarios</span>
                                            </div>
                                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-slate-800 -mt-[1px]"></div>
                                        </div>
                                        <div className={`w-full max-w-[60px] rounded-t-xl transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.2)] ${item.color}`} style={{ height: `${Math.max(item.percentage, 5)}%` }}></div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 px-2">
                                {recsByUserRange.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-sm ${item.color} shadow-sm`}></div>
                                        <span className="text-xs font-bold text-slate-300">{item.range} <span className="text-slate-500 ml-1">({item.count})</span></span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 5. RADAR CUSTOM DE PROFESIONES */}
            <div className="bg-[#FF6600]/5 p-6 md:p-8 rounded-[1rem] border border-orange-500/20 shadow-xl shadow-black/10 w-full mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-[#FF6600]" /> Radar de Nuevas Profesiones
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Especialidades escritas a mano que están pendientes de añadir oficialmente.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {customSpecialties.length === 0 ? (
                        <p className="text-sm text-slate-500 w-full text-center py-6 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 font-bold sm:col-span-2 lg:col-span-3 xl:col-span-4">¡Todo al día!</p>
                    ) : (
                        customSpecialties.map((spec: any, idx: number) => (
                            <div key={idx} className="flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-[#FF6600]/50 transition-colors shadow-sm">
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                                    <span className="font-bold text-slate-200 text-sm">{spec.name}</span>
                                    <span className="bg-[#FF6600]/10 text-[#FF6600] text-xs font-black px-2.5 py-1 rounded-lg ml-3 shrink-0">{spec.count}</span>
                                </div>
                                <div className="px-4 py-3 bg-slate-900/30 flex flex-col gap-2 border-t border-slate-800/50 max-h-32 overflow-y-auto custom-scrollbar">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Usuarios:</span>
                                    {spec.users.map((u: any) => (
                                        <div key={u.id} className="text-xs text-slate-400 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-slate-700 rounded-full shrink-0" /><span className="truncate">{u.name}</span></div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 6. RADAR CUSTOM DE INTERESES */}
            <div className="bg-yellow-500/5 p-6 md:p-8 rounded-[1rem] border border-yellow-500/20 shadow-xl shadow-black/10 w-full mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500" /> Radar de Nuevos Intereses
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Intereses escritos a mano que están pendientes de añadir oficialmente.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {!customInterests || customInterests.length === 0 ? (
                        <p className="text-sm text-slate-500 w-full text-center py-6 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700 font-bold sm:col-span-2 lg:col-span-3 xl:col-span-4">No hay intereses manuales pendientes.</p>
                    ) : (
                        customInterests.map((interest: any, idx: number) => (
                            <div key={idx} className="flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-yellow-500/50 transition-colors shadow-sm">
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50">
                                    <span className="font-bold text-slate-200 text-sm">{interest.name}</span>
                                    <span className="bg-yellow-500/10 text-yellow-500 text-xs font-black px-2.5 py-1 rounded-lg ml-3 shrink-0">{interest.count}</span>
                                </div>
                                <div className="px-4 py-3 bg-slate-900/30 flex flex-col gap-2 border-t border-slate-800/50 max-h-32 overflow-y-auto custom-scrollbar">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Usuarios:</span>
                                    {interest.users.map((u: any, i: number) => (
                                        <div key={`${u.id}-${i}`} className="text-xs text-slate-400 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-slate-700 rounded-full shrink-0" />
                                            <span className="truncate">{u.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}