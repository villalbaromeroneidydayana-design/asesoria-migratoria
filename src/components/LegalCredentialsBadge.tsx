import { ShieldCheck, ExternalLink, Scale } from 'lucide-react';
import { firmData } from '../config/firmData';

export default function LegalCredentialsBadge({ variant = 'header' }: { variant?: 'header' | 'footer' }) {
  
  if (variant === 'header') {
    return (
      <div className="bg-emerald-950/80 border-b border-emerald-900 text-emerald-50 py-2 px-4 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
             <div className="flex items-center gap-2">
               <Scale size={16} className="text-gold-500 shrink-0" />
               <span className="font-medium tracking-wide">
                 Firma Jurídica Supervisada por <strong>{firmData.lawyerName}</strong> | Texas State Bar #{firmData.barNumber}
               </span>
             </div>
             <div className="hidden sm:block w-px h-4 bg-emerald-800"></div>
             <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck size={14} />
                <span>Cifrado SSL 256-bit | Privilegio Abogado-Cliente Garantizado</span>
             </div>
          </div>
          <a 
            href={firmData.verificationDirectoryUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700/50 px-3 py-1 rounded-full transition text-emerald-100 font-semibold"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            Verificar Licencia en TexasBar.com <ExternalLink size={12} className="opacity-70" />
          </a>
        </div>
      </div>
    );
  }

  // Footer Variant
  return (
    <div className="bg-gradient-to-br from-slate-900 to-navy-950 rounded-2xl p-6 border border-emerald-900/50 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        <div className="bg-emerald-950 p-4 rounded-full border border-emerald-800 shadow-inner shrink-0">
          <ShieldCheck size={40} className="text-emerald-400" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
            Compromiso de Honestidad
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-2xl">
            Evaluaciones legales respaldadas por profesionales acreditados ante tribunales federales de EE. UU.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
             <span className="bg-slate-800 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">
               State Bar of Texas #{firmData.barNumber}
             </span>
             <a 
              href={firmData.verificationDirectoryUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition"
            >
              Verificar Licencia <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
