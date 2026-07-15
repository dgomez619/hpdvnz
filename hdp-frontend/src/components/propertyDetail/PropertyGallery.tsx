import { useTranslation } from 'react-i18next';

interface GalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
  isLoading?: boolean;
}

export const PropertyGallery = ({ images, onImageClick, isLoading = true }: GalleryProps) => {
  const { t } = useTranslation();

  // Safety check: If no images, show a placeholder
  if (!isLoading && (!images || images.length === 0)) {
    return <div className="h-64 w-full bg-slate-100 animate-pulse rounded-2xl" />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* MOBILE: Simple aspect-video container
          DESKTOP: 5-image Mosaic using 12-column grid 
      */}
      <div
        className="relative grid h-[350px] grid-cols-1 gap-2 overflow-hidden rounded-xl md:h-[550px] md:grid-cols-4 md:grid-rows-2 md:rounded-2xl"
        aria-busy={isLoading}
      >
        
        {/* MAIN IMAGE: Spans 2 columns and 2 rows on Desktop */}
        <div className="h-full overflow-hidden md:col-span-2 md:row-span-2">
          {isLoading ? (
            <div className="skeleton-shimmer h-full w-full rounded-[inherit]" aria-hidden="true" />
          ) : (
            <img
              src={images[0]}
              className="h-full w-full cursor-pointer object-cover transition-opacity hover:opacity-90"
              alt="Property Main"
              onClick={() => onImageClick(0)}
            />
          )}
        </div>

        {/* SUPPORTING IMAGES: Hidden on small screens, shown in grid on Desktop */}
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="hidden h-full min-h-0 overflow-hidden md:block">
            {isLoading ? (
              <div className="skeleton-shimmer h-full w-full rounded-[inherit]" aria-hidden="true" />
            ) : (
              <img
                src={images[index] || images[0]}
                className="h-full w-full cursor-pointer object-cover hover:opacity-90"
                alt={`Interior ${index}`}
                onClick={() => onImageClick(index)}
              />
            )}
          </div>
        ))}

        {/* "SHOW ALL PHOTOS" BUTTON */}
        <button
          type="button"
          onClick={() => onImageClick(0)}
          disabled={isLoading}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-slate-900 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-900 shadow-md transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          {t('detail.show_all_photos')}
        </button>
      </div>
    </section>
  );
};