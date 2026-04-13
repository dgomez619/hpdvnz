import { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, Link as LinkIcon, Copy, Check } from 'lucide-react';
import type { Property } from '../../types/property';
import { AMENITIES_LIST } from '../../utils/amenityIcons';


interface PropertyFormData {
    title_es: string;      // Update these to match
    title_en: string;      // Update these to match
    location: string;
    description_es: string;
    description_en: string;
    pricePerNight: string | number;
    beds: string | number;
    baths: string | number;
    sqm: string | number;  // Ensure this is sqm now
    category_es: string;   // Added
    category_en: string;   // Added
    amenities: string[];
    images: string[];
    externalSyncLinks: { platform: string; url: string; _id?: string }[];
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    propertyToEdit?: Property | null; // This now uses the global Property type
}

export const AddPropertyModal = ({ isOpen, onClose, onSuccess, propertyToEdit }: ModalProps) => {
    // RESTORED CONSTANTS
    const CLOUD_NAME = 'dwrinmdz0';
    const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const UPLOAD_PRESET = 'ml_default';
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const [formData, setFormData] = useState<PropertyFormData>({
        title_es: '',
        title_en: '',
        location: '',
        description_es: '',
        description_en: '',
        pricePerNight: '',
        beds: '',
        baths: '',
        category_es: 'Apartamento',
        category_en: 'Apartment',
        amenities: [],
        images: [],
        externalSyncLinks: [],
        sqm: ''
    });

    const [newSyncLink, setNewSyncLink] = useState({ platform: 'Airbnb', url: '' });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (propertyToEdit) {
                setFormData({
                    title_es: propertyToEdit.title_es || '',
                    title_en: propertyToEdit.title_en || '',
                    location: propertyToEdit.location,
                    description_es: propertyToEdit.description_es || '',
                    description_en: propertyToEdit.description_en || '',
                    pricePerNight: propertyToEdit.pricePerNight,
                    beds: propertyToEdit.beds,
                    baths: propertyToEdit.baths,
                    amenities: propertyToEdit.amenities || [],
                    images: propertyToEdit.images || [],
                    externalSyncLinks: propertyToEdit.externalSyncLinks || [],
                    category_es: propertyToEdit.category_es || 'Apartamento',
                    category_en: propertyToEdit.category_en || 'Apartment',
                    sqm: propertyToEdit.sqm || ''
                });
            } else {
                setFormData({
                    title_es: '', title_en: '', location: '', description_es: '', description_en: '',
                    pricePerNight: '', beds: '', baths: '', amenities: [],
                    images: [], externalSyncLinks: [], category_es: 'Apartamento', category_en: 'Apartment', sqm: ''
                });
            }
        }
    }, [propertyToEdit, isOpen]);

    // RESTORED COPY FUNCTION
    const handleCopyExportUrl = () => {
        if (!propertyToEdit?._id) return;
        const url = `${API_BASE_URL}/api/export/${propertyToEdit._id}.ics`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addExternalLink = () => {
        const trimmed = newSyncLink.url.trim();
        if (trimmed === '') return;
        setFormData(prev => ({
            ...prev,
            externalSyncLinks: [...prev.externalSyncLinks, { ...newSyncLink, url: trimmed }]
        }));
        setNewSyncLink({ platform: 'Airbnb', url: '' });
    };

    const removeExternalLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            externalSyncLinks: prev.externalSyncLinks.filter((_, i) => i !== index)
        }));
    };

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
    };

    // CLOUDINARY LOGIC
    const openUploadWidget = () => {
        // @ts-expect-error cloudinary
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUD_NAME,
                uploadPreset: UPLOAD_PRESET,
                sources: ['local', 'camera', 'url'],
                multiple: true,
                maxFiles: 10,
                styles: { palette: { window: "#111114", sourceBg: "#111114", windowBorder: "#ffffff10", tabIcon: "#FFFFFF", textLight: "#FFFFFF", textDark: "#000000", link: "#FFFFFF", action: "#FFFFFF", inactiveTabIcon: "#555a5f", error: "#F44235", inProgress: "#FFFFFF", complete: "#20B832", sourceHover: "#1c1c1e" } }
            },
            (error: Error | null, result: { event: string; info: { secure_url: string } }) => {
                if (!error && result && result.event === "success") {
                    setFormData(prev => ({ ...prev, images: [...prev.images, result.info.secure_url] }));
                }
            }
        );
        widget.open();
    };

    const openMediaLibrary = () => {
        // @ts-expect-error we know 
        window.cloudinary.openMediaLibrary(
            { cloud_name: CLOUD_NAME, api_key: API_KEY, insert_caption: "Insertar en Propiedad", multiple: true },
            {
                insertHandler: (data: { assets: Array<{ secure_url: string }> }) => {
                    const newUrls = data.assets.map(asset => asset.secure_url);
                    setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
                }
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isEditing = !!propertyToEdit;
        const url = isEditing
            ? `${API_BASE_URL}/api/properties/${propertyToEdit?._id}`
            : `${API_BASE_URL}/api/properties`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const token = localStorage.getItem('adminToken');

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    ...formData,
                    pricePerNight: parseFloat(formData.pricePerNight.toString()) || 0,
                    beds: parseInt(formData.beds.toString(), 10) || 0,
                    baths: parseInt(formData.baths.toString(), 10) || 0,
                    sqm: parseFloat(formData.sqm.toString()) || 0
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Error al guardar');
            }

            onSuccess();
            onClose();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Error desconocido";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
            <div className="bg-[#111114] w-full max-w-2xl max-h-[95vh] rounded-2xl sm:rounded-3xl border border-white/5 overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-white/5 bg-[#161618]">
                    <h2 className="text-white font-display text-sm sm:text-lg tracking-widest uppercase italic">
                        {propertyToEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* Images */}
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gestión de Imágenes</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button type="button" onClick={openUploadWidget} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                                <Plus size={14} /> Subir Nuevas
                            </button>
                            <button type="button" onClick={openMediaLibrary} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                                <Search size={14} /> Biblioteca
                            </button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <img src={url} className="w-full h-full object-cover rounded-lg border border-white/10" alt="" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-xl"><Trash2 size={10} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- TITLES (Side by Side) --- */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Título (ES)</label>
                        <input
                            required
                            value={formData.title_es}
                            onChange={(e) => setFormData({ ...formData, title_es: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Ej: Villa del Mar"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Title (EN)</label>
                        <input
                            required
                            value={formData.title_en}
                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Ex: Ocean Villa"
                        />
                    </div>

                    {/* --- CATEGORY / BADGE (Side by Side) --- */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Categoría (ES)</label>
                        <input
                            required
                            value={formData.category_es}
                            onChange={(e) => setFormData({ ...formData, category_es: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Ej: Apartamento"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Category (EN)</label>
                        <input
                            required
                            value={formData.category_en}
                            onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Ex: Apartment"
                        />
                    </div>

                    {/* --- LOCATION & SIZE (The sqm Base Unit) --- */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Ubicación</label>
                        <input
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-sans">Tamaño (m²)</label>
                        <input
                            required
                            type="number"
                            value={formData.sqm}
                            onChange={(e) => setFormData({ ...formData, sqm: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20"
                            placeholder="Ej: 85"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Precio / Noche</label>
                        <input required type="number" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Habitaciones</label>
                        <input required type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Baños</label>
                        <input required type="number" value={formData.baths} onChange={(e) => setFormData({ ...formData, baths: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Descripción (Español)</label>
                        <textarea
                            required
                            value={formData.description_es}
                            rows={3}
                            onChange={(e) => setFormData({ ...formData, description_es: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20 resize-none"
                            placeholder="Ej: Hermoso apartamento con vista al mar..."
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description (English)</label>
                        <textarea
                            required
                            value={formData.description_en}
                            rows={3}
                            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20 resize-none"
                            placeholder="Ex: Beautiful apartment with ocean view..."
                        />
                    </div>

                    {/* iCAL SYNC SECTION */}
                    <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-6 mt-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <LinkIcon size={12} /> Sincronización de Calendarios (.ics)
                        </label>

                        {propertyToEdit && (
                            <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/5">
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Enlace de Exportación para Airbnb/Booking</p>
                                <div className="flex gap-2">
                                    <input readOnly value={`${API_BASE_URL}/api/export/${propertyToEdit._id}.ics`} className="flex-1 bg-black/20 border-none rounded-lg p-2 text-[10px] text-slate-400 outline-none" />
                                    <button type="button" onClick={handleCopyExportUrl} className="px-3 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all text-white">
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        <span className="text-[9px] font-bold uppercase ml-2">{copied ? 'Copiado' : 'Copiar'}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-[9px] text-slate-400 uppercase font-bold">Importar Calendarios Externos</p>
                            {formData.externalSyncLinks.map((link, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{link.platform}</span>
                                        <span className="text-[10px] text-slate-500 truncate max-w-50">{link.url}</span>
                                    </div>
                                    <button type="button" onClick={() => removeExternalLink(idx)} className="text-red-500/50 hover:text-red-500 transition-colors p-2"><Trash2 size={14} /></button>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                <select value={newSyncLink.platform} onChange={(e) => setNewSyncLink({ ...newSyncLink, platform: e.target.value })} className="sm:col-span-3 bg-[#1c1c1e] text-white text-[10px] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-white/20">
                                    <option value="Airbnb">Airbnb</option>
                                    <option value="Booking.com">Booking.com</option> {/* Use the full name */}
                                    <option value="Esteiapp">Esteiapp</option>
                                    <option value="Other">Otro</option>

                                </select>
                                <input placeholder="Pegar URL .ics aquí..." value={newSyncLink.url} onChange={(e) => setNewSyncLink({ ...newSyncLink, url: e.target.value })} className="sm:col-span-7 bg-[#1c1c1e] text-white text-[10px] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-white/20" />
                                <button type="button" onClick={addExternalLink} className="sm:col-span-2 bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-white/20 transition-all">Añadir</button>
                            </div>
                        </div>
                    </div>

                    {/* --- AMENITIES SELECTION --- */}
                    <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Amenidades / Comodidades</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {AMENITIES_LIST.map((amenity) => {
                                const isSelected = formData.amenities.includes(amenity.id);
                                return (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => {
                                            const newAmenities = isSelected
                                                ? formData.amenities.filter(id => id !== amenity.id)
                                                : [...formData.amenities, amenity.id];
                                            setFormData({ ...formData, amenities: newAmenities });
                                        }}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected
                                                ? 'bg-white border-white text-black'
                                                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                            }`}
                                    >
                                        <span className={isSelected ? 'text-black' : 'text-slate-500'}>
                                            {amenity.icon}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">
                                            {amenity.label_es}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4 md:col-span-2 pt-6 mt-4 border-t border-white/5 sticky bottom-0 bg-[#111114]">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold text-slate-500 uppercase">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-2 bg-white text-black py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                            {loading ? 'Procesando...' : propertyToEdit ? 'Guardar Cambios' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};