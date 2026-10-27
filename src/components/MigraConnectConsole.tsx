import React, { useState } from 'react';
import {
  Search,
  Copy,
  CheckCircle2,
  Send,
  ExternalLink,
  Smartphone,
  Scale,
  AlertTriangle,
  Building2,
  FileText,
  UserCheck,
  PhoneCall,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import type { ClientLead } from '../types';
import { LAWYER_PROFILE } from '../data/initialData';

interface MigraConnectConsoleProps {
  clients: ClientLead[];
  onUpdateClient?: (updatedClient: ClientLead) => void;
}

export const MigraConnectConsole: React.FC<MigraConnectConsoleProps> = ({
  clients
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Query Input
  const [inputNumber, setInputNumber] = useState('');
  const [detectedType, setDetectedType] = useState<'uscis' | 'eoir' | 'unknown'>('unknown');

  // Response Form Generator State
  const [fechaAudiencia, setFechaAudiencia] = useState('');
  const [horaAudiencia, setHoraAudiencia] = useState('');
  const [ciudadCorte, setCiudadCorte] = useState('');
  const [nombreJuez, setNombreJuez] = useState('');
  const [diasReloj, setDiasReloj] = useState('155');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientName = selectedClient ? selectedClient.nombre : 'Estimado cliente';
  const clientPhone = selectedClient ? (selectedClient.whatsapp || selectedClient.telefono) : '';

  // Auto-detect number type
  const handleInputChange = (val: string) => {
    setInputNumber(val);
    const clean = val.trim().replace(/[-\s]/g, '');
    if (/^[a-zA-Z]{3}\d{10}$/i.test(clean) || /^(IOE|MSC|NBC|LIN|WAC|EAC|SRC)/i.test(clean)) {
      setDetectedType('uscis');
    } else if (/^\d{8,9}$/.test(clean) || /^A\d{8,9}$/i.test(clean)) {
      setDetectedType('eoir');
    } else {
      setDetectedType('unknown');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const openWhatsApp = (text: string) => {
    const phone = clientPhone ? clientPhone.replace(/[^0-9]/g, '') : '';
    const url = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const openUSCISPortal = () => {
    const clean = inputNumber.trim().replace(/[-\s]/g, '').toUpperCase();
    if (clean) {
      navigator.clipboard.writeText(clean);
      setCopiedKey('uscis-copied');
      setTimeout(() => setCopiedKey(null), 2500);
    }
    window.open('https://egov.uscis.gov/', '_blank');
  };

  const openEOIRPortal = () => {
    const digitsOnly = inputNumber.replace(/\D/g, '');
    if (digitsOnly) {
      navigator.clipboard.writeText(digitsOnly);
      setCopiedKey('eoir-copied');
      setTimeout(() => setCopiedKey(null), 2500);
    }
    window.open('https://acis.eoir.justice.gov/es/', '_blank');
  };

  // Scripts de Solicitud de Datos
  const scriptUSCIS = `Don ${clientName}, para verificar en el sistema en qué estado exacto está su expediente y qué le han aprobado hasta el momento, ¿me podría compartir por favor su Número de Recibo de USCIS? Suele ser un código de 13 caracteres que empieza por tres letras como IOE, SRC o LIN, y viene en la parte superior de sus cartas oficiales I-797.`;

  const scriptEOIR = `Don ${clientName}, para verificarle en el sistema de la Corte cuándo tiene su próxima audiencia y con qué juez le tocó, ¿tiene a mano su Número A (Número de Extranjero)? Es un número de 9 dígitos que empieza por la letra A y aparece en sus papeles de liberación de frontera o en su aviso de comparecencia (NTA).`;

  const scriptFoto = `Don ${clientName}, no se preocupe si no ubica el código exacto; tómele una fotografía clara por WhatsApp a la carta oficial que le llegó por correo o al documento que le entregaron al ingresar a EE. UU., y nosotros mismos extraemos el número y le confirmamos su estado en el sistema en 5 minutos.`;

  // Scripts de Respuestas Tras Verificación
  const respuestaCorte = `🏛️ *REPORTE DE AUDIENCIA EN CORTE (EOIR)*\n*${LAWYER_PROFILE.despacho}*\n\nDon ${clientName}, acabamos de verificar su expediente en el sistema oficial de la Corte de Inmigración:\n\n📅 *Fecha de Audiencia:* ${fechaAudiencia || '[Pendiente o por confirmar]'}\n⏰ *Hora:* ${horaAudiencia || '09:00 AM'}\n📍 *Tribunal:* ${ciudadCorte || 'Corte de Inmigración'}\n⚖️ *Juez Asignado:* ${nombreJuez || 'Juez de Inmigración'}\n\n⚠️ *Aviso Legal:* Es fundamental comparecer con el respaldo de un abogado colegiado para evitar una orden de deportación en ausencia. El despacho del Licenciado David Antony Carrillo está a su disposición para asumir su representación legal formal.`;

  const respuestaRelojAsilo = `⏱️ *VERIFICACIÓN DEL RELOJ DE ASILO (PERMISO DE TRABAJO C-08)*\n*${LAWYER_PROFILE.despacho}*\n\nDon ${clientName}, excelentes noticias al consultar el sistema de la Corte:\n\n✅ *Días Acumulados:* ${diasReloj || '150+'} días registrados en su reloj de asilo.\n💼 *Estado:* ¡Ya califica legalmente para solicitar su Permiso de Trabajo y Número de Seguro Social (Formulario I-765 categoría C-08)!\n\nPodemos iniciar la preparación y radicación inmediata de sus formularios. Contáctenos para coordinar los documentos necesarios.`;

  const respuestaUSCISDemorado = `📋 *ESTADO DE TRÁMITE ANTE USCIS*\n*${LAWYER_PROFILE.despacho}*\n\nDon ${clientName}, consultamos el número de recibo de su caso ante el Servicio de Inmigración (USCIS):\n\n🔍 *Estado Actual:* El caso fue recibido y se encuentra pendiente de resolución. No registra movimientos recientes en el sistema.\n💡 *Recomendación del Abogado:* El despacho puede solicitar una indagación formal de caso fuera de tiempo de procesamiento habitual para acelerar una respuesta oficial de USCIS.`;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              <span>Herramienta Integrada: MigraConnect, USCIS & Corte EOIR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Verificador de Casos & Solicitud de Datos Oficiales
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consola para solicitar el <strong className="text-amber-300">Número de Recibo (USCIS)</strong> o el <strong className="text-emerald-300">Número A (Corte EOIR)</strong> al cliente con guiones profesionales, verificarlo en segundos e interpretar los resultados en tiempo real.
            </p>
          </div>

          {/* Quick Client Selector */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 w-full lg:w-80 shrink-0 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Cliente en Gestión</span>
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-amber-400"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroExpediente} - {c.nombre} ({c.estadoResidenciaEEUU.split(' ')[0]})
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Tel: <strong className="text-slate-200 font-mono">{selectedClient.telefono}</strong></span>
                <span className="text-emerald-400 font-semibold">{selectedClient.estadoCaso}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: ¿CÓMO PEDIRLE LOS DATOS AL CLIENTE? */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold">Guiones para Solicitar los Números al Cliente</h2>
            <p className="text-xs text-slate-400">Selecciona el guion según el tipo de trámite y envíalo en un clic.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tarjeta A: USCIS */}
          <div className="glass-card rounded-2xl p-5 border-blue-500/30 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30">
                  Caso con USCIS
                </span>
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-sm">Pedir Número de Recibo (13 dígitos)</h3>
              <p className="text-xs text-slate-400">Para peticiones familiares, permisos de trabajo o asilo afirmativo.</p>
              
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                “{scriptUSCIS}”
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => copyToClipboard(scriptUSCIS, 'script-uscis')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === 'script-uscis' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'script-uscis' ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={() => openWhatsApp(scriptUSCIS)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                title="Enviar por WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Tarjeta B: Corte EOIR */}
          <div className="glass-card rounded-2xl p-5 border-amber-500/30 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                  Corte de Inmigración / EOIR
                </span>
                <Scale className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-sm">Pedir Número A (Alien Number - 9 dígitos)</h3>
              <p className="text-xs text-slate-400">Para quienes entraron por frontera o tienen cita ante el Juez.</p>
              
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                “{scriptEOIR}”
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => copyToClipboard(scriptEOIR, 'script-eoir')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === 'script-eoir' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'script-eoir' ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={() => openWhatsApp(scriptEOIR)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                title="Enviar por WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Tarjeta C: Foto de Carta / Cliente Confundido */}
          <div className="glass-card rounded-2xl p-5 border-emerald-500/30 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  Si no entiende los papeles
                </span>
                <HelpCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-sm">Pedir Foto del Documento</h3>
              <p className="text-xs text-slate-400">La opción más fácil para que el cliente no se bloquee ni se asuste.</p>
              
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
                “{scriptFoto}”
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => copyToClipboard(scriptFoto, 'script-foto')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === 'script-foto' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'script-foto' ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>
              <button
                onClick={() => openWhatsApp(scriptFoto)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                title="Enviar por WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: CONSOLA DE VERIFICACIÓN EN VIVO */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold">Consola de Consulta Rápida (USCIS, Corte EOIR o MigraConnect)</h2>
            <p className="text-xs text-slate-400">Ingresa el código que te envió el cliente para verificarlo de inmediato.</p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 border-slate-800 space-y-6">
          {/* Live Search Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Pegar Número de Recibo o Número A:</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputNumber}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Ej: IOE0923847582 (USCIS)  o  A098765432 (Corte EOIR)"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 tracking-wider"
                />
                {detectedType !== 'unknown' && (
                  <span className={`absolute right-3.5 top-3.5 px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    detectedType === 'uscis' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {detectedType === 'uscis' ? 'Detectado: USCIS' : 'Detectado: Corte EOIR'}
                  </span>
                )}
              </div>

              {/* Botones de Consulta */}
              <button
                onClick={openUSCISPortal}
                className={`px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  detectedType === 'uscis'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Consultar en USCIS</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={openEOIRPortal}
                className={`px-5 py-3 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  detectedType === 'eoir'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-950/40 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Consultar en Corte EOIR</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            {copiedKey?.includes('copied') && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>¡Número copiado al portapapeles! Listo para pegarlo en el portal que se acaba de abrir.</span>
              </p>
            )}
          </div>

          {/* Tarjeta Informativa: Cómo usar MigraConnect en tu Celular */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>¿Tienes la App MigraConnect abierta en tu teléfono?</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Recomendado</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  En la app solo toca el botón <strong>"+" (Agregar Caso)</strong>, escribe el Número A o el Número de Recibo, ¡y listo! Te guardará el historial con notificaciones automáticas y estadísticas del Juez.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <a
                href="tel:18008987180"
                className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                title="Línea telefónica automatizada del tribunal"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Llamar EOIR: 1-800-898-7180</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: MANUAL DE INTERPRETACIÓN (QUÉ SIGNIFICA LO QUE VES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold">Manual de Interpretación Legal</h2>
            <p className="text-xs text-slate-400">Aprende a leer exactamente lo que muestra MigraConnect o el portal oficial.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Interpretación Corte EOIR */}
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-400 border-b border-slate-800 pb-3">
              <Scale className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">En Corte de Inmigración (EOIR)</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-300 flex items-center justify-between">
                  <span>⏱️ Reloj de Asilo (Asylum Clock):</span>
                  <span className="text-[11px] font-mono text-emerald-400">150 / 180 días</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  • <strong>Menos de 150 días:</strong> Debe esperar para pedir el permiso de trabajo.<br />
                  • <strong>150 días exactos:</strong> ¡Califica para radicar el formulario I-765 (Categoría C-08)!<br />
                  • <strong>180 días:</strong> USCIS ya puede aprobar la tarjeta de permiso de trabajo.<br />
                  • <strong>Reloj Detenido (*Stopped*):</strong> Si el reloj no avanza, el abogado debe ingresar una moción al juez para reactivarlo.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>🏛️ Tipo de Audiencia:</span>
                  <span className="text-[11px] text-blue-400 font-semibold">Master vs. Individual</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  • <strong>Master Calendar Hearing:</strong> Audiencia preliminar corta para contestar cargos y entregar el formulario I-589 de asilo.<br />
                  • <strong>Individual Merits Hearing:</strong> El juicio final con el Juez donde se decide si se otorga el asilo o la residencia.
                </p>
              </div>
            </div>
          </div>

          {/* Card Interpretación USCIS */}
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm">En Casos ante USCIS</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-bold text-blue-300">
                  📄 "Case Was Received" (Caso Recibido)
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Significa que USCIS aceptó el paquete y ya envió el aviso de recibo oficial I-797C. El trámite está formalmente dentro del sistema.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>"Request for Evidence Was Sent" (RFE - Alerta Amarilla)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  USCIS solicita pruebas adicionales urgentes con una <strong>fecha límite estricta</strong> (usualmente 30 a 87 días). Si no se responde con el abogado a tiempo, el caso será denegado automáticamente.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>"Card Is Being Produced" (Tarjeta en Producción)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  ¡Aprobado! Significa que el Permiso de Trabajo (EAD) o la Green Card está siendo impresa y llegará por correo USPS en 7 a 14 días.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: GENERADOR DE RESPUESTAS LISTAS PARA EL CLIENTE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm">
            4
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold">Generador de Respuestas Oficiales tras la Verificación</h2>
            <p className="text-xs text-slate-400">Personaliza y envíale el reporte al cliente en segundos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Respuesta 1: Próxima Corte */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold">
                Reporte: Fecha de Corte
              </span>
              <div className="space-y-2 pt-1 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Fecha de Corte:</label>
                    <input
                      type="date"
                      value={fechaAudiencia}
                      onChange={(e) => setFechaAudiencia(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Hora:</label>
                    <input
                      type="text"
                      placeholder="Ej: 09:00 AM"
                      value={horaAudiencia}
                      onChange={(e) => setHoraAudiencia(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs mt-0.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Ciudad y Tribunal:</label>
                  <input
                    type="text"
                    placeholder="Ej: Miami Immigration Court"
                    value={ciudadCorte}
                    onChange={(e) => setCiudadCorte(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Juez Asignado:</label>
                  <input
                    type="text"
                    placeholder="Ej: Juez Carrillo"
                    value={nombreJuez}
                    onChange={(e) => setNombreJuez(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs mt-0.5"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(respuestaCorte, 'resp-corte')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                {copiedKey === 'resp-corte' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar</span>
              </button>
              <button
                onClick={() => openWhatsApp(respuestaCorte)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>

          {/* Respuesta 2: Reloj de Asilo Listo */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                Reporte: Permiso de Trabajo Listo
              </span>
              <div className="space-y-2 pt-1 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400">Días Registrados en Reloj:</label>
                  <input
                    type="number"
                    value={diasReloj}
                    onChange={(e) => setDiasReloj(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs mt-0.5 font-mono"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                  Informa al cliente que superó los 150 días y ya puede solicitar legalmente su Formulario I-765 con Seguro Social.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(respuestaRelojAsilo, 'resp-reloj')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                {copiedKey === 'resp-reloj' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar</span>
              </button>
              <button
                onClick={() => openWhatsApp(respuestaRelojAsilo)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>

          {/* Respuesta 3: Trámite Demorado en USCIS */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold">
                Reporte: Caso USCIS Pendiente
              </span>
              <div className="space-y-2 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                  Tranquiliza al cliente informándole que su expediente sigue vigente en USCIS y propone la intervención formal del abogado para solicitar una revisión por demoras indebidas.
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(respuestaUSCISDemorado, 'resp-uscis')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                {copiedKey === 'resp-uscis' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar</span>
              </button>
              <button
                onClick={() => openWhatsApp(respuestaUSCISDemorado)}
                className="py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
