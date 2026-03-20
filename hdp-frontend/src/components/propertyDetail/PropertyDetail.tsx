import { useTranslation } from 'react-i18next';
import type { Property } from '../../types/property';
import { PropertyGallery } from './PropertyGallery';
import { BookingWidget } from './BookingWidget';
import { PropertyInfo } from './PropertyInfo';
import { PhotoModal } from './PhotoModal';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const PropertyDetail = ({ property }: { property: Property }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safety check: if somehow property is null, don't crash the whole app
  if (!property) return null;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    // Add check to ensure images exist before calculating length
    const imageCount = property.images?.length || 0;
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount);
    }
  };

  const prevImage = () => {
    const imageCount = property.images?.length || 0;
    if (imageCount > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-20 md:pt-24">
      {/* ... (Back button and Header logic remains the same) */}

      {/* 4. Update Gallery: Ensure images array exists */}
      <PropertyGallery 
        images={property.images || []} 
        onImageClick={openModal} 
      />

      {/* 5. Render Modal */}
      {isModalOpen && property.images && (
        <PhotoModal 
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <PropertyInfo property={property} />

          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.about_space')}</h2>
            <p className="mt-4 leading-relaxed text-slate-600 font-light text-lg">
              {property.description}
            </p>
          </div>

          {/* Amenities Section: Enhanced Safety */}
          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.amenities')}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Ensure we have an array, or show a 'No amenities listed' message */}
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-4 text-slate-600 font-light">
                    <span className="h-2 w-2 rounded-full bg-slate-900" />
                    {item}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 font-light italic text-sm">No amenities listed.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="relative">
          <div className="sticky top-28 hidden lg:block">
            <BookingWidget property={property} />
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
        <div>
          <p className="font-bold text-slate-900">
            ${property.pricePerNight} 
            <span className="font-light text-slate-500"> / {t('properties.night')}</span>
          </p>
          <p className="text-xs underline">{t('detail.available_dates')}</p>
        </div>
        <button className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-bold text-white active:scale-95 transition-transform">
          {t('detail.reserve_button')}
        </button>
      </div>
    </div>
  );
};