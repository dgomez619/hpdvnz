import { Moon, Sun } from 'lucide-react';
import type { AdminTheme } from '../../utils/useAdminTheme';

interface AdminThemeToggleProps {
  theme: AdminTheme;
  onToggle: () => void;
}

export const AdminThemeToggle = ({ theme, onToggle }: AdminThemeToggleProps) => {
  const isLight = theme === 'light';
  const label = isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';

  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isLight}
      aria-label={label}
      title={label}
      className="relative flex h-11 w-22 shrink-0 items-center rounded-full border border-white/10 bg-white/5 p-1 transition-colors hover:bg-white/10"
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 h-9 w-10 rounded-full bg-white shadow-md transition-transform duration-300 ${isLight ? 'translate-x-0' : 'translate-x-10'}`}
      />
      <span className={`relative z-10 grid h-9 w-10 place-items-center transition-colors ${isLight ? 'text-black' : 'text-slate-500'}`}>
        <Sun size={16} />
      </span>
      <span className={`relative z-10 grid h-9 w-10 place-items-center transition-colors ${isLight ? 'text-slate-500' : 'text-black'}`}>
        <Moon size={16} />
      </span>
    </button>
  );
};
