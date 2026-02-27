import { useTranslation } from 'react-i18next';

interface GalleryProps {
  images: string[];
}

export const PropertyGallery = ({ images }: GalleryProps) => {
  const { t } = useTranslation();

  // Safety check: If no images, show a placeholder
  if (!images || images.length === 0) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl" />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* MOBILE: Simple aspect-video container
          DESKTOP: 5-image Mosaic using 12-column grid 
      */}
      <div className="relative grid h-[350px] grid-cols-1 gap-2 overflow-hidden rounded-xl md:h-[550px] md:grid-cols-4 md:rounded-2xl">
        
        {/* MAIN IMAGE: Spans 2 columns and 2 rows on Desktop */}
        <div className="md:col-span-2 md:row-span-2 h-full">
          <img 
            src={images[0]} 
            className="h-full w-full object-cover transition-opacity hover:opacity-90 cursor-pointer" 
            alt="Property Main" 
          />
        </div>

        {/* SUPPORTING IMAGES: Hidden on small screens, shown in grid on Desktop */}
        <div className="hidden md:block h-full">
          <img src={images[1] || images[0]} className="h-full w-full object-cover hover:opacity-90 cursor-pointer" alt="Interior 1" />
        </div>
        <div className="hidden md:block h-full">
          <img src={images[2] || images[0]} className="h-full w-full object-cover hover:opacity-90 cursor-pointer" alt="Interior 2" />
        </div>
        <div className="hidden md:block h-full">
          <img src={images[3] || images[0]} className="h-full w-full object-cover hover:opacity-90 cursor-pointer" alt="Interior 3" />
        </div>
        <div className="hidden md:block h-full">
          <img src={images[4] || images[0]} className="h-full w-full object-cover hover:opacity-90 cursor-pointer" alt="Interior 4" />
        </div>

        {/* "SHOW ALL PHOTOS" BUTTON */}
        <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-slate-900 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 shadow-md hover:bg-slate-50 transition-all">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          {t('detail.show_all_photos')}
        </button>
      </div>
    </section>
  );
};