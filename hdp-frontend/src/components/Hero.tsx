import { useTranslation } from 'react-i18next';
import { SearchTab } from './SearchTab';

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')` 
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container - FIXED VERSION */}
      {/* 1. Changed h-full to min-h-screen to ensure it fills the viewport */}
      {/* 2. Added pt-24 to push the content down exactly where the Navbar ends */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center text-white">
        <h1 className="max-w-4xl font-display text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl font-light text-gray-200">
          {t('hero.subtitle')}
        </p>

        {/* The Search Tab Container */}
        <div className="mt-12 w-full max-w-5xl">
          <SearchTab />
        </div>
      </div>
    </section>
  );
};