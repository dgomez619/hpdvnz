// src/components/Booking/BookingModal.tsx
import { useState } from 'react';
import { X, Users, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  startDate: string;
  endDate: string;
  guests: number;
}

export const BookingModal = ({ isOpen, onClose, property, startDate, endDate, guests }: BookingModalProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    guestName: '',
    contactInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const displayTitle = i18n.language === 'en' ? (property.title_en || property.title_es) : (property.title_es || property.title_en);

  if (!isOpen) return null;

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const WHATSAPP_NUMBER = "1234567890"; // Reemplaza con tu número de WhatsApp Business (sin el +)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. SAVE TO DATABASE
      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property._id,
          ...formData,
          startDate,
          endDate,
          guests,
          totalPrice: property.pricePerNight * 1 // Placeholder for date calculation logic
        })
      });

      if (response.ok) {
        // 2. TRIGGER WHATSAPP REDIRECT
        const message = encodeURIComponent(
          `${t('booking.whatsapp_intro', { title: displayTitle })}\n\n` +
          `${t('booking.whatsapp_details')}\n` +
          `- ${t('booking.full_name')}: ${formData.guestName}\n` +
          `- ${t('booking.summary_check_in')}: ${startDate}\n` +
          `- ${t('booking.summary_check_out')}: ${endDate}\n` +
          `- ${t('booking.summary_guests')}: ${guests}\n` +
          `- ${t('booking.contact_label')}: ${formData.contactInfo}`
        );
        
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        
        setIsSuccess(true);
        setTimeout(() => {
          window.open(waLink, '_blank');
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white">
          <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">{t('booking.request_title')}</p>
          <h2 className="font-display text-2xl italic">{displayTitle}</h2>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="flex justify-center"><CheckCircle2 size={64} className="text-green-500 animate-bounce" /></div>
            <h3 className="text-xl font-bold text-slate-900">{t('booking.request_sent')}</h3>
            <p className="text-slate-500 font-light text-sm">{t('booking.redirect_whatsapp')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{t('booking.summary_title')}</p>
              <p className="mt-2">{t('booking.summary_check_in')}: {startDate || '-'}</p>
              <p>{t('booking.summary_check_out')}: {endDate || '-'}</p>
              <p>{t('booking.summary_guests')}: {guests}</p>
            </div>
            
            {/* Guest Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('booking.full_name')}</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder={t('booking.full_name_placeholder')}
                  value={formData.guestName}
                  onChange={(e) => setFormData({...formData, guestName: e.target.value})}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900 transition-colors"
                />
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('booking.contact_label')}</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder={t('booking.contact_placeholder')}
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 pl-12 text-sm outline-none focus:border-slate-900 transition-colors"
                />
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? t('booking.processing') : (
                <>
                  {t('booking.confirm_and_contact')} <Send size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};