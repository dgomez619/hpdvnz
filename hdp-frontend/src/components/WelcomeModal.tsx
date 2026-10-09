import { useEffect, useRef, useState } from 'react';
import { ImageOff, ShieldCheck, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useModalFocus } from '../utils/useModalFocus';

const HPD_LOGO_URL =
  'https://res.cloudinary.com/dwrinmdz0/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1791242892/WebAssets/hpd3d2_copy_h2ps5c.png';

const LogoHpd = () => {
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return <ImageOff size={24} aria-hidden="true" />;
  }

  return (
    <img
      src={HPD_LOGO_URL}
      alt="Hospedaje por Dias logo"
      className="h-10 w-10 rounded-xl object-cover"
      loading="eager"
      decoding="async"
      onError={() => setHasImageError(true)}
    />
  );
};


interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalFocus(dialogRef, onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-description"
        tabIndex={-1}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/30"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-slate-900" />

        <button
          type="button"
          onClick={onClose}
          aria-label={t('welcome.close')}
          className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="px-6 pb-7 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <LogoHpd />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
            {t('welcome.eyebrow')}
          </p>
          <h2 id="welcome-modal-title" className="mt-3 font-display text-3xl italic text-slate-900 sm:text-4xl">
            {t('welcome.title')}
          </h2>
          <div id="welcome-modal-description" className="mt-5 space-y-3 text-sm font-light leading-6 text-slate-600 sm:text-base">
            <p>{t('welcome.description')}</p>
            <p>{t('welcome.service_message')}</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <ShieldCheck size={16} className="text-slate-900" aria-hidden="true" />
            <span>{t('welcome.reassurance')}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            {t('welcome.action')}
          </button>
        </div>
      </div>
    </div>
  );
};
