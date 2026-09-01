import { useState } from 'react';
import { AlertCircle, Shield, Check } from 'lucide-react';
import { firmData } from '../config/firmData';

interface LegalDisclaimerModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function LegalDisclaimerModal({ onAccept, onDecline }: LegalDisclaimerModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-500"></div>
        <div className="flex items-center gap-3 mb-6 text-navy-900">
          <Shield className="text-gold-500" size={32} />
          <h2 className="text-2xl font-serif font-bold">Aviso de Confidencialidad Legal</h2>
        </div>
        
        <div className="space-y-4 text-sm text-slate-600 mb-8 max-h-64 overflow-y-auto pr-2">
          <p>
            Al proceder a ingresar sus datos biográficos en este portal, usted acepta los siguientes términos bajo el principio de <strong>Privilegio Abogado-Cliente (Attorney-Client Privilege)</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Toda la información proporcionada será tratada con estricta confidencialidad.</li>
            <li>El envío de este formulario inicial no constituye la firma de un contrato de representación formal (Retainer Agreement) ni la radicación del {firmData.g28Notice}.</li>
            <li>Usted autoriza a la oficina de <strong>{firmData.lawyerName}</strong> a procesar estos datos con el fin exclusivo de generar borradores de formularios oficiales de USCIS/EOIR y proveerle instrucciones de radicación.</li>
            <li>Sus datos están protegidos mediante cifrado SSL de extremo a extremo.</li>
          </ul>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3 mt-4">
             <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
             <p className="text-blue-800">Al hacer clic en "Aceptar", usted consiente el tratamiento de sus datos conforme a nuestra <a href={firmData.privacyUrl} className="underline font-bold">Política de Privacidad</a>.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <input 
             type="checkbox" 
             id="consent" 
             checked={agreed} 
             onChange={(e) => setAgreed(e.target.checked)}
             className="w-5 h-5 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
          />
          <label htmlFor="consent" className="text-slate-700 font-medium cursor-pointer">
            He leído y acepto los términos de confidencialidad legal.
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button 
             onClick={onDecline}
             className="px-6 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
          >
            Cancelar
          </button>
          <button 
             onClick={onAccept}
             disabled={!agreed}
             className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition ${agreed ? 'bg-navy-900 text-white hover:bg-navy-800 shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Aceptar y Continuar <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
