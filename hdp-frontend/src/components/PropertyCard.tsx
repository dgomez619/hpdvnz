// src/components/PropertyCard.tsx
import type { Property } from '../types/property';

import {Link} from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  return (
    <Link to={`/property/${property._id}`} className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-100">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Top Badge */}
        <div className="absolute left-3 top-3 bg-white/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-900 backdrop-blur-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[10px]">
          {property.category}
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="pr-3 font-display text-lg text-slate-900 sm:text-xl">{property.title}</h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400">★</span>
            <span className="text-xs font-medium text-slate-600">{property.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 font-light">{property.location}</p>
        
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400 sm:text-sm">
            {property.beds}bd • {property.baths}ba • {property.sqft}ft²
          </p>
          <p className="text-sm font-semibold text-slate-900">
            ${property.pricePerNight} <span className="font-light text-slate-500">/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
};