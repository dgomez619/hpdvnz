// src/components/PropertyGrid.tsx
import { useState } from 'react';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from './common/PropertyCardSkeleton';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

import {Link} from 'react-router-dom';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
}

const INITIAL_VISIBLE = 6;
const LOAD_MORE_STEP = 3;

export const PropertyGrid = ({ properties, isLoading = false }: PropertyGridProps) => {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

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
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => <PropertyCardSkeleton key={index} />)
          : visibleProperties.map((property) => <PropertyCard key={property._id} property={property} />)}
      </div>

      {!isLoading && hasMore && (
        <div className="mt-12 flex justify-center sm:mt-14 lg:mt-16">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + LOAD_MORE_STEP)}
            className="w-full max-w-xs border border-slate-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 sm:w-auto sm:text-xs"
          >
            {t('properties.load_more')}
          </button>
        </div>
      )}
    </section>
  );
};