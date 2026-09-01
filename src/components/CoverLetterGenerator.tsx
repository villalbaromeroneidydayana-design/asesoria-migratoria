import { useState } from 'react';
import { FileText, Copy, Check, Printer } from 'lucide-react';
import { firmData } from '../config/firmData';

interface Props {
  clientName?: string;
  aNumber?: string;
  formTypes?: string[];
}

export default function CoverLetterGenerator({ clientName = "[Client Name]", aNumber = "[A-Number]", formTypes = [] }: Props) {
  const [copied, setCopied] = useState(false);

  const formsString = formTypes.length > 0 ? formTypes.join(', ') : 'I-589 / I-765';

  const letterContent = `${firmData.officeAddress}
${firmData.phone} | ${firmData.website}

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

U.S. Department of Homeland Security
USCIS

RE: Application for ${formsString}
Applicant: ${clientName}
A-Number: ${aNumber}

Dear Sir/Madam:

Please find enclosed the application package for the above-referenced client. 
My G-28, Notice of Entry of Appearance as Attorney, is attached.

Enclosed are the following documents:
- Exhibit A: Form G-28
- Exhibit B: Form ${formTypes[0] || 'I-589'} and evidence
- Exhibit C: Form G-1450 (Filing Fee, if applicable)
- Exhibit D: Biographical Passport & Identity Documents

Thank you for your prompt attention to this matter.

Respectfully submitted,

_______________________
${firmData.lawyerName}
${firmData.barAssociation} No. ${firmData.barNumber}
${firmData.eoirRegisteredId}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 mt-6 shadow-inner relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-slate-300 font-bold flex items-center gap-2 uppercase text-xs tracking-widest"><FileText size={16} /> Cover Letter (Borrador)</h3>
         <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition">
               <Printer size={14} /> Imprimir / Guardar PDF
            </button>
            <button onClick={handleCopy} className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition shadow-lg shadow-gold-500/20">
               {copied ? <Check size={14} className="text-navy-950" /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar Texto'}
            </button>
         </div>
      </div>
      <pre className="bg-slate-900/80 p-4 rounded-lg text-xs text-slate-400 font-serif whitespace-pre-wrap overflow-y-auto max-h-48 border border-slate-800">
         {letterContent}
      </pre>
    </div>
  );
}
