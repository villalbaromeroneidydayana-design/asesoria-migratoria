import { useState } from 'react';
import { ChevronDown, ChevronUp, Scale, ShieldAlert, FileCheck, DollarSign } from 'lucide-react';

export default function LegalFAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: <ShieldAlert size={20} className="text-emerald-500" />,
      question: "¿Protección y privacidad total frente a ICE?",
      answer: "Absolutamente. Como firma de abogados licenciada, toda la información que compartes está protegida bajo el Secreto Profesional (Attorney-Client Privilege). Por ley federal, no compartimos tus datos con ICE, CBP ni agencias de deportación. Radicar tu caso con un abogado es el paso más seguro para protegerte."
    },
    {
      icon: <Scale size={20} className="text-amber-500" />,
      question: "¿Qué opciones tengo si superé el plazo de 1 año para solicitar asilo (1-year deadline)?",
      answer: "Si llevas más de un año en EE. UU., aún existen excepciones. Factores como cambios en las circunstancias de tu país de origen, o circunstancias extraordinarias (como trauma severo, enfermedad grave, o incapacidad legal) pueden excusar la demora. Nuestro equipo evaluará tu caso para aplicar a estas excepciones o buscar otras vías de alivio como la Suspensión de Remoción o protección bajo CAT."
    },
    {
      icon: <FileCheck size={20} className="text-sky-500" />,
      question: "¿Cuáles son los requisitos para tramitar Licencia de Conducir y Seguro Social (SSN)?",
      answer: "Para el SSN, necesitas tener un Permiso de Trabajo (EAD) aprobado. Para la Licencia de Conducir, los requisitos varían por estado, pero generalmente requieren tu Pasaporte, comprobante de domicilio, tu SSN (o carta de inelegibilidad) y prueba de que tienes un trámite migratorio pendiente o aprobado (como la Notificación I-797C)."
    },
    {
      icon: <DollarSign size={20} className="text-emerald-500" />,
      question: "¿Cómo se pagan las tasas oficiales de USCIS?",
      answer: "Nuestra firma opera con total transparencia. Los honorarios legales se pagan a la firma, pero las tasas de presentación (Filing Fees) de USCIS siempre se pagan directamente al gobierno mediante un 'Money Order' o cheque de caja emitido EXACTAMENTE a nombre del 'U.S. Department of Homeland Security'. Jamás te pediremos que nos pagues las tasas de USCIS a nosotros directamente."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
       <div className="text-center mb-10">
         <h2 className="text-3xl font-serif font-bold text-white mb-4">Preguntas Frecuentes Legales</h2>
         <p className="text-slate-400">Respuestas claras y fundamentadas a las dudas más comunes de nuestros clientes.</p>
      </div>

      {faqs.map((faq, idx) => {
         const isOpen = openIndex === idx;
         return (
            <div key={idx} className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-gold-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
               <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
               >
                  <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg ${isOpen ? 'bg-slate-800' : 'bg-slate-950'}`}>
                        {faq.icon}
                     </div>
                     <span className={`font-bold text-lg ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                        {faq.question}
                     </span>
                  </div>
                  {isOpen ? <ChevronUp size={20} className="text-gold-500 shrink-0" /> : <ChevronDown size={20} className="text-slate-500 shrink-0" />}
               </button>
               
               {isOpen && (
                  <div className="px-6 pb-6 pt-2">
                     <div className="pl-14 text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-800/50 pt-4">
                        {faq.answer}
                     </div>
                  </div>
               )}
            </div>
         );
      })}
    </div>
  );
}
