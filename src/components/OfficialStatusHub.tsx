import { ExternalLink, PhoneCall, Scale, Search, FileText } from 'lucide-react';

interface Props {
  theme?: 'light' | 'dark';
}

export default function OfficialStatusHub({ theme = 'light' }: Props) {
  const isDark = theme === 'dark';
  
  const cardClass = isDark 
     ? "bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-full relative overflow-hidden" 
     : "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full relative overflow-hidden";
     
  const textTitleClass = isDark ? "text-slate-100" : "text-navy-900";
  const textDescClass = isDark ? "text-slate-400" : "text-slate-600";
  const primaryBtnClass = isDark 
     ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm w-full shadow-lg shadow-emerald-900/20"
     : "bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm w-full";
  const secondaryBtnClass = isDark
     ? "bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm w-full mt-3 border border-slate-600"
     : "border border-navy-200 hover:bg-navy-50 text-navy-800 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition text-sm w-full mt-3";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. EOIR */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-4">
           <div className={`p-2.5 rounded-lg ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}><Scale size={24} /></div>
           <h3 className={`font-bold leading-tight ${textTitleClass}`}>Consultar Fecha de Corte y Juez (EOIR)</h3>
        </div>
        <p className={`text-sm mb-6 flex-1 ${textDescClass}`}>
           Usa tu A-Number de 9 dígitos (A-XXX-XXX-XXX) que aparece en tu orden de comparecencia (NTA).
        </p>
        <div className="mt-auto">
           <a href="https://acis.eoir.justice.gov" target="_blank" rel="noreferrer" className={primaryBtnClass}>
             <ExternalLink size={16} /> Portal Web EOIR
           </a>
           <a href="tel:18008987180" className={secondaryBtnClass}>
             <PhoneCall size={16} /> Llamar: 1-800-898-7180
           </a>
        </div>
      </div>

      {/* 2. USCIS */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-4">
           <div className={`p-2.5 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Search size={24} /></div>
           <h3 className={`font-bold leading-tight ${textTitleClass}`}>Rastreo de Trámites USCIS</h3>
        </div>
        <p className={`text-sm mb-6 flex-1 ${textDescClass}`}>
           Usa tu Receipt Number de 13 caracteres (ej. IOE, LIN, SRC) que está en tu Notificación I-797C.
        </p>
        <div className="mt-auto">
           <a href="https://egov.uscis.gov" target="_blank" rel="noreferrer" className={primaryBtnClass}>
             <ExternalLink size={16} /> Revisar Estatus USCIS
           </a>
        </div>
      </div>

      {/* 3. I-94 */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 mb-4">
           <div className={`p-2.5 rounded-lg ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}><FileText size={24} /></div>
           <h3 className={`font-bold leading-tight ${textTitleClass}`}>Descargar Registro I-94 (CBP)</h3>
        </div>
        <p className={`text-sm mb-6 flex-1 ${textDescClass}`}>
           Ingresa tu número de pasaporte para comprobar tu admisión legal a EE. UU.
        </p>
        <div className="mt-auto">
           <a href="https://i94.cbp.dhs.gov" target="_blank" rel="noreferrer" className={primaryBtnClass}>
             <ExternalLink size={16} /> Obtener I-94 Oficial
           </a>
        </div>
      </div>
    </div>
  );
}
