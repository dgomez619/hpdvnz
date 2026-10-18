import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export interface InvoiceExtra {
  description: string;
  amount: number;
}

export interface InvoiceData {
  guestName: string;
  propertyName: string;
  checkIn: string; // yyyy-MM-dd
  checkOut: string; // yyyy-MM-dd
  ratePerNight: number;
  adminFee: number;
  cleaningFee: number;
  extras: InvoiceExtra[];
  issuedAt: Date;
}

export interface InvoiceTotals {
  nights: number;
  lodging: number;
  total: number;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export const getNights = (checkIn: string, checkOut: string) => {
  const start = parseISO(checkIn);
  const end = parseISO(checkOut);
  if (!isValid(start) || !isValid(end)) return 0;
  return Math.max(0, differenceInCalendarDays(end, start));
};

export const calculateTotals = (data: Pick<InvoiceData, 'checkIn' | 'checkOut' | 'ratePerNight' | 'adminFee' | 'cleaningFee' | 'extras'>): InvoiceTotals => {
  const nights = getNights(data.checkIn, data.checkOut);
  const lodging = round2(nights * data.ratePerNight);
  const extrasTotal = data.extras.reduce((sum, extra) => sum + extra.amount, 0);
  return { nights, lodging, total: round2(lodging + data.adminFee + data.cleaningFee + extrasTotal) };
};

const moneyFormatter = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

export const formatMoney = (value: number) => `$${moneyFormatter.format(value)}`;

export const formatInvoiceDate = (value: string | Date) => {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isValid(date) ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: es }) : '';
};

export const buildInvoiceFileName = (guestName: string) => {
  const slug = guestName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `aviso-de-pago-${slug || 'huesped'}.pdf`;
};
