// src/components/Admin/AdminDashboard.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Plus,
  Edit3,
  RefreshCw,
  Lock,
  Search,
  Trash2,
  Calendar,
  Loader2
} from 'lucide-react'; 
import { AddPropertyModal } from './AddPropertyModal';
import { AddServiceModal } from './AddServiceModal';
import { AdminInbox } from './AdminInbox';
import type { Property } from '../../types/property';

interface Service {
  _id: string;
  title_en: string;
  title_es: string;
  category: string;
  image: string;
  isActive: boolean;
  priceInfo?: string;
}

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Restored
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Restored
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inbox' | 'experiences'>('dashboard');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  const fetchServices = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/services`, {
        headers: { 'x-auth-token': token || '' }
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProperties();
    fetchServices();
  }, [fetchProperties, fetchServices]);

  const handleSyncAll = async () => {
    try {
      setIsSyncing(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/sync/all`, {
        method: 'POST',
        headers: { 'x-auth-token': token || '', 'Content-Type': 'application/json' }
      });
      if (response.ok) await fetchProperties();
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!window.confirm(`¿Eliminar "${title}"?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '', 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchProperties();
    } catch (error) { console.error(error); }
  };

  const getLocalizedTitle = (prop: Property) => {
    const isEn = i18n.language === 'en';
    return (isEn ? (prop.title_en || prop.title_es) : (prop.title_es || prop.title_en)) || '';
  };

  const handleToggleService = async (serviceId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/api/services/${serviceId}/toggle`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': token || '',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setServices(prev => prev.map(s =>
          s._id === serviceId ? { ...s, isActive: !s.isActive } : s
        ));
      } else {
        alert('Error al cambiar el estado del servicio');
      }
    } catch (error) {
      console.error("Error toggling service:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-slate-300">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#111114] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <h2 className="text-sm font-bold tracking-[0.3em] text-white uppercase">HOSPEDAJE<span className="opacity-40">PD</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<MessageSquare size={18} />} label="Mensajes" active={activeTab === 'inbox'} onClick={() => setActiveTab('inbox')} />
          <SidebarLink icon={<Home size={18} />} label="Experiencias" active={activeTab === 'experiences'} onClick={() => setActiveTab('experiences')} />
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all group">
            <Lock size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        {activeTab === 'dashboard' && (
          <>
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Vista General</p>
                <h1 className="text-2xl sm:text-3xl font-display text-white italic">Panel de Control</h1>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSyncAll} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/10">
                  <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>
                <button onClick={() => { setSelectedProperty(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 shadow-lg">
                  <Plus size={14} /> Nueva Propiedad
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <StatCard label="Propiedades Activas" value={properties.length.toString()} />
              <StatCard label="Sincronización iCal" value="Activa" subValue="Todo al día" />
              <StatCard label="Mensajes Pendientes" value="3" />
            </div>

            <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
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
                                <button onClick={() => { setSelectedProperty(prop); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-white"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteProperty(prop._id, getLocalizedTitle(prop))} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
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
          </>
        )}

        {/* TAB: INBOX */}
        {activeTab === 'inbox' && <AdminInbox />}

        {/* TAB: EXPERIENCES */}
        {activeTab === 'experiences' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <header className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Catálogo de Servicios</p>
                <h1 className="text-3xl font-display text-white italic">Experience Manager</h1>
              </div>
              <button onClick={() => { setSelectedService(null); setIsServiceModalOpen(true); }} className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all shadow-lg">
                + Nueva Experiencia
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service._id} className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden group">
                  <div className="aspect-video relative">
                    <img src={service.image} alt={service.title_es} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button onClick={() => { setSelectedService(service); setIsServiceModalOpen(true); }} className="bg-black/50 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white hover:text-black transition-all">
                          <Edit3 size={16} />
                       </button>
                    </div>
                  </div>
                  <div className="p-5 text-sm">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{service.category}</span>
                    <h3 className="text-lg text-white font-medium mt-1">{i18n.language === 'en' ? service.title_en : service.title_es}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-slate-400 font-light">
                        {service.priceInfo || 'Consultar'}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${service.isActive ? 'text-green-500' : 'text-slate-500'}`}>
                          {service.isActive ? 'Activo' : 'Pausado'}
                        </span>
                        <button
                          onClick={() => handleToggleService(service._id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            service.isActive ? 'bg-green-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                              service.isActive ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AddPropertyModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedProperty(null); }} onSuccess={() => fetchProperties()} propertyToEdit={selectedProperty} />
      <AddServiceModal isOpen={isServiceModalOpen} onClose={() => { setIsServiceModalOpen(false); setSelectedService(null); }} onSuccess={() => fetchServices()} serviceToEdit={selectedService} />
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white text-black shadow-lg shadow-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest text-left">{label}</span>
  </button>
);

const StatCard = ({ label, value, subValue }: { label: string, value: string, subValue?: string }) => (
  <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 truncate">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-2xl font-display text-white">{value}</h4>
      {subValue && <span className="text-[10px] text-slate-600 italic truncate">{subValue}</span>}
    </div>
  </div>
);