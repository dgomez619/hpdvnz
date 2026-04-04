import { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2, Link as LinkIcon, Copy, Check } from 'lucide-react';

interface Property {
    _id: string;
    title: string;
    location: string;
    description: string;
    pricePerNight: number;
    beds: number;
    baths: number;
    amenities: string[];
    images: string[];
    category?: string;
    externalSyncLinks?: { platform: string; url: string; _id?: string }[];
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    propertyToEdit?: Property | null;
}

export const AddPropertyModal = ({ isOpen, onClose, onSuccess, propertyToEdit }: ModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        pricePerNight: '',
        beds: '',
        baths: '',
        amenities: '',
        images: [] as string[],
        externalSyncLinks: [] as { platform: string; url: string }[],
        category: propertyToEdit?.category || 'Apartamento' // Default category
    });

    const [newSyncLink, setNewSyncLink] = useState({ platform: 'Airbnb', url: '' });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // CONFIGURATION
    const CLOUD_NAME = 'dwrinmdz0';
    const API_KEY = '184389541388686';
    const UPLOAD_PRESET = 'ml_default';
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    useEffect(() => {
        if (propertyToEdit) {
            setFormData({
                title: propertyToEdit.title,
                location: propertyToEdit.location,
                description: propertyToEdit.description,
                pricePerNight: propertyToEdit.pricePerNight.toString(),
                beds: propertyToEdit.beds.toString(),
                baths: propertyToEdit.baths.toString(),
                amenities: propertyToEdit.amenities.join(', '),
                images: propertyToEdit.images || [],
                externalSyncLinks: propertyToEdit.externalSyncLinks || [],
                category: propertyToEdit.category || 'Apartamento'
            });
        } else {
            setFormData({
                title: '', location: '', description: '', pricePerNight: '',
                beds: '', baths: '', amenities: '', images: [],
                externalSyncLinks: [], category: 'Apartamento'
            });
        }
    }, [propertyToEdit, isOpen]);

    const handleCopyExportUrl = () => {
        if (!propertyToEdit?._id) return;
        const url = `${API_BASE_URL}/api/export/${propertyToEdit._id}.ics`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addExternalLink = () => {
        if (newSyncLink.url.trim() === '') return;
        setFormData(prev => ({
            ...prev,
            externalSyncLinks: [...prev.externalSyncLinks, { ...newSyncLink }]
        }));
        setNewSyncLink({ platform: 'Airbnb', url: '' });
    };

    const removeExternalLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            externalSyncLinks: prev.externalSyncLinks.filter((_, i) => i !== index)
        }));
    };

    if (!isOpen) return null;

    // --- CLOUDINARY LOGIC ---
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

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
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

        // 1. IMPROVED AMENITIES LOGIC
        // Only split if it's a string; if it's already an array, just trim the items
        const sanitizedAmenities = typeof formData.amenities === 'string'
            ? formData.amenities.split(',').map(item => item.trim()).filter(i => i !== "")
            : formData.amenities;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || ''
            },
            body: JSON.stringify({
                ...formData,
                // Ensure numbers are truly numbers
                pricePerNight: parseFloat(formData.pricePerNight.toString()),
                beds: parseInt(formData.beds.toString(), 10),
                baths: parseInt(formData.baths.toString(), 10),
                amenities: sanitizedAmenities,
                // Explicitly ensure category is sent
                category: formData.category 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Error al guardar la propiedad');
        }

        // Success handling
        onSuccess();
        onClose();
        
    } catch (error: unknown) {
        console.error("Error saving property:", error);
        
        // This resolves your "Unexpected any" error correctly
        const errorMessage = error instanceof Error 
            ? error.message 
            : "No se pudo conectar con el servidor";
            
        alert(errorMessage);
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
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

                    {/* Basic Info */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Título</label>
                        <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            Categoría (Badge)
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20 appearance-none cursor-pointer"
                        >
                            <option value="Apartamento">Apartamento</option>
                            <option value="Casa">Casa</option>
                            <option value="Villa">Villa</option>
                            <option value="Estudio">Estudio</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Posada">Posada</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ubicación</label>
                        <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" />
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
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Descripción</label>
                        <textarea required value={formData.description} rows={3} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20 resize-none" />
                    </div>

                    {/* NEW SECTION: iCAL SYNC */}
                    <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-6 mt-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <LinkIcon size={12} /> Sincronización de Calendarios (.ics)
                        </label>

                        {propertyToEdit && (
                            <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/5">
                                <p className="text-[9px] text-slate-400 uppercase font-bold">Enlace de Exportación para Airbnb/Booking</p>
                                <div className="flex gap-2">
                                    <input readOnly value={`${API_BASE_URL}/api/export/${propertyToEdit._id}.ics`} className="flex-1 bg-black/20 border-none rounded-lg p-2 text-[10px] text-slate-400 outline-none" />
                                    <button type="button" onClick={handleCopyExportUrl} className="px-3 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all">
                                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        <span className="text-[9px] font-bold uppercase">{copied ? 'Copiado' : 'Copiar'}</span>
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
                                        <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{link.url}</span>
                                    </div>
                                    <button type="button" onClick={() => removeExternalLink(idx)} className="text-red-500/50 hover:text-red-500 transition-colors p-2"><Trash2 size={14} /></button>
                                </div>
                            ))}

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                                <select value={newSyncLink.platform} onChange={(e) => setNewSyncLink({ ...newSyncLink, platform: e.target.value })} className="sm:col-span-3 bg-[#1c1c1e] text-white text-[10px] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-white/20">
                                    <option value="Airbnb">Airbnb</option>
                                    <option value="Booking">Booking.com</option>
                                    <option value="Other">Otro</option>
                                </select>
                                <input placeholder="Pegar URL .ics aquí..." value={newSyncLink.url} onChange={(e) => setNewSyncLink({ ...newSyncLink, url: e.target.value })} className="sm:col-span-7 bg-[#1c1c1e] text-white text-[10px] p-3 rounded-xl border-none outline-none focus:ring-1 focus:ring-white/20" />
                                <button type="button" onClick={addExternalLink} className="sm:col-span-2 bg-white/10 text-white rounded-xl text-[10px] font-bold uppercase hover:bg-white/20 transition-all">Añadir</button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Comodidades</label>
                        <input value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none focus:ring-1 focus:ring-white/20" placeholder="Piscina, Wifi, A/C..." />
                    </div>

                    <div className="flex gap-4 md:col-span-2 pt-6 mt-4 border-t border-white/5 sticky bottom-0 bg-[#111114]">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold text-slate-500 uppercase">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-white text-black py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                            {loading ? 'Procesando...' : propertyToEdit ? 'Guardar Cambios' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};