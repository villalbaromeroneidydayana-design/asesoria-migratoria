import { useState, useMemo } from 'react';
import { Calendar, Share2, Search, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ViralUtilityTools() {
  const { t } = useTranslation();
  
  // -- Calculator State --
  const [baseDate, setBaseDate] = useState('');
  
  const calculateProgress = useMemo(() => {
    if (!baseDate) return { days: 0, percent: 0, targetDate: null, canApply: false };
    
    const start = new Date(baseDate);
    const target = new Date(start);
    target.setDate(target.getDate() + 150); // Usually eligible to APPLY at 150 days for EAD
    
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const daysElapsed = Math.max(0, diffDays);
    const percent = Math.min(100, (daysElapsed / 150) * 100);
    const canApply = daysElapsed >= 150;
    
    return { days: daysElapsed, percent, targetDate: target.toLocaleDateString(), canApply };
  }, [baseDate]);

  const handleShareCalculator = () => {
    const url = window.location.href;
    const text = encodeURIComponent(`⏳ ¡Calcula gratis cuántos días faltan para tu Permiso de Trabajo (I-765) de Asilo! Usa esta herramienta segura: ${url}`);
    window.open(`whatsapp://send?text=${text}`, '_blank');
  };

  // -- Glossary State --
  const [searchTerm, setSearchTerm] = useState('');
  
  const dictionary = [
    { term: 'NTA', full: 'Notice to Appear', def: 'Documento oficial que inicia los procedimientos de deportación. Contiene los cargos del gobierno en su contra.' },
    { term: 'I-797C', full: 'Notice of Action', def: 'Recibo oficial de USCIS confirmando que han recibido su solicitud o el pago de tarifas.' },
    { term: 'Biometrics', full: 'Cita de Biométricos', def: 'Cita en la cual USCIS toma sus huellas dactilares y fotografía para revisión de antecedentes.' },
    { term: 'Asylum Clock', full: 'Reloj de Asilo', def: 'El conteo de días desde que se radicó su asilo. Debe llegar a 150 días para solicitar el permiso de trabajo.' },
    { term: 'Master Calendar', full: 'Audiencia Preliminar', def: 'Primera audiencia breve frente a un juez de inmigración para programar su caso.' }
  ];

  const filteredGlossary = dictionary.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.full.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8 my-16">
      
      {/* 1. Work Permit Calculator */}
      <div className="bg-gradient-to-b from-slate-900 to-navy-950 rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-[60px] group-hover:bg-gold-500/20 transition-all"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gold-500/20 p-3 rounded-xl border border-gold-500/30">
              <Clock className="text-gold-400" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{t('viral.calculator.title', 'Calculadora: Permiso de Trabajo')}</h3>
              <p className="text-slate-400 text-sm">{t('viral.calculator.subtitle', 'Para Solicitantes de Asilo (Regla de los 150/180 días)')}</p>
            </div>
          </div>

          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 mb-6">
             <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
               <Calendar size={16} className="text-emerald-400"/> {t('viral.calculator.dateLabel', 'Fecha en que USCIS recibió su asilo (Recibo I-797C)')}
             </label>
             <input 
                type="date" 
                value={baseDate} 
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-gold-500 focus:border-gold-500 px-4 py-3"
             />
          </div>

          {baseDate && (
             <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-slate-300 font-medium">{t('viral.calculator.daysAccumulated', 'Días Acumulados:')} <strong className="text-gold-400 text-xl">{calculateProgress.days}</strong>/150</span>
                 <span className="text-xs text-slate-500">{Math.round(calculateProgress.percent)}%</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
                 <div 
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${calculateProgress.canApply ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-gold-500'}`}
                    style={{ width: `${calculateProgress.percent}%` }}
                 ></div>
               </div>
               
               {calculateProgress.canApply ? (
                  <div className="bg-emerald-950/50 border border-emerald-900/50 p-4 rounded-xl flex items-start gap-3">
                     <AlertCircle className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                     <p className="text-sm text-emerald-100">{t('viral.calculator.canApply', '¡Felicidades! Ya han pasado más de 150 días. Puede presentar su solicitud I-765 hoy mismo.')}</p>
                  </div>
               ) : (
                  <div className="bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl">
                     <p className="text-sm text-slate-300">
                        {t('viral.calculator.targetDate', 'Usted será elegible para solicitar su permiso en o alrededor del:')} 
                        <strong className="block text-lg text-white mt-1">{calculateProgress.targetDate}</strong>
                     </p>
                  </div>
               )}
             </div>
          )}

          <button 
             onClick={handleShareCalculator}
             className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition flex justify-center items-center gap-2 shadow-lg hover:shadow-emerald-500/20"
          >
             <Share2 size={18} /> {t('viral.calculator.shareBtn', 'Compartir calculadora en WhatsApp')}
          </button>
        </div>
      </div>

      {/* 2. Glossary */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl flex flex-col">
         <div className="flex items-center gap-3 mb-6">
            <div className="bg-navy-100 p-3 rounded-xl border border-navy-200">
              <BookOpen className="text-navy-700" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy-900">{t('viral.glossary.title', 'Glosario Migratorio Rápido')}</h3>
              <p className="text-slate-500 text-sm">{t('viral.glossary.subtitle', 'Entiende tus cartas de USCIS y Cortes')}</p>
            </div>
         </div>

         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
               type="text" 
               placeholder={t('viral.glossary.searchPlaceholder', 'Buscar término (ej. NTA, I-797...)')}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-700 focus:ring-navy-500 focus:border-navy-500 transition"
            />
         </div>

         <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar max-h-[300px]">
            {filteredGlossary.map((item, idx) => (
               <details key={idx} className="group bg-slate-50 border border-slate-100 rounded-xl p-4 cursor-pointer hover:border-navy-200 transition [&_summary::-webkit-details-marker]:hidden">
                  <summary className="font-bold text-navy-900 flex justify-between items-center outline-none">
                     <span className="flex items-center gap-2">
                        <span className="bg-navy-900 text-white text-xs px-2 py-1 rounded">{item.term}</span>
                        {item.full}
                     </span>
                     <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-sm text-slate-600 mt-3 pl-1 leading-relaxed border-t border-slate-100 pt-3">
                     {item.def}
                  </p>
               </details>
            ))}
            
            {filteredGlossary.length === 0 && (
               <p className="text-center text-slate-500 py-8">{t('viral.glossary.noResults', 'No se encontraron resultados.')}</p>
            )}
         </div>
      </div>

    </div>
  );
}
