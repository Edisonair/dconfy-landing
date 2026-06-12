"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useBusiness } from '../../BusinessContext';
import { supabase } from '@/utils/supabaseClient';
import { 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  FileImage,
  ExternalLink
} from 'lucide-react';

interface GalleryItem {
  id: string | number;
  image_url: string;
  created_at?: string;
}

export default function BusinessGalleryPage() {
  const { businessId } = useBusiness();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  
  // Loading & status states
  const [loadingList, setLoadingList] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({}); // filename -> boolean
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  // Fetch gallery items from DB
  const fetchGallery = async () => {
    if (!businessId) return;
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from('business_gallery')
        .select('id, image_url, created_at')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGallery((data as GalleryItem[]) || []);
    } catch (err: any) {
      console.error('Error fetching gallery:', err);
      setErrorMsg('Error al cargar la galería de imágenes.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [businessId]);

  // Upload an individual file to Storage + DB
  const uploadFile = async (file: File) => {
    if (!businessId) return;
    
    // File validation: Images only, max 5MB
    if (!file.type.startsWith('image/')) {
      setErrorMsg(`El archivo "${file.name}" no es una imagen válida.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`La imagen "${file.name}" supera el tamaño máximo permitido de 5MB.`);
      return;
    }

    const tempId = file.name;
    setUploadingFiles(prev => ({ ...prev, [tempId]: true }));
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `gallery/${businessId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('business-media')
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) throw new Error('Error al obtener la URL de la imagen.');

      // 3. Insert metadata record in DB
      const { data: insertData, error: dbError } = await supabase
        .from('business_gallery')
        .insert({
          business_id: businessId,
          image_url: urlData.publicUrl
        })
        .select();

      if (dbError) throw dbError;
      if (!insertData || insertData.length === 0) {
        throw new Error('No tienes permisos (RLS) para añadir imágenes a la galería.');
      }

      setSuccessMsg(`Imagen "${file.name}" subida correctamente.`);
      await fetchGallery();
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setErrorMsg(err.message || `Error al subir "${file.name}".`);
    } finally {
      setUploadingFiles(prev => {
        const copy = { ...prev };
        delete copy[tempId];
        return copy;
      });
    }
  };

  // Handle file picker selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => uploadFile(file));
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => uploadFile(file));
    }
  }, [businessId]);

  // Delete image from database and physical storage
  const handleDelete = async (itemId: string | number, imageUrl: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta imagen de la galería?')) return;
    
    setDeletingId(itemId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Extract storage file path from public URL
      // E.g. URL format: https://[project].supabase.co/storage/v1/object/public/business-media/gallery/business_id/filename.jpg
      const bucketName = 'business-media';
      const parts = imageUrl.split(`/${bucketName}/`);
      const filePath = parts.length > 1 ? parts[1] : null;

      if (filePath) {
        // Delete from Storage
        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);
        
        if (storageError) {
          console.warn('Storage cleanup warning:', storageError);
        }
      }

      // 2. Delete from database table
      const { data: deleteData, error: dbError } = await supabase
        .from('business_gallery')
        .delete()
        .eq('id', itemId)
        .select();

      if (dbError) throw dbError;
      if (!deleteData || deleteData.length === 0) {
        throw new Error('No tienes permisos (RLS) para eliminar esta imagen de la galería.');
      }

      setSuccessMsg('Imagen eliminada de la galería.');
      // Auto-update local state to animate/remove immediately
      setGallery(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      console.error('Error deleting image:', err);
      setErrorMsg(err.message || 'Error al eliminar la imagen.');
    } finally {
      setDeletingId(null);
    }
  };

  const isUploading = Object.keys(uploadingFiles).length > 0;

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

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          bg-slate-900/90 rounded-3xl p-8 border-2 border-dashed text-center transition-all duration-300 relative
          ${isDragging 
            ? 'border-[#FE5518] bg-[#FE5518]/5 scale-[0.99]' 
            : 'border-slate-800 hover:border-slate-700'}
        `}
      >
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-inner">
            <Upload className={`w-6 h-6 ${isDragging ? 'text-[#FE5518] animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Arrastra tus fotos aquí</h4>
            <p className="text-xs text-slate-500 font-medium">
              o haz clic para buscar en tu dispositivo. Admite JPG, PNG y WEBP (Máx. 5MB).
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FE5518] hover:bg-[#E44911] active:scale-95 text-white text-xs font-bold rounded-full transition-all cursor-pointer shadow-lg shadow-[#FE5518]/10">
            <span>Seleccionar imágenes</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden" 
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Uploading Progress Overlay */}
      {isUploading && (
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#FE5518] animate-spin" />
            <span className="text-xs font-bold text-slate-300">Subiendo {Object.keys(uploadingFiles).length} imagen(es)...</span>
          </div>
          <div className="flex gap-2">
            {Object.keys(uploadingFiles).map((name) => (
              <span key={name} className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-1 rounded text-slate-500 max-w-[120px] truncate font-mono">
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="bg-slate-900/90 rounded-3xl p-6 md:p-8 border border-slate-800/80 space-y-6">
        <div className="border-b border-slate-800/50 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-violet-500" />
            Galería de Imágenes
          </h3>
          <span className="bg-slate-850 border border-slate-800 text-slate-400 font-bold px-2.5 py-1 rounded-full text-xs">
            {gallery.length} fotos
          </span>
        </div>

        {loadingList ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#FE5518] animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
            <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h4 className="text-sm font-bold text-slate-400 font-[system-ui]">Tu galería está vacía</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Sube fotos de tus instalaciones, tratamientos o equipo para mostrarlas a tus clientes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 shadow-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-slate-800"
              >
                {/* Visual Thumbnail */}
                <img 
                  src={item.image_url} 
                  alt="Galería empresa" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlays on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                  <div className="flex justify-end">
                    <a 
                      href={item.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-1.5 bg-slate-900/90 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-850"
                      title="Ver pantalla completa"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm border border-slate-800">
                      Miniatura
                    </span>

                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      disabled={deletingId !== null}
                      className="p-2 bg-red-650/90 hover:bg-red-600 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border border-red-500/20"
                      title="Eliminar de la galería"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
