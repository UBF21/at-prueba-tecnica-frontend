import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { login, saveToken } from '../api/auth';
import type { ApiError } from '../types';

function LoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // GSAP entrance animation
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      saveToken(response.token);
      navigate('/pedidos', { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800"
    >
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Reto Pedidos
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 text-red-400 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@retopedidos.com"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin123!"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded transition"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Usuario: admin@retopedidos.com
          <br />
          Contraseña: Admin123!
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
