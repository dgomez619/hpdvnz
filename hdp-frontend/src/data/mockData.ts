import type { Property } from '../types/property';

// 1. Temporary Mock Data (This will eventually come from MongoDB)
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Executive Apartment centrally located',
    location: 'Valencia, Carabobo',
    pricePerNight: 60,
    rating: 4.98,
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1771810059/val-91/Screenshot_2026-02-22_at_7.26.04_PM_qyfixk.jpg'],
    beds: 1,
    baths: 1,
    sqft: 850,
    category: 'Apartment',
    description: 'A stunning penthouse featuring floor-to-ceiling windows with panoramic views of the Avila mountain. Experience the height of luxury in the heart of Caracas.',
    amenities: ['wifi', 'ac', 'kitchen', 'parking', 'pool'],
  },
  {
    id: '2',
    title: 'Beach, Work & Play',
    location: 'Lecheria, Anzoátegui',
    pricePerNight: 40,
    rating: 4.95,
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1754434851/vistamar10c/sala2_k9a33z.png'],
    beds: 4,
    baths: 3,
    sqft: 2400,
    category: 'Apartment',
    description: 'A stunning penthouse featuring floor-to-ceiling windows with panoramic views of the Avila mountain. Experience the height of luxury in the heart of Caracas.',
    amenities: ['wifi', 'ac', 'kitchen', 'parking', 'pool'],
  },
  {
    id: '3',
    title: 'Coastal escape, caribbean vibes',
    location: 'Chiciriviche, Falcón',
    pricePerNight: 70,
    rating: 4.89,
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1771810534/chichiriviche/Screenshot_2026-02-22_at_7.34.14_PM_nyt7dq.jpg'],
    beds: 2,
    baths: 2,
    sqft: 1100,
    category: 'Apartment',
    description: 'A stunning penthouse featuring floor-to-ceiling windows with panoramic views of the Avila mountain. Experience the height of luxury in the heart of Caracas.',
    amenities: ['wifi', 'ac', 'kitchen', 'parking', 'pool'],
  }
];

export { MOCK_PROPERTIES };