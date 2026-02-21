// src/components/PropertyGrid.tsx
import { PropertyCard } from './PropertyCard';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid = ({ properties }: PropertyGridProps) => {
  const { t } = useTranslation();

  return (
    <section id="properties" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl text-slate-900 md:text-5xl">
            {t('properties.title')}
          </h2>
          <p className="mt-4 max-w-md text-slate-500 font-light">
            {t('properties.subtitle')}
          </p>
        </div>
        <button className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          {t('properties.view_all')} →
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};