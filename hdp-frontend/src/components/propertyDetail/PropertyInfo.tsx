import type { Property } from '../../types/property';

export const PropertyInfo = ({ property }: { property: Property }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-medium text-slate-900">
        Entire {property.category} hosted by Hospedaje por Dias
      </h2>
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold">HD</div>
    </div>
    <div className="flex gap-4 text-slate-500 font-light border-b border-slate-100 pb-6">
      <span>{property.beds} beds</span>
      <span>•</span>
      <span>{property.baths} baths</span>
      <span>•</span>
      <span>{property.sqft} m²</span>
    </div>
  </div>
);