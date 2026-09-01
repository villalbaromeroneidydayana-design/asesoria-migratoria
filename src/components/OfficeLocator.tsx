import { useState } from 'react';
import { MapPin, Phone, Building, Info } from 'lucide-react';

interface LocationData {
  state: string;
  eoir: {
    name: string;
    address: string;
  };
  uscis: {
    name: string;
    address: string;
  };
}

const locations: LocationData[] = [
  {
    state: "Florida",
    eoir: { name: "Miami Immigration Court", address: "333 South Miami Ave, Suite 700, Miami, FL 33130" },
    uscis: { name: "Miami Field Office", address: "8801 NW 7th Ave, Miami, FL 33150" }
  },
  {
    state: "Texas",
    eoir: { name: "Dallas Immigration Court", address: "1100 Commerce St, Room 1060, Dallas, TX 75242" },
    uscis: { name: "Dallas Field Office", address: "6500 Campus Cir Dr E, Irving, TX 75063" }
  },
  {
    state: "California",
    eoir: { name: "Los Angeles Immigration Court", address: "606 S Olive St, 15th Floor, Los Angeles, CA 90014" },
    uscis: { name: "Los Angeles Field Office", address: "300 N Los Angeles St, Room 1001, Los Angeles, CA 90012" }
  },
  {
    state: "New York",
    eoir: { name: "New York - Broadway Immigration Court", address: "26 Federal Plaza, 12th Floor, Room 1237, New York, NY 10278" },
    uscis: { name: "New York City Field Office", address: "26 Federal Plaza, 3rd Floor, New York, NY 10278" }
  }
];

export default function OfficeLocator() {
  const [selectedState, setSelectedState] = useState<string>("Florida");
  const data = locations.find(l => l.state === selectedState) || locations[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
               <Building size={24} className="text-gold-500" /> Buscador de Cortes y Oficinas USCIS
            </h3>
            <p className="text-slate-400 text-sm">Ubica tu sede jurisdiccional según tu estado de residencia.</p>
         </div>
         
         <div className="shrink-0 w-full md:w-64">
            <select 
               value={selectedState} 
               onChange={(e) => setSelectedState(e.target.value)}
               className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-4 py-3 focus:border-gold-500 font-bold"
            >
               {locations.map(l => (
                  <option key={l.state} value={l.state}>{l.state}</option>
               ))}
            </select>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* EOIR Court */}
         <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full"></div>
            <h4 className="font-bold text-amber-500 flex items-center gap-2 mb-4 uppercase text-xs tracking-wider">
               <MapPin size={14} /> Corte de Inmigración (EOIR)
            </h4>
            <p className="text-white font-bold text-lg mb-2">{data.eoir.name}</p>
            <p className="text-slate-400 text-sm mb-6">{data.eoir.address}</p>
            
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs">
               <p className="text-slate-300 font-bold mb-1 flex items-center gap-1.5"><Phone size={12} className="text-amber-500"/> Sistema Automatizado de Cortes:</p>
               <p className="text-slate-400">Llama al <a href="tel:18008987180" className="text-amber-400 hover:underline">1-800-898-7180</a> con tu A-Number para verificar tu fecha de audiencia.</p>
            </div>
         </div>

         {/* USCIS Office */}
         <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/10 rounded-bl-full"></div>
            <h4 className="font-bold text-sky-500 flex items-center gap-2 mb-4 uppercase text-xs tracking-wider">
               <MapPin size={14} /> Oficina de Campo (USCIS)
            </h4>
            <p className="text-white font-bold text-lg mb-2">{data.uscis.name}</p>
            <p className="text-slate-400 text-sm mb-6">{data.uscis.address}</p>
            
            <div className="bg-slate-900 rounded-lg p-3 border border-slate-800 text-xs">
               <p className="text-slate-300 font-bold mb-1 flex items-center gap-1.5"><Info size={12} className="text-sky-500"/> Centro de Contacto USCIS:</p>
               <p className="text-slate-400">Llama al <a href="tel:18003755283" className="text-sky-400 hover:underline">1-800-375-5283</a> para asistencia general.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
