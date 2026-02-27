// src/components/PropertyGrid.tsx
import { PropertyCard } from './PropertyCard';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

import {Link} from 'react-router-dom';

interface PropertyGridProps {
  properties: Property[];
}

export const PropertyGrid = ({ properties }: PropertyGridProps) => {
  const { t } = useTranslation();

  return (
    <section id="properties" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
      <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl text-slate-900 sm:text-4xl md:text-5xl">
            {t('properties.title')}
          </h2>
          <p className="mt-3 max-w-md text-sm font-light text-slate-500 sm:mt-4 sm:text-base">
            {t('properties.subtitle')}
          </p>
        </div>
        <Link to="/catalog" className="self-start text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900 sm:text-xs md:self-auto">
          {t('properties.view_all')} →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};