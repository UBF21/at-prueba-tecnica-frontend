import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, saveToken } from '../api/auth';
import type { ApiError } from '../types';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login({ email, password });
      saveToken(response.token);
      navigate('/orders', { replace: true });
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#1A1530] to-[#0F0F1A]" />

      {/* Multiple radial gradient halos for depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(232, 197, 71, 0.5) 0%, transparent 70%)',
            top: '10%',
            right: '10%',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute w-72 h-72 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)',
            bottom: '20%',
            left: '5%',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="px-8 py-10 bg-surface-raised rounded-xl border border-border-default shadow-2xl">
          {/* Title with gold accent line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-primary to-gold-bright bg-clip-text text-transparent mb-3">
              AT
            </h1>
            <div className="w-10 h-[2px] bg-gold-primary mx-auto" />
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-semantic-danger/10 border border-semantic-danger/50 text-semantic-danger rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@retopedidos.com"
                required
                className="w-full px-4 py-3 bg-surface-overlay border border-border-default text-text-primary rounded-lg focus:outline-none focus:border-gold-dim transition-colors duration-200 placeholder:text-text-muted"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin123!"
                required
                className="w-full px-4 py-3 bg-surface-overlay border border-border-default text-text-primary rounded-lg focus:outline-none focus:border-gold-dim transition-colors duration-200 placeholder:text-text-muted"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-8 bg-gold-primary hover:bg-gold-bright disabled:bg-gold-muted text-surface-base font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    opacity="0.75"
                  />
                </svg>
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </motion.button>
          </form>

          {/* Credentials hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-center text-text-muted text-xs mt-8 leading-relaxed"
          >
            Usuario: admin@retopedidos.com
            <br />
            Contraseña: Admin123!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;
