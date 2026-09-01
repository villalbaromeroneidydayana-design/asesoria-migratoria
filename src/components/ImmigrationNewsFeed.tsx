import { Clock, ShieldCheck, ChevronRight, FileText } from 'lucide-react';
import { newsArticles } from '../config/newsData';

export default function ImmigrationNewsFeed() {
  const getCategoryColor = (cat: string) => {
    switch(cat) {
       case 'Alerta Federal': return 'bg-red-950 text-red-400 border-red-900';
       case 'USCIS': return 'bg-sky-950 text-sky-400 border-sky-900';
       case 'Defensa en Corte': return 'bg-amber-950 text-amber-400 border-amber-900';
       case 'Alivio Humanitario': return 'bg-purple-950 text-purple-400 border-purple-900';
       default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-10">
         <h2 className="text-3xl font-serif font-bold text-white mb-4">Centro de Noticias y Alertas Legales</h2>
         <p className="text-slate-400">Mantente informado sobre los últimos cambios en leyes migratorias y políticas de USCIS/EOIR.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {newsArticles.map(news => (
            <div key={news.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-gold-500/50 transition flex flex-col h-full shadow-lg">
               <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getCategoryColor(news.category)}`}>
                     {news.category}
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                     <Clock size={12} /> {news.date}
                  </span>
               </div>
               
               <h3 className="text-xl font-bold text-white mb-3">{news.title}</h3>
               <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">{news.summary}</p>
               
               <div className="mt-auto">
                  <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg p-3 mb-4 flex items-center gap-2">
                     <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                     <span className="text-emerald-400/90 text-xs font-medium">{news.verifiedBy}</span>
                  </div>
                  
                  <button className="w-full text-center bg-slate-800 hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 group">
                     <FileText size={16} /> Leer análisis completo <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
