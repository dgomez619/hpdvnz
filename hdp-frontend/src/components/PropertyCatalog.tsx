import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyCard } from './PropertyCard';
import { MOCK_PROPERTIES } from '../data/mockData';

export const PropertyCatalog = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('All');

  // Logic to filter properties (this will be dynamic once MongoDB is connected)
  const filteredProperties = activeFilter === 'All' 
    ? MOCK_PROPERTIES 
    : MOCK_PROPERTIES.filter(p => p.location.includes(activeFilter));

  const filters = ['All', 'Valencia', 'Lecheria', 'Chiciriviche', 'Tinaquillo'];

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header Section */}
        <header className="mb-12 border-b border-slate-100 pb-12">
          <h1 className="font-display text-5xl text-slate-900 md:text-6xl">
            {t('catalog.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-light text-slate-500">
            {t('catalog.subtitle')}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">
                {t('catalog.filter_location')}
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {filters.map((city) => (
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

          {/* Results Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{filteredProperties.length} {t('catalog.results_found')}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};