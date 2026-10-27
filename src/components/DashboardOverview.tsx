import React, { useState } from 'react';
import { 
  Users, 
  UserPlus,
  PhoneCall, 
  PhoneOff,
  FileQuestion,
  ClipboardCheck,
  FolderOpen,
  CalendarCheck,
  ShieldAlert, 
  Scale, 
  Send, 
  Mic, 
  Calendar, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Filter,
  Bot,
  Search
} from 'lucide-react';
import type { ClientLead } from '../types';
import { LAWYER_PROFILE } from '../data/initialData';
import { Upload, UserCheck, Mail, Phone, Globe, ExternalLink, FileText } from 'lucide-react';
import { sendWhatsAppMessage } from '../utils/speech';

interface DashboardOverviewProps {
  clients: ClientLead[];
  onOpenNewClientModal: () => void;
  onStartIntake: () => void;
  onNavigateToTab: (tab: string) => void;
  onSelectClient: (client: ClientLead) => void;
  onResetToZero?: () => void;
  onLoadDemoData?: () => void;
  onLoadUserLeads?: () => void;
  onOpenBulkImport?: () => void;
  onOpenProfile?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  clients,
  onOpenNewClientModal,
  onStartIntake,
  onNavigateToTab,
  onSelectClient,
  onResetToZero,
  onLoadDemoData,
  onLoadUserLeads,
  onOpenBulkImport,
  onOpenProfile
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('urgentes');

  // Exact metrics requested by user
  const totalClients = clients.length;
  
  // Clientes nuevos por contactar
  const newToContact = clients.filter(c => c.estadoContacto === 'nuevo_por_contactar').length;
  
  // Llamadas realizadas y sin respuesta
  const callsCompleted = clients.reduce((acc, c) => acc + (c.llamadasRealizadasCount || 0), 0);
  const callsNoAnswer = clients.reduce((acc, c) => acc + (c.llamadasSinRespuestaCount || 0), 0);
  
  // Clientes que esperan documentos
  const waitingDocuments = clients.filter(c => c.estadoDocumentos === 'esperando_documentos').length;
  
  // Evaluaciones pendientes y completadas
  const evalPending = clients.filter(c => c.estadoEvaluacion === 'pendiente').length;
  const evalCompleted = clients.filter(c => c.estadoEvaluacion === 'completada').length;
  
  // Casos activos y finalizados
  const casesActive = clients.filter(c => c.estadoCaso === 'activo').length;
  const casesFinished = clients.filter(c => c.estadoCaso === 'finalizado').length;
  
  // Seguimientos programados para hoy
  const todayStr = new Date().toISOString().split('T')[0];
  const followupsToday = clients.filter(c => c.esSeguimientoHoy || c.fechaSeguimientoProgramado === todayStr).length;
  
  // Casos urgentes por detención o audiencia próxima
  const urgentCases = clients.filter(c => c.estaDetenido || (c.tieneCorte && c.fechaCorte));

  // Filtered list based on selected dashboard card
  const getFilteredClients = () => {
    switch (selectedFilter) {
      case 'nuevos':
        return clients.filter(c => c.estadoContacto === 'nuevo_por_contactar');
      case 'sin_respuesta':
        return clients.filter(c => c.estadoContacto === 'sin_respuesta' || (c.llamadasSinRespuestaCount || 0) > 0);
      case 'documentos':
        return clients.filter(c => c.estadoDocumentos === 'esperando_documentos');
      case 'seguimientos_hoy':
        return clients.filter(c => c.esSeguimientoHoy || c.fechaSeguimientoProgramado === todayStr);
      case 'urgentes':
      default:
        return urgentCases;
    }
  };

  const currentDisplayList = getFilteredClients();

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner with Action Buttons */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bufete Jurídico Lic. David Antony Carrillo • Abogado de Inmigración</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                En Línea (WhatsApp Business Activo)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {LAWYER_PROFILE.nombre}
            </h1>
            
