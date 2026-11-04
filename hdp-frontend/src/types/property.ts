// src/types/property.ts

export interface Property {
  _id: string;
  // Public-facing, SEO-friendly identifier. Always present (required at the
  // database level). Use this — not _id — for any public-facing URL.
  slug: string;
  // Every slug this property has ever had (current one included, as the
  // last entry). Optional on the client since older cached payloads or
  // partial fetches may omit it.
  slugHistory?: string[];
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
  maxCapacity: number;
  
  // The Base Unit
  sqm: number; 

  images: string[];
  amenities: string[]; // IDs like 'wifi', 'gym'
  displayOrder?: number | null;
  
  rating?: number; // Optional/Virtual
  externalSyncLinks?: { platform: string; url: string; _id?: string }[];
  blockedDates: {
    startDate: string;
    endDate: string;
    source: string;
    _id: string;
  }[];
}