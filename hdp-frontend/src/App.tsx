import { useState, useEffect } from 'react'; // 1. Add these imports

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetailWrapper } from './components/PropertyDetailWrapper';
import { PropertyCatalog } from './components/PropertyCatalog';
import { AdditionalServices } from './components/AdditionalServices';
import { ScrollToTop } from './components/ScrollToTop';
import { useTranslation } from 'react-i18next';
import { AboutUs } from './components/AboutUs';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // 1. ADD THIS: Define the API base URL for deployment
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const [realProperties, setRealProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicProperties = async () => {
      try {
        // 2. UPDATE THIS: Use backticks and the API_BASE variable
        const response = await fetch(`${API_BASE}/api/properties`);
        const data = await response.json();
        setRealProperties(data);
      } catch (error) {
        console.error("Error fetching properties for the front-end:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProperties();
  }, [API_BASE]); // Added API_BASE to dependencies

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="relative min-h-screen bg-white font-sans text-slate-900">
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <div id="properties">
              {/* 4. Pass the realProperties instead of MOCK_PROPERTIES */}
              {loading ? (
                <div className="py-20 text-center text-slate-400 uppercase tracking-widest text-[10px]">
                  {t('common.loading_collection')} {/* <--- Now 't' is being used! */}
                </div>
              ) : (
                <PropertyGrid properties={realProperties} />
              )}
            </div>

            <section id="about" className="bg-slate-50 py-24 px-6 text-center">
              {/* ... Keep your AboutUs logic */}
            </section>
          </main>
        } />

        <Route path="/catalog" element={<PropertyCatalog properties={realProperties} />} />
        <Route path="/services" element={<AdditionalServices />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/property/:id" element={<PropertyDetailWrapper />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>

      {/* 3. Conditionally show Footer */}
      {!isAdminPage && (
        <footer className="border-t border-gray-100 py-12 px-6 text-center text-xs uppercase tracking-widest text-slate-400">
          © 2026 Hospedaje por Dias.
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;