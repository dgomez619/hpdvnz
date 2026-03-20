import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Home,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Loader2,
  Trash2,
  Edit3
} from 'lucide-react';
import { AddPropertyModal } from './AddPropertyModal';

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

export const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5001/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEditClick = (prop: Property) => {
    setSelectedProperty(prop);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${title}" permanentemente?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token || '' }
      });

      if (response.ok) fetchProperties();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] text-slate-300">
      
      {/* 1. SIDEBAR RESTORED */}
      <aside className="w-64 border-r border-white/5 bg-[#111114] hidden lg:flex flex-col">
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

        <div className="p-6 border-t border-white/5">
          <SidebarLink icon={<Settings size={18} />} label="Configuración" />
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Vista General</p>
            <h1 className="text-3xl font-display text-white italic">Panel de Control</h1>
          </div>
          <button
            onClick={handleAddNewClick}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            <Plus size={16} /> Agregar Propiedad
          </button>
        </header>

        {/* 3. STATS GRID RESTORED */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Propiedades Activas" value={properties.length.toString()} />
          <StatCard label="Sincronización iCal" value="Activa" subValue="Hace 12 min" />
          <StatCard label="Mensajes Pendientes" value="3" />
        </div>

        {/* 4. TABLE SECTION WITH SEARCH RESTORED */}
        <div className="bg-[#111114] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">Tu Colección</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Buscar propiedad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1c1c1e] border-none rounded-lg pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-white/20 w-64"
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-500 bg-white/5">
              <tr>
                <th className="px-6 py-4 font-bold">Propiedad</th>
                <th className="px-6 py-4 font-bold">Ubicación</th>
                <th className="px-6 py-4 font-bold">Precio</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-500" /></td></tr>
              ) : (
                properties
                  .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((prop) => (
                    <tr key={prop._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={prop.images[0]} className="w-10 h-10 rounded-lg object-cover" alt="" />
                          <span className="text-sm font-medium text-white">{prop.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-light">{prop.location}</td>
                      <td className="px-6 py-4 text-sm font-bold text-white">${prop.pricePerNight}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(prop)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white" title="Editar">
                            <Edit3 size={16} />
                          </button>
                          <button onClick={() => handleDelete(prop._id, prop.title)} className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-slate-400 hover:text-red-500" title="Eliminar">
                            <Trash2 size={16} />
                          </button>
                          <button className='p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white' title="Ver en sitio">
                            <ExternalLink size={16} />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedProperty(null); }} 
        onSuccess={() => fetchProperties()}
        propertyToEdit={selectedProperty} 
      />
    </div>
  );
};

// --- RESTORED HELPER COMPONENTS ---

const SidebarLink = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-white text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'
  }`}>
    {icon}
    <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
  </div>
);

const StatCard = ({ label, value, subValue }: { label: string, value: string, subValue?: string }) => (
  <div className="bg-[#111114] p-6 rounded-2xl border border-white/5">
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-2xl font-display text-white">{value}</h4>
      {subValue && <span className="text-[10px] text-slate-600 italic">{subValue}</span>}
    </div>
  </div>
);