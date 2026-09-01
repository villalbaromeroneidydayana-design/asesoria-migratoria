import { useState } from 'react';
import { ExternalLink, Search, Scale, FileText, CopyPlus, X } from 'lucide-react';

interface Props {
  theme?: 'light' | 'dark';
  isOpen?: boolean;
  onClose?: () => void;
  extractedData?: {
    aNumber?: string;
    receiptNumber?: string;
  };
}

export default function OfficialLookupConsole({ theme = 'light', isOpen = true, onClose, extractedData }: Props) {
  const [activeTab, setActiveTab] = useState<'eoir' | 'uscis' | 'cbp'>('eoir');
  const [inputs, setInputs] = useState({
    aNumber: '',
    receiptNumber: '',
    passport: ''
  });

  const isDark = theme === 'dark';
  
  if (!isOpen) return null;

  const handleAutofill = () => {
     if (extractedData?.aNumber) setInputs(prev => ({ ...prev, aNumber: extractedData.aNumber! }));
     if (extractedData?.receiptNumber) setInputs(prev => ({ ...prev, receiptNumber: extractedData.receiptNumber! }));
  };

  const baseContainer = isDark 
     ? "bg-slate-900 border border-slate-800 shadow-2xl flex flex-col h-full text-slate-200"
     : "bg-white border border-slate-200 shadow-lg flex flex-col h-full text-navy-900 rounded-2xl";

  const tabClass = (tab: string) => {
     const active = activeTab === tab;
     if (isDark) {
        return `flex-1 py-3 text-sm font-bold text-center border-b-2 transition cursor-pointer ${active ? 'border-emerald-500 text-emerald-400 bg-slate-800' : 'border-slate-800 text-slate-500 hover:bg-slate-800/50'}`;
     }
     return `flex-1 py-3 text-sm font-bold text-center border-b-2 transition cursor-pointer ${active ? 'border-navy-900 text-navy-900 bg-slate-50' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`;
  };

  const inputClass = isDark
     ? "w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-emerald-500 focus:border-emerald-500"
     : "w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-navy-900 focus:ring-navy-900 focus:border-navy-900";

  return (
    <div className={baseContainer}>
      <div className={`p-4 flex justify-between items-center ${isDark ? 'border-b border-slate-800' : 'border-b border-slate-100'}`}>
         <h2 className="font-bold flex items-center gap-2">
            <Search size={18} className={isDark ? "text-emerald-400" : "text-navy-900"} /> 
            Consola Gubernamental
         </h2>
         <div className="flex items-center gap-2">
            {extractedData && (
               <button onClick={handleAutofill} className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-gold-400' : 'bg-gold-50 hover:bg-gold-100 text-gold-700'}`}>
                  <CopyPlus size={14} /> Autocompletar
               </button>
            )}
            {onClose && (
               <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800/50 transition">
                  <X size={18} />
               </button>
            )}
         </div>
      </div>

      <div className="flex border-b border-slate-800">
         <div className={tabClass('eoir')} onClick={() => setActiveTab('eoir')}>
            <Scale size={16} className="mx-auto mb-1" /> EOIR
         </div>
         <div className={tabClass('uscis')} onClick={() => setActiveTab('uscis')}>
            <Search size={16} className="mx-auto mb-1" /> USCIS
         </div>
         <div className={tabClass('cbp')} onClick={() => setActiveTab('cbp')}>
            <FileText size={16} className="mx-auto mb-1" /> CBP I-94
         </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
         {activeTab === 'eoir' && (
            <div className="animate-in fade-in duration-300">
               <h3 className="font-bold mb-2">Consulta de Cortes de Inmigración</h3>
               <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Verifique fecha, hora y juez asignado usando el número de extranjero (A-Number).</p>
               
               <label className="block text-sm font-bold mb-2">A-Number</label>
               <input 
                  type="text" 
                  value={inputs.aNumber}
                  onChange={(e) => setInputs({...inputs, aNumber: e.target.value})}
                  placeholder="A-XXX-XXX-XXX" 
                  className={inputClass}
               />
               
               <div className={`mt-4 p-3 rounded-lg text-xs ${isDark ? 'bg-red-950/30 text-red-300 border border-red-900/50' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  Nota: El sistema ACIS requiere validación de seguridad oficial. Haga clic abajo para abrir el portal con su número.
               </div>

               <a href="https://acis.eoir.justice.gov" target="_blank" rel="noreferrer" className={`mt-4 w-full py-3 px-4 rounded-lg font-bold flex justify-center items-center gap-2 transition ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-navy-900 hover:bg-navy-800 text-white'}`}>
                  <ExternalLink size={16} /> Abrir Portal EOIR
               </a>
            </div>
         )}

         {activeTab === 'uscis' && (
            <div className="animate-in fade-in duration-300">
               <h3 className="font-bold mb-2">Rastreo de Caso USCIS</h3>
               <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Consulte el estado de I-765, I-589 u otros formularios usando el número de recibo.</p>
               
               <label className="block text-sm font-bold mb-2">Receipt Number</label>
               <input 
                  type="text" 
                  value={inputs.receiptNumber}
                  onChange={(e) => setInputs({...inputs, receiptNumber: e.target.value})}
                  placeholder="ej. IOE1234567890" 
                  className={inputClass}
               />

               <a href="https://egov.uscis.gov" target="_blank" rel="noreferrer" className={`mt-6 w-full py-3 px-4 rounded-lg font-bold flex justify-center items-center gap-2 transition ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-navy-900 hover:bg-navy-800 text-white'}`}>
                  <ExternalLink size={16} /> Consultar en USCIS
               </a>
            </div>
         )}

         {activeTab === 'cbp' && (
            <div className="animate-in fade-in duration-300">
               <h3 className="font-bold mb-2">Registro de Admisión I-94</h3>
               <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Obtenga el registro oficial de entrada a EE. UU. emitido por CBP.</p>
               
               <label className="block text-sm font-bold mb-2">Número de Pasaporte</label>
               <input 
                  type="text" 
                  value={inputs.passport}
                  onChange={(e) => setInputs({...inputs, passport: e.target.value})}
                  placeholder="Número de Pasaporte" 
                  className={inputClass}
               />

               <a href="https://i94.cbp.dhs.gov" target="_blank" rel="noreferrer" className={`mt-6 w-full py-3 px-4 rounded-lg font-bold flex justify-center items-center gap-2 transition ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-navy-900 hover:bg-navy-800 text-white'}`}>
                  <ExternalLink size={16} /> Ir al Portal CBP I-94
               </a>
            </div>
         )}
      </div>
    </div>
  );
}
