import { CheckCircle2, Lock } from 'lucide-react';
import type { ImmigrationService } from '../config/servicesData';

export default function PaymentMilestones({ services }: { services: ImmigrationService[] }) {
  const totalUscis = services.reduce((sum, s) => sum + s.uscisFee, 0);

  const milestones = [
    { title: "Apertura de Expediente", desc: "Revisión inicial y estrategia.", amount: "$500", status: "completed" },
    { title: "Preparación de Paquetes", desc: "Formularios, traducciones y affidavit.", amount: "$1,500", status: "current" },
    { title: "Radicación y Tasas USCIS", desc: `Envío oficial a USCIS/EOIR. (Tasas: $${totalUscis})`, amount: `$${1000 + totalUscis}`, status: "pending" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Plan de Pagos de Honorarios</h2>
      
      <div className="relative">
         <div className="absolute left-[22px] top-8 bottom-8 w-1 bg-slate-100 z-0"></div>
         
         <div className="space-y-6 relative z-10">
            {milestones.map((m, i) => (
               <div key={i} className="flex gap-6 items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm transition ${m.status === 'completed' ? 'bg-emerald-500 text-white' : m.status === 'current' ? 'bg-gold-500 text-white shadow-gold-500/30' : 'bg-slate-200 text-slate-400'}`}>
                     {m.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="font-bold">{i+1}</span>}
                  </div>
                  <div className={`flex-1 p-4 rounded-xl flex justify-between items-center transition ${m.status === 'current' ? 'bg-white border-2 border-gold-200 shadow-md' : 'bg-slate-50 border border-slate-100'}`}>
                     <div>
                        <h3 className={`font-bold ${m.status === 'pending' ? 'text-slate-500' : 'text-navy-900'}`}>{m.title}</h3>
                        <p className="text-sm text-slate-500">{m.desc}</p>
                     </div>
                     <div className="text-right">
                        <div className={`font-bold text-lg ${m.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{m.amount}</div>
                        {m.status === 'current' && (
                           <button className="mt-2 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1 transition shadow-lg">
                              <Lock size={12} /> Pago Seguro
                           </button>
                        )}
                        {m.status === 'completed' && (
                           <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded inline-block mt-1">Pagado</span>
                        )}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
