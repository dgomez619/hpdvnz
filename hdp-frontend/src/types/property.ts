export interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  category: string; // e.g., 'Apartment', 'Villa', 'Suite'
}