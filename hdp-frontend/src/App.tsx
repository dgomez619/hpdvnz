import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import type { Property } from './types/property';
import './i18n'; // Ensure i18n is initialized
import { useTranslation } from 'react-i18next';

// 1. Temporary Mock Data (This will eventually come from MongoDB)
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Obsidian Suite',
    location: 'Valencia, Carabobo',
    pricePerNight: 550,
    rating: 4.98,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'],
    beds: 1,
    baths: 1,
    sqft: 850,
    category: 'Penthouse'
  },
  {
    id: '2',
    title: 'Azure Waters Villa',
    location: 'Lecheria, Anzoátegui',
    pricePerNight: 820,
    rating: 4.95,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'],
    beds: 4,
    baths: 3,
    sqft: 2400,
    category: 'Villa'
  },
  {
    id: '3',
    title: 'Minimalist Desert Retreat',
    location: 'Chiciriviche, Falcón',
    pricePerNight: 410,
    rating: 4.89,
    images: ['https://images.unsplash.com/photo-1432303492674-642e9d0944b2?auto=format&fit=crop&q=80&w=800'],
    beds: 2,
    baths: 2,
    sqft: 1100,
    category: 'Modern House'
  }
];

function App() {
  const { t } = useTranslation();

  return (
    /* 2. The outer div must be relative to allow the fixed Navbar to float correctly */
    <div className="relative min-h-screen bg-white font-sans text-slate-900">
      
      {/* 3. Navbar stays fixed at the top */}
      <Navbar />

      <main>
        {/* 4. Hero section fills the initial view */}
        <Hero />

        {/* 5. Property section with padding for breathing room */}
        <div className="bg-white">
          <PropertyGrid properties={MOCK_PROPERTIES} />
        </div>

       {/* 6. Quality Guarantee Section */}
<section className="bg-slate-50 py-24 px-6 text-center">
  <div className="mx-auto max-w-3xl">
    <h2 className="font-display text-3xl mb-6 text-slate-900">
      {t('guarantee.title')}
    </h2>
    <p className="text-slate-500 font-light leading-relaxed text-lg">
      {t('guarantee.description')}
    </p>
    
    {/* Optional: Add a subtle 'signature' or icon to reinforce the premium feel */}
    <div className="mt-8 flex justify-center opacity-20">
      <div className="h-px w-12 bg-slate-900 self-center"></div>
      <span className="mx-4 text-xs tracking-[0.3em] uppercase">Authentic Hospitality</span>
      <div className="h-px w-12 bg-slate-900 self-center"></div>
    </div>
  </div>
</section>
      </main>

      {/* 7. Basic Footer Placeholder */}
      <footer className="border-t border-gray-100 py-12 px-6 text-center text-xs uppercase tracking-widest text-slate-400">
        © 2026 Hospedaje por Dias. All rights reserved.
      </footer>
    </div>
  );
}

export default App;