// src/types/property.ts

export interface Property {
  _id: string;
  // Localized Strings
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  category_es: string;
  category_en: string;

  location: string;
  pricePerNight: number;
  beds: number;
  baths: number;
  
  // The Base Unit
  sqm: number; 

  images: string[];
  amenities: string[]; // IDs like 'wifi', 'gym'
  
  rating?: number; // Optional/Virtual
  externalSyncLinks?: { platform: string; url: string; _id?: string }[];
  blockedDates: {
    startDate: string;
    endDate: string;
    source: string;
    _id: string;
  }[];
}