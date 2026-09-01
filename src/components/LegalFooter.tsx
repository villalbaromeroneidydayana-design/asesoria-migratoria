import { useState } from 'react';
import { MapPin, PhoneCall, Shield, Scale, Lock, X } from 'lucide-react';
import { firmData } from '../config/firmData';

export default function LegalFooter() {
  const [modalContent, setModalContent] = useState<string | null>(null);

  return (
    <footer className="bg-navy-950 border-t border-slate-800/50 pt-10 pb-6 px-4 sm:px-6 lg:px-8 text-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-8 border-b border-slate-800/50 pb-8">
           <div className="flex items-start gap-4">
              <h4 className="font-bold text-gold-500 mb-4">{firmData.corporateLabel}</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                 <li className="flex items-start gap-3">
                    <MapPin className="text-gold-500 shrink-0 mt-0.5" size={18} />
                    <span className="leading-relaxed">
                       {firmData.officeAddress}
                       <br />
                       <span className="text-xs text-slate-500 mt-2 block italic">
                          {firmData.remoteOnlyNotice}
                       </span>
                    </span>
                 </li>
              </ul>
           </div>
           <div className="flex items-start gap-4">
              <span className="bg-gold-500/10 p-2.5 rounded-full text-gold-500 shrink-0 border border-gold-500/20"><PhoneCall size={22} /></span>
              <div>
                 <h4 className="text-white font-bold mb-1 text-base">Teléfono local US</h4>
                 <a href={`tel:${firmData.phone}`} className="text-gold-500 hover:text-gold-400 font-medium text-base underline decoration-gold-500/30 underline-offset-4">{firmData.phone}</a>
                 <div className="mt-1 text-slate-400">
                    <a href={`https://${firmData.website}`} className="underline decoration-slate-600 underline-offset-4 hover:text-white transition">{firmData.website}</a>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="max-w-3xl text-slate-500 text-xs leading-relaxed">
              <p className="mb-2"><strong>Aviso Legal:</strong> La información contenida en este sitio web tiene fines meramente informativos y no constituye asesoramiento legal formal. {firmData.federalJurisdictionNotice}</p>
              <p>El uso de este sitio o del Portal del Cliente no crea una relación abogado-cliente hasta que se firme un contrato formal de representación (Retainer Agreement) y se ingrese el {firmData.g28Notice}</p>
              <div className="flex gap-4 mt-3 text-gold-600/70">
                 <button onClick={() => setModalContent('terms')} className="hover:text-gold-500 transition cursor-pointer">Términos de Servicio</button>
                 <button onClick={() => setModalContent('privacy')} className="hover:text-gold-500 transition cursor-pointer">Política de Privacidad</button>
                 <button onClick={() => setModalContent('disclaimer')} className="hover:text-gold-500 transition cursor-pointer">Aviso de Práctica Federal</button>
              </div>
           </div>
           
           <div className="flex gap-3 shrink-0">
              <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-700 rounded-lg p-2 w-16 h-16 shadow-inner">
                 <Scale size={24} className="text-blue-500 mb-1" />
                 <span className="text-[9px] text-center font-bold text-slate-300 leading-tight">AILA<br/>MEMBER</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-900 border border-gold-900/50 rounded-lg p-2 w-16 h-16 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-gold-500/5"></div>
                 <Shield size={24} className="text-gold-600 mb-1" />
                 <span className="text-[9px] text-center font-bold text-gold-500 leading-tight">EOIR<br/>REGISTERED</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-900 border border-emerald-900/50 rounded-lg p-2 w-16 h-16 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 bg-emerald-500/5"></div>
                 <Lock size={24} className="text-emerald-500 mb-1" />
                 <span className="text-[9px] text-center font-bold text-emerald-400 leading-tight">SSL<br/>SECURE</span>
              </div>
           </div>
        </div>
      </div>

      {/* Legal Modal */}
      {modalContent && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[40px] pointer-events-none"></div>
               <div className="flex justify-between items-center p-6 border-b border-slate-800">
                  <h3 className="text-xl font-bold text-white capitalize">
                     {modalContent === 'terms' ? 'Términos de Servicio' : modalContent === 'privacy' ? 'Política de Privacidad' : 'Aviso Legal Federal'}
                  </h3>
                  <button onClick={() => setModalContent(null)} className="text-slate-400 hover:text-white transition bg-slate-800 p-2 rounded-full">
                     <X size={20} />
                  </button>
               </div>
               <div className="p-6 overflow-y-auto text-slate-300 text-sm leading-relaxed space-y-4">
                  {modalContent === 'terms' && (
                     <>
                        <p><strong>1. Relación Abogado-Cliente:</strong> El uso de esta plataforma no establece una relación formal. Debe firmarse un contrato de honorarios.</p>
                        <p><strong>2. Tarifas:</strong> Las tarifas de USCIS mencionadas son referenciales y sujetas a cambios gubernamentales.</p>
                        <p><strong>3. Responsabilidad:</strong> El bufete no garantiza resultados específicos en tribunales o agencias de inmigración.</p>
                     </>
                  )}
                  {modalContent === 'privacy' && (
                     <>
                        <p><strong>1. Recolección de Datos:</strong> Solo recopilamos los datos estrictamente necesarios para sus formularios (A-Number, Nombre, Entrada).</p>
                        <p><strong>2. Protección ICE:</strong> Nunca compartimos ni vendemos datos a agencias policiales locales ni a ICE (Inmigration and Customs Enforcement).</p>
                        <p><strong>3. Cifrado:</strong> Esta plataforma utiliza cifrado de extremo a extremo y almacenamiento local seguro.</p>
                     </>
                  )}
                  {modalContent === 'disclaimer' && (
                     <>
                        <p><strong>Autorización Federal:</strong> Como abogado autorizado por EOIR, el {firmData.lawyerName} ({firmData.barAssociation} {firmData.barNumber}) tiene el derecho federal de practicar la ley de inmigración de EE. UU. en los 50 estados.</p>
                     </>
                  )}
               </div>
               <div className="p-4 border-t border-slate-800 flex justify-end">
                  <button onClick={() => setModalContent(null)} className="bg-gold-500 text-navy-950 font-bold px-6 py-2 rounded-lg hover:bg-gold-400 transition">Aceptar y Cerrar</button>
               </div>
            </div>
         </div>
      )}
    </footer>
  );
}
