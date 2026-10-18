// src/components/admin/InvoiceGeneratorModal.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Loader2, FileText, Plus, Trash2, Share2, Download, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { useModalFocus } from '../../utils/useModalFocus';
import { buildInvoiceFileName, calculateTotals, formatInvoiceDate, formatMoney } from '../../utils/invoice';
import type { InvoiceData } from '../../utils/invoice';
import type { Property } from '../../types/property';

interface InvoiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
}

interface ExtraRow {
  id: number;
  description: string;
  amount: string;
}

interface GeneratedInvoice {
  blob: Blob;
  url: string;
  fileName: string;
  data: InvoiceData;
  total: number;
}

const inputClass = 'w-full rounded-xl border-none bg-[#1c1c1e] p-4 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-white/20';
const labelClass = 'text-[10px] font-bold uppercase tracking-widest text-slate-500';
const actionClass = 'flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10';

const toAmount = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export const InvoiceGeneratorModal = ({ isOpen, onClose, properties }: InvoiceGeneratorModalProps) => {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rate, setRate] = useState('');
  const [adminFee, setAdminFee] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [extras, setExtras] = useState<ExtraRow[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<GeneratedInvoice | null>(null);
  const extraId = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalFocus(dialogRef, onClose, isOpen);

  const invoiceUrl = invoice?.url;
  useEffect(() => () => {
    if (invoiceUrl) URL.revokeObjectURL(invoiceUrl);
  }, [invoiceUrl]);

  const liveTotals = useMemo(() => calculateTotals({
    checkIn,
    checkOut,
    ratePerNight: toAmount(rate),
    adminFee: toAmount(adminFee),
    cleaningFee: toAmount(cleaningFee),
    extras: extras.map((extra) => ({ description: extra.description, amount: toAmount(extra.amount) })),
  }), [checkIn, checkOut, rate, adminFee, cleaningFee, extras]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setPropertyId('');
    setPropertyName('');
    setCheckIn('');
    setCheckOut('');
    setRate('');
    setAdminFee('');
    setCleaningFee('');
    setExtras([]);
    setError('');
    setNotice('');
    setInvoice(null);
    onClose();
  };

  const handlePropertySelect = (id: string) => {
    setPropertyId(id);
    const property = properties.find((p) => p._id === id);
    if (!property) return;
    setPropertyName(`${property.title_es} — ${property.location}`);
    setRate(String(property.pricePerNight));
  };

  const updateExtra = (id: number, patch: Partial<ExtraRow>) => {
    setExtras((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (liveTotals.nights < 1) {
      setError('La fecha de check-out debe ser posterior al check-in.');
      return;
    }
    if (toAmount(rate) <= 0) {
      setError('Ingresa una tarifa por noche válida.');
      return;
    }

    const filledExtras = extras.filter((extra) => extra.description.trim() || extra.amount.trim());
    if (filledExtras.some((extra) => !extra.description.trim() || toAmount(extra.amount) <= 0)) {
      setError('Cada cargo adicional necesita una descripción y un monto mayor a cero.');
      return;
    }

    const data: InvoiceData = {
      guestName: guestName.trim(),
      propertyName: propertyName.trim(),
      checkIn,
      checkOut,
      ratePerNight: toAmount(rate),
      adminFee: toAmount(adminFee),
      cleaningFee: toAmount(cleaningFee),
      extras: filledExtras.map((extra) => ({ description: extra.description.trim(), amount: toAmount(extra.amount) })),
      issuedAt: new Date(),
    };
    const totals = calculateTotals(data);

    setLoading(true);
    try {
      // Loaded on demand so the PDF engine never weighs down the public site bundle.
      const [{ pdf }, { InvoiceDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./InvoiceDocument'),
      ]);
      const blob = await pdf(<InvoiceDocument data={data} totals={totals} />).toBlob();
      setInvoice({
        blob,
        url: URL.createObjectURL(blob),
        fileName: buildInvoiceFileName(data.guestName),
        data,
        total: totals.total,
      });
    } catch (err) {
      console.error('Error generating invoice:', err);
      setError('No se pudo generar el documento. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!invoice) return;
    const link = document.createElement('a');
    link.href = invoice.url;
    link.download = invoice.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const buildMessage = () => {
    if (!invoice) return '';
    const { data, total } = invoice;
    return `Hola ${data.guestName}, te enviamos el aviso de pago de tu estadía en ${data.propertyName} del ${formatInvoiceDate(data.checkIn)} al ${formatInvoiceDate(data.checkOut)}. Total a pagar: ${formatMoney(total)} USD.`;
  };

  const handleShare = async () => {
    if (!invoice) return;
    setNotice('');
    const file = new File([invoice.blob], invoice.fileName, { type: 'application/pdf' });

    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Aviso de Pago', text: buildMessage() });
      } catch (err) {
        if ((err as DOMException).name !== 'AbortError') {
          console.error('Error sharing invoice:', err);
          setNotice('No se pudo compartir. Descarga el PDF y envíalo manualmente.');
        }
      }
      return;
    }

    handleDownload();
    setNotice('Tu navegador no permite compartir archivos. El PDF se descargó: adjúntalo manualmente al mensaje.');
  };

  const handleWhatsApp = () => {
    if (!invoice) return;
    const phone = guestPhone.replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildMessage())}`, '_blank', 'noopener,noreferrer');
    setNotice('WhatsApp no adjunta archivos automáticamente: descarga el PDF y adjúntalo en la conversación.');
  };

  const handleEmail = () => {
    if (!invoice) return;
    const subject = `Aviso de pago - ${invoice.data.propertyName}`;
    window.location.href = `mailto:${guestEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage())}`;
    setNotice('El correo no adjunta archivos automáticamente: descarga el PDF y adjúntalo al mensaje.');
  };

  return (
    <div className="fixed inset-0 z-110 grid place-items-start overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:place-items-center">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="invoice-modal-title" tabIndex={-1} className="my-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-5 sm:p-6">
          <h2 id="invoice-modal-title" className="flex items-center gap-2 font-display text-xl italic text-white">
            <FileText size={20} /> Generar Factura
          </h2>
          <button type="button" onClick={resetAndClose} aria-label="Cerrar generador de facturas" className="p-2 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {invoice ? (
          <div className="space-y-6 p-5 sm:p-8">
            <div className="rounded-xl border border-white/10 bg-[#1c1c1e] p-5">
              <p className={labelClass}>Aviso de pago listo</p>
              <p className="mt-2 text-sm text-white">{invoice.data.guestName}</p>
              <p className="text-xs text-slate-400">{invoice.data.propertyName}</p>
              <p className="mt-3 font-display text-3xl italic text-white">{formatMoney(invoice.total)} <span className="text-xs not-italic text-slate-500">USD</span></p>
            </div>

            <iframe title="Vista previa del documento" src={invoice.url} className="hidden h-96 w-full rounded-xl border border-white/10 bg-white md:block" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button type="button" onClick={handleShare} className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-slate-200 sm:col-span-2">
                <Share2 size={14} /> Compartir
              </button>
              <button type="button" onClick={handleWhatsApp} className={actionClass}>
                <MessageCircle size={14} /> WhatsApp
              </button>
              <button type="button" onClick={handleEmail} className={actionClass}>
                <Mail size={14} /> Correo
              </button>
              <button type="button" onClick={handleDownload} className={`${actionClass} sm:col-span-2`}>
                <Download size={14} /> Descargar PDF
              </button>
            </div>

            {notice ? <p className="text-xs font-medium text-amber-400">{notice}</p> : null}

            <button type="button" onClick={() => { setInvoice(null); setNotice(''); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white">
              <ArrowLeft size={14} /> Editar datos
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-5 p-5 sm:p-8">
            <div className="space-y-2">
              <label htmlFor="inv-guest" className={labelClass}>Nombre del huésped</label>
              <input id="inv-guest" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="inv-phone" className={labelClass}>WhatsApp (opcional)</label>
                <input id="inv-phone" type="tel" inputMode="tel" placeholder="58412XXXXXXX" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="inv-email" className={labelClass}>Correo (opcional)</label>
                <input id="inv-email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="inv-property-select" className={labelClass}>Propiedad</label>
              <select id="inv-property-select" value={propertyId} onChange={(e) => handlePropertySelect(e.target.value)} className={inputClass}>
                <option value="">Seleccionar propiedad…</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>{property.title_es} — {property.location}</option>
                ))}
              </select>
              <input aria-label="Nombre y ubicación de la propiedad" required placeholder="Nombre / ubicación de la propiedad" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="inv-checkin" className={labelClass}>Check-in</label>
                <input id="inv-checkin" required type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className={`${inputClass} scheme-dark`} />
              </div>
              <div className="space-y-2">
                <label htmlFor="inv-checkout" className={labelClass}>Check-out</label>
                <input id="inv-checkout" required type="date" min={checkIn || undefined} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={`${inputClass} scheme-dark`} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="inv-rate" className={labelClass}>Tarifa por noche (USD)</label>
                <input id="inv-rate" required type="number" inputMode="decimal" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="inv-admin" className={labelClass}>Tarifa administrativa</label>
                <input id="inv-admin" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={adminFee} onChange={(e) => setAdminFee(e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label htmlFor="inv-cleaning" className={labelClass}>Tarifa de limpieza</label>
                <input id="inv-cleaning" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={cleaningFee} onChange={(e) => setCleaningFee(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Otros cargos (especificar)</span>
                <button type="button" onClick={() => setExtras((rows) => [...rows, { id: extraId.current++, description: '', amount: '' }])} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white">
                  <Plus size={12} /> Agregar
                </button>
              </div>
              {extras.map((extra) => (
                <div key={extra.id} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1fr_9rem_auto]">
                  <input aria-label="Descripción del cargo" placeholder="Descripción" value={extra.description} onChange={(e) => updateExtra(extra.id, { description: e.target.value })} className={`${inputClass} col-span-2 sm:col-span-1`} />
                  <input aria-label="Monto del cargo" type="number" inputMode="decimal" min="0" step="0.01" placeholder="0.00" value={extra.amount} onChange={(e) => updateExtra(extra.id, { amount: e.target.value })} className={inputClass} />
                  <button type="button" aria-label="Quitar cargo" onClick={() => setExtras((rows) => rows.filter((row) => row.id !== extra.id))} className="p-3 text-slate-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between gap-4 rounded-xl border border-white/10 bg-[#1c1c1e] p-5">
              <div>
                <p className={labelClass}>Total a pagar</p>
                <p className="mt-1 text-xs text-slate-500">{liveTotals.nights} {liveTotals.nights === 1 ? 'noche' : 'noches'}</p>
              </div>
              <p className="font-display text-3xl italic text-white">{formatMoney(liveTotals.total)} <span className="text-xs not-italic text-slate-500">USD</span></p>
            </div>

            {error ? <p role="alert" className="text-xs font-medium text-red-500">{error}</p> : null}

            <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-slate-200 disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Generar Factura'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
