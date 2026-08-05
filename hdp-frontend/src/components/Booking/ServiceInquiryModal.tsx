// src/components/Booking/ServiceInquiryModal.tsx
import { useRef, useState } from 'react';
import { X, User, Home, Calendar, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useModalFocus } from '../../utils/useModalFocus';

interface Service {
  _id: string;
  title_en: string;
  title_es: string;
  category: string;
}

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
}

export const ServiceInquiryModal = ({ isOpen, onClose, service }: ServiceInquiryModalProps) => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalFocus(dialogRef, onClose, isOpen);

  const [formData, setFormData] = useState({
    guestName: '',
    contactInfo: '',
    propertyName: '', // Verification: Which house?
    stayDates: '',    // Verification: When?
    message: ''
  });

  if (!isOpen) return null;

  const displayTitle = i18n.language === 'en' ? service.title_en : service.title_es;
  const WHATSAPP_NUMBER = "1234567890"; // Reemplaza con tu número

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Database
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          ...formData
        })
      });

      if (response.ok) {
        // 2. WhatsApp Redirect with Verification Details
        const waMessage = encodeURIComponent(
          `*SOLICITUD DE SERVICIO CONCIERGE*%0A` +
          `---------------------------%0A` +
          `*Servicio:* ${displayTitle}%0A` +
          `*Cliente:* ${formData.guestName}%0A` +
          `*Hospedado en:* ${formData.propertyName}%0A` +
          `*Fechas de estancia:* ${formData.stayDates}%0A` +
          `*Mensaje:* ${formData.message || 'Sin comentarios adicionales'}%0A` +
          `---------------------------%0A` +
          `Contacto: ${formData.contactInfo}`
        );

        setIsSuccess(true);
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, '_blank');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-120 grid place-items-center overflow-y-auto bg-slate-900/80 p-4 backdrop-blur-md">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="service-inquiry-title" tabIndex={-1} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white">
          <button type="button" onClick={onClose} aria-label="Close service inquiry" className="absolute right-6 top-8 p-2 text-slate-400 transition-colors hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{t('services.exclusive_access')}</p>
          </div>
          <h2 id="service-inquiry-title" className="font-display text-3xl italic">{displayTitle}</h2>
        </div>

        {isSuccess ? (
          <div className="p-16 text-center space-y-4">
            <div className="flex justify-center"><CheckCircle2 size={64} className="text-green-500" /></div>
            <h3 className="text-2xl font-bold text-slate-900">{t('services.inquiry_sent')}</h3>
            <p className="text-slate-500 font-light">{t('services.wa_redirect_notice')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-5 custom-scrollbar">
            
            <p className="text-xs text-slate-400 italic mb-4">
              * {t('services.verification_notice')}
            </p>

            {/* Guest Info Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('booking.full_name')}</label>
                <div className="relative">
                  <input required type="text" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900" />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('booking.contact_label')}</label>
                <div className="relative">
                  <input required type="text" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900" />
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
            </div>

            {/* Verification Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('services.staying_at')}</label>
                <div className="relative">
                  <input required type="text" placeholder="Villa 1, Apartment B..." value={formData.propertyName} onChange={e => setFormData({...formData, propertyName: e.target.value})} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900" />
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('services.stay_dates')}</label>
                <div className="relative">
                  <input required type="text" placeholder="Jan 12 - Jan 15" value={formData.stayDates} onChange={e => setFormData({...formData, stayDates: e.target.value})} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900" />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('booking.message_label')}</label>
              <textarea rows={3} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none focus:border-slate-900" />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? t('booking.processing') : (
                <>
                  {t('services.request_concierge')} <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};