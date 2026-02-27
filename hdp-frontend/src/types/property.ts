// src/types/property.ts
export interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  rating: number;
  // The missing fields:
  description: string; 
  amenities: string[]; // This fixes the "implicit any" in your map
  category: string;
}