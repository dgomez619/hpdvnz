import { useState} from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTab } from './SearchTab';
// Import your local asset correctly
import cromoBg from '../assets/cromointfrnc.png';
import avilaBg from '../assets/avila.jpg'

export const Hero = () => {
  const { t } = useTranslation();
  const [bgImage] = useState<string>(() => {
    const images = [
      // Caribbean beach with turquoise waters
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000",
      // High-end architectural shot of El Avila
      avilaBg, // Your local import
      cromoBg // Your local import
    ];

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Image Layer */}
      {bgImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] animate-in fade-in zoom-in-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center text-white">
        <h1 className="max-w-4xl font-display text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl font-light text-gray-200">
          {t('hero.subtitle')}
        </p>

        <div className="mt-12 w-full max-w-5xl">
          <SearchTab />
        </div>
      </div>
    </section>
  );
};