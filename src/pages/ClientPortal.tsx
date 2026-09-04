import { useState } from 'react';
import { Search, CheckCircle, Clock, MapPin, Building, ChevronRight } from 'lucide-react';
import { firmData } from '../config/firmData';

export default function ClientPortal() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // In a real app, we would fetch from supabase based on the phone number
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(phoneNumber.length > 5) {
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-navy-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-landmark text-2xl"></i>
          <h1 className="font-serif font-black text-xl tracking-tight leading-none">Portal del Cliente</h1>
        </div>
        <p className="font-bold text-emerald-400">{firmData.phone}</p>
      </header>

      <main className="max-w-3xl mx-auto p-6 mt-8">
        {!hasSearched ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Rastrea tu Reembolso de Fianza</h2>
            <p className="text-slate-500 mb-8">Ingresa el número de teléfono con el que abriste tu caso para ver el estatus actual de tu trámite con el Departamento del Tesoro.</p>
            
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative mb-4">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Search size={20} />
                </span>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Número de Teléfono..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-navy-500 font-bold"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-900/20">
                Ver Estatus de mi Caso
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-navy-900 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Estatus del Caso</h2>
              <p className="text-emerald-400 font-bold">Teléfono asociado: {phoneNumber}</p>
            </div>
            
            <div className="p-8">
              <div className="relative border-l-4 border-slate-200 ml-4 space-y-10 py-2">
                
                <div className="relative">
                  <div className="absolute -left-[29px] bg-emerald-500 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div className="ml-8">
                    <h3 className="font-bold text-lg text-navy-900">Evaluación y Diagnóstico Inicial</h3>
                    <p className="text-slate-500 text-sm">Comprobamos que tu fianza cuenta con la orden de cancelación oficial para ser procesada.</p>
                    <span className="inline-block mt-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Completado</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[29px] bg-emerald-500 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow">
                    <CheckCircle size={20} className="text-white" />
                  </div>
                  <div className="ml-8">
                    <h3 className="font-bold text-lg text-navy-900">Preparación de Documentos (I-395)</h3>
                    <p className="text-slate-500 text-sm">Elaboración del paquete legal notariado para solicitar el desembolso a tu nombre.</p>
                    <span className="inline-block mt-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Completado</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[29px] bg-amber-500 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow animate-pulse">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div className="ml-8">
                    <h3 className="font-bold text-lg text-navy-900">Procesamiento en ICE Debt Management</h3>
                    <p className="text-slate-500 text-sm">Tu paquete fue enviado al centro en Williston, VT. Estamos en espera de la aprobación federal.</p>
                    <span className="inline-block mt-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">En Proceso Actual</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[29px] bg-slate-200 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center">
                    <Building size={20} className="text-slate-400" />
                  </div>
                  <div className="ml-8">
                    <h3 className="font-bold text-lg text-slate-400">Desembolso del Tesoro (ACH)</h3>
                    <p className="text-slate-400 text-sm">El Departamento del Tesoro deposita el capital y los intereses directamente en tu cuenta bancaria.</p>
                    <span className="inline-block mt-2 text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Pendiente</span>
                  </div>
                </div>

              </div>

              <div className="mt-10 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <MapPin size={24} className="text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">¿Dudas sobre tu caso?</h4>
                  <p className="text-blue-800 text-xs mt-1">El proceso federal toma varias semanas. Si tienes información adicional que enviarnos, haz clic abajo para contactarnos.</p>
                  <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:text-blue-900 mt-2">
                    Contactar al Despacho <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
