// src/components/PropertyCard.tsx
import type { Property } from '../types/property';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { t, i18n } = useTranslation();
  
  // 1. HELPER LOGIC: Determine active language state
  const isEn = i18n.language === 'en';

  // 2. DATA FALLBACKS: Pick the right string, or fallback to Spanish if English is missing
  const displayTitle = isEn ? (property.title_en || property.title_es) : property.title_es;
  const displayCategory = isEn ? (property.category_en || property.category_es) : property.category_es;
  const displayDescription = isEn ? (property.description_en || property.description_es) : property.description_es;

  // 3. UNIT CONVERSION: Handle Square Meters vs Square Feet
  // Standard conversion: 1 m² = 10.764 ft²
  const displayArea = isEn 
    ? Math.round((property.sqm || 0) * 10.764).toLocaleString() 
    : (property.sqm || 0).toLocaleString();
  
  const areaUnit = isEn ? 'ft²' : 'm²';

  return (
    <Link to={`/property/${property._id}`} className="group cursor-pointer block">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-100">
        <img 
          src={property.images && property.images[0] ? property.images[0] : '/placeholder-property.jpg'} 
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Top Badge (Category) */}
        <div className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-900 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[10px]">
          {displayCategory}
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-5 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="pr-3 font-display text-lg text-slate-900 sm:text-xl truncate">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">★</span>
            <span className="text-xs font-medium text-slate-600">{property.rating || 'N/A'}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 font-light">{property.location}</p>

        {/* Localized Description with Line Clamp */}
        <p className="line-clamp-2 text-xs text-slate-400 font-light leading-relaxed min-h-[2.5rem]">
          {displayDescription}
        </p>
        
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Unit-Converted Specs */}
          <p className="text-xs text-slate-400 sm:text-sm">
            {property.beds}bd • {property.baths}ba • {displayArea}{areaUnit}
          </p>
          
          {/* Price with Translated Night Label */}
          <p className="text-sm font-semibold text-slate-900">
            ${property.pricePerNight?.toLocaleString()} 
            <span className="font-light text-slate-500"> / {t('properties.night')}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};