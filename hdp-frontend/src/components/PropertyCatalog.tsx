import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './common/PropertyCardSkeleton';
import type { Property } from '../types/property';

// Locations are free text, so "Lecheria", "Lechería " and "lecheria, Anzoátegui" must collapse to one city.
const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const getCityLabel = (location: string) => location.split(',')[0].replace(/\s+/g, ' ').trim();

// 2. Accept properties as a prop from App.tsx
export const PropertyCatalog = ({ properties = [], isLoading = false }: { properties: Property[]; isLoading?: boolean }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('city') || t('search.placeholder_all_locations');
  const [activeFilter, setActiveFilter] = useState(selectedCity);

  useEffect(() => {
    setActiveFilter(selectedCity);
  }, [selectedCity]);

  // 3. Logic to filter based on real MongoDB data
  const allLabel = t('search.placeholder_all_locations');
  const isAllActive = activeFilter === allLabel;
  const normalizedFilter = normalize(activeFilter);
  const filteredProperties = isAllActive
    ? properties
    : properties.filter(p => normalize(p.location).includes(normalizedFilter));

  // 4. Generate dynamic filters based on what's actually in your DB
  // Cities are de-duplicated by normalized name (case, accents, spacing, trailing region), keeping the first label seen
  const cityMap = new Map<string, string>();
  properties.forEach(p => {
    const label = getCityLabel(p.location);
    const key = normalize(label);
    if (key && !cityMap.has(key)) cityMap.set(key, label);
  });
  const dynamicFilters = [allLabel, ...cityMap.values()];

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

        <div className="flex flex-col gap-12 xl:flex-row">

          {/* Sidebar for dynamic filters */}
          <aside className="w-full shrink-0 xl:sticky xl:top-28 xl:w-72 xl:self-start">
            <section
              aria-labelledby="location-filter-heading"
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3
                  id="location-filter-heading"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500"
                >
                  {t('catalog.filter_location')}
                </h3>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-400 shadow-sm">
                  {properties.length}
                </span>
              </div>

              <div className="flex max-h-44 gap-2 overflow-x-auto pb-1 xl:max-h-none xl:flex-col xl:overflow-visible xl:pb-0">
                {dynamicFilters.map((city) => {
                  const isActive = city === allLabel ? isAllActive : normalize(activeFilter) === normalize(city);

                  return (
                    <button
                      key={city}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveFilter(city)}
                      className={`whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 xl:w-full ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15'
                          : 'bg-white text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {city}
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>

          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{isLoading ? '…' : filteredProperties.length} {t('catalog.results_found')}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
              {isLoading
                ? Array.from({ length: 6 }, (_, index) => <PropertyCardSkeleton key={index} />)
                : filteredProperties.map((property) => (
                    <PropertyCard key={property._id} property={property} searchParams={searchParams} />
                  ))}
            </div>

            {!isLoading && filteredProperties.length === 0 && (
              <div className="py-20 text-center border border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400 font-light italic">{t('catalog.no_results')}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};