import { useState, useEffect } from 'react';
import { X, Plus, Search, Trash2 } from 'lucide-react';

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
        images: [] as string[]
    });
    const [loading, setLoading] = useState(false);

    // CONFIGURATION
    const CLOUD_NAME = 'dwrinmdz0';
    const API_KEY = '184389541388686';
    const UPLOAD_PRESET = 'ml_default';

    // DYNAMIC API URL (Uses environment variable for Render deployment)
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
                images: propertyToEdit.images || []
            });
        } else {
            setFormData({ title: '', location: '', description: '', pricePerNight: '', beds: '', baths: '', amenities: '', images: [] });
        }
    }, [propertyToEdit, isOpen]);

    if (!isOpen) return null;

    // --- CLOUDINARY LOGIC ---
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
                styles: {
                    palette: {
                        window: "#111114",
                        sourceBg: "#111114",
                        windowBorder: "#ffffff10",
                        tabIcon: "#FFFFFF",
                        textLight: "#FFFFFF",
                        textDark: "#000000",
                        link: "#FFFFFF",
                        action: "#FFFFFF",
                        inactiveTabIcon: "#555a5f",
                        error: "#F44235",
                        inProgress: "#FFFFFF",
                        complete: "#20B832",
                        sourceHover: "#1c1c1e"
                    }
                }
            },
            // CHANGED: Replaced 'any' with specific Cloudinary result shape
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
            {
                cloud_name: CLOUD_NAME,
                api_key: API_KEY,
                insert_caption: "Insertar en Propiedad",
                multiple: true,
            },
            {
                // CHANGED: Replaced 'any' with the expected asset array structure
                insertHandler: (data: { assets: Array<{ secure_url: string }> }) => {
                    const newUrls = data.assets.map(asset => asset.secure_url);
                    setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
                }
            }
        );
    };
    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
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

            // Sanitizing amenities: split by comma, trim whitespace, remove empty strings
            const sanitizedAmenities = formData.amenities
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== "");

            await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    ...formData,
                    pricePerNight: Number(formData.pricePerNight),
                    beds: Number(formData.beds),
                    baths: Number(formData.baths),
                    amenities: sanitizedAmenities,
                }),
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving property:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111114] w-full max-w-2xl rounded-3xl border border-white/5 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#161618]">
                    <h2 className="text-white font-display text-lg tracking-widest uppercase italic">
                        {propertyToEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Gestión de Imágenes</label>
                        <div className="flex gap-3">
                            <button type="button" onClick={openUploadWidget} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                <Plus size={14} /> Subir Nuevas
                            </button>
                            <button type="button" onClick={openMediaLibrary} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                                <Search size={14} /> Explorar Cloudinary
                            </button>
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                            {formData.images.map((url, index) => (
                                <div key={index} className="relative aspect-square group">
                                    <img src={url} className="w-full h-full object-cover rounded-lg border border-white/10" alt="Vista previa" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Título</label>
                        <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ubicación</label>
                        <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Precio / Noche</label>
                        <input required type="number" value={formData.pricePerNight} onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Habitaciones</label>
                        <input required type="number" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Baños</label>
                        <input required type="number" value={formData.baths} onChange={(e) => setFormData({ ...formData, baths: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Descripción</label>
                        <textarea required value={formData.description} rows={3} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20 resize-none" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Comodidades</label>
                        <input value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} className="w-full bg-[#1c1c1e] rounded-xl p-4 text-white text-sm outline-none border-none focus:ring-1 focus:ring-white/20" placeholder="Piscina, Wifi, A/C..." />
                    </div>

                    <div className="flex gap-4 md:col-span-2 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold text-slate-500 uppercase">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-white text-black py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                            {loading ? 'Procesando...' : propertyToEdit ? 'Guardar Cambios' : 'Publicar Propiedad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};