// src/components/property/PropertyInfo.tsx
import { Bed, Bath, Maximize } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Property } from '../../types/property';

interface PropertyInfoProps {
  property: Property;
  displayArea: number;
  areaUnit: string;
}

export const PropertyInfo = ({ property, displayArea, areaUnit }: PropertyInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-8 border-b border-slate-100 pb-10">
      {/* Beds */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-900">
          <Bed size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-display text-xl text-slate-900">{property.beds}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {t('properties.beds')}
          </p>
        </div>
      </div>

      {/* Baths */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-900">
          <Bath size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-display text-xl text-slate-900">{property.baths}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {t('properties.baths')}
          </p>
        </div>
      </div>

      {/* Area (m² or ft²) */}
      {displayArea != null && (
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-900">
          <Maximize size={20} strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-display text-xl text-slate-900">
            {displayArea.toLocaleString()}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {areaUnit}
          </p>
        </div>
      </div>
      )}
    </div>
  );
};