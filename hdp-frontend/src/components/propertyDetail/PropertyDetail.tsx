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
import { BookingModal } from './BookingModal';
interface PropertyDetailProps {
  property: Property;
  initialBookingDates?: { startDate: string; endDate: string; guests: number };
}

export const PropertyDetail = ({ property, initialBookingDates }: PropertyDetailProps) => {
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
    startDate: initialBookingDates?.startDate || '',
    endDate: initialBookingDates?.endDate || '',
    guests: initialBookingDates?.guests || 1,
  });
  const [bookingValidationError, setBookingValidationError] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'mayBeUnavailable' | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

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

  const handleCheckAvailability = async () => {
    const { startDate, endDate } = bookingDates;
    if (!startDate || !endDate || endDate <= startDate) {
      setAvailabilityStatus(null);
      setBookingValidationError(!startDate || !endDate ? t('detail.available_dates') : t('search.check_out'));
      return;
    }

    setBookingValidationError('');
    setIsCheckingAvailability(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiBase}/api/properties/${property._id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) throw new Error('Availability check failed');
      const data: { mayBeUnavailable: boolean } = await response.json();
      setAvailabilityStatus(data.mayBeUnavailable ? 'mayBeUnavailable' : 'available');
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityStatus(null);
      setBookingValidationError(t('booking.availability_error'));
    } finally {
      setIsCheckingAvailability(false);
    }
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
        isLoading={false}
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

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 xl:grid-cols-3">
        {/* Booking form stays in normal flow at compact widths so it is never clipped by a short viewport. */}
        <aside className="order-first self-start xl:col-start-3 xl:row-start-1 xl:order-0">
          <BookingWidget 
            property={property} 
            startDate={bookingDates.startDate}
            endDate={bookingDates.endDate}
            guests={bookingDates.guests}
            onStartDateChange={(value) => {
              setBookingValidationError('');
              setAvailabilityStatus(null);
              setBookingDates((prev) => ({
                ...prev,
                startDate: value,
                endDate: prev.endDate && prev.endDate <= value ? '' : prev.endDate,
              }));
            }}
            onEndDateChange={(value) => {
              setBookingValidationError('');
              setAvailabilityStatus(null);
              setBookingDates((prev) => ({ ...prev, endDate: value }));
            }}
            onGuestsChange={(value) => setBookingDates((prev) => ({ ...prev, guests: value }))}
            onCheckAvailability={handleCheckAvailability}
            onReserveClick={handleOpenBookingModal}
            validationError={bookingValidationError}
            availabilityStatus={availabilityStatus}
            isCheckingAvailability={isCheckingAvailability}
          />
        </aside>

        {/* Left Content */}
        <div className="xl:col-span-2 space-y-10">
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