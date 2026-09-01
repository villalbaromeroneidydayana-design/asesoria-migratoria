import { useState } from 'react';
import { Map, MapPin, Building2, ExternalLink } from 'lucide-react';

export default function OfficialLocationsMap() {
  const [selectedState, setSelectedState] = useState('TX');

  const locationsData = {
    TX: {
      stateName: 'Texas',
      eoir: 'Dallas Immigration Court (EOIR) - 1100 Commerce Street, Room 1060, Dallas, TX 75242',
      asc: 'USCIS Application Support Center (ASC) - Según notificación I-797C en Texas.'
    },
    FL: {
      stateName: 'Florida',
      eoir: 'Miami Immigration Court (EOIR) - 333 South Miami Ave, Suite 700, Miami, FL 33130',
      asc: 'USCIS Application Support Center (ASC) - Según notificación I-797C en Florida.'
    },
    CA: {
      stateName: 'California',
      eoir: 'Los Angeles Immigration Court (EOIR) - 300 North Los Angeles Street, Room 8547, Los Angeles, CA 90012',
      asc: 'USCIS Application Support Center (ASC) - Según notificación I-797C en California.'
    },
    NY: {
      stateName: 'New York',
      eoir: 'New York - Broadway Immigration Court (EOIR) - 26 Federal Plaza, 12th Floor, Room 1237, New York, NY 10278',
      asc: 'USCIS Application Support Center (ASC) - Según notificación I-797C en New York.'
    }
  };

  type StateKey = keyof typeof locationsData;
  const currentLoc = locationsData[selectedState as StateKey] || locationsData.TX;

  const handleDirections = () => {
    const query = encodeURIComponent(`EOIR Immigration Court ${currentLoc.stateName}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-3">
          <Map className="text-blue-600" /> Mapa de Sedes Oficiales
        </h2>
        <select 
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)}
          className="border border-slate-200 rounded-lg bg-slate-50 text-navy-900 px-4 py-2 font-semibold focus:ring-blue-600 focus:border-blue-600 outline-none"
        >
          <option value="TX">Texas (TX)</option>
          <option value="FL">Florida (FL)</option>
          <option value="CA">California (CA)</option>
          <option value="NY">New York (NY)</option>
        </select>
      </div>

      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        Usa este directorio para ubicar tu <strong>Corte de Inmigración (EOIR)</strong> principal y conocer las instrucciones sobre el Centro de Biométricos (ASC) para tu estado.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* EOIR Court */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 hover:shadow-md transition group">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600/10 p-2 rounded-lg shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
              <Building2 className="text-blue-600 group-hover:text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1 text-sm uppercase tracking-wider">Corte EOIR ({currentLoc.stateName})</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{currentLoc.eoir}</p>
              
              <button 
                onClick={handleDirections}
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
              >
                📍 Cómo llegar a mi Corte EOIR en Google Maps <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ASC Biometrics */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 hover:shadow-md transition group">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-600/10 p-2 rounded-lg shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
              <MapPin className="text-emerald-600 group-hover:text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 mb-1 text-sm uppercase tracking-wider">Centro de Biométricos ASC</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{currentLoc.asc}</p>
              <p className="text-xs text-emerald-700 bg-emerald-100/50 px-2 py-1 rounded inline-block font-medium">
                Cita asignada automáticamente por USCIS
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
