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
    <section className="relative z-10 min-h-dvh w-full overflow-visible bg-slate-900">
      {/* Background Image Layer */}
      {bgImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] animate-in fade-in zoom-in-105"
          style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-20 flex min-h-dvh flex-col items-center justify-center px-4 py-16 text-center text-white sm:px-6 md:py-20">
        <h1 className="max-w-4xl font-display text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-5 max-w-xl text-[clamp(1rem,2vw,1.25rem)] font-light text-gray-200 md:mt-6">
          {t('hero.subtitle')}
        </p>

        <div className="mt-8 w-full max-w-5xl md:mt-12">
          <SearchTab />
        </div>
      </div>
    </section>
  );
};