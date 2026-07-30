import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onAuthenticate: () => void;
}

export default function AuthModal({ onAuthenticate }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'pizzue') {
      setError(false);
      setSuccess(true);
      sessionStorage.setItem('smart_meter_auth', 'true');
      setTimeout(() => {
        onAuthenticate();
      }, 800);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050508]/90 backdrop-blur-xl">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[rgba(0,240,255,0.08)] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[rgba(255,0,255,0.05)] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="w-full max-w-md rounded-2xl border border-[rgba(0,240,255,0.2)] p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        style={{
          background: 'rgba(15, 15, 25, 0.85)',
          backdropFilter: 'blur(16px)',
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Top Glowing Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center mb-4 relative"
            animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {success ? (
              <Shield className="w-8 h-8 text-[#00FF9D]" />
            ) : (
              <Lock className="w-8 h-8 text-[#00F0FF]" />
            )}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F0FF]"></span>
            </span>
          </motion.div>

          <h2 className="font-rajdhani text-2xl font-bold tracking-widest text-white uppercase mb-1">
            System Authentication
          </h2>
          <p className="text-[#8A8A9E] text-xs font-inter">
            Enter security passphrase to access 3-Phase Energy Monitor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#8A8A9E] text-[10px] font-mono tracking-widest uppercase mb-2 flex items-center gap-1.5">
              <KeyRound size={12} className="text-[#00F0FF]" /> Passphrase Required
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Enter password..."
                className={`w-full bg-[rgba(10,10,18,0.7)] border ${
                  error ? 'border-[#FF0055]' : 'border-[#1A1A24] focus:border-[#00F0FF]'
                } rounded-xl px-4 py-3.5 text-white font-mono text-sm placeholder-[#4A4A5E] focus:outline-none transition-all pr-12`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6A6A7E] hover:text-[#00F0FF] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(255,0,85,0.1)] border border-[rgba(255,0,85,0.3)] text-[#FF0055] text-xs font-mono"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>Access Denied: Incorrect password</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={success}
            className={`w-full py-3.5 px-6 rounded-xl font-rajdhani font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)] ${
              success
                ? 'bg-[#00FF9D] text-[#050508]'
                : 'bg-gradient-to-r from-[#00F0FF] to-[#00A3FF] hover:from-[#00A3FF] hover:to-[#00F0FF] text-[#050508] active:scale-[0.98]'
            }`}
          >
            {success ? (
              <>
                <span>Access Granted</span>
              </>
            ) : (
              <>
                <span>Unlock Terminal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#1A1A24] flex items-center justify-between text-[10px] text-[#4A4A5E] font-mono">
          <span>SECURE SYSTEM v3.0</span>
          <span className="text-[#00FF9D]">ENCRYPTED</span>
        </div>
      </motion.div>
    </div>
  );
}
