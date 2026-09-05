import { useState, useEffect } from 'react';
import { Users, FileText, Search, MessageCircle, DollarSign, Lock, Database, Download, Filter, Plus, X, FileOutput } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function CrmDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  const [activeView, setActiveView] = useState<'leads' | 'expedientes'>('leads');
  
  // Leads State
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Expedientes State
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // New Expediente Modal
  const [showNewExpModal, setShowNewExpModal] = useState(false);
  const [isSavingExp, setIsSavingExp] = useState(false);
  const [newExp, setNewExp] = useState({
    nombre_completo: '',
    telefono_whatsapp: '',
    estado_usa: '',
    a_number: '',
    numero_recibo: '',
    estatus_corte: 'Pendiente',
    fecha_audiencia: '',
    juez_asignado: '',
    hubo_fianza: false,
    monto_estimado: 0,
    nombre_fiador: '',
    estado_cobro_fianza: 'No aplica',
    estado_pago_auditoria: 'Pendiente',
    metodo_pago: ''
  });

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') { // Contraseña simple de demo
      setIsAuthenticated(true);
    } else {
      alert('PIN Incorrecto');
    }
  };

  // Load Data
  const fetchData = async () => {
    if (supabase) {
       try {
         const { data: leadsData } = await supabase.from('fianzas_leads').select('*').order('timestamp', { ascending: false });
         if (leadsData) {
             setLeads(leadsData);
             if (leadsData.length > 0) setSelectedLead(leadsData[0]);
         }

         const { data: expData, error: expError } = await supabase.from('expedientes_auditoria').select('*').order('created_at', { ascending: false });
         if (expData && !expError) {
             setExpedientes(expData);
         }
       } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
     if (!isAuthenticated) return;
     fetchData();
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
        fetchData();
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

  const handleSaveExpediente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setIsSavingExp(true);
    try {
      const folio = `AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const payload = { ...newExp, folio };
      
      const { error } = await supabase.from('expedientes_auditoria').insert([payload]);
      if (!error) {
        alert("Expediente Creado Exitosamente");
        setShowNewExpModal(false);
        fetchData();
        // Reset form
        setNewExp({
          nombre_completo: '', telefono_whatsapp: '', estado_usa: '', a_number: '', numero_recibo: '',
          estatus_corte: 'Pendiente', fecha_audiencia: '', juez_asignado: '', hubo_fianza: false,
          monto_estimado: 0, nombre_fiador: '', estado_cobro_fianza: 'No aplica', estado_pago_auditoria: 'Pendiente', metodo_pago: ''
        });
      } else {
        alert("Error al guardar: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
    setIsSavingExp(false);
  };

  // Filter Expedientes
  const filteredExpedientes = expedientes.filter(exp => {
    const matchesSearch = (exp.nombre_completo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (exp.telefono_whatsapp || '').includes(searchTerm) || 
                          (exp.a_number || '').includes(searchTerm);
    let matchesStatus = true;
    if (filterStatus === 'ready_bond') matchesStatus = exp.estado_cobro_fianza === 'Lista para reclamo';
    if (filterStatus === 'pending_hearing') matchesStatus = exp.estatus_corte === 'Pendiente';
    if (filterStatus === 'paid') matchesStatus = exp.estado_pago_auditoria === 'Pagado';
    return matchesSearch && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredExpedientes.length === 0) return;
    const headers = ["Folio", "Fecha", "Nombre", "Teléfono", "A-Number", "Estatus Corte", "Fianza Estimada", "Estado Cobro Fianza", "Estado Pago Auditoria"];
    const rows = filteredExpedientes.map(exp => [
      exp.folio, new Date(exp.created_at).toLocaleDateString(), exp.nombre_completo, exp.telefono_whatsapp, exp.a_number,
      exp.estatus_corte, exp.monto_estimado, exp.estado_cobro_fianza, exp.estado_pago_auditoria
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.map(cell => `"${cell || ''}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expedientes_auditoria_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl max-w-sm w-full text-center">
          <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Lock size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Panel Administrativo Seguro</h2>
          <p className="text-slate-400 mb-6 text-sm">Acceso exclusivo (PIN)</p>
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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 relative">
      <header className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center mb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Lock size={24} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Terminal Central</h1>
              <p className="text-xs text-slate-500">Acceso Seguro</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveView('leads')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeView === 'leads' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-500 hover:text-white'}`}
            >
              <Users size={16} /> Buzón Web (Leads)
            </button>
            <button 
              onClick={() => setActiveView('expedientes')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeView === 'expedientes' ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'text-slate-500 hover:text-white'}`}
            >
              <Database size={16} /> Base de Datos (Auditorías)
            </button>
          </div>
        </div>
      </header>

      {/* VIEW: LEADS */}
      {activeView === 'leads' && (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
          {/* LEADS LIST */}
          <div className="lg:w-1/3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h2 className="font-bold text-white flex items-center gap-2">
                <FileText size={18} /> Consultas de Landing Page
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
                      Motivo: {lead.tipo_servicio || 'Fianza'}
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
                      <Search size={16} /> Interesado en: {selectedLead.tipo_servicio || 'Fianza'}
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
                  <p><strong>Estado:</strong> {selectedLead.estado || 'No provisto'}</p>
                  <p><strong>Referido por:</strong> {selectedLead.referido || 'Directo Web'}</p>
                  {selectedLead.tipo_servicio !== 'Auditoria' && (
                    <p><strong>Monto Pagado:</strong> ${selectedLead.monto}</p>
                  )}
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
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>Selecciona un lead de la izquierda para ver su hoja de vida.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: EXPEDIENTES (AUDITORIAS) */}
      {activeView === 'expedientes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[calc(100vh-120px)] overflow-hidden">
          
          {/* TOOLBAR */}
          <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 justify-between items-center bg-slate-900 z-10">
            <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setShowNewExpModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition text-sm shadow-lg shadow-emerald-900/20"
              >
                <Plus size={18} /> Nuevo Expediente
              </button>

              <div className="relative flex-1 max-w-md ml-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por Nombre, Teléfono o A-Number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-emerald-500 outline-none transition text-white"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-500" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 outline-none"
                >
                  <option value="all">Todos los Casos</option>
                  <option value="ready_bond">Listos para Cobro de Fianza</option>
                  <option value="pending_hearing">Audiencia Pendiente</option>
                  <option value="paid">Auditorías Pagadas ($50)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={exportToCSV}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition text-sm border border-slate-700"
            >
              <Download size={16} /> Exportar a CSV
            </button>
          </div>

          {/* TABLE */}
          <div className="overflow-auto flex-1 p-0 m-0">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-950 text-slate-400 sticky top-0 uppercase text-xs tracking-wider z-0">
                <tr>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">Folio / Fecha</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">Cliente</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">A-Number</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">Estatus Corte</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">Auditoría</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold">Fianza</th>
                  <th className="px-4 py-3 border-b border-slate-800 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredExpedientes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron expedientes. Añade uno nuevo.
                    </td>
                  </tr>
                ) : (
                  filteredExpedientes.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 py-3">
                        <div className="font-mono text-emerald-400 font-bold">{exp.folio}</div>
                        <div className="text-[10px] text-slate-500">{new Date(exp.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{exp.nombre_completo}</div>
                        <div className="text-xs text-slate-400">{exp.telefono_whatsapp}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        {exp.a_number || 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${exp.estatus_corte === 'Cerrado' || exp.estatus_corte === 'Orden Final' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                          {exp.estatus_corte || 'Desconocido'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${exp.estado_pago_auditoria === 'Pagado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                          {exp.estado_pago_auditoria || 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {exp.hubo_fianza ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">${exp.monto_estimado}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{exp.estado_cobro_fianza}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link 
                          to={`/reporte/${exp.folio}`} 
                          target="_blank"
                          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded text-xs font-bold inline-flex items-center gap-1 transition"
                        >
                          <FileOutput size={14} /> PDF
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL NUEVO EXPEDIENTE */}
      {showNewExpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Registrar Nueva Auditoría</h2>
              <button onClick={() => setShowNewExpModal(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="new-exp-form" onSubmit={handleSaveExpediente} className="space-y-6">
                
                {/* Info Cliente */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 mb-3 border-b border-slate-800 pb-2">Información del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nombre Completo *</label>
                      <input required type="text" value={newExp.nombre_completo} onChange={e => setNewExp({...newExp, nombre_completo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Teléfono WhatsApp *</label>
                      <input required type="text" value={newExp.telefono_whatsapp} onChange={e => setNewExp({...newExp, telefono_whatsapp: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Estado en USA</label>
                      <input type="text" value={newExp.estado_usa} onChange={e => setNewExp({...newExp, estado_usa: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                  </div>
                </div>

                {/* Identificadores */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 mb-3 border-b border-slate-800 pb-2">Identificadores</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">A-Number</label>
                      <input type="text" value={newExp.a_number} onChange={e => setNewExp({...newExp, a_number: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Número de Recibo USCIS</label>
                      <input type="text" value={newExp.numero_recibo} onChange={e => setNewExp({...newExp, numero_recibo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                  </div>
                </div>

                {/* Estatus del Proceso */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 mb-3 border-b border-slate-800 pb-2">Resultado de la Búsqueda</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Estatus en Corte *</label>
                      <select value={newExp.estatus_corte} onChange={e => setNewExp({...newExp, estatus_corte: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white">
                        <option value="Pendiente">Pendiente</option>
                        <option value="Cerrado">Cerrado / Dismissed</option>
                        <option value="Orden Final">Orden Final de Deportación</option>
                        <option value="Administrativamente Cerrado">Admin. Cerrado</option>
                        <option value="No Encontrado">No Encontrado en Sistema</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Fecha de Audiencia</label>
                      <input type="text" placeholder="Ej. 12/Oct/2026 o TBD" value={newExp.fecha_audiencia} onChange={e => setNewExp({...newExp, fecha_audiencia: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Juez / Corte</label>
                      <input type="text" placeholder="Ej. Juez Smith, Miami FL" value={newExp.juez_asignado} onChange={e => setNewExp({...newExp, juez_asignado: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                  </div>
                </div>

                {/* Fianza */}
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <input 
                      type="checkbox" 
                      id="hubo_fianza" 
                      checked={newExp.hubo_fianza} 
                      onChange={e => setNewExp({...newExp, hubo_fianza: e.target.checked})} 
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <label htmlFor="hubo_fianza" className="font-bold text-white text-sm">¿Se detectó Fianza en el sistema?</label>
                  </div>
                  
                  {newExp.hubo_fianza && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Monto Estimado USD</label>
                        <input type="number" value={newExp.monto_estimado} onChange={e => setNewExp({...newExp, monto_estimado: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Nombre del Fiador</label>
                        <input type="text" value={newExp.nombre_fiador} onChange={e => setNewExp({...newExp, nombre_fiador: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Estado Comercial Fianza</label>
                        <select value={newExp.estado_cobro_fianza} onChange={e => setNewExp({...newExp, estado_cobro_fianza: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white">
                          <option value="No aplica">No aplica (aún en corte)</option>
                          <option value="Lista para reclamo">Lista para reclamo</option>
                          <option value="Pendiente de cierre">Pendiente de cierre</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comercial Auditoría */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-500 mb-3 border-b border-slate-800 pb-2">Estado de Cobro de la Auditoría</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Estatus del Pago ($50 USD)</label>
                      <select value={newExp.estado_pago_auditoria} onChange={e => setNewExp({...newExp, estado_pago_auditoria: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white">
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pagado">Pagado</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Método de Pago</label>
                      <input type="text" placeholder="Ej. Zelle, Cash App..." value={newExp.metodo_pago} onChange={e => setNewExp({...newExp, metodo_pago: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-white" />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-slate-800 flex justify-end gap-3 bg-slate-950 rounded-b-2xl">
              <button 
                type="button" 
                onClick={() => setShowNewExpModal(false)}
                className="px-6 py-2 rounded font-bold text-slate-400 hover:text-white transition"
              >
                Cancelar
              </button>
              <button 
                form="new-exp-form"
                type="submit" 
                disabled={isSavingExp}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-2 rounded shadow-lg transition disabled:opacity-50"
              >
                {isSavingExp ? 'Guardando...' : 'Guardar Expediente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
