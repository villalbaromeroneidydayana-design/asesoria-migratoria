import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, KeyRound, ArrowRight } from 'lucide-react';
import { LAWYER_PROFILE } from '../data/initialData';

interface CrmAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

// PINs maestros autorizados para el despacho
const VALID_PINS = ['1778', '177856', '2024', '1234'];

export const CrmAuthModal: React.FC<CrmAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (VALID_PINS.includes(cleanPin)) {
      setError(false);
      try {
        localStorage.setItem('bufete_crm_authenticated', 'true');
      } catch (err) {
        // ignore
      }
      onAuthenticated();
    } else {
      setError(true);
      setErrorMessage('Clave de seguridad incorrecta. Acceso denegado a personal no autorizado.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-card rounded-3xl border-amber-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition cursor-pointer"
          title="Regresar al Sitio Web Público"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6 relative z-10">
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-white tracking-tight">
              Área Restringida del Despacho
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Expedientes y datos confidenciales protegidos bajo el secreto profesional legal (8 CFR § 292.1).
            </p>
          </div>

          {/* PIN Input Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>PIN / Clave de Acceso:</span>
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="••••••"
                autoFocus
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-950 border text-center text-white text-xl font-mono tracking-[0.5em] placeholder:tracking-normal placeholder:text-slate-600 focus:outline-none transition ${
                  error 
                    ? 'border-red-500/80 ring-2 ring-red-500/20' 
                    : 'border-slate-700 focus:border-amber-400 ring-2 ring-amber-500/10'
                }`}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>Ingresar al Panel Jurídico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-3 border-t border-slate-800 text-center space-y-1 text-[11px] text-slate-500">
            <p className="flex items-center justify-center gap-1 text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{LAWYER_PROFILE.despacho}</span>
            </p>
            <p>Los clientes externos no tienen acceso a expedientes ni registros del despacho.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
