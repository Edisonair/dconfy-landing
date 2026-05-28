"use client";

import React, { useState, useEffect } from 'react';
import { useBusiness } from '../../BusinessContext';
import { supabase } from '@/utils/supabaseClient';
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Upload, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

export default function BusinessProfilePage() {
  const { businessId, businessProfile, refreshBusinessProfile } = useBusiness();

  // Form states
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [showLocation, setShowLocation] = useState(true);

  // Status states
  const [sectorsList, setSectorsList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing profile values
  useEffect(() => {
    if (businessProfile) {
      setBusinessName(businessProfile.business_name || '');
      setCategory(businessProfile.category || '');
      setSector(businessProfile.sector || '');
      setPhone(businessProfile.phone || '');
      setEmail(businessProfile.email || '');
      setWebsite(businessProfile.website || '');
      setInstagram(businessProfile.instagram || '');
      setDescription(businessProfile.bio || businessProfile.description || '');
      setLogoUrl(businessProfile.logo_url || '');
      setShowLocation(businessProfile.show_location !== false);
    }
  }, [businessProfile]);

  // Load sectors dynamically from the sectors table
  useEffect(() => {
    async function loadSectors() {
      try {
        const { data, error } = await supabase
          .from('sectors')
          .select('name')
          .order('name');
        if (!error && data) {
          setSectorsList(data.map(s => s.name));
        }
      } catch (err) {
        console.error('Error loading sectors:', err);
      }
    }
    loadSectors();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !businessId) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logos/${businessId}_${Date.now()}.${fileExt}`;

      // Upload file to the 'business-media' bucket
      const { error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('business-media')
        .getPublicUrl(fileName);

      if (!data?.publicUrl) throw new Error('Error al obtener la URL pública del logotipo.');

      setLogoUrl(data.publicUrl);
      setSuccessMsg('Logotipo cargado. Recuerda guardar los cambios del perfil.');
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setErrorMsg(err.message || 'Error al subir el logotipo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let formattedWebsite = website.trim();
      if (formattedWebsite && !/^https?:\/\//i.test(formattedWebsite)) {
        formattedWebsite = `https://${formattedWebsite}`;
      }

      const { data: bizData, error } = await supabase
        .from('business_profiles')
        .update({
          business_name: businessName,
          category,
          sector,
          phone,
          email,
          website: formattedWebsite,
          instagram,
          bio: description,
          logo_url: logoUrl,
          show_location: showLocation
        })
        .eq('id', businessId)
        .select();

      if (error) throw error;
      
      if (!bizData || bizData.length === 0) {
        throw new Error('No tienes permisos (RLS) para actualizar los datos de esta empresa en la tabla business_profiles.');
      }

      // Update show_location in user's profile row too (to prevent sync trigger overrides)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profData, error: profError } = await supabase
          .from('profiles')
          .update({ show_location: showLocation })
          .eq('id', session.user.id)
          .select();
        
        if (profError) throw profError;
        if (!profData || profData.length === 0) {
          throw new Error('No tienes permisos (RLS) para actualizar tu perfil en la tabla profiles.');
        }
      }

      await refreshBusinessProfile();
      setSuccessMsg('Perfil de la empresa actualizado correctamente.');
      
      // Scroll the dashboard content container to top
      const scrollContainer = document.querySelector('.custom-scrollbar');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Auto-hide success message after 4s
      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      console.error('Save profile error:', err);
      setErrorMsg(err.message || 'Error al guardar los datos del perfil.');
      // Scroll the dashboard content container to top on error
      const scrollContainer = document.querySelector('.custom-scrollbar');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
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

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Logo and Identity Card */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800/80 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative group w-32 h-32 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo empresa" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-12 h-12 text-slate-700" />
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#FF6600] animate-spin" />
              </div>
            )}
          </div>

          <div className="text-center md:text-left space-y-3">
            <h3 className="text-lg font-bold text-white">Logotipo corporativo</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm">
              Sube una imagen cuadrada de tu logotipo (PNG, JPG). Tamaño sugerido: 512x512px.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Seleccionar archivo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        {/* General Form Fields */}
        <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800/80 space-y-6">
          <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800/50 pb-3">
            Datos Generales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Nombre de la Empresa
              </label>
              <input 
                type="text" 
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="Mi Clínica Estética"
              />
            </div>

            {/* Category (Text input) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Categoría
              </label>
              <input 
                type="text" 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="Ej. Clínica Dental, Asesoría Fiscal"
              />
            </div>

            {/* Sector (Dropdown) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sector
              </label>
              <select
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium cursor-pointer"
              >
                <option value="">Selecciona un sector...</option>
                {sectorsList.map((sectName) => (
                  <option key={sectName} value={sectName} className="bg-slate-950 text-white font-medium">
                    {sectName}
                  </option>
                ))}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> Teléfono Corporativo
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="+34 600 000 000"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Corporativo
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="administracion@empresa.com"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-500" /> Sitio Web
              </label>
              <input 
                type="text" 
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="https://miweb.com"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-slate-500" /> Perfil de Instagram
              </label>
              <input 
                type="text" 
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium"
                placeholder="@mi_empresa"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Sobre nosotros (Descripción)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/10 outline-none transition-all text-white font-medium resize-y"
              placeholder="Explica qué servicios ofreces, la trayectoria de tu clínica o centro, etc."
            />
          </div>
        </div>

        {/* Privacy Gating */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800/50 pb-3">
            Ajustes de Privacidad
          </h3>
          
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 pr-6">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {showLocation ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
                Mostrar ubicación al público
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                Si está activado, la dirección física de la clínica/empresa será visible para los usuarios en la landing pública de dconfy.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setShowLocation(!showLocation)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out outline-none
                ${showLocation ? 'bg-[#FF6600]' : 'bg-slate-800'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                  transition duration-200 ease-in-out
                  ${showLocation ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#E65C00] active:scale-95 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-[#FF6600]/15 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar Perfil
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