            {/* Quick Attorney Contact Bar */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 pt-1">
              <a 
                href={`https://wa.me/${LAWYER_PROFILE.whatsapp}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{LAWYER_PROFILE.telefono}</span>
              </a>
              <a 
                href={`mailto:${LAWYER_PROFILE.email}`}
                className="flex items-center gap-1.5 text-blue-300 hover:text-blue-200 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/60"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{LAWYER_PROFILE.email}</span>
              </a>
              <a 
                href={LAWYER_PROFILE.barVerificationUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/60 transition"
                title="Verificar en The State Bar of California"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Bar License: {LAWYER_PROFILE.barNumber} ({LAWYER_PROFILE.barStatus})</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
              <span className="hidden sm:inline text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                Horario: {LAWYER_PROFILE.horario}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pt-1">
              Control de gestión de prospectos y casos migratorios: llamadas en curso, trámites ante USCIS, audiencias de fianza (EOIR) y expedientes con seguimiento programado para hoy.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 border border-amber-500/40 transition cursor-pointer shadow-lg"
                title="Ver perfil oficial de WhatsApp Business del Licenciado"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Perfil Legal</span>
              </button>
            )}

            {onOpenBulkImport && (
              <button
                onClick={onOpenBulkImport}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 text-amber-200 font-bold text-sm flex items-center justify-center gap-2 border border-amber-500/40 transition cursor-pointer shadow-lg"
                title="Pegar lista de prospectos y teléfonos recibidos"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>+ Carga Masiva</span>
              </button>
            )}

            {/* Primary Action Button: + NUEVO CLIENTE */}
            <button
              onClick={onOpenNewClientModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/40 border border-amber-300/50 transition cursor-pointer hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4 fill-slate-950" />
              <span>+ Nuevo Cliente</span>
            </button>

            {/* Live WhatsApp Intake Call Wizard */}
            <button
              onClick={onStartIntake}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>Intake Telefónico</span>
            </button>

            {/* Estefanía Assistant Button */}
            <button
              onClick={() => onNavigateToTab('estefania')}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600/40 to-indigo-600/40 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-200 font-bold text-sm flex items-center justify-center gap-2 border border-purple-500/40 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-300" />
              <span>Estefanía</span>
            </button>

            {/* Rastreador Oficial Online Button */}
            <button
              onClick={() => onNavigateToTab('ubicaciones')}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-blue-500/20 hover:from-blue-600/40 hover:to-indigo-600/35 text-blue-200 font-bold text-sm flex items-center justify-center gap-2 border border-blue-500/40 transition cursor-pointer shadow-lg"
              title="Rastreador Oficial de Casos en Línea (USCIS, Cortes EOIR y Detenidos ICE)"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Rastreador de Casos (USCIS / Corte)</span>
            </button>

            {/* Formularios & Tarifas Button (Whiteboard) */}
            <button
              onClick={() => onNavigateToTab('tarifas')}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2 border border-amber-500/40 transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Formularios & Tarifas</span>
            </button>

            {/* Assistant Voice Audios */}
            <button
              onClick={() => onNavigateToTab('audios')}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Mic className="w-4 h-4 text-purple-400" />
              <span>Audios (ElevenLabs)</span>
            </button>

            {/* Botón para restaurar los 10 prospectos iniciales */}
            {onLoadUserLeads && (
              <button
                onClick={onLoadUserLeads}
                className="w-full sm:w-auto px-3 py-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 transition cursor-pointer"
                title="Cargar o restaurar los 10 prospectos iniciales del Lic. David Antony Carrillo"
              >
                <span>Restaurar 10 Leads</span>
              </button>
            )}

            {/* Botón para reiniciar en cero si hay clientes cargados */}
            {clients.length > 0 && onResetToZero && (
              <button
                onClick={onResetToZero}
                className="w-full sm:w-auto px-3 py-3 rounded-2xl bg-red-950/40 hover:bg-red-900/50 text-red-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-red-800/40 transition cursor-pointer"
                title="Limpiar y volver a dejar la plataforma en cero"
              >
                <span>Limpiar en Cero</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid: Indicators requested by user */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Registrados */}
        <div 
          onClick={() => onNavigateToTab('clients')}
          className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Total Registrados</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalClients}</div>
          <div className="text-[11px] text-blue-300 mt-1">Expedientes en sistema</div>
        </div>

        {/* Metric 2: Nuevos por Contactar */}
        <div 
          onClick={() => setSelectedFilter('nuevos')}
          className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border cursor-pointer ${
            selectedFilter === 'nuevos' ? 'border-amber-500/60 bg-amber-500/5' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Por Contactar</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-200 font-mono">{newToContact}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Leads nuevos en espera</div>
        </div>

        {/* Metric 3: Llamadas Realizadas vs Sin Respuesta */}
        <div 
          onClick={() => setSelectedFilter('sin_respuesta')}
          className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border cursor-pointer ${
            selectedFilter === 'sin_respuesta' ? 'border-purple-500/60 bg-purple-500/5' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">Llamadas CRM</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{callsCompleted}</span>
            <span className="text-xs text-slate-400">hechas</span>
            <span className="text-slate-600">•</span>
            <span className="text-xl font-bold text-red-400 font-mono">{callsNoAnswer}</span>
            <span className="text-[10px] text-red-300">buzón</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <PhoneOff className="w-3 h-3 text-red-400" />
            <span>{callsNoAnswer} sin respuesta</span>
          </div>
        </div>

        {/* Metric 4: Clientes Esperando Documentos */}
        <div 
          onClick={() => setSelectedFilter('documentos')}
          className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border cursor-pointer ${
            selectedFilter === 'documentos' ? 'border-teal-500/60 bg-teal-500/5' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">Esperan Documentos</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-200 font-mono">{waitingDocuments}</div>
          <div className="text-[11px] text-teal-400/80 mt-1">Pruebas / Médico pendiente</div>
        </div>
      </div>

      {/* Secondary KPI Grid: Evaluations, LifeCycle, Today Followups and Urgent Detention */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 5: Evaluaciones (Pendientes vs Completadas) */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Evaluaciones</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-300 font-mono">{evalCompleted}</span>
            <span className="text-xs text-slate-400">listas</span>
            <span className="text-slate-600">•</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{evalPending}</span>
            <span className="text-[10px] text-amber-300">pendientes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Calificación de vías legales</div>
        </div>

        {/* Metric 6: Casos Activos vs Finalizados */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Estado de Casos</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{casesActive}</span>
            <span className="text-xs text-slate-400">activos</span>
            <span className="text-slate-600">•</span>
            <span className="text-xl font-bold text-teal-400 font-mono">{casesFinished}</span>
            <span className="text-[10px] text-teal-300">ganados</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Ciclo de vida de expedientes</div>
        </div>

        {/* Metric 7: Seguimientos Programados para Hoy */}
        <div 
          onClick={() => setSelectedFilter('seguimientos_hoy')}
          className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border cursor-pointer ${
            selectedFilter === 'seguimientos_hoy' ? 'border-amber-500/60 bg-amber-500/5' : 'border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">Seguimiento Hoy</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-200 font-mono">{followupsToday}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Contactos citados para hoy</div>
        </div>

        {/* Metric 8: Urgentes por Detención o Corte Próxima */}
        <div 
          onClick={() => setSelectedFilter('urgentes')}
          className={`glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border cursor-pointer relative overflow-hidden ${
            selectedFilter === 'urgentes' ? 'border-red-500/60 bg-red-950/20' : 'border-slate-800'
          }`}
        >
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-red-300">Casos Urgentes</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-red-300 font-mono">{urgentCases.length}</div>
          <div className="text-[11px] text-red-400 mt-1">Detenidos en ICE / Audiencias</div>
        </div>
      </div>

      {/* Dynamic Tab Filter Header */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-white">
              {selectedFilter === 'nuevos' && 'Clientes Nuevos por Contactar'}
              {selectedFilter === 'sin_respuesta' && 'Llamadas Sin Respuesta / Buzón de Voz'}
              {selectedFilter === 'documentos' && 'Clientes en Espera de Documentos y Evidencia'}
              {selectedFilter === 'seguimientos_hoy' && 'Seguimientos Programados para el Día de Hoy'}
              {selectedFilter === 'urgentes' && 'Casos Urgentes: Detenciones en ICE y Cortes Próximas'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {currentDisplayList.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTab('clients')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Ver todos los {clients.length} expedientes en CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Display List Cards */}
        <div className="space-y-3">
          {currentDisplayList.map((client) => (
            <div
              key={client.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {client.numeroExpediente}
                  </span>
                  <span className="font-bold text-white text-sm hover:text-amber-300 transition cursor-pointer" onClick={() => onSelectClient(client)}>
                    {client.nombre}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {client.paisOrigen}
                  </span>
                  {client.estadoResidenciaEEUU && (
                    <span className="text-[10px] text-slate-400">
                      📍 {client.estadoResidenciaEEUU}
                    </span>
                  )}

                  {client.estaDetenido ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 font-bold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Detenido en ICE ({client.centroDetencion || 'Custodia'})
                    </span>
                  ) : client.tieneCorte ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                      ⚖️ Audiencia con Juez
                    </span>
                  ) : null}
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-slate-400">Trámite: </strong>
                  <span className="text-amber-200">{client.tramiteSolicitado}</span>
                  {client.observacionesIniciales && (
                    <span className="text-slate-400 text-[11px] block mt-0.5 line-clamp-1 italic">
                      "{client.observacionesIniciales}"
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-emerald-400 font-mono">{client.whatsapp || client.telefono}</span>
                  {client.fechaCorte && (
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Calendar className="w-3 h-3" />
                      Corte: {client.fechaCorte}
                    </span>
                  )}
                  {client.juezNombre && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <Scale className="w-3 h-3 text-slate-500" />
                      {client.juezNombre}
                    </span>
                  )}
                  {client.ciudadCorte && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {client.ciudadCorte}
                    </span>
                  )}
                  <span className="text-slate-500">
                    Resp: {client.responsable}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this Client */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const msg = `Hola ${client.nombre}, le saluda el Licenciado David Antony Carrillo del Bufete de Asesoría Migratoria. Me comunico respecto a su expediente ${client.numeroExpediente} para coordinar los próximos pasos de su trámite.`;
                    sendWhatsAppMessage(client.whatsapp || client.telefono, msg);
                  }}
                  className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition cursor-pointer"
                  title="Abrir WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectClient(client)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  Ver Expediente
                </button>
              </div>
            </div>
          ))}

          {clients.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <FolderOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white font-serif">
                  Plataforma en Cero — Lista para Nuevos Expedientes
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No hay clientes registrados en el sistema. Todos los indicadores y métricas están en cero, listos para ingresar expedientes reales.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={onOpenNewClientModal}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 fill-slate-950" />
                  <span>+ Registrar Primer Cliente</span>
                </button>

                <button
                  onClick={onStartIntake}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Iniciar Intake Telefónico</span>
                </button>
              </div>

              {onLoadDemoData && (
                <div className="pt-4 border-t border-slate-800/60">
                  <button
                    onClick={onLoadDemoData}
                    className="text-[11px] text-slate-500 hover:text-amber-400 transition cursor-pointer underline"
                  >
                    ¿Deseas cargar clientes de prueba para demostración? Haz clic aquí
                  </button>
                </div>
              )}
            </div>
          ) : currentDisplayList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No hay clientes pendientes en este filtro en este momento.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
