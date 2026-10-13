// src/components/admin/ChangePasswordModal.tsx
import { useState, useRef } from 'react';
import { X, Loader2, KeyRound } from 'lucide-react';
import { useModalFocus } from '../../utils/useModalFocus';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ isOpen, onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalFocus(dialogRef, onClose, isOpen);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setLoading(true);
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    try {
      const res = await fetch(`${apiBase}/api/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('adminToken') || ''
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMessage(data?.msg || 'Contraseña actualizada con éxito.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data?.msg || 'No se pudo actualizar la contraseña.');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('No se pudo actualizar la contraseña. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-110 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="change-password-title" tabIndex={-1} className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 p-6">
          <h2 id="change-password-title" className="flex items-center gap-2 font-display text-xl italic text-white">
            <KeyRound size={20} /> Cambiar Contraseña
          </h2>
          <button type="button" onClick={resetAndClose} aria-label="Close change password dialog" className="p-2 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Contraseña actual</label>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border-none bg-[#1c1c1e] p-4 text-sm text-white focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nueva contraseña</label>
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border-none bg-[#1c1c1e] p-4 text-sm text-white focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Confirmar nueva contraseña</label>
            <input
              required
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border-none bg-[#1c1c1e] p-4 text-sm text-white focus:ring-1 focus:ring-white/20"
            />
          </div>

          {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
          {successMessage ? <p className="text-xs font-medium text-green-500">{successMessage}</p> : null}

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-slate-200 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};
