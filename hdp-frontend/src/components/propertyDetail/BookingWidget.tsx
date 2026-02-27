import { useTranslation } from 'react-i18next';
import type { Property } from '../../types/property';

export const BookingWidget = ({ property }: { property: Property }) => {
    const { t } = useTranslation();

    const numberOfNights = 5; // This will eventually be calculated from your state
    const cleaningFee = 40;
    const serviceFee = 25;

    return (
        <div className="mt-6 space-y-3 text-sm text-slate-600 font-light">
            {/* Nightly Total */}
            <div className="flex justify-between">
                <span className="underline">${property.pricePerNight} x {numberOfNights} {t('booking.nights_plural')}</span>
                <span>${property.pricePerNight * numberOfNights}</span>
            </div>

            {/* Cleaning Fee */}
            <div className="flex justify-between">
                <span className="underline">{t('booking.cleaning_fee')}</span>
                <span>${cleaningFee}</span>
            </div>

            {/* Service Fee */}
            <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="underline">{t('booking.service_fee')}</span>
                <span>${serviceFee}</span>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                <span>{t('booking.total')}</span>
                <span>${(property.pricePerNight * numberOfNights) + cleaningFee + serviceFee}</span>
            </div>
        </div>
    );

    return (
        <div className="rounded-2xl border border-slate-200 p-6 shadow-xl bg-white">
            <div className="flex justify-between items-baseline mb-6">
                <div>
                    <span className="text-2xl font-bold text-slate-900">${property.pricePerNight}</span>
                    <span className="text-slate-500 font-light ml-1">/ {t('properties.night')}</span>
                </div>
                <div className="text-sm font-medium">★ {property.rating}</div>
            </div>

            {/* Date & Guest Inputs */}
            <div className="rounded-lg border border-slate-300 overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-slate-300">
                    <div className="p-3 border-r border-slate-300 cursor-pointer hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase">{t('search.check_in')}</label>
                        <input type="date" className="w-full text-sm bg-transparent outline-none" />
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase">{t('search.check_out')}</label>
                        <input type="date" className="w-full text-sm bg-transparent outline-none" />
                    </div>
                </div>
                <div className="p-3 cursor-pointer hover:bg-slate-50">
                    <label className="block text-[10px] font-bold uppercase">{t('search.guests')}</label>
                    <select className="w-full text-sm bg-transparent outline-none">
                        <option>1 {t('search.guest')}</option>
                        <option>2 {t('search.guests_plural')}</option>
                    </select>
                </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">
                {t('detail.reserve_button')}
            </button>

            <div className="mt-4 space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                    <span className="underline">${property.pricePerNight} x 5 {t('properties.night_plural')}</span>
                    <span>${property.pricePerNight * 5}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-slate-100 pt-3">
                    <span>Total</span>
                    <span>${property.pricePerNight * 5}</span>
                </div>
            </div>
        </div>
    );
};