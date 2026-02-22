import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const API_BASE_URL = '/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-lime-400 rounded-2xl mb-6 sm:mb-8 shadow-2xl shadow-emerald-400/40"
          >
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-slate-900" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Admin Portal</h1>
          <p className="text-sm sm:text-base text-slate-400 uppercase tracking-widest">Enter credentials to access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Username</label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all hover:border-slate-600/50 backdrop-blur-sm"
              placeholder="admin"
              required
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all pr-14 hover:border-slate-600/50 backdrop-blur-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl sm:rounded-2xl text-red-400 text-xs sm:text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-900 font-bold uppercase tracking-wider rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-emerald-400/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={22} /> : 'Login'}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">← Back to Portfolio</a>
        </div>
      </div>
    </div>
  );
}
