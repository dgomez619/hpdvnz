import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AVAILABLE_CITIES = ['Valencia', 'Lecheria', 'Chiciriviche', 'Tinaquillo'];

export const SearchTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State Management
  const [cityOpen, setCityOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [guests, setGuests] = useState(1);
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [searchError, setSearchError] = useState('');
  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const handleSearch = () => {
    if (!selectedCity || !dates.checkIn || !dates.checkOut) {
      setSearchError(t('search.complete_fields'));
      return;
    }

    if (dates.checkOut <= dates.checkIn) {
      setSearchError(t('search.invalid_date_range'));
      return;
    }

    const params = new URLSearchParams({
      city: selectedCity,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests: String(guests),
    });

    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div className="relative mx-auto flex w-full flex-col divide-y divide-gray-100 rounded-xl bg-white p-2 shadow-2xl md:flex-row md:divide-x md:divide-y-0">
      
      {/* 1. Location Dropdown */}
      <div className="relative flex-1">
        <div 
          onClick={() => { setCityOpen(!cityOpen); setGuestOpen(false); }}
          className="flex h-full cursor-pointer flex-col items-start px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6 sm:py-4"
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('search.location')}</label>
          <span className={`mt-1 text-sm font-medium sm:text-base ${selectedCity ? 'text-slate-900' : 'text-slate-400'}`}>
            {selectedCity || t('search.placeholder_location')}
          </span>
        </div>
        {cityOpen && (
          <div className="absolute top-full left-0 z-30 mt-2 grid max-h-56 w-full min-w-0 grid-cols-2 overflow-y-auto rounded-lg bg-white shadow-xl ring-1 ring-black/5 md:min-w-70">
            {AVAILABLE_CITIES.map((city) => (
              <button key={city} onClick={() => { setSelectedCity(city); setCityOpen(false); setSearchError(''); }}
                className="w-full px-4 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-gold sm:px-6">
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Date Picker (Simplified for MVP) */}
      <div className="flex flex-1 flex-col items-start px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6 sm:py-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('search.dates')}</label>
        <div className="mt-2 flex w-full flex-col gap-2 sm:mt-1 sm:flex-row sm:items-center sm:gap-2">
          <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <input 
              type="date"
              placeholder='Check-in'
              aria-label="Check-in date"
              value={dates.checkIn}
              min={minimumDate}
              className="date-input h-5 w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-slate-900 outline-none scheme-light"
              onChange={(e) => {
                const checkIn = e.target.value;
                setDates((current) => ({
                  checkIn,
                  checkOut: current.checkOut && current.checkOut <= checkIn ? '' : current.checkOut,
                }));
                setSearchError('');
              }}
            />
          </div>
          <span className="hidden text-slate-300 sm:inline">-</span>
          <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <input 
              type="date"
              placeholder='Check-out'
              aria-label="Check-out date"
              value={dates.checkOut}
              min={dates.checkIn || minimumDate}
              className="date-input h-5 w-full min-w-0 appearance-none bg-transparent text-sm font-medium text-slate-900 outline-none scheme-light"
              onChange={(e) => { setDates((current) => ({ ...current, checkOut: e.target.value })); setSearchError(''); }}
            />
          </div>
        </div>
      </div>

      {/* 3. Guest Selector */}
      <div className="relative flex-1">
        <div 
          onClick={() => { setGuestOpen(!guestOpen); setCityOpen(false); }}
          className="flex h-full cursor-pointer flex-col items-start px-4 py-3 transition-colors hover:bg-gray-50 sm:px-6 sm:py-4"
        >
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('search.guests')}</label>
          <span className="mt-1 text-sm font-medium text-slate-900 sm:text-base">{guests} {guests === 1 ? t('search.guest') : t('search.guests_plural')}</span>
        </div>
        {guestOpen && (
          <div className="absolute top-full left-0 z-30 mt-2 w-full rounded-xl border border-black/10 bg-white p-4 shadow-2xl ring-1 ring-black/5 sm:w-56 md:left-auto md:right-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-600">
                {t('search.how_many')}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="h-7 w-7 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center hover:border-slate-400 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="text-base font-bold text-slate-900">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="h-7 w-7 rounded-full border border-slate-300 text-slate-700 flex items-center justify-center hover:border-slate-400 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => setGuestOpen(false)}
              className="mt-5 w-full rounded-md bg-slate-900 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-slate-800 active:scale-95"
            >
              {t('search.done')}
            </button>
          </div>
        )}
      </div>

      {/* 4. Search Button */}
      <div className="flex w-full flex-col md:w-auto">
        <button onClick={handleSearch} className="w-full bg-slate-900 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-800 active:scale-95 md:px-10">
          {t('search.button')}
        </button>
        {searchError ? <p className="mt-2 text-center text-xs font-medium text-red-600 md:absolute md:top-full md:right-0">{searchError}</p> : null}
      </div>
    </div>
  );
};