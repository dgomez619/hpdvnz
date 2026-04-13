// src/utils/amenityIcons.tsx
import { 
  Wifi, 
  Waves, 
  Wind, 
  Car, 
  Tv,  
  Utensils, 
  ShieldCheck, 
  Flame, 
  IceCream, 
  Zap
} from 'lucide-react';

export interface Amenity {
  id: string;
  label_es: string;
  label_en: string;
  icon: React.ReactNode;
}

export const AMENITIES_LIST: Amenity[] = [
  { id: 'wifi', label_es: 'Wifi de alta velocidad', label_en: 'High-speed Wifi', icon: <Wifi size={20} strokeWidth={1.5} /> },
  { id: 'pool', label_es: 'Piscina privada', label_en: 'Private Pool', icon: <Waves size={20} strokeWidth={1.5} /> },
  { id: 'ac', label_es: 'Aire Acondicionado', label_en: 'Air Conditioning', icon: <Wind size={20} strokeWidth={1.5} /> },
  { id: 'parking', label_es: 'Estacionamiento gratis', label_en: 'Free Parking', icon: <Car size={20} strokeWidth={1.5} /> },
  { id: 'tv', label_es: 'Smart TV', label_en: 'Smart TV', icon: <Tv size={20} strokeWidth={1.5} /> },
  { id: 'kitchen', label_es: 'Cocina equipada', label_en: 'Fully Equipped Kitchen', icon: <Utensils size={20} strokeWidth={1.5} /> },
  { id: 'security', label_es: 'Seguridad 24/7', label_en: '24/7 Security', icon: <ShieldCheck size={20} strokeWidth={1.5} /> },
  { id: 'bbq', label_es: 'Parrillera / Grill', label_en: 'BBQ / Grill', icon: <Flame size={20} strokeWidth={1.5} /> },
  { id: 'fridge', label_es: 'Nevera', label_en: 'Refrigerator', icon: <IceCream size={20} strokeWidth={1.5} /> }, // Using IceCream as a fallback fridge icon
  { id: 'power inverter', label_es: 'Inversor de energía', label_en: 'Power Inverter', icon: <Zap size={20} strokeWidth={1.5} /> },
];

// Helper to get an amenity by ID
export const getAmenityById = (id: string) => AMENITIES_LIST.find(a => a.id === id);

        