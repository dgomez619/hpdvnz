import { useTranslation } from 'react-i18next';
import type { Property } from '../../types/property';

interface BookingWidgetProps {
    property: Property;
    startDate: string;
    endDate: string;
    guests: number;
    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onGuestsChange: (value: number) => void;
    onCheckAvailability: () => void;
    onReserveClick: () => void;
    validationError?: string;
    availabilityStatus?: 'available' | 'mayBeUnavailable' | null;
    isCheckingAvailability?: boolean;
}

export const BookingWidget = ({
    property,
    startDate,
    endDate,
    guests,
    onStartDateChange,
    onEndDateChange,
    onGuestsChange,
    onCheckAvailability,
    onReserveClick,
    validationError,
    availabilityStatus = null,
    isCheckingAvailability = false,
}: BookingWidgetProps) => {
    const { t } = useTranslation();

    const cleaningFee = 40;
    const serviceFee = 25;
    const today = new Date();
    const minimumDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');

    const numberOfNights = (() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const msInDay = 1000 * 60 * 60 * 24;
        const diff = Math.round((end.getTime() - start.getTime()) / msInDay);
        return diff > 0 ? diff : 0;
    })();

    const nightlyTotal = property.pricePerNight * numberOfNights;
    const grandTotal = nightlyTotal + (numberOfNights > 0 ? cleaningFee + serviceFee : 0);

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
                        <input
                            type="date"
                            value={startDate}
                            min={minimumDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            className="w-full text-sm bg-transparent outline-none"
                        />
                    </div>
                    <div className="p-3 cursor-pointer hover:bg-slate-50">
                        <label className="block text-[10px] font-bold uppercase">{t('search.check_out')}</label>
                        <input
                            type="date"
                            value={endDate}
                            min={startDate || minimumDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            className="w-full text-sm bg-transparent outline-none"
                        />
                    </div>
                </div>
                <div className="p-3 cursor-pointer hover:bg-slate-50">
                    <label className="block text-[10px] font-bold uppercase">{t('search.guests')}</label>
                    <select
                        value={guests}
                        onChange={(e) => onGuestsChange(Number(e.target.value))}
                        className="w-full text-sm bg-transparent outline-none"
                    >
                        {[1, 2, 3, 4, 5, 6].map((count) => (
                            <option key={count} value={count}>
                                {count} {count === 1 ? t('search.guest') : t('search.guests_plural')}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {validationError ? (
                <p className="mb-4 text-xs font-medium text-red-500">{validationError}</p>
            ) : null}

            {availabilityStatus ? (
                <p className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium ${availabilityStatus === 'available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {availabilityStatus === 'available' ? t('booking.appears_available') : t('booking.may_be_unavailable')}
                </p>
            ) : null}

            <button onClick={onCheckAvailability} disabled={isCheckingAvailability} className="w-full rounded-lg bg-slate-900 py-3 font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60">
                {t('detail.reserve_button')}
            </button>
            <button onClick={onReserveClick} className="mt-3 w-full rounded-lg border border-slate-300 py-3 font-bold uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50">
                {t('booking.send_inquiry')}
            </button>

            <div className="mt-4 space-y-3">
                <div className="flex justify-between text-slate-600 text-sm">
                    <span className="underline">${property.pricePerNight} x {numberOfNights} {numberOfNights === 1 ? t('properties.night') : t('properties.night_plural')}</span>
                    <span>${nightlyTotal}</span>
                </div>
                {numberOfNights > 0 ? (
                    <>
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span className="underline">{t('booking.cleaning_fee')}</span>
                            <span>${cleaningFee}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 text-sm">
                            <span className="underline">{t('booking.service_fee')}</span>
                            <span>${serviceFee}</span>
                        </div>
                    </>
                ) : null}
                <div className="flex justify-between font-bold border-t border-slate-100 pt-3">
                    <span>{t('booking.total')}</span>
                    <span>${grandTotal}</span>
                </div>
            </div>
        </div>
    );
};