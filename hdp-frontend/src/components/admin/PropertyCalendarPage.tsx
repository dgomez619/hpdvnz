import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
    ArrowLeft, 
    RefreshCw, 
    Lock, 
    Calendar as CalendarIcon, 
    Trash2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import 'react-day-picker/dist/style.css';

// 1. DEFINE STRICT TYPES
interface BlockedDate {
    _id: string;
    startDate: string;
    endDate: string;
    source: 'Airbnb' | 'Booking.com' | 'Manual' | 'Direct-Booking';
    lastSynced?: string;
}

interface PropertyData {
    _id: string;
    title: string;
    blockedDates: BlockedDate[];
}

export const PropertyCalendarPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [property, setProperty] = useState<PropertyData | null>(null);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // 2. USE CALLBACK TO FIX EFFECT DEPENDENCY
    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/properties/${id}`);
            const data = await response.json();
            setProperty(data);
        } catch (err) {
            console.error("Error fetching property:", err);
        } finally {
            setLoading(false);
        }
    }, [id, API_BASE]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleManualBlock = async () => {
        const start = selectedRange?.from;
        const end = selectedRange?.to || selectedRange?.from;

        if (!start || !end) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE}/api/properties/${id}/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token || ''
                },
                body: JSON.stringify({
                    startDate: start,
                    endDate: end,
                    source: 'Manual'
                })
            });

            const data = await response.json();

            if (response.ok) {
                await fetchData();
                setSelectedRange(undefined);
            } else {
                alert(data.msg || "No se pudo realizar el bloqueo.");
            }
        } catch (err) {
            console.error("Manual block error:", err);
            alert("Error de conexión con el servidor.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteBlock = async (blockId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas liberar estas fechas?")) return;

    setActionLoading(true);
    try {
        const token = localStorage.getItem('adminToken'); // Retrieve the stored token
        
        const response = await fetch(`${API_BASE}/api/properties/${id}/block/${blockId}`, {
            method: 'DELETE',
            headers: { 
                'x-auth-token': token || '', // Send token for security
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            await fetchData(); // Refresh the calendar and list
        } else {
            const data = await response.json();
            alert(data.msg || "No tienes permiso para realizar esta acción.");
        }
    } catch (err) {
        console.error("Delete error:", err);
        alert("Error de conexión al intentar eliminar el bloqueo.");
    } finally {
        setActionLoading(false);
    }
};

    if (loading || !property) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0b] gap-4">
            <RefreshCw className="animate-spin text-white" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cargando Calendario...</p>
        </div>
    );

    // 3. MAP WITH TYPES
    const bookedDays = property.blockedDates.map((b: BlockedDate) => ({
        from: parseISO(b.startDate),
        to: parseISO(b.endDate),
        source: b.source,
        id: b._id
    }));

    const modifiers = {
        airbnb: bookedDays.filter((d) => d.source === 'Airbnb'),
        booking: bookedDays.filter((d) => d.source === 'Booking.com'),
        manual: bookedDays.filter((d) => d.source === 'Manual'),
    };

    const disabledDays = [
        { before: new Date() },
        ...bookedDays.map((d) => ({ from: d.from, to: d.to }))
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-slate-300 p-4 lg:p-10">
            <div className="max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-display text-white italic">{property.title}</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Panel de Disponibilidad</p>
                    </div>
                </div>
                <button 
                    onClick={fetchData} 
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-white/10 transition-all text-white disabled:opacity-50"
                >
                    <RefreshCw size={14} className={actionLoading ? "animate-spin" : ""} /> 
                    Sincronizar Ahora
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 bg-[#111114] rounded-3xl border border-white/5 p-4 sm:p-8 flex flex-col items-center shadow-2xl overflow-hidden">
                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        onSelect={setSelectedRange}
                        disabled={disabledDays}
                        locale={es}
                        modifiers={modifiers}
                        modifiersClassNames={{
                            airbnb: 'rdp-day_airbnb',
                            booking: 'rdp-day_booking',
                            manual: 'rdp-day_manual'
                        }}
                        numberOfMonths={2}
                        className="bg-transparent custom-calendar"
                        // FIXED FOR V9 COMPATIBILITY
                        components={{
                            Chevron: (props) => props.orientation === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />
                        }}
                    />
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#111114] p-6 rounded-3xl border border-white/5 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <Lock size={18} className="text-white" />
                            <h2 className="text-[11px] font-bold uppercase tracking-widest text-white italic">Bloqueo de Fechas</h2>
                        </div>

                        {selectedRange?.from ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Periodo Seleccionado</p>
                                    <p className="text-sm font-bold text-white tracking-tight">
                                        {format(selectedRange.from, "dd MMM yyyy", { locale: es })}
                                        {selectedRange.to && ` — ${format(selectedRange.to, "dd MMM yyyy", { locale: es })}`}
                                    </p>
                                </div>
                                <button
                                    onClick={handleManualBlock}
                                    disabled={actionLoading}
                                    className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {actionLoading ? 'Procesando...' : 'Confirmar Bloqueo'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-10 text-center space-y-3 opacity-20">
                                <CalendarIcon size={32} />
                                <p className="text-[10px] uppercase font-bold tracking-widest px-6">Selecciona fechas en el calendario</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#111114] p-6 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Historial Manual</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {property.blockedDates.filter((b) => b.source === 'Manual').length === 0 ? (
                                <p className="text-[10px] text-slate-600 italic py-4">No hay bloqueos manuales activos.</p>
                            ) : (
                                property.blockedDates
                                    .filter((b) => b.source === 'Manual')
                                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                    .map((block) => (
                                        <div key={block._id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-white">
                                                    {format(parseISO(block.startDate), "dd MMM")} - {format(parseISO(block.endDate), "dd MMM")}
                                                </span>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteBlock(block._id)}
                                                className="text-red-500/50 hover:text-red-500 p-2"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};