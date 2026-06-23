// src/components/Admin/AddServiceModal.tsx
import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceToEdit?: any;
}

export const AddServiceModal = ({ isOpen, onClose, onSuccess, serviceToEdit }: AddServiceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '', title_es: '',
    description_en: '', description_es: '',
    category: 'experience',
    image: '',
    priceInfo: '',
    isActive: true
  });

  useEffect(() => {
    if (serviceToEdit) setFormData(serviceToEdit);
    else setFormData({ 
        title_en: '', title_es: '', 
        description_en: '', description_es: '', 
        category: 'experience', image: '', 
        priceInfo: '', isActive: true 
    });
  }, [serviceToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = serviceToEdit ? 'PUT' : 'POST';
    const url = serviceToEdit 
        ? `${import.meta.env.VITE_API_URL}/api/services/${serviceToEdit._id}` 
        : `${import.meta.env.VITE_API_URL}/api/services`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('adminToken') || '' 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error saving service:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#111114] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-xl font-display italic text-white">
            {serviceToEdit ? 'Editar Experiencia' : 'Nueva Experiencia'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Titles */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Título (ES)</label>
            <input required value={formData.title_es} onChange={e => setFormData({...formData, title_es: e.target.value})} className="w-full bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-white/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Title (EN)</label>
            <input required value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-white/20" />
          </div>

          {/* Category & Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Categoría</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white outline-none">
              <option value="logistics">Logística / Transporte</option>
              <option value="experience">Experiencia / Tour</option>
              <option value="leisure">Ocio / Playa</option>
              <option value="wellness">Bienestar</option>
              <option value="gastronomy">Gastronomía</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Referencia de Precio (Ej: Desde $50)</label>
            <input value={formData.priceInfo} onChange={e => setFormData({...formData, priceInfo: e.target.value})} className="w-full bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-white/20" />
          </div>

          {/* Descriptions */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Descripción (ES)</label>
            <textarea rows={3} value={formData.description_es} onChange={e => setFormData({...formData, description_es: e.target.value})} className="w-full bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-white/20" />
          </div>

          {/* Image URL */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">URL de Imagen</label>
            <div className="flex gap-4">
              <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 bg-[#1c1c1e] border-none rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-white/20" placeholder="https://images.unsplash.com/..." />
              {formData.image && <img src={formData.image} className="w-14 h-14 rounded-lg object-cover border border-white/10" alt="Preview" />}
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button disabled={loading} type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-slate-200 transition-all flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Guardar Experiencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};