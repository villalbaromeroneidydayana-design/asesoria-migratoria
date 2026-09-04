import { useState, useEffect } from 'react';
import { Users, FileText, Search, MessageCircle, DollarSign, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CrmDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('PIN Incorrecto');
    }
  };

  // Load leads
  useEffect(() => {
     if (!isAuthenticated) return;
     
     const fetchLeads = async () => {
        if (supabase) {
           try {
             // Traer de fianzas_leads
             const { data, error } = await supabase.from('fianzas_leads').select('*').order('timestamp', { ascending: false });
             if (data && !error) {
                 setLeads(data);
                 if (data.length > 0) setSelectedLead(data[0]);
             }
           } catch (e) { console.error("Supabase fetch error:", e); }
        }
     };
     fetchLeads();
  }, [isAuthenticated]);

  const saveNotes = async () => {
    if (!selectedLead || !supabase) return;
    setIsSavingNote(true);
    try {
      const updatedNotes = selectedLead.notas ? selectedLead.notas + '\n\n' + leadNotes : leadNotes;
      const { error } = await supabase
        .from('fianzas_leads')
        .update({ notas: updatedNotes })
        .eq('id', selectedLead.id);
        
      if (!error) {
        alert("Nota guardada");
        const newLeads = leads.map(l => l.id === selectedLead.id ? { ...l, notas: updatedNotes } : l);
        setLeads(newLeads);
        setSelectedLead({ ...selectedLead, notas: updatedNotes });
        setLeadNotes('');
      } else {
        alert("Error guardando");
      }
    } catch (e) {
      console.error(e);
    }
    setIsSavingNote(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-sm w-full text-center">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">CRM Fianzas</h2>
          <p className="text-slate-400 mb-6 text-sm">Panel exclusivo para administradores</p>
          <input 
            type="password" 
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="PIN de Acceso"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-center text-xl text-white tracking-[0.5em] mb-4 focus:border-emerald-500 transition outline-none"
            maxLength={4}
          />
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-emerald-900/20">
            Acceder al Sistema
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4">
      <header className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
            <Users size={24} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Gestión de Leads (Fianzas)</h1>
            <p className="text-xs text-slate-500">Backoffice Administrativo</p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
        {/* LEADS LIST */}
        <div className="lg:w-1/3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="font-bold text-white flex items-center gap-2">
              <FileText size={18} /> Leads Recientes
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {leads.length === 0 ? (
              <p className="p-4 text-slate-500 text-center">No hay leads registrados aún.</p>
            ) : (
              leads.map(lead => (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 border-b border-slate-800/50 cursor-pointer transition ${selectedLead?.id === lead.id ? 'bg-slate-800 border-l-4 border-l-emerald-500' : 'hover:bg-slate-800/50'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-emerald-400">{lead.nombre || 'Sin Nombre'}</span>
                    <span className="text-xs text-slate-500">{new Date(lead.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-slate-400 flex items-center gap-1">
                    Monto: ${lead.monto} | {lead.estado}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* LEAD DETAILS */}
        <div className="lg:w-2/3 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-y-auto">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedLead.nombre}</h2>
                  <p className="text-emerald-500 font-bold flex items-center gap-2">
                    <Search size={16} /> Fianza de ${selectedLead.monto} en {selectedLead.estado}
                  </p>
                </div>
                <a 
                  href={`https://wa.me/${selectedLead.telefono?.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                >
                  <MessageCircle size={18} /> Escribir
                </a>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-400 mb-2 uppercase text-xs tracking-wider">Datos de Contacto</h3>
                <p><strong>Teléfono:</strong> {selectedLead.telefono || 'No provisto'}</p>
                <p><strong>Referido por:</strong> {selectedLead.referido || 'Directo Web'}</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-slate-400 mb-3 uppercase text-xs tracking-wider">Hoja de Vida (Notas del Caso)</h3>
                <div className="bg-slate-900 border border-slate-700 p-3 rounded mb-4 whitespace-pre-wrap text-sm min-h-[100px]">
                  {selectedLead.notas || 'No hay notas registradas para este cliente.'}
                </div>
                
                <textarea 
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Agregar nueva nota, detalle de llamada, o avance del proceso..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none mb-3"
                  rows={3}
                ></textarea>
                <button 
                  onClick={saveNotes}
                  disabled={isSavingNote || !leadNotes.trim()}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                >
                  {isSavingNote ? 'Guardando...' : 'Guardar Nota'}
                </button>
              </div>
              
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                 <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                   <DollarSign size={18} className="text-emerald-400" /> Cobro de Honorarios
                 </h3>
                 <p className="text-sm text-slate-400 mb-4">Envía un enlace seguro para cobrar la gestión administrativa de este rescate.</p>
                 <a href={`https://wa.me/${selectedLead.telefono?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selectedLead.nombre}, para iniciar formalmente tu trámite de rescate de fianza, por favor realiza el pago de honorarios seguros en este enlace: https://buy.stripe.com/tu-enlace-de-pago`)}`} target="_blank" rel="noreferrer" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20">
                    Solicitar Pago por WhatsApp
                 </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Selecciona un lead de la izquierda para ver su hoja de vida.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
