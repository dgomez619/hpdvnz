import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PropertyDetail } from './propertyDetail/PropertyDetail';
import { Loader2 } from 'lucide-react';
import type { Property } from '../types/property';



export const PropertyDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  
  // 1. ADD THIS: Define the API base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // 2. UPDATE THIS: Use the backticks with the API_BASE variable
        const response = await fetch(`${API_BASE}/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error('Property not found');
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id, API_BASE]); // Added API_BASE to dependency array for safety

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-40">
        <Loader2 className="animate-spin text-slate-200" size={40} />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Cargando Detalles...</p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error || !property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-40">
        <h1 className="font-display text-3xl text-slate-900 italic">Propiedad no encontrada</h1>
        <p className="mt-2 text-slate-500 font-light text-sm">El santuario que buscas no está disponible en este momento.</p>
      </div>
    );
  }

  // 3. SUCCESS STATE
  return <PropertyDetail property={property} />;
};