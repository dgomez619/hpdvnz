// src/types/property.ts
export interface Property {
  _id: string;
  title: string;
  location: string;
  description: string;
  pricePerNight: number;
  beds: number;
  baths: number;
  images: string[];
  amenities: string[];
  // Add '?' to make these optional so the compiler stops complaining
  sqft?: number; 
  rating?: number;
  category?: string;
}