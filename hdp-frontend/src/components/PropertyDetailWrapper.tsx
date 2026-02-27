import { useParams } from 'react-router-dom';
import { PropertyDetail } from './propertyDetail/PropertyDetail';
import { MOCK_PROPERTIES } from '../data/mockData';

export const PropertyDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();

  // Use .find() and ensure IDs match types (string vs string)
  const property = MOCK_PROPERTIES.find((p) => p.id === id);
  
  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-40">
        <h1 className="font-display text-3xl text-slate-900">Property not found</h1>
        <p className="mt-2 text-slate-500 font-light">The sanctuary you are looking for is unavailable.</p>
      </div>
    );
  }
  
  return <PropertyDetail property={property} />;
};