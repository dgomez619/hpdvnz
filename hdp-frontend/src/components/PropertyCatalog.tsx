import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../types/property';


// 2. Accept properties as a prop from App.tsx
export const PropertyCatalog = ({ properties = [] }: { properties: Property[] }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');

  // 3. Logic to filter based on real MongoDB data
  const filteredProperties = activeFilter === 'All' 
    ? properties 
    : properties.filter(p => p.location.includes(activeFilter));

  // 4. Generate dynamic filters based on what's actually in your DB
  // This takes your property locations, removes duplicates, and adds 'All'
  const dynamicFilters = ['All', ...new Set(properties.map(p => p.location))];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        
        <header className="mb-12 border-b border-slate-100 pb-12">
          <h1 className="font-display text-5xl text-slate-900 md:text-6xl italic">
            {t('catalog.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-light text-slate-500">
            {t('catalog.subtitle')}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                {t('catalog.filter_location')}
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {dynamicFilters.map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveFilter(city)}
                    className={`text-left text-sm transition-all py-1 ${
                      activeFilter === city 
                        ? 'font-bold text-slate-900 translate-x-2' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{filteredProperties.length} {t('catalog.results_found')}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
              {filteredProperties.map((property) => (
                // 5. Use property._id for the key!
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="py-20 text-center border border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400 font-light italic">No se encontraron propiedades en esta ubicación.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};