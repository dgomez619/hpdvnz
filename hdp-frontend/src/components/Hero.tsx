import { useTranslation } from 'react-i18next';
import { SearchTab } from './SearchTab';
import cromointfrnc from '../assets/cromointfrnc.png';
export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[88vh] w-full overflow-hidden md:h-[90vh]">
      {/* Background Image - Using a high-end architectural placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{ 
          backgroundImage: `url(${cromointfrnc})` 
        }}
      >
        {/* Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-20 pb-10 text-center text-white sm:px-6 md:pt-24 md:pb-12">
        <h1 className="max-w-4xl font-display text-3xl leading-tight tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 max-w-xl text-base font-light text-gray-200 sm:mt-6 sm:text-lg md:text-xl">
          {t('hero.subtitle')}
        </p>

        {/* The Search Tab Container */}
        <div className="mt-8 w-full max-w-5xl sm:mt-12">
          <SearchTab />
        </div>
      </div>
    </section>
  );
};