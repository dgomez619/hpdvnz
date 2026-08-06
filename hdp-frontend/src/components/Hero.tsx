import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchTab } from './SearchTab';
import CaribeBG from '../assets/bgimg1sm.jpg';
import CineticBg from '../assets/bgimg2sm.png';
import AvilaBG from '../assets/bgimg3sm.jpg';

type HeroVariant = {
  lowRes: string;
  highRes: string;
};

const HERO_VARIANTS: HeroVariant[] = [
  {
    lowRes: CaribeBG,
    highRes:
      'https://res.cloudinary.com/dwrinmdz0/image/upload/v1786043023/WebAssets/bgimg1_qbk1tc.jpg',
  },
  {
    lowRes: CineticBg,
    highRes:
      'https://res.cloudinary.com/dwrinmdz0/image/upload/v1786043019/WebAssets/bgimg2_hs7nyt.png',
  },
  {
    lowRes: AvilaBG,
    highRes:
      'https://res.cloudinary.com/dwrinmdz0/image/upload/v1786043377/WebAssets/bgimg3_1_myttlj.jpg',
  },
];

export const Hero = () => {
  const { t } = useTranslation();
  const [selectedVariant] = useState<HeroVariant>(() => {
    const randomIndex = Math.floor(Math.random() * HERO_VARIANTS.length);
    return HERO_VARIANTS[randomIndex];
  });
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = selectedVariant.highRes;

    const handleLoad = () => {
      setIsHighResLoaded(true);
    };

    const handleError = () => {
      setIsHighResLoaded(false);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [selectedVariant]);

  return (
    <section className="relative z-10 min-h-dvh w-full overflow-visible bg-slate-900">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 animate-in fade-in zoom-in-105"
          style={{ backgroundImage: `url(${selectedVariant.lowRes})` }}
        />

        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-out ${
            isHighResLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${selectedVariant.highRes})` }}
        />

        <div className="absolute inset-0 bg-black/30" />

        {!isHighResLoaded && (
          <div className="sr-only" aria-live="polite">
            Loading background image
          </div>
        )}
      </div>

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