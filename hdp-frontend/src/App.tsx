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
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1771810059/val-91/Screenshot_2026-02-22_at_7.26.04_PM_qyfixk.jpg'],
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
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1754434851/vistamar10c/sala2_k9a33z.png'],
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
    images: ['https://res.cloudinary.com/dwrinmdz0/image/upload/v1771810534/chichiriviche/Screenshot_2026-02-22_at_7.34.14_PM_nyt7dq.jpg'],
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
<section id="about" className="bg-slate-50 px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
  <div className="mx-auto max-w-3xl">
    <h2 className="mb-4 font-display text-2xl text-slate-900 sm:mb-6 sm:text-3xl">
      {t('guarantee.title')}
    </h2>
    <p className="text-base leading-relaxed text-slate-500 font-light sm:text-lg">
      {t('guarantee.description')}
    </p>
    
    {/* Optional: Add a subtle 'signature' or icon to reinforce the premium feel */}
    <div className="mt-8 flex items-center justify-center opacity-20">
      <div className="h-px w-8 bg-slate-900 sm:w-12"></div>
      <span className="mx-3 text-[10px] uppercase tracking-[0.22em] sm:mx-4 sm:text-xs sm:tracking-[0.3em]">Authentic Hospitality</span>
      <div className="h-px w-8 bg-slate-900 sm:w-12"></div>
    </div>
  </div>
</section>
      </main>

      {/* 7. Basic Footer Placeholder */}
      <footer className="border-t border-gray-100 px-4 py-10 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:px-6 sm:py-12 sm:text-xs sm:tracking-widest">
        © 2026 Hospedaje por Dias. All rights reserved.
      </footer>
    </div>
  );
}

export default App;