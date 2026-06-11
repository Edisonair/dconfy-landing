"use client";

import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../BusinessContext';
import { supabase } from '@/utils/supabaseClient';
import { 
  Users, 
  Search, 
  UserPlus, 
  UserMinus, 
  Shield, 
  MapPin, 
  Mail, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  User
} from 'lucide-react';

interface Employee {
  id: string;
  full_name: string;
  avatar_url: string | null;
  specialty: string | null;
  email: string | null;
  is_business_admin: boolean;
  show_location: boolean;
  managed_by_business: boolean;
  business_id: string | null;
}

export default function BusinessTeamPage() {
  const { businessId } = useBusiness();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  
  // Loading & feedback states
  const [loadingList, setLoadingList] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null); // holds profile.id currently mutating
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch employees currently linked to this business
  const fetchEmployees = async () => {
    if (!businessId) return;
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, specialty, email, is_business_admin, show_location, managed_by_business, business_id')
        .eq('business_id', businessId)
        .order('full_name');

      if (error) throw error;
      setEmployees((data as Employee[]) || []);
    } catch (err: any) {
      console.error('Error fetching team:', err);
      setErrorMsg('Error al cargar la lista del equipo.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [businessId]);

  // Handle toggle triggers (is_business_admin, show_location)
  const handleToggle = async (employeeId: string, field: 'is_business_admin' | 'show_location', currentValue: boolean) => {
    setActionInProgress(employeeId);
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      const newValue = !currentValue;
      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update({ [field]: newValue })
        .eq('id', employeeId)
        .select();

      if (error) throw error;
      if (!updatedData || updatedData.length === 0) {
        throw new Error('No tienes permisos (RLS) para actualizar este profesional.');
      }

      // Update local state directly
      setEmployees(prev => prev.map(emp => {
        if (emp.id === employeeId) {
          return { ...emp, [field]: newValue };
        }
        return emp;
      }));

      setSuccessMsg('Permisos actualizados correctamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Error updating employee profile:', err);
      setErrorMsg(err.message || 'Error al actualizar el perfil.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Search existing professionals to link
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingSearch(true);
    setErrorMsg(null);
    setSearchResults([]);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, specialty, email, is_business_admin, show_location, managed_by_business, business_id')
        .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      // Filter out users who are already part of this business
      const filteredResults = ((data as Employee[]) || []).filter(
        item => item.business_id !== businessId
      );
      
      setSearchResults(filteredResults);
      if (filteredResults.length === 0) {
        setSuccessMsg('No se encontraron profesionales disponibles.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err: any) {
      console.error('Error searching professionals:', err);
      setErrorMsg('Error al buscar profesionales.');
    } finally {
      setLoadingSearch(false);
    }
  };

  // Link professional to this business
  const handleLink = async (profileId: string, memberFullName: string) => {
    if (!businessId) return;
    setActionInProgress(profileId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Obtener la ubicación actual desde la tabla business_profiles del negocio
      const { data: businessData, error: businessError } = await supabase
        .from('business_profiles')
        .select('city, zip_code')
        .eq('id', businessId)
        .single();

      if (businessError) {
        console.error("Error al obtener la ubicación del negocio de business_profiles:", businessError);
      }

      // 2. Obtener el perfil actual del miembro a vincular
      const { data: memberProfile, error: memberError } = await supabase
        .from('profiles')
        .select('is_professional, professional_name, slug')
        .eq('id', profileId)
        .single();

      if (memberError) throw memberError;

      // 3. Determinar si ya es profesional activo
      const isAlreadyProfessional = memberProfile?.is_professional && memberProfile?.professional_name;

      // 4. Preparar payload de actualización
      const updatePayload: any = {
        business_id: businessId,
        managed_by_business: true,
        is_professional: true,
        subscription_status: 'active',
        // Heredamos la localización desde business_profiles a la tabla profiles del miembro
        location: businessData?.city || null,
        zip_code: businessData?.zip_code || null
      };

      // Si NO es un profesional activo, le asignamos el nombre profesional para que el trigger de BD genere el slug
      if (!isAlreadyProfessional) {
        updatePayload.professional_name = memberFullName;
        // Dejamos el slug en null para que el trigger trigger_update_slug lo autogenere de forma segura
        updatePayload.slug = null;
      }

      const { data: linkedData, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', profileId)
        .select();

      if (error) throw error;
      if (!linkedData || linkedData.length === 0) {
        throw new Error('No tienes permisos (RLS) para vincular este profesional.');
      }

      setSuccessMsg('Profesional vinculado al equipo exitosamente.');
      setSearchQuery('');
      setSearchResults([]);
      await fetchEmployees();
    } catch (err: any) {
      console.error('Error linking professional:', err);
      setErrorMsg(err.message || 'Error al vincular profesional.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Unlink professional (Bonus, makes B2B app fully functional!)
  const handleUnlink = async (profileId: string) => {
    if (!confirm('¿Seguro que quieres desvincular a este profesional de la empresa?')) return;
    setActionInProgress(profileId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { data: unlinkedData, error } = await supabase
        .from('profiles')
        .update({
          business_id: null,
          managed_by_business: false,
          is_business_admin: false,
          subscription_status: 'expired'
        })
        .eq('id', profileId)
        .select();

      if (error) throw error;
      if (!unlinkedData || unlinkedData.length === 0) {
        throw new Error('No tienes permisos (RLS) para desvincular este profesional.');
      }

      setSuccessMsg('Profesional desvinculado del equipo.');
      await fetchEmployees();
    } catch (err: any) {
      console.error('Error unlinking professional:', err);
      setErrorMsg(err.message || 'Error al desvincular profesional.');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Notifications (Floating at top-right of the screen) */}
      {(successMsg || errorMsg) && (
        <div className="fixed top-24 right-4 md:right-8 z-50 max-w-md w-[calc(100%-2rem)] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-300 space-y-3">
          {successMsg && (
            <div className="bg-emerald-950/95 text-emerald-400 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium border border-emerald-800 shadow-2xl backdrop-blur-md">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
              <p>{successMsg}</p>
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-950/95 text-red-400 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium border border-red-800 shadow-2xl backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}
        </div>
      )}

      {/* Search & Link Component */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800/80 space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#FF6600]" />
            Vincular Nuevo Profesional
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Busca profesionales registrados en dconfy para agregarlos a tu equipo corporativo.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all font-medium text-white text-sm"
              placeholder="Buscar por nombre o correo electrónico..."
            />
          </div>
          <button
            type="submit"
            disabled={loadingSearch || !searchQuery.trim()}
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold px-6 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {loadingSearch ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border border-slate-800/60 rounded-2xl overflow-hidden bg-slate-950/60 divide-y divide-slate-850">
            {searchResults.map((result) => (
              <div key={result.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {result.avatar_url ? (
                      <img src={result.avatar_url} alt={result.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{result.full_name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{result.specialty || 'Profesional'}</p>
                    {result.email && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                        <Mail className="w-3 h-3" /> {result.email}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleLink(result.id, result.full_name)}
                  disabled={actionInProgress !== null}
                  className="bg-[#FF6600]/10 hover:bg-[#FF6600]/20 active:scale-95 text-[#FF6600] font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {actionInProgress === result.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Añadir al Equipo</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Members List */}
      <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800/80 space-y-6">
        <div className="border-b border-slate-800/50 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            Miembros del Equipo
          </h3>
          <span className="bg-slate-850 border border-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-full text-xs">
            {employees.length} profesionales
          </span>
        </div>

        {loadingList ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#FF6600] animate-spin" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h4 className="text-sm font-bold text-slate-400">No hay profesionales vinculados</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Utiliza el buscador superior para agregar profesionales a tu plantilla corporativa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {employees.map((emp) => (
              <div 
                key={emp.id} 
                className="bg-slate-950 border border-slate-800/60 hover:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all"
              >
                {/* Profile Card Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-850 overflow-hidden flex items-center justify-center shrink-0">
                    {emp.avatar_url ? (
                      <img src={emp.avatar_url} alt={emp.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base leading-tight">{emp.full_name}</h4>
                      {emp.is_business_admin && (
                        <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{emp.specialty || 'Profesional'}</p>
                    {emp.email && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-600" /> {emp.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Settings & Actions */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 sm:justify-end">
                  {/* Admin toggle */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={actionInProgress !== null}
                      onClick={() => handleToggle(emp.id, 'is_business_admin', emp.is_business_admin)}
                      className={`
                        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out outline-none disabled:opacity-50
                        ${emp.is_business_admin ? 'bg-violet-600' : 'bg-slate-800'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow 
                          transition duration-200 ease-in-out
                          ${emp.is_business_admin ? 'translate-x-4' : 'translate-x-0'}
                        `}
                      />
                    </button>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1 select-none">
                      <Shield className={`w-3.5 h-3.5 ${emp.is_business_admin ? 'text-violet-400' : 'text-slate-600'}`} />
                      Administrador
                    </span>
                  </div>

                  {/* Location toggle */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      disabled={actionInProgress !== null}
                      onClick={() => handleToggle(emp.id, 'show_location', emp.show_location)}
                      className={`
                        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                        transition-colors duration-200 ease-in-out outline-none disabled:opacity-50
                        ${emp.show_location ? 'bg-[#FF6600]' : 'bg-slate-800'}
                      `}
                    >
                      <span
                        className={`
                          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow 
                          transition duration-200 ease-in-out
                          ${emp.show_location ? 'translate-x-4' : 'translate-x-0'}
                        `}
                      />
                    </button>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1 select-none">
                      <MapPin className={`w-3.5 h-3.5 ${emp.show_location ? 'text-[#FF6600]' : 'text-slate-600'}`} />
                      Ubicación
                    </span>
                  </div>

                  {/* Unlink Action */}
                  <button
                    onClick={() => handleUnlink(emp.id)}
                    disabled={actionInProgress !== null}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-500/10 shrink-0"
                    title="Desvincular del equipo"
                  >
                    {actionInProgress === emp.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserMinus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
