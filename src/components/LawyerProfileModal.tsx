import React from 'react';
import { 
  X, 
  Scale, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Award,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { LAWYER_PROFILE } from '../data/initialData';

interface LawyerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl glass-card rounded-3xl border-amber-500/40 overflow-hidden shadow-2xl my-auto">
        
        {/* Profile Header with Flag / Law Books Background */}
        <div className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar, Bar Seal and Details */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-[#090d16] flex items-center justify-center text-amber-400">
                  <Scale className="w-10 h-10" />
                </div>
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-950 border-2 border-[#090d16] flex items-center justify-center text-emerald-400"
                title="Licencia Activa"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3 text-amber-400" />
                  {LAWYER_PROFILE.titulo}
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  License Status: Active
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                {LAWYER_PROFILE.nombre}
              </h2>
              <p className="text-xs text-amber-200/90 font-mono font-semibold">
                California Bar License: {LAWYER_PROFILE.barNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information List */}
        <div className="p-5 sm:p-6 space-y-3.5 text-xs max-h-[60vh] overflow-y-auto">
          
          {/* Card 1: Official Bar Certification (from California State Bar) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-900 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Certificación Oficial • The State Bar of California
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Número de Tarjeta Profesional:</span>
                <span className="font-mono text-sm font-bold text-white">{LAWYER_PROFILE.barNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Colegio de Abogados:</span>
                <span className="font-semibold text-slate-200">{LAWYER_PROFILE.barState}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-[11px] text-slate-300">
                Verificable públicamente en el registro oficial del Estado de California.
              </span>
              <a
                href={LAWYER_PROFILE.barVerificationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] flex items-center gap-1.5 transition shadow cursor-pointer shrink-0"
              >
                <span>Verificar en CalBar.ca.gov</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 2: Phone / WhatsApp */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Teléfono & WhatsApp de Atención
              </div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">
                {LAWYER_PROFILE.telefono}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Línea oficial registrada en WhatsApp Business para atención de casos y emergencias.
              </p>
            </div>
            <a
              href={`https://wa.me/${LAWYER_PROFILE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-lg shadow-emerald-950/40 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </a>
          </div>

          {/* Card 3: Address & Office */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Dirección Institucional / Registro
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">
                {LAWYER_PROFILE.direccion}
              </div>
            </div>
          </div>

          {/* Card 4: Email */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Correo Electrónico Oficial
              </div>
              <a 
                href={`mailto:${LAWYER_PROFILE.email}`} 
                className="text-xs font-semibold text-blue-300 hover:text-blue-200 truncate block mt-0.5"
              >
                {LAWYER_PROFILE.email}
              </a>
            </div>
          </div>

          {/* Card 5: Academic / California Constitution Center */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Centro de Investigación & Sitio Web
              </div>
              <a
                href={LAWYER_PROFILE.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 truncate flex items-center gap-1 mt-0.5"
              >
                <span>California Constitution Center • Berkeley Law</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Card 6: Horario */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Horario de Atención
              </div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {LAWYER_PROFILE.horario}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {LAWYER_PROFILE.despacho}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
