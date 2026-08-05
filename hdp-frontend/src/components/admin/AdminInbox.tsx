// src/components/Admin/AdminInbox.tsx
import { useEffect, useState } from 'react';

interface BookingProperty {
  _id: string;
  title_es?: string;
  title_en?: string;
  images?: string[];
}

type BookingStatus = 'pending' | 'approved' | 'denied' | 'cancelled';

interface BookingRequest {
  _id: string;
  guestName: string;
  email: string;
  whatsapp?: string;
  startDate: string;
  endDate: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  propertyId: BookingProperty | string;
  createdAt?: string;
}

const statusStyles: Record<BookingStatus, string> = {
  pending: 'bg-amber-500/12 text-amber-300 border border-amber-400/20',
  approved: 'bg-emerald-500/12 text-emerald-300 border border-emerald-400/20',
  denied: 'bg-rose-500/12 text-rose-300 border border-rose-400/20',
  cancelled: 'bg-slate-500/12 text-slate-300 border border-slate-400/20',
};

const dateFormatter = new Intl.DateTimeFormat('es-VE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const getPropertyTitle = (property: BookingProperty | string) => {
  if (!property || typeof property === 'string') {
    return 'Propiedad sin título';
  }

  return property.title_es || property.title_en || 'Propiedad sin título';
};

const formatDate = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return dateFormatter.format(parsedDate);
};

const getWhatsAppHref = (whatsapp: string) => {
  const sanitizedPhone = whatsapp.replace(/[^\d]/g, '');
  return `https://wa.me/${sanitizedPhone}`;
};

export const AdminInbox = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: { 'x-auth-token': localStorage.getItem('adminToken') || '' }
      });
      const data: BookingRequest[] = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('adminToken') || ''
      },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('¿Eliminar esta solicitud de reserva?');
    if (!confirmed) {
      return;
    }

    await fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': localStorage.getItem('adminToken') || ''
      }
    });
    fetchBookings();
  };

  if (loading) {
    return <div className="p-8 text-white">Cargando solicitudes...</div>;
  }

  return (
    <div className="space-y-8 p-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-slate-500">Inbox</p>
          <h2 className="font-display text-3xl italic text-white">Solicitudes de Reserva</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-slate-400">
          {requests.length} mensaje{requests.length === 1 ? '' : 's'} en bandeja
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-[#111114] px-8 py-14 text-center text-slate-500">
          No hay solicitudes pendientes.
        </div>
      ) : (
        <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 gap-5 xl:grid-cols-6">
          {requests.map((req, index) => {
            const propertyTitle = getPropertyTitle(req.propertyId);
            const cardSpan = index % 3 === 0 ? 'xl:col-span-3' : 'xl:col-span-3';

            return (
              <article
                key={req._id}
                className={`group rounded-[30px] border border-white/10 bg-[#111114] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-colors hover:border-white/20 ${cardSpan}`}
              >
                <div className="flex h-full flex-col gap-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] ${statusStyles[req.status]}`}>
                        {req.status}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">Propiedad</p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">{propertyTitle}</h3>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-right">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Total solicitado</p>
                      <p className="mt-2 text-2xl font-semibold text-white">${req.totalPrice}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-500">Huésped</p>
                      <p className="mt-3 text-xl font-semibold text-white">{req.guestName}</p>
                      <p className="mt-2 break-all text-sm text-slate-400">{req.email}</p>
                      {req.whatsapp ? <p className="mt-1 text-sm text-slate-400">WhatsApp: {req.whatsapp}</p> : null}
                      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {req.guests} huésped{req.guests === 1 ? '' : 'es'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-200/70">Check-in</p>
                        <p className="mt-3 text-lg font-semibold text-white">{formatDate(req.startDate)}</p>
                      </div>
                      <div className="rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/5 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-fuchsia-200/70">Check-out</p>
                        <p className="mt-3 text-lg font-semibold text-white">{formatDate(req.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-2 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => window.open(`mailto:${req.email}`, '_blank', 'noopener,noreferrer')}
                        className="rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-200 transition-colors hover:bg-sky-500/20"
                      >
                        Enviar correo
                      </button>
                      {req.whatsapp ? (
                        <button
                          onClick={() => window.open(getWhatsAppHref(req.whatsapp || ''), '_blank', 'noopener,noreferrer')}
                          className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300 transition-colors hover:bg-emerald-500/20"
                        >
                          WhatsApp
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleStatusChange(req._id, 'approved')}
                        className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300 transition-colors hover:bg-emerald-500/20"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, 'denied')}
                        className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-300 transition-colors hover:bg-rose-500/20"
                      >
                        Denegar
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(req._id)}
                      className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300 transition-colors hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};