import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useModalFocus } from '../../utils/useModalFocus';
import { ProgressiveImage } from '../common/ProgressiveImage';

interface PhotoModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PhotoModal = ({ images, currentIndex, onClose, onNext, onPrev }: PhotoModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);

  useModalFocus(dialogRef, onClose);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Keyboard navigation for photos; Escape is handled by the shared modal focus hook.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startX = swipeStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    swipeStartX.current = null;

    if (startX === null || endX === undefined) return;

    const horizontalDistance = endX - startX;
    const minimumSwipeDistance = 48;

    if (horizontalDistance <= -minimumSwipeDistance) onNext();
    if (horizontalDistance >= minimumSwipeDistance) onPrev();
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Property photo gallery" tabIndex={-1} className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo gallery"
        className="absolute right-4 top-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/30 text-white/80 transition-colors hover:bg-black/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-8 sm:top-8"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Navigation - Left */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous photo"
        className="absolute left-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/30 p-2 text-white/80 transition-all hover:scale-110 hover:bg-black/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4 md:left-8"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      {/* Main Image Container */}
      <div
        className="relative h-[75dvh] w-[90vw] max-w-6xl touch-pan-y select-none sm:h-[85dvh]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ProgressiveImage
          src={images[currentIndex]} 
          alt={`View ${currentIndex + 1}`}
          loading="eager"
          className="h-full w-full"
          imageClassName="object-contain"
        />
      </div>

      {/* Navigation - Right */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next photo"
        className="absolute right-2 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/30 p-2 text-white/80 transition-all hover:scale-110 hover:bg-black/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4 md:right-8"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-8 text-white/60 font-light tracking-[0.3em] text-[10px] uppercase">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};