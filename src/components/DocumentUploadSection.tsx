import { UploadCloud, FileImage, ShieldCheck } from 'lucide-react';
import type { ImmigrationService } from '../config/servicesData';

export default function DocumentUploadSection({ services }: { services: ImmigrationService[] }) {
  const allDocs = Array.from(new Set(services.flatMap(s => s.requiredDocs)));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-navy-50 text-navy-600 p-2.5 rounded-lg"><UploadCloud size={24} /></div>
        <h2 className="text-2xl font-bold text-navy-900 leading-tight">Locker de Documentos Seguros</h2>
      </div>
      <p className="text-slate-600 mb-6">Sube de forma segura los documentos requeridos para tu caso. Tus archivos están protegidos bajo cifrado SSL de grado militar.</p>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Dropzone */}
         <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gold-500 hover:bg-gold-50/50 transition cursor-pointer group bg-slate-50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition">
               <UploadCloud size={32} className="text-gold-500" />
            </div>
            <h3 className="font-bold text-navy-900 mb-1">Arrastra tus archivos aquí</h3>
            <p className="text-xs text-slate-500 mb-4">PDF, JPG o PNG (Max. 10MB)</p>
            <button className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2 px-6 rounded-lg transition text-sm">
               Seleccionar Archivo
            </button>
         </div>

         {/* Required Docs List */}
         <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
            <h3 className="font-bold text-navy-900 mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500" /> Evidencias Requeridas</h3>
            {allDocs.length > 0 ? (
               <ul className="space-y-4">
                  {allDocs.map((doc, idx) => (
                     <li key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <FileImage size={18} className="text-slate-400" />
                           <span className="text-sm font-medium text-slate-700">{doc}</span>
                        </div>
                        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">Pendiente</span>
                     </li>
                  ))}
               </ul>
            ) : (
               <p className="text-sm text-slate-500">Seleccione un trámite para ver la lista de documentos obligatorios.</p>
            )}
         </div>
      </div>
    </div>
  );
}
