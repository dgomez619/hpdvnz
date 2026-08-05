import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useModalFocus } from '../../utils/useModalFocus';

interface PhotoModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PhotoModal = ({ images, currentIndex, onClose, onNext, onPrev }: PhotoModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Property photo gallery" tabIndex={-1} className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        aria-label="Close photo gallery"
        className="absolute top-8 right-8 p-2 text-white/70 transition-colors hover:text-white"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Navigation - Left */}
      <button 
        onClick={onPrev}
        aria-label="Previous photo"
        className="absolute left-4 p-4 text-white/50 transition-all hover:scale-110 hover:text-white md:left-8"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      {/* Main Image Container */}
      <div className="max-h-[85dvh] max-w-[90vw] overflow-hidden select-none">
        <img 
          src={images[currentIndex]} 
          alt={`View ${currentIndex + 1}`}
          className="max-h-[85dvh] max-w-[90vw] object-contain"
        />
      </div>

      {/* Navigation - Right */}
      <button 
        onClick={onNext}
        aria-label="Next photo"
        className="absolute right-4 p-4 text-white/50 transition-all hover:scale-110 hover:text-white md:right-8"
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