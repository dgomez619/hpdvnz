// src/components/PropertyDetail.tsx
import { useTranslation } from 'react-i18next';
import type { Property } from '../../types/property';
import { PropertyGallery } from './PropertyGallery';
import { BookingWidget } from './BookingWidget';
import { PropertyInfo } from './PropertyInfo';
import { PhotoModal } from './PhotoModal';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getAmenityById } from '../../utils/amenityIcons';
import { BookingModal } from '../BookingModal';
export const PropertyDetail = ({ property }: { property: Property }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // --- LOGIC: Area Conversion & Localization ---
  const displayArea = i18n.language === 'en' 
    ? Math.round(property.sqm * 10.764) 
    : property.sqm;

  const areaUnit = i18n.language === 'en' ? 'ft²' : 'm²';

  const currentDescription = i18n.language === 'en' 
    ? property.description_en 
    : property.description_es;

  // --- STATE: Modals ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Photo Gallery Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false); // New Booking Request Modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
  });
  const [bookingValidationError, setBookingValidationError] = useState('');

  if (!property) return null;

  // --- HANDLERS: Gallery ---
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
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

  const handleOpenBookingModal = () => {
    const { startDate, endDate } = bookingDates;
    if (!startDate || !endDate) {
      setBookingValidationError(t('detail.available_dates'));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      setBookingValidationError(t('search.check_out'));
      return;
    }

    setBookingValidationError('');
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white pb-20 pt-20 md:pt-24">
      {/* Back Button */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[15px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-all hover:text-slate-900"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          {t('detail.back_to_previous')}
        </button>
      </div>

      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-medium text-slate-900 md:text-4xl">
          {property.title_en && property.title_es
            ? (i18n.language === 'en' ? property.title_en : property.title_es)
            : property.title_es || property.title_en || ' '}
        </h1>
      </header>

      <PropertyGallery 
        images={property.images || []} 
        onImageClick={openModal} 
      />

      {/* Full Screen Photo Modal */}
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
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-10">
          <PropertyInfo 
            property={property} 
            displayArea={displayArea} 
            areaUnit={areaUnit} 
          />
          
          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.about_space')}</h2>
            <p className="mt-4 leading-relaxed text-slate-600 font-light text-lg whitespace-pre-wrap">
              {currentDescription || property.description_es} 
            </p>
          </div>

          {/* Amenities Section */}
          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.amenities')}</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {property.amenities?.map((id) => {
                const amenity = getAmenityById(id);
                if (!amenity) return null;
                return (
                  <div key={id} className="flex items-center gap-4 text-slate-600">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-900">
                      {amenity.icon}
                    </div>
                    <span className="font-light text-sm tracking-wide">
                      {i18n.language === 'en' ? amenity.label_en : amenity.label_es}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Desktop) */}
        <aside className="relative">
          <div className="sticky top-28 hidden lg:block">
            <BookingWidget 
              property={property} 
              startDate={bookingDates.startDate}
              endDate={bookingDates.endDate}
              guests={bookingDates.guests}
              onStartDateChange={(value) => {
                setBookingValidationError('');
                setBookingDates((prev) => ({ ...prev, startDate: value }));
              }}
              onEndDateChange={(value) => {
                setBookingValidationError('');
                setBookingDates((prev) => ({ ...prev, endDate: value }));
              }}
              onGuestsChange={(value) => setBookingDates((prev) => ({ ...prev, guests: value }))}
              onReserveClick={handleOpenBookingModal}
              validationError={bookingValidationError}
            />
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
        <button 
          onClick={handleOpenBookingModal}
          className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-bold text-white active:scale-95 transition-transform"
        >
          {t('detail.reserve_button')}
        </button>
      </div>

      {/* Inquiry Form Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        property={property}
        startDate={bookingDates.startDate}
        endDate={bookingDates.endDate}
        guests={bookingDates.guests}
      />
    </div>
  );
};