import { Camera, DollarSign, CalendarHeart, Stethoscope, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { ImmigrationService } from '../config/servicesData';

export default function ClientActionTasks({ services }: { services: ImmigrationService[] }) {
  const [tasks, setTasks] = useState({
     photos: false,
     moneyOrder: false,
     biometrics: false,
     medical: false
  });

  const needsPhotos = services.some(s => s.tasks.needsPhotos);
  const needsMoneyOrder = services.some(s => s.tasks.needsMoneyOrder);
  const needsBiometrics = services.some(s => s.tasks.needsBiometrics);
  const needsMedical = services.some(s => s.tasks.needsMedical);

  if (!needsPhotos && !needsMoneyOrder && !needsBiometrics && !needsMedical) {
     return null; // Nothing to show
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-navy-900 mb-2">Tus Tareas Personales</h2>
      <p className="text-slate-600 mb-8">Debes completar estos trámites de forma presencial. Marca las casillas al completarlos para actualizar tu caso en el sistema.</p>

      <div className="space-y-6">
         {/* Tarea 1: Fotos */}
         {needsPhotos && (
            <div className={`border-2 rounded-xl p-5 flex gap-4 transition ${tasks.photos ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-navy-200'}`}>
               <div className={`p-3 rounded-lg shrink-0 h-fit ${tasks.photos ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                  <Camera size={24} />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-navy-900 mb-1">Fotos Estilo Pasaporte (2x2)</h3>
                  <p className="text-sm text-slate-600 mb-3">Tómate 2 fotos a color, fondo blanco, 2x2 pulgadas. Escribe tu Nombre y A-Number suavemente al reverso con lápiz.</p>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                     <input type="checkbox" checked={tasks.photos} onChange={(e) => setTasks({...tasks, photos: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                     <span className={`text-sm font-bold ${tasks.photos ? 'text-emerald-700' : 'text-slate-500'}`}>{tasks.photos ? 'Completado' : 'Marcar como completado'}</span>
                  </label>
               </div>
            </div>
         )}

         {/* Tarea 2: Money Order */}
         {needsMoneyOrder && (
            <div className={`border-2 rounded-xl p-5 flex gap-4 transition ${tasks.moneyOrder ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-navy-200'}`}>
               <div className={`p-3 rounded-lg shrink-0 h-fit ${tasks.moneyOrder ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                  <DollarSign size={24} />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-navy-900 mb-1">Pago Oficial (Money Order)</h3>
                  <p className="text-sm text-slate-600 mb-2">Obtén un Money Order por la(s) tasa(s) requerida(s) de USCIS pagadero a nombre de:</p>
                  <div className="bg-white p-3 rounded border border-slate-200 font-mono text-sm mb-3 shadow-inner inline-block">
                     <strong>U.S. Department of Homeland Security</strong>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                     <input type="checkbox" checked={tasks.moneyOrder} onChange={(e) => setTasks({...tasks, moneyOrder: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                     <span className={`text-sm font-bold ${tasks.moneyOrder ? 'text-emerald-700' : 'text-slate-500'}`}>{tasks.moneyOrder ? 'Completado y enviado al abogado' : 'Marcar como completado'}</span>
                  </label>
               </div>
            </div>
         )}

         {/* Tarea 3: Biometrics */}
         {needsBiometrics && (
            <div className={`border-2 rounded-xl p-5 flex gap-4 transition ${tasks.biometrics ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-navy-200'}`}>
               <div className={`p-3 rounded-lg shrink-0 h-fit ${tasks.biometrics ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                  <CalendarHeart size={24} />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-navy-900 mb-1">Cita de Biométricos (ASC)</h3>
                  <p className="text-sm text-slate-600 mb-3">USCIS te enviará una notificación (I-797C) con la fecha de tu cita. Debes llevar tu Pasaporte vigente y la notificación original.</p>
                  <label className="flex items-center gap-2 cursor-pointer w-fit">
                     <input type="checkbox" checked={tasks.biometrics} onChange={(e) => setTasks({...tasks, biometrics: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                     <span className={`text-sm font-bold ${tasks.biometrics ? 'text-emerald-700' : 'text-slate-500'}`}>{tasks.biometrics ? 'Asistí a la cita' : 'Marcar tras asistir'}</span>
                  </label>
               </div>
            </div>
         )}

         {/* Tarea 4: I-693 */}
         {needsMedical && (
            <div className={`border-2 rounded-xl p-5 flex gap-4 transition ${tasks.medical ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-slate-50 hover:border-navy-200'}`}>
               <div className={`p-3 rounded-lg shrink-0 h-fit ${tasks.medical ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                  <Stethoscope size={24} />
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-navy-900 mb-1">Examen Médico I-693 (Civil Surgeon)</h3>
                  <p className="text-sm text-slate-600 mb-3">Tu trámite requiere un examen médico sellado. Encuentra un médico autorizado por USCIS en tu área.</p>
                  <div className="flex gap-4 items-center">
                     <a href="https://my.uscis.gov/findadoctor" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm bg-navy-900 hover:bg-navy-800 text-white font-bold py-2 px-4 rounded-lg transition">
                        <ExternalLink size={16} /> Buscar "Civil Surgeon"
                     </a>
                     <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input type="checkbox" checked={tasks.medical} onChange={(e) => setTasks({...tasks, medical: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className={`text-sm font-bold ${tasks.medical ? 'text-emerald-700' : 'text-slate-500'}`}>{tasks.medical ? 'Completado' : 'Marcar tras asistir'}</span>
                     </label>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
