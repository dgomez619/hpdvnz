import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  Search,
  Loader2,
  Trash2,
  Edit3,
  RefreshCw,
  Lock
} from 'lucide-react'; // Removed ExternalLink from here
import { AddPropertyModal } from './AddPropertyModal';
import type { Property } from '../../types/property';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation(); // Removed 't' as it was unused
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login', { replace: true });
  };

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${API_BASE}/api/properties`, {
        headers: { 'x-auth-token': token || '' }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, navigate]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSyncAll = async () => {
    try {
      setIsSyncing(true);
      const token = localStorage.getItem('adminToken');

      const response = await fetch(`${API_BASE}/api/sync/all`, {
        method: 'POST',
        headers: {
          'x-auth-token': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchProperties();
        alert("Sincronización exitosa.");
      } else {
        alert("Error al sincronizar.");
      }
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEditClick = (prop: Property) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`¿Eliminar "${title}"?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || '',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) fetchProperties();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const getLocalizedTitle = (prop: Property) => {
    const isEn = i18n.language === 'en';
    return (isEn ? (prop.title_en || prop.title_es) : (prop.title_es || prop.title_en)) || '';
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-slate-300">
      <aside className="w-64 border-r border-white/5 bg-[#111114] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h2 className="text-sm font-bold tracking-[0.3em] text-white uppercase">
            HOSPEDAJE<span className="opacity-40">PD</span>
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarLink icon={<Home size={18} />} label="Propiedades" />
          <SidebarLink icon={<Calendar size={18} />} label="Calendario / iCal" />
          <SidebarLink icon={<MessageSquare size={18} />} label="Mensajes" />
        </nav>
        <div className="p-6 border-t border-white/5 space-y-4">
          <SidebarLink icon={<Settings size={18} />} label="Configuración" />
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all group">
            <span className="text-red-500/50 group-hover:text-red-500 transition-colors"><Lock size={18} /></span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Vista General</p>
            <h1 className="text-2xl sm:text-3xl font-display text-white italic">Panel de Control</h1>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={handleSyncAll} disabled={isSyncing || isLoading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50">
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
            <button onClick={handleAddNewClick} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg">
              <Plus size={14} /> Nueva Propiedad
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <StatCard label="Propiedades Activas" value={properties.length.toString()} />
          <StatCard label="Sincronización iCal" value="Activa" subValue="Todo al día" />
          <StatCard label="Mensajes Pendientes" value="3" />
        </div>

        <div className="bg-[#111114] rounded-2xl border border-white/5">
          <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">Tu Colección</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1c1c1e] border-none rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-white/20 w-full" />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[600px]">
              <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500 bg-white/5">
                <tr>
                  <th className="px-6 py-4">Propiedad</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-500" /></td></tr>
                ) : (
                  properties
                    .filter(p => getLocalizedTitle(p).toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((prop) => (
                      <tr key={prop._id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={prop.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <span className="text-sm font-medium text-white">{getLocalizedTitle(prop)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-light">{prop.location}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">${prop.pricePerNight}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEditClick(prop)} className="p-2 text-slate-400 hover:text-white"><Edit3 size={16} /></button>
                            <button onClick={() => handleDelete(prop._id, getLocalizedTitle(prop))} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <button onClick={() => navigate(`/admin/calendar/${prop._id}`)} className="p-2 text-slate-400 hover:text-white"><Calendar size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* The component now correctly passes the Property object which matches the new types */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProperty(null); }}
        onSuccess={() => fetchProperties()}
        propertyToEdit={selectedProperty}
      />
    </div>
  );
};

const SidebarLink = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    <span className={active ? "text-black" : "text-slate-500 group-hover:text-white"}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const StatCard = ({ label, value, subValue }: { label: string, value: string, subValue?: string }) => (
  <div className="bg-[#111114] p-5 sm:p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-full">
    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 truncate">{label}</p>
    <div className="flex items-baseline gap-2 flex-wrap">
      <h4 className="text-xl sm:text-2xl font-display text-white">{value}</h4>
      {subValue && <span className="text-[10px] text-slate-600 italic truncate">{subValue}</span>}
    </div>
  </div>
);