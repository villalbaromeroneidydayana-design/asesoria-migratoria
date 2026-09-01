import { useState } from 'react';
import { mapData } from '../config/mapData';
import type { StateImmigrationData } from '../config/mapData';
import { AlertTriangle, Clock, MapPin, Share2, Scale } from 'lucide-react';

export default function ImmigrationActivityMap() {
  const [selectedState, setSelectedState] = useState<StateImmigrationData | null>(null);
  const [layer, setLayer] = useState<'cooperation' | 'backlog' | 'border'>('cooperation');

  const getColorByCooperation = (level: string) => {
    switch(level) {
       case 'High': return 'bg-red-500/20 border-red-500 text-red-500';
       case 'Moderate': return 'bg-amber-500/20 border-amber-500 text-amber-500';
       case 'Sanctuary': return 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
       default: return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  const generateWhatsAppShare = (data: StateImmigrationData) => {
     const msg = `🚨 *REPORTE MIGRATORIO: ${data.name.toUpperCase()}*\n\n` +
                 `⚖️ *Leyes Locales:* ${data.localLaws}\n\n` +
                 `⏳ *Corte local:* ${data.eoirCourtName}\n` +
                 `📅 *Tiempo de espera aprox:* ${data.courtWaitTimeDays} días\n` +
                 `📈 *Tasa de aprobación (ref):* ${data.asylumApprovalRate}\n\n` +
                 `👉 Verifica tus derechos y opciones aquí: https://bufetelegal.com/client`;
     return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
       {/* Left: Map / Grid visualization */}
       <div className="w-full md:w-3/5 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-800 relative bg-slate-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-navy-500/5 rounded-full blur-[60px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Monitor Nacional (EOIR & ICE)</h2>
          <p className="text-slate-400 text-sm mb-6">Selecciona una jurisdicción para ver alertas locales y estado de las cortes.</p>
          
          {/* Layer Controls */}
          <div className="flex gap-2 mb-8 bg-slate-900 p-2 rounded-xl inline-flex flex-wrap">
             <button onClick={()=>setLayer('cooperation')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${layer==='cooperation'?'bg-slate-700 text-white':'text-slate-500 hover:text-slate-300'}`}>Cooperación ICE (SB4)</button>
             <button onClick={()=>setLayer('backlog')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${layer==='backlog'?'bg-amber-900/40 text-amber-500':'text-slate-500 hover:text-slate-300'}`}>Saturación Cortes</button>
             <button onClick={()=>setLayer('border')} className={`px-4 py-2 rounded-lg text-sm font-bold transition ${layer==='border'?'bg-blue-900/40 text-blue-400':'text-slate-500 hover:text-slate-300'}`}>Zona 100 Millas</button>
          </div>

          {/* Grid of States (Emulating a Map) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
             {mapData.map(state => {
                const isSelected = selectedState?.id === state.id;
                let bgStyle = "bg-slate-900 border-slate-800";
                
                if (layer === 'cooperation') {
                   bgStyle = getColorByCooperation(state.cooperationLevel);
                } else if (layer === 'backlog' && state.courtSaturated) {
                   bgStyle = "bg-amber-500/20 border-amber-500 text-amber-500";
                } else if (layer === 'border' && state.borderZone100Miles) {
                   bgStyle = "bg-blue-500/20 border-blue-500 text-blue-400";
                }

                return (
                   <button 
                      key={state.id}
                      onClick={() => setSelectedState(state)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden group ${isSelected ? 'ring-2 ring-white scale-105 shadow-xl z-10' : 'hover:border-slate-500'} ${bgStyle}`}
                   >
                      <h3 className="font-bold text-lg">{state.name}</h3>
                      <div className="text-xs mt-2 opacity-80 flex flex-col gap-1">
                         {layer === 'cooperation' && <span className="uppercase tracking-wider font-bold">{state.cooperationLevel === 'Sanctuary' ? 'Santuario' : 'Alerta'}</span>}
                         {layer === 'backlog' && <span>Espera: ~{state.courtWaitTimeDays} d</span>}
                         {layer === 'border' && <span>{state.borderZone100Miles ? 'Frontera/Costa' : 'Interior'}</span>}
                      </div>
                   </button>
                )
             })}
          </div>
       </div>

       {/* Right: Info Panel */}
       <div className="w-full md:w-2/5 p-6 md:p-8 bg-slate-900 flex flex-col">
          {selectedState ? (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                   <h2 className="text-3xl font-bold text-white">{selectedState.name}</h2>
                   <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700">{selectedState.id}</span>
                </div>

                <div className="space-y-6 flex-1">
                   <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle size={14} className={selectedState.cooperationLevel === 'High' ? 'text-red-500' : 'text-emerald-500'}/> Leyes Locales e ICE</h4>
                      <p className="text-slate-200 text-sm leading-relaxed">{selectedState.localLaws}</p>
                   </div>
                   
                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                      <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Scale size={14}/> Estatus Corte EOIR</h4>
                      <p className="text-white font-bold mb-1">{selectedState.eoirCourtName}</p>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                         <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-xs block mb-1">Espera Promedio</span>
                            <span className="text-amber-400 font-bold flex items-center gap-1.5"><Clock size={14}/> ~{selectedState.courtWaitTimeDays} días</span>
                         </div>
                         <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-slate-500 text-xs block mb-1">Tasa Aprobación</span>
                            <span className="text-white font-bold">{selectedState.asylumApprovalRate}</span>
                         </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                         <a href="https://acis.eoir.justice.gov" target="_blank" rel="noreferrer" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded text-center border border-slate-700 transition">Verificar en ACIS</a>
                         <a href="tel:18008987180" className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded text-center border border-slate-700 transition">Llamar 1-800-898-7180</a>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                   <button className="w-full bg-slate-800 hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 mb-3">
                      <Clock size={18} /> Calcular reloj asilo (180 días)
                   </button>
                   <a href={generateWhatsAppShare(selectedState)} target="_blank" rel="noreferrer" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20">
                      <Share2 size={18} /> Compartir reporte en WhatsApp
                   </a>
                </div>
             </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
                <MapPin size={48} className="text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-300 mb-2">Selecciona un Estado</h3>
                <p className="text-sm text-slate-500">Toca uno de los recuadros en el monitor para cargar la información jurisdiccional detallada.</p>
             </div>
          )}
       </div>
    </div>
  );
}
