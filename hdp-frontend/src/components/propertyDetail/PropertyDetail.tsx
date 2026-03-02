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

  // 3. State for Lightbox logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (

    <div className="min-h-screen bg-white pb-20 pt-20 md:pt-24">

     {/* --- BACK BUTTON --- */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[15px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-all hover:text-slate-900"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          {t('detail.back_to_previous')}
        </button>
      </div>

      {/* 1. Header (Mobile/Desktop consistent) */}
      <header className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-3xl font-medium text-slate-900 md:text-4xl">
          {property.title}
        </h1>
        <div className="mt-2 flex items-center justify-between text-sm font-light text-slate-600">
          <p className="underline underline-offset-4">{property.location}</p>
          <div className="flex gap-4">
            <button className="underline font-medium hover:text-black transition-colors">{t('detail.share')}</button>
            <button className="underline font-medium hover:text-black transition-colors">{t('detail.save')}</button>
          </div>
        </div>
      </header>

   {/* 4. Update Gallery to accept the openModal function */}
      <PropertyGallery 
        images={property.images} 
        onImageClick={openModal} 
      />

      {/* 5. Render Modal at the bottom level */}
      {isModalOpen && (
        <PhotoModal 
          images={property.images}
          currentIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      {/* 3. Main Content Grid */}
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-3">

        {/* Left Column: Details (Modular) */}
        <div className="lg:col-span-2 space-y-10">
          <PropertyInfo property={property} />

          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.about_space')}</h2>
            <p className="mt-4 leading-relaxed text-slate-600 font-light text-lg">
              {property.description}
            </p>
          </div>

          {/* Amenities Section */}
          <div className="border-t border-slate-100 pt-10">
            <h2 className="font-display text-2xl text-slate-900">{t('detail.amenities')}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {property.amenities?.map((item) => (
                <div key={item} className="flex items-center gap-4 text-slate-600 font-light">
                  <span className="h-2 w-2 rounded-full bg-brand-gold" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Widget */}
        <aside className="relative">
          <div className="sticky top-28 hidden lg:block">
            <BookingWidget property={property} />
          </div>
        </aside>
      </div>

      {/* Mobile-Only Bottom Sticky Bar (Conversion Booster) */}
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
        <div>
          <p className="font-bold text-slate-900">${property.pricePerNight} <span className="font-light text-slate-500">/ {t('properties.night')}</span></p>
          <p className="text-xs underline">Mar 25 - 30</p>
        </div>
        <button className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-bold text-white">
          {t('detail.reserve_button')}
        </button>
      </div>
    </div>
  );
};