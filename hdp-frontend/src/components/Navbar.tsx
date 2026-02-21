import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('en') ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-500 px-6 py-4 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Brand Logo */}
        <div className={`text-2xl font-bold tracking-tighter transition-colors duration-500 ${
          isScrolled ? 'text-slate-900' : 'text-white'
        }`}>
          HOSPEDAJE <span className="font-light opacity-70">POR DIAS</span>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center space-x-10 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-500 ${
          isScrolled ? 'text-slate-600' : 'text-white/90'
        }`}>
          <a href="#properties" className="hover:text-brand-gold transition-colors">
            {t('nav.properties')}
          </a>
          <a href="#about" className="hover:text-brand-gold transition-colors">
            {t('nav.about')}
          </a>
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="cursor-pointer border border-current px-2 py-1 rounded-sm hover:bg-current hover:text-white transition-all"
          >
            {i18n.language.toUpperCase().substring(0, 2)}
          </button>
        </div>

        {/* Action Button */}
        <button className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
          isScrolled 
            ? 'bg-slate-900 text-white hover:bg-slate-700' 
            : 'bg-white text-slate-900 hover:bg-gray-200'
        }`}>
          {t('nav.book_now')}
        </button>
      </div>
    </nav>
  );
};