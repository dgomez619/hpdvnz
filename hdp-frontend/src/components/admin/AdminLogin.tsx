import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // New state for error messages
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Send the data to your Node.js server
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Check if the server rejected the login
      if (!response.ok) {
        throw new Error(data.msg || 'Error al iniciar sesión');
      }

      // 3. SUCCESS: Save the token and redirect
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      
      navigate('/admin/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-6">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="font-display text-2xl font-bold tracking-[0.3em] text-white uppercase">
            HOSPEDAJE<span className="font-light opacity-40">PORDIAS</span>
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Centro de Comando Administrativo
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#161618] p-10 rounded-3xl shadow-2xl border border-white/5">
          
          {/* ERROR ALERT */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-xs animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={18} />
                </span>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#1c1c1e] border border-white/5 rounded-xl text-sm text-white focus:ring-1 focus:ring-white/20 transition-all outline-none"
                  placeholder="admin@hospedajepordias.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#1c1c1e] border border-white/5 rounded-xl text-sm text-white focus:ring-1 focus:ring-white/20 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verificando..." : "Acceder al Panel"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase tracking-widest">
          Sistema de Acceso Restringido
        </p>
      </div>
    </div>
  );
};