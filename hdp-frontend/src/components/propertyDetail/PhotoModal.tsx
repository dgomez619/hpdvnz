import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface PhotoModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PhotoModal = ({ images, currentIndex, onClose, onNext, onPrev }: PhotoModalProps) => {
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  // Keyboard navigation (Esc, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm transition-all animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors p-2"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Navigation - Left */}
      <button 
        onClick={onPrev}
        className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-all hover:scale-110 p-4"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>

      {/* Main Image Container */}
      <div className="max-h-[85vh] max-w-[90vw] overflow-hidden select-none">
        <img 
          src={images[currentIndex]} 
          alt={`View ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] object-contain"
        />
      </div>

      {/* Navigation - Right */}
      <button 
        onClick={onNext}
        className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-all hover:scale-110 p-4"
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