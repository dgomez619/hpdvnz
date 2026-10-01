import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PropertyDetail } from './propertyDetail/PropertyDetail';
import type { Property } from '../types/property';

const PropertyDetailSkeleton = () => (
  <div className="min-h-screen bg-white pb-20 pt-24" aria-busy="true" aria-label="Loading property details">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mt-6 h-4 w-32 rounded bg-slate-100" />
      <div className="mt-8 h-10 w-2/5 rounded bg-slate-200" />
    </div>
    <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
      <div className="skeleton-shimmer aspect-4/5 w-full rounded-xl sm:aspect-3/2 md:aspect-16/7 md:rounded-2xl" />
      <div className="mt-8 grid grid-cols-1 gap-12 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="h-7 w-48 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
        </div>
        <div className="order-first skeleton-shimmer h-72 rounded-2xl xl:order-none" />
      </div>
    </div>
  </div>
);


export const PropertyDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  
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
    return <PropertyDetailSkeleton />;
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
  return (
    <PropertyDetail
      property={property}
      initialBookingDates={{
        startDate: searchParams.get('checkIn') || '',
        endDate: searchParams.get('checkOut') || '',
        guests: Number(searchParams.get('guests')) || 1,
      }}
    />
  );
};