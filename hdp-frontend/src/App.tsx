// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetail } from './components/PropertyDetail';
import { MOCK_PROPERTIES } from './data/mockData'; // Move mock data to its own file 
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Ensure we scroll to top on route change */}
      <div className="relative min-h-screen bg-white font-sans text-slate-900">
        <Navbar />
        
        <Routes>
          {/* HOME PAGE */}
          <Route path="/" element={
            <main>
              <Hero />
              <PropertyGrid properties={MOCK_PROPERTIES} />
              {/* Your Guarantee Section here */}
            </main>
          } />

          {/* DETAIL PAGE */}
          <Route path="/property/:id" element={<PropertyDetailWrapper />} />
        </Routes>

        <footer className="border-t border-gray-100 py-12 px-6 text-center text-xs uppercase tracking-widest text-slate-400">
          © 2026 Hospedaje por Dias.
        </footer>
      </div>
    </Router>
  );
}

// A small wrapper to find the correct property based on the URL ID
const PropertyDetailWrapper = () => {
  const { id } = useParams();
  const property = MOCK_PROPERTIES.find(p => p.id === id);
  
  if (!property) return <div className="pt-40 text-center">Property not found</div>;
  
  return <PropertyDetail property={property} />;
};

export default App;