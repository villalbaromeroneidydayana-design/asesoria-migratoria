import { useState } from 'react';
import { 
  Users, 
  UserPlus,
  Search, 
  Filter, 
  Phone, 
  Send, 
  Scale, 
  Stethoscope, 
  Fingerprint, 
  ShieldAlert, 
  X,
  PhoneCall,
  PhoneOff,
  ClipboardList,
  Check,
  FileImage,
  Upload
} from 'lucide-react';
import type { ClientLead, CaseStatus, ContactStatus, DocumentStatus, EvaluationStatus, CaseLifecycle } from '../types';
import { sendWhatsAppMessage } from '../utils/speech';
import { generateBossReport } from '../utils/reportUtils';

interface ClientsCRMProps {
  clients: ClientLead[];
  selectedClient: ClientLead | null;
  onSelectClient: (client: ClientLead | null) => void;
  onUpdateClient: (updated: ClientLead) => void;
  onStartIntake: () => void;
  onOpenNewClientModal?: () => void;
  onOpenBulkImport?: () => void;
}

export const ClientsCRM: React.FC<ClientsCRMProps> = ({
  clients,
  selectedClient,
  onSelectClient,
  onUpdateClient,
  onStartIntake,
  onOpenNewClientModal,
  onOpenBulkImport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.numeroExpediente && c.numeroExpediente.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.telefono.includes(searchQuery) ||
      (c.whatsapp && c.whatsapp.includes(searchQuery)) ||
      (c.numeroA && c.numeroA.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.paisOrigen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tramiteSolicitado && c.tramiteSolicitado.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'todos') return true;
    if (statusFilter === 'por_contactar') return c.estadoContacto === 'nuevo_por_contactar';
    if (statusFilter === 'esperan_docs') return c.estadoDocumentos === 'esperando_documentos';
    if (statusFilter === 'sin_respuesta') return c.estadoContacto === 'sin_respuesta' || (c.llamadasSinRespuestaCount || 0) > 0;
    if (statusFilter === 'detenidos') return c.estaDetenido || c.status === 'detenido_fianza';
    if (statusFilter === 'corte') return c.tieneCorte;
    if (statusFilter === 'activos') return c.estadoCaso === 'activo';
    if (statusFilter === 'finalizados') return c.estadoCaso === 'finalizado';
    return true;
  });

  const getStatusBadge = (status: CaseStatus, estaDetenido: boolean) => {
    if (estaDetenido) {
      return (
        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-950/80 text-red-300 border border-red-800/80 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-red-400" />
          Detenido en ICE / Fianza
        </span>
      );
    }
    switch (status) {
      case 'nuevo_lead':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-950 text-blue-300 border border-blue-800">Nuevo Lead</span>;
      case 'calificado':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">Calificado</span>;
      case 'tramites_previos':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-950 text-amber-300 border border-amber-800">Trámites Previos</span>;
      case 'en_corte':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-950 text-purple-300 border border-purple-800">En Corte con Juez</span>;
      case 'aprobado':
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-teal-950 text-teal-300 border border-teal-800">Caso Aprobado</span>;
      default:
        return <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">En Proceso</span>;
    }
  };

  // Call logging actions
  const handleLogCallSuccess = (client: ClientLead) => {
    const updated: ClientLead = {
      ...client,
      llamadasRealizadasCount: (client.llamadasRealizadasCount || 0) + 1,
      estadoContacto: 'llamada_realizada',
      ultimaLlamada: `Hoy a las ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    onUpdateClient(updated);
  };

  const handleLogCallNoAnswer = (client: ClientLead) => {
    const updated: ClientLead = {
      ...client,
      llamadasSinRespuestaCount: (client.llamadasSinRespuestaCount || 0) + 1,
      estadoContacto: 'sin_respuesta',
      ultimaLlamada: `Hoy ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Sin respuesta)`
    };
    onUpdateClient(updated);
  };

  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);

  const handleCopyBossReport = (client: ClientLead) => {
    const reportText = generateBossReport(client);
    navigator.clipboard.writeText(reportText);
    setCopiedReportId(client.id);
    setTimeout(() => setCopiedReportId(null), 3500);
  };

  const handleUploadPhotoId = (client: ClientLead, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated: ClientLead = {
        ...client,
        fotoIdUrl: result,
        tipoDocumentoIdentidad: 'pasaporte'
      };
      onUpdateClient(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Gestión de Expedientes y Cartera de Clientes</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">
              Expedientes y CRM Migratorio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro completo: fuentes de captación, llamadas, trámites de fianza, corte y documentos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenBulkImport && (
              <button
                onClick={onOpenBulkImport}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-amber-500/40 transition cursor-pointer shadow-md"
                title="Pegar lista de prospectos y teléfonos"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>+ Carga Masiva</span>
              </button>
            )}

            {onOpenNewClientModal && (
              <button
                onClick={onOpenNewClientModal}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-300/40 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4 fill-slate-950" />
                <span>+ Nuevo Cliente</span>
              </button>
            )}

            <button
              onClick={onStartIntake}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Intake en Vivo</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por Expediente (EXP-...), nombre, WhatsApp, trámite, Número A o país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'por_contactar', label: 'Por Contactar' },
              { id: 'esperan_docs', label: 'Esperan Docs' },
              { id: 'sin_respuesta', label: 'Sin Respuesta' },
              { id: 'detenidos', label: 'Detenidos / ICE' },
              { id: 'corte', label: 'Con Corte' },
              { id: 'activos', label: 'Casos Activos' },
              { id: 'finalizados', label: 'Finalizados' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  statusFilter === f.id
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table / Grid */}
      <div className="glass-card rounded-2xl border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Expediente / Cliente</th>
                <th className="py-3.5 px-4">Contacto & WhatsApp</th>
                <th className="py-3.5 px-4">Trámite Solicitado</th>
                <th className="py-3.5 px-4">Llamadas CRM</th>
                <th className="py-3.5 px-4">Documentos & Evaluación</th>
                <th className="py-3.5 px-4">Estado del Caso</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredClients.map((client) => (
                <tr 
                  key={client.id}
                  className="hover:bg-slate-800/40 transition group cursor-pointer"
                  onClick={() => onSelectClient(client)}
                >
                  {/* Column 1: Expediente & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        {client.numeroExpediente}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {client.fechaRegistro}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm group-hover:text-amber-300 transition mt-1">
                      {client.nombre}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{client.paisOrigen}</span>
                      {client.estadoResidenciaEEUU && (
                        <>
                          <span>•</span>
                          <span>📍 {client.estadoResidenciaEEUU}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Column 2: WhatsApp & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="text-emerald-400 font-mono font-semibold">
                      {client.whatsapp || client.telefono}
                    </div>
                    {client.email && (
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {client.email}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Fuente: <span className="capitalize text-slate-400">{client.fuenteContacto}</span>
                    </div>
                  </td>

                  {/* Column 3: Trámite */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200 line-clamp-1 max-w-[200px]" title={client.tramiteSolicitado}>
                      {client.tramiteSolicitado}
                    </div>
                    {client.referidoPor && (
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                        Ref: {client.referidoPor}
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500">
                      Resp: {client.responsable}
                    </div>
                  </td>

                  {/* Column 4: Llamadas */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/20" title="Llamadas realizadas">
                        ✓ {client.llamadasRealizadasCount || 0}
                      </span>
                      {(client.llamadasSinRespuestaCount || 0) > 0 && (
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono font-bold text-[11px] border border-red-500/20" title="Sin respuesta / buzón">
                          ✗ {client.llamadasSinRespuestaCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 capitalize">
                      {client.estadoContacto === 'nuevo_por_contactar' ? (
                        <span className="text-amber-300 font-semibold">Por contactar</span>
                      ) : client.estadoContacto === 'sin_respuesta' ? (
                        <span className="text-red-300 font-semibold">Sin respuesta</span>
                      ) : (
                        <span className="text-slate-300">Contactado</span>
                      )}
                    </div>
                  </td>

                  {/* Column 5: Documentos y Evaluación */}
                  <td className="py-3.5 px-4">
                    <div className="text-[11px]">
                      {client.estadoDocumentos === 'esperando_documentos' ? (
                        <span className="text-amber-300 font-medium">⏳ Esperando Docs</span>
                      ) : client.estadoDocumentos === 'documentos_recibidos' ? (
                        <span className="text-blue-300 font-medium">📥 Docs Recibidos</span>
                      ) : (
                        <span className="text-emerald-300 font-medium">✓ Docs Completos</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Evaluación: <strong className={client.estadoEvaluacion === 'completada' ? 'text-emerald-400' : 'text-amber-400'}>{client.estadoEvaluacion}</strong>
                    </div>
                  </td>

                  {/* Column 6: Status Badge */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(client.status, client.estaDetenido)}
                  </td>

                  {/* Column 7: Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Copiar Reporte para Jefes */}
                      <button
                        onClick={() => handleCopyBossReport(client)}
                        className={`p-2 rounded-lg border transition cursor-pointer ${
                          copiedReportId === client.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border-purple-500/30'
                        }`}
                        title="Copiar reporte detallado para los jefes (WhatsApp)"
                      >
                        {copiedReportId === client.id ? (
                          <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                        ) : (
                          <ClipboardList className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          const msg = `Hola ${client.nombre}, le saluda el Licenciado David Antony Carrillo del Bufete de Asesoría Migratoria. Le escribo en referencia a su expediente ${client.numeroExpediente}.`;
                          sendWhatsAppMessage(client.whatsapp || client.telefono, msg);
                        }}
                        className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition cursor-pointer"
                        title="Abrir chat en WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectClient(client)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
                      >
                        Ficha
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-white font-bold text-sm">
                        No hay clientes registrados aún
                      </h3>
                      <p className="text-slate-400 text-xs">
                        La base de datos está limpia y en cero. Registra al primer cliente formalmente o inicia una llamada de intake en vivo.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        {onOpenNewClientModal && (
                          <button
                            onClick={onOpenNewClientModal}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5 fill-slate-950" />
                            <span>+ Registrar Primer Cliente</span>
                          </button>
                        )}
                        <button
                          onClick={onStartIntake}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Intake en Vivo</span>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No se encontraron expedientes con los criterios seleccionados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER FOR EXPEDIENTE */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-amber-500/30 shadow-2xl space-y-6 p-6 sm:p-8 relative">
            <button
              onClick={() => onSelectClient(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-lg font-serif shrink-0">
                  {selectedClient.nombre.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      {selectedClient.nombre}
                    </h2>
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedClient.numeroExpediente}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span>Nacionalidad: {selectedClient.paisOrigen}</span>
                    <span>•</span>
                    <span>Reside en: {selectedClient.estadoResidenciaEEUU || 'EE.UU.'}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">{selectedClient.whatsapp || selectedClient.telefono}</span>
                    <span>•</span>
                    <span>Registrado: {selectedClient.fechaRegistro} {selectedClient.horaRegistro}</span>
                  </p>
                </div>
              </div>

              {/* Botón Destacado: Copiar Reporte para Jefes */}
              <div className="flex items-center gap-2 md:mr-10">
                <button
                  type="button"
                  onClick={() => handleCopyBossReport(selectedClient)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition shadow-lg cursor-pointer ${
                    copiedReportId === selectedClient.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-amber-500/30'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-purple-950/50'
                  }`}
                  title="Copia el informe ejecutivo formateado para enviar a la jefatura por WhatsApp"
                >
                  {copiedReportId === selectedClient.id ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                      <span>¡Reporte Copiado para los Jefes!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-4 h-4 text-purple-200" />
                      <span>Copiar Reporte para Jefes (WhatsApp)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Call Logging Strip */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Registro Rápido de Llamada de Atención
                </span>
                <span className="text-[11px] text-slate-400">
                  Llamadas realizadas: <strong className="text-white">{selectedClient.llamadasRealizadasCount || 0}</strong> • Sin respuesta: <strong className="text-red-400">{selectedClient.llamadasSinRespuestaCount || 0}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLogCallSuccess(selectedClient)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+ Llamada Atendida</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLogCallNoAnswer(selectedClient)}
                  className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span>+ Sin Respuesta / Buzón</span>
                </button>
              </div>
            </div>

            {/* ID / Passport Document Photo Strip */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <FileImage className="w-4 h-4" />
                  <span>Documento de Identificación / Pasaporte</span>
                </div>
                {selectedClient.numeroIdentificacion && (
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Doc: {selectedClient.numeroIdentificacion}
                  </span>
                )}
              </div>

              {selectedClient.fotoIdUrl ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <img 
                    src={selectedClient.fotoIdUrl} 
                    alt="Foto de Identificación" 
                    className="w-32 h-20 object-cover rounded-lg border border-slate-700 shadow cursor-pointer hover:opacity-90 transition"
                    onClick={() => window.open(selectedClient.fotoIdUrl, '_blank')}
                    title="Clic para ver en tamaño completo"
                  />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-200">
                      Foto de Documento Adjunta en Expediente
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedClient.tipoDocumentoIdentidad ? `Tipo: ${selectedClient.tipoDocumentoIdentidad.toUpperCase()}` : 'Pasaporte / ID'} • Clic en la foto para abrirla en alta resolución.
                    </p>
                    <label className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer pt-1 underline">
                      <Upload className="w-3 h-3" />
                      <span>Cambiar foto del documento</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadPhotoId(selectedClient, e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-dashed border-slate-700">
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <p className="text-slate-300 font-medium">¿El cliente te envió una foto de su pasaporte o ID?</p>
                    <p className="text-[11px] text-slate-400">
                      Puedes adjuntarla aquí para guardarla en su expediente, o <strong>arrastrarla a nuestro chat de Antigravity</strong> para que yo extraiga automáticamente los datos.
                    </p>
                  </div>
                  <label className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Adjuntar Foto de ID</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleUploadPhotoId(selectedClient, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Operational Status Selectors (Documentos, Evaluación, Caso, Contacto) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Estado de Contacto
                </label>
                <select
                  value={selectedClient.estadoContacto}
                  onChange={(e) => {
                    const updated = { ...selectedClient, estadoContacto: e.target.value as ContactStatus };
                    onUpdateClient(updated);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  <option value="nuevo_por_contactar">Nuevo / Por Contactar</option>
                  <option value="llamada_realizada">Llamada Realizada</option>
                  <option value="sin_respuesta">Sin Respuesta / Buzón</option>
                  <option value="en_seguimiento">En Seguimiento</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Estado Documentos
                </label>
                <select
                  value={selectedClient.estadoDocumentos}
                  onChange={(e) => {
                    const updated = { ...selectedClient, estadoDocumentos: e.target.value as DocumentStatus };
                    onUpdateClient(updated);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  <option value="esperando_documentos">Esperando Documentos</option>
                  <option value="documentos_recibidos">Documentos Recibidos</option>
                  <option value="en_revision">En Revisión Legal</option>
                  <option value="completos">Completos / Expediente Listo</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Evaluación Preliminar
                </label>
                <select
                  value={selectedClient.estadoEvaluacion}
                  onChange={(e) => {
                    const updated = { ...selectedClient, estadoEvaluacion: e.target.value as EvaluationStatus };
                    onUpdateClient(updated);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Ciclo del Caso
                </label>
                <select
                  value={selectedClient.estadoCaso}
                  onChange={(e) => {
                    const updated = { ...selectedClient, estadoCaso: e.target.value as CaseLifecycle };
                    onUpdateClient(updated);
                  }}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                >
                  <option value="activo">Caso Activo</option>
                  <option value="en_pausa">En Pausa</option>
                  <option value="finalizado">Finalizado / Ganado</option>
                </select>
              </div>
            </div>

            {/* Trámite Solicitado & Observaciones */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-900 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Trámite: {selectedClient.tramiteSolicitado}
                </span>
                <span className="text-[10px] text-slate-400">
                  Fuente: {selectedClient.fuenteContacto} {selectedClient.referidoPor ? `(Ref: ${selectedClient.referidoPor})` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedClient.observacionesIniciales || selectedClient.notasCaso}
              </p>
            </div>

            {/* Bitácora de Llamadas Realizadas y Reportes */}
            {selectedClient.historialLlamadas && selectedClient.historialLlamadas.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    Bitácora de Llamadas & Reportes ({selectedClient.historialLlamadas.length})
                  </span>
                  {selectedClient.fechaSeguimientoProgramado && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                      Próximo Seguimiento: {selectedClient.fechaSeguimientoProgramado}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {selectedClient.historialLlamadas.map((call, idx) => (
                    <div key={call.id || idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-200">
                          📅 {call.fechaHora} • 👤 {call.responsable}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {call.resultado === 'atendio' ? 'Llamada Atendida' : call.resultado}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
                        {call.notas}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-requisites & Court Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Detention & Court */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  Corte y Situación de Detención
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Número A:</span>
                  <span className="font-mono text-white font-semibold">{selectedClient.numeroA || 'No registrado'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">¿Está detenido?:</span>
                  <span className={selectedClient.estaDetenido ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {selectedClient.estaDetenido ? `Sí (${selectedClient.centroDetencion || 'ICE'})` : 'No'}
                  </span>
                </div>
                {selectedClient.tieneCorte && (
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Fecha de Corte:</span>
                    <span className="text-amber-300 font-semibold">{selectedClient.fechaCorte}</span>
                  </div>
                )}
                {selectedClient.montoFianzaSugerido ? (
                  <div className="flex justify-between py-1 text-red-300 font-semibold">
                    <span>Fianza Fijada/Sugerida:</span>
                    <span>${selectedClient.montoFianzaSugerido.toLocaleString()} USD</span>
                  </div>
                ) : null}
              </div>

              {/* Medical Exam & Biometrics */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  Trámites del Cliente (Médico y Huellas)
                </h4>

                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-300">Examen Médico (I-693):</span>
                  <select
                    value={selectedClient.examenMedicoStatus}
                    onChange={(e) => {
                      const updated = { ...selectedClient, examenMedicoStatus: e.target.value as any };
                      onUpdateClient(updated);
                    }}
                    className="px-2 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="agendado">Cita Agendada</option>
                    <option value="completado">Completado y Sellado</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-300">Toma Biométrica:</span>
                  <select
                    value={selectedClient.biometricosStatus}
                    onChange={(e) => {
                      const updated = { ...selectedClient, biometricosStatus: e.target.value as any };
                      onUpdateClient(updated);
                    }}
                    className="px-2 py-1 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="agendado">Cita Agendada</option>
                    <option value="completado">Completado en ASC</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Dispatch Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Comunicaciones Directas por WhatsApp:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    const text = `🩺 Estimado/a ${selectedClient.nombre}, le saluda el Licenciado David Antony Carrillo (Expediente ${selectedClient.numeroExpediente}). Le recordamos agendar cuanto antes su Examen Médico Civil oficial (Formulario I-693) con un Cirujano Civil certificado por USCIS.`;
                    sendWhatsAppMessage(selectedClient.whatsapp || selectedClient.telefono, text);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aviso Examen Médico</span>
                </button>

                <button
                  onClick={() => {
                    const text = `👆 Estimado/a ${selectedClient.nombre}, le recordamos desde el bufete del Licenciado David Antony Carrillo (Expediente ${selectedClient.numeroExpediente}) que debe acudir a su cita de Biométricos (huellas y fotos) en el centro de USCIS.`;
                    sendWhatsAppMessage(selectedClient.whatsapp || selectedClient.telefono, text);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
                  <span>Aviso Biométricos</span>
                </button>

                <button
                  onClick={() => {
                    const text = `🏛️ Estimado/a ${selectedClient.nombre}, le escribe el Licenciado David Antony Carrillo respecto a su expediente ${selectedClient.numeroExpediente}. Le informamos sobre el avance de su fecha de corte y trámite de fianza.`;
                    sendWhatsAppMessage(selectedClient.whatsapp || selectedClient.telefono, text);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Aviso Audiencia / Juez</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
