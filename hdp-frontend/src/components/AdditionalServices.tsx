// src/components/AdditionalServices.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { ServiceInquiryModal } from './Booking/ServiceInquiryModal'; // We'll create this next

interface Service {
  _id: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  category: string;
  image: string;
  priceInfo?: string;
}

export const AdditionalServices = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Inquiry Modal
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleInquireClick = (service: Service) => {
    setSelectedService(service);
    setIsInquiryOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="max-w-3xl mb-16">
          <h1 className="font-display text-5xl md:text-6xl text-slate-900 italic uppercase">
            {t('services.page_title')}
          </h1>
          <p className="mt-6 text-lg text-slate-500 font-light leading-relaxed">
            {t('services.page_subtitle')}
          </p>
          <div className="mt-8 inline-block border border-slate-200 px-4 py-2 rounded-full">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {t('services.exclusive_badge')}
            </p>
          </div>
        </header>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service) => {
            const title = i18n.language === 'en' ? service.title_en : service.title_es;
            const description = i18n.language === 'en' ? service.description_en : service.description_es;

            return (
              <div key={service._id} className="group cursor-pointer">
                <div 
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6 shadow-sm"
                  onClick={() => handleInquireClick(service)}
                >
                  <img 
                    src={service.image} 
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                    {t(`services.cat_${service.category}`)}
                  </span>
                  {service.priceInfo && (
                    <span className="text-[10px] font-medium text-slate-900 italic">
                      {service.priceInfo}
                    </span>
                  )}
                </div>

                <h3 className="mt-2 font-display text-2xl text-slate-900 italic">
                  {title}
                </h3>
                <p className="mt-3 text-slate-500 font-light leading-relaxed text-sm line-clamp-3">
                  {description}
                </p>
                
                <button 
                  onClick={() => handleInquireClick(service)}
                  className="mt-6 text-[10px] font-bold uppercase tracking-widest border-b border-slate-900 pb-1 hover:opacity-50 transition-all"
                >
                  {t('services.inquire_now')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inquiry Modal - The Gatekeeper */}
      {selectedService && (
        <ServiceInquiryModal 
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          service={selectedService}
        />
      )}
    </div>
  );
};