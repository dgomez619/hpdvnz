import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetailWrapper } from './components/PropertyDetailWrapper'; // Assuming you named it this
import { PropertyCatalog } from './components/PropertyCatalog';
import { AdditionalServices } from './components/AdditionalServices'; // New Import
import { ScrollToTop } from './components/ScrollToTop';
import { MOCK_PROPERTIES } from './data/mockData';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <ScrollToTop /> {/* Essential for UX when switching pages */}
      <div className="relative min-h-screen bg-white font-sans text-slate-900">
        <Navbar />
        
        <Routes>
          {/* HOME PAGE */}
          <Route path="/" element={
            <main>
              <Hero />
              <div id="properties">
                <PropertyGrid properties={MOCK_PROPERTIES} />
              </div>
              
              {/* Quality Guarantee Section */}
              <section id="about" className="bg-slate-50 py-24 px-6 text-center">
                <div className="mx-auto max-w-3xl">
                  <h2 className="font-display text-3xl mb-6 text-slate-900">
                    {t('guarantee.title')}
                  </h2>
                  <p className="text-slate-500 font-light leading-relaxed text-lg">
                    {t('guarantee.description')}
                  </p>
                </div>
              </section>
            </main>
          } />

          {/* CATALOG PAGE */}
          <Route path="/catalog" element={<PropertyCatalog />} />

          {/* ADDITIONAL SERVICES PAGE */}
          <Route path="/services" element={<AdditionalServices />} />

          {/* PROPERTY DETAIL PAGE */}
          <Route path="/property/:id" element={<PropertyDetailWrapper />} />
        </Routes>

        <footer className="border-t border-gray-100 py-12 px-6 text-center text-xs uppercase tracking-widest text-slate-400">
          © 2026 Hospedaje por Dias.
        </footer>
      </div>
    </Router>
  );
}

export default App;