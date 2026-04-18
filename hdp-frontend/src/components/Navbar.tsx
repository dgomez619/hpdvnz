// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";
  const isNavbarActive = isScrolled || !isHomePage || menuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.about'), path: "/about" },
    { name: t('nav.properties'), path: "/catalog" },
    { name: t('nav.services'), path: "/services" },
  ];

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 px-6 py-4 ${
        isNavbarActive ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          <Link to="/" className={`z-50 text-xl font-bold tracking-[0.2em] transition-colors duration-500 ${
            (isNavbarActive && !menuOpen) ? 'text-slate-900' : (menuOpen ? 'text-slate-900' : 'text-white')
          }`}>
            HOSPEDAJE<span className="font-light opacity-60">PORDIAS</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all hover:opacity-60 ${
                isNavbarActive ? 'text-slate-600' : 'text-white'
              }`}>
                {link.name}
              </Link>
            ))}
            <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
              className={`text-[10px] font-bold border border-current px-2 py-0.5 rounded-sm ${
                isNavbarActive ? 'text-slate-900' : 'text-white'
              }`}>
              {i18n.language.toUpperCase().substring(0, 2)}
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="z-50 lg:hidden p-2">
            <div className={`w-6 h-0.5 mb-1.5 transition-all ${isNavbarActive || menuOpen ? 'bg-slate-900' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <div className={`w-6 h-0.5 mb-1.5 transition-all ${isNavbarActive || menuOpen ? 'bg-slate-900' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-0.5 transition-all ${isNavbarActive || menuOpen ? 'bg-slate-900' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>

          {/* UPDATED DESKTOP CTA: Now links to Catalog */}
          <Link 
            to="/catalog" 
            className={`hidden lg:block px-7 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
              isNavbarActive ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-900'
            }`}
          >
            {t('nav.book_now')}
          </Link>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-500 lg:hidden ${
        menuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-10 text-center">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="text-xl font-display text-slate-900 tracking-widest uppercase">
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
            className="text-xs font-bold border-b-2 border-slate-900 pb-1 tracking-widest"
          >
            {i18n.language === 'en' ? 'SWITCH TO ESPAÑOL' : 'CAMBIAR A INGLÉS'}
          </button>

          {/* MOBILE CTA: Added here so mobile users have a way to book */}
          <Link 
            to="/catalog" 
            className="w-full bg-slate-900 text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm"
          >
            {t('nav.book_now')}
          </Link>
        </div>
      </div>
    </>
  );
};