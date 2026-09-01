import { useState, useMemo } from 'react';
import { Share2, Search, BookOpen, Clock, ShieldAlert, Download, ChevronDown } from 'lucide-react';

export default function HeroUtilityCards() {
  
  // -- Calculator State --
  const [baseDate, setBaseDate] = useState('');
  
  const calculateProgress = useMemo(() => {
    if (!baseDate) return null;
    
    const start = new Date(baseDate);
    const target = new Date(start);
    target.setDate(target.getDate() + 150); 
    
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
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // -- Glossary State --
  const [searchTerm, setSearchTerm] = useState('');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  
  const dictionary = [
    { term: 'NTA', full: 'Notice to Appear', def: 'Documento oficial que inicia los procedimientos de deportación. Contiene los cargos del gobierno en su contra.' },
    { term: 'I-797C', full: 'Notice of Action', def: 'Recibo oficial de USCIS confirmando que han recibido su solicitud o el pago de tarifas.' },
    { term: 'Biometrics', full: 'Cita de Biométricos', def: 'Cita en la cual USCIS toma sus huellas dactilares y fotografía para revisión de antecedentes.' },
    { term: 'Master Calendar', full: 'Audiencia Preliminar', def: 'Primera audiencia breve frente a un juez de inmigración para programar su caso.' }
  ];

  const filteredGlossary = dictionary.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.full.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -- Red Card State --
  const [isRedCardOpen, setIsRedCardOpen] = useState(false);

  return (
    <div className="grid md:grid-cols-3 gap-6 my-8 relative z-20">
      
      {/* CARD 1: Work Permit Calculator */}
      <div className="bg-slate-900 border border-slate-700/50 hover:border-gold-500/50 rounded-2xl p-6 shadow-xl transition-all group flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gold-500/20 p-2.5 rounded-lg border border-gold-500/30">
            <Clock className="text-gold-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">Calculadora de Permiso de Trabajo (180 Días)</h3>
        </div>
        
        <div className="flex-1">
           <label className="block text-xs font-bold text-slate-400 mb-2">Fecha de radicación I-589 o entrada CBP One:</label>
           <input 
              type="date" 
              value={baseDate} 
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-gold-500 focus:border-gold-500 px-3 py-2 text-sm mb-4"
           />

           {calculateProgress && (
              <div className="animate-in fade-in duration-300 mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-slate-300 text-sm font-medium">Días: <strong className="text-gold-400">{calculateProgress.days}</strong>/150</span>
                  <span className="text-xs text-slate-500">{Math.round(calculateProgress.percent)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div 
                     className={`h-2 rounded-full transition-all duration-1000 ease-out ${calculateProgress.canApply ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-gold-500'}`}
                     style={{ width: `${calculateProgress.percent}%` }}
                  ></div>
                </div>
                {calculateProgress.canApply ? (
                   <p className="text-xs text-emerald-400 font-medium">¡Elegible para aplicar a c-8/c-11!</p>
                ) : (
                   <p className="text-xs text-slate-400">Elegible aprox: {calculateProgress.targetDate}</p>
                )}
              </div>
           )}
        </div>

        <button 
           onClick={handleShareCalculator}
           className="w-full bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold py-2.5 px-3 rounded-lg transition flex justify-center items-center gap-2 text-sm border border-slate-700 hover:border-emerald-500 mt-auto"
        >
           <Share2 size={16} /> Compartir cálculo en WhatsApp
        </button>
      </div>

      {/* CARD 2: Immigration Dictionary */}
      <div className="bg-slate-900 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl transition-all flex flex-col h-full relative z-30">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
            <BookOpen className="text-blue-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">Diccionario de Cartas y Términos</h3>
        </div>
        
        <p className="text-xs text-slate-400 mb-4">Buscador rápido para entender siglas oficiales de USCIS/EOIR.</p>
        
        <div className="relative mb-2">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input 
              type="text" 
              placeholder="Ej. NTA, I-797C..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsGlossaryOpen(true)}
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 pl-9 pr-3 py-2 text-sm"
           />
        </div>

        {isGlossaryOpen && searchTerm && (
           <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 p-2 custom-scrollbar">
              <div className="flex justify-between items-center px-2 py-1 mb-2">
                 <span className="text-xs text-slate-400 font-bold">Resultados:</span>
                 <button onClick={() => setIsGlossaryOpen(false)} className="text-slate-400 hover:text-white"><ChevronDown size={16}/></button>
              </div>
              {filteredGlossary.map((item, idx) => (
                 <div key={idx} className="bg-slate-900 rounded-lg p-3 mb-2 last:mb-0 border border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{item.term}</span>
                       <span className="text-sm font-bold text-white">{item.full}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.def}</p>
                 </div>
              ))}
              {filteredGlossary.length === 0 && (
                 <p className="text-center text-xs text-slate-500 py-4">No se encontró el término.</p>
              )}
           </div>
        )}
      </div>

      {/* CARD 3: Red Card */}
      <div className="bg-gradient-to-br from-red-950 to-slate-900 border border-red-900/50 hover:border-red-500/50 rounded-2xl p-6 shadow-xl transition-all flex flex-col h-full relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-all"></div>
        
        <div className="flex items-center gap-3 mb-4 relative z-10">
          <div className="bg-red-500/20 p-2.5 rounded-lg border border-red-500/30">
            <ShieldAlert className="text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">Tarjeta Roja Digital de Emergencia</h3>
        </div>
        
        <p className="text-xs text-red-200/70 mb-4 relative z-10 leading-relaxed">
           Protege tus derechos bajo la 4ta y 5ta Enmienda si eres detenido por ICE. Bilingüe (Inglés/Español).
        </p>
        
        <button 
           onClick={() => setIsRedCardOpen(!isRedCardOpen)}
           className="w-full bg-red-600/80 hover:bg-red-500 text-white font-bold py-2.5 px-3 rounded-lg transition flex justify-center items-center gap-2 text-sm border border-red-500 mt-auto relative z-10 shadow-lg shadow-red-900/50"
        >
           <ShieldAlert size={16} /> Abrir Tarjeta Roja
        </button>

        {isRedCardOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-sm">
              <div className="bg-red-600 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                 <div className="p-6 text-white">
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">I do not wish to speak with you</h2>
                    <p className="text-sm font-bold opacity-90 mb-4">No deseo hablar con usted.</p>
                    
                    <div className="space-y-4 text-xs font-medium leading-relaxed opacity-95">
                       <p>I choose to exercise my right to remain silent under the 5th Amendment.</p>
                       <p>I refuse to sign any documents I do not understand.</p>
                       <p>I do not give you permission to search my belongings or me under the 4th Amendment.</p>
                       <p>I choose to speak with my attorney.</p>
                    </div>

                    <hr className="border-red-500 my-6" />

                    <h3 className="font-bold mb-2">Mis Derechos (Español):</h3>
                    <ul className="list-disc pl-4 text-xs space-y-2 opacity-90">
                       <li>Elijo ejercer mi derecho constitucional a guardar silencio (5ta Enmienda).</li>
                       <li>Me niego a firmar documentos que no entiendo.</li>
                       <li>No doy permiso de revisar mis pertenencias ni mi persona (4ta Enmienda).</li>
                       <li>Deseo contactar a mi abogado inmediatamente.</li>
                    </ul>
                 </div>
                 <div className="bg-red-950 p-4 flex gap-3">
                    <button onClick={() => setIsRedCardOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-bold">Cerrar</button>
                    <button className="flex-1 bg-white hover:bg-slate-100 text-red-700 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2"><Download size={14}/> Guardar</button>
                 </div>
              </div>
           </div>
        )}
      </div>

    </div>
  );
}
