import { useEffect, useRef, useState } from 'react';

interface ProgressiveImageProps {
  src?: string;
  previewSrc?: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
  onClick?: () => void;
}

/**
 * Reserves image space, shows a shimmer or optional low-resolution preview,
 * then fades in the full asset once the browser has finished loading it.
 */
export const ProgressiveImage = ({
  src,
  previewSrc,
  alt,
  className = '',
  imageClassName = '',
  loading = 'lazy',
  onClick,
}: ProgressiveImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error' | 'missing'>(src ? 'loading' : 'missing');
  const isLoaded = status === 'loaded';
  const hasError = status === 'error' || status === 'missing';

  useEffect(() => {
    if (!src) {
      setStatus('missing');
      return;
    }

    setStatus('loading');

    // Cached images can finish before React's onLoad handler is attached.
    // Inspecting `complete` prevents those images from being left behind the skeleton.
    const image = imageRef.current;
    if (image?.complete) {
      setStatus(image.naturalWidth > 0 ? 'loaded' : 'error');
    }
  }, [src]);

  const isInteractive = Boolean(onClick);

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${isInteractive ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {status === 'loading' && !previewSrc ? <div className="skeleton-shimmer absolute inset-0" aria-hidden="true" /> : null}

      {previewSrc ? (
        <img
          src={previewSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'} ${imageClassName}`}
        />
      ) : null}

      {src && status !== 'error' ? (
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
        />
      ) : null}

      {hasError ? (
        <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center bg-slate-100 px-4 text-center text-xs font-medium text-slate-400">
          Image unavailable
        </div>
      ) : null}
    </div>
  );
};
