import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Copy, 
  CheckCircle2, 
  Mic, 
  Square, 
  Download, 
  FolderPlus, 
  FileAudio, 
  Upload, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import type { ClientLead, EstefaniaMessageRecord, MessageRecordStatus } from '../types';

interface EstefaniaAssistantProps {
  clients: ClientLead[];
  onSaveMessageToClient: (clientId: string, record: EstefaniaMessageRecord) => void;
  preselectedClientId?: string;
  initialMessageText?: string;
}

export const EstefaniaAssistant: React.FC<EstefaniaAssistantProps> = ({
  clients,
  onSaveMessageToClient,
  preselectedClientId,
  initialMessageText
}) => {
  // Client association
  const [selectedClientId, setSelectedClientId] = useState<string>(preselectedClientId || '');

  // Step A: Input text
  const [mensajeCliente, setMensajeCliente] = useState(initialMessageText || '');
  const [intencionFrancisco, setIntencionFrancisco] = useState('');

  // Generated results
  const [respuestaGenerada, setRespuestaGenerada] = useState('');
  const [guionAudioGenerado, setGuionAudioGenerado] = useState('');
  const [copiedType, setCopiedType] = useState<'text' | 'audio' | null>(null);

  // Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);

  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Local history of generated messages during session
  const [historialSesion, setHistorialSesion] = useState<EstefaniaMessageRecord[]>([]);

  useEffect(() => {
    if (initialMessageText) {
      setMensajeCliente(initialMessageText);
    }
    if (preselectedClientId) {
      setSelectedClientId(preselectedClientId);
    }
  }, [initialMessageText, preselectedClientId]);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Quick prompt buttons to assist Francisco
  const applyQuickIntention = (tipo: string) => {
    switch (tipo) {
      case 'pedir_documento':
        setIntencionFrancisco('Pedirle amablemente que nos comparta foto o copia clara del documento o citatorio que recibió para poder orientarle.');
        break;
      case 'primera_orientacion':
        setIntencionFrancisco('Saludar cordialmente, agradecer su mensaje y preguntarle en qué fecha ingresó al país y cuál es su situación actual.');
        break;
      case 'recordatorio_corte':
        setIntencionFrancisco('Recordarle que es de vital importancia no faltar a ninguna fecha citada y consultar con anticipación.');
        break;
      case 'caso_complejo':
        setIntencionFrancisco('Indicar con honestidad que este asunto requiere una revisión jurídica detallada con un abogado de inmigración calificado.');
        break;
    }
  };

  // Generate compliant, safe, natural Spanish response
  const handleGenerarRespuesta = () => {
    const input = mensajeCliente.toLowerCase();
    const intention = intencionFrancisco.trim();
    const nombreCliente = selectedClient ? selectedClient.nombre.split(' ')[0] : 'Estimado/a';

    let base = '';
    let preguntaFaltante = '';

    // Analyze topics prudently without promising outcomes or inventing laws
    if (input.includes('corte') || input.includes('juez') || input.includes('nta') || input.includes('papel') || input.includes('hoja')) {
      base = `Hola ${nombreCliente}, gracias por escribirnos. Con respecto al documento o notificación que menciona, es muy importante atenderlo con puntualidad, ya que no presentarse a una fecha citada puede acarrear consecuencias migratorias desfavorables.`;
      preguntaFaltante = '¿Podría confirmarnos qué fecha exacta figura en su documento o compartirnos una fotografía clara del encabezado para verificar su estado?';
    } else if (input.includes('fianza') || input.includes('detenido') || input.includes('preso') || input.includes('ice') || input.includes('cárcel')) {
      base = `Hola ${nombreCliente}, entendemos la preocupación por la situación de su familiar. En temas de detención migratoria, la posibilidad de una fianza depende de varios factores particulares de cada caso y requiere evaluación especializada.`;
      preguntaFaltante = '¿Cuenta con el número de registro extranjero (Número A de 9 dígitos) o sabe en qué centro de procesamiento se encuentra?';
    } else if (input.includes('permiso') || input.includes('trabajo') || input.includes('social') || input.includes('ead')) {
      base = `Hola ${nombreCliente}, con gusto le orientamos. El permiso de trabajo no se otorga por sí solo; generalmente está vinculado a una solicitud principal en trámite (como asilo, TPS, petición familiar u otro proceso).`;
      preguntaFaltante = '¿Usted ya tiene alguna solicitud migratoria presentada formalmente ante el gobierno, o está por comenzar su trámite inicial?';
    } else if (input.includes('asilo') || input.includes('miedo') || input.includes('frontera')) {
      base = `Hola ${nombreCliente}, gracias por su confianza. En los casos de asilo es fundamental tener presente el tiempo transcurrido desde el ingreso a Estados Unidos y las razones de su solicitud.`;
      preguntaFaltante = '¿Nos podría indicar en qué fecha aproximada ingresó al país y si ingresó con alguna cita previa o inspección?';
    } else {
      base = `Hola ${nombreCliente}, le agradecemos su mensaje. Para brindarle una orientación clara y adecuada a su situación particular:`;
      preguntaFaltante = '¿Podría detallarnos brevemente cuál es el trámite o la duda principal que desea atender en este momento?';
    }

    // Append custom intention if provided by Francisco
    let complement = '';
    if (intention) {
      complement = `\n\nPor nuestra parte: ${intention}`;
    }

    // Safety legal disclaimer note (Rule compliance: no false promises, advises attorney review when needed)
    const cierrePrudente = '\n\nTenga en cuenta que esta orientación es informativa. Cualquier caso específico debe ser analizado a profundidad para revisar los requisitos aplicables. Quedamos atentos a su respuesta.';

    const finalResponse = `${base} ${preguntaFaltante}${complement}${cierrePrudente}`;
    setRespuestaGenerada(finalResponse);

    // Auto-create initial audio script version
    const audioScript = `Hola ${nombreCliente}, te saluda el equipo de atención migratoria de Licenciado David Antony Carrillo. Con respecto a lo que nos comentas: es muy importante revisar los detalles de tu situación. ${preguntaFaltante} Por favor compártenos ese dato por aquí cuando tengas un momento, para poder darte la orientación correcta. Que tengas un buen día.`;
    setGuionAudioGenerado(audioScript);
  };

  // Convert response to audio script
  const handlePrepararAudio = () => {
    if (!respuestaGenerada) {
      handleGenerarRespuesta();
      return;
    }
    const nombreCliente = selectedClient ? selectedClient.nombre.split(' ')[0] : '';
    const script = `Hola ${nombreCliente || 'amigo/a'}, te envío esta breve nota de voz para responder a tu mensaje. Queremos apoyarte con tu consulta migratoria con total claridad. Para poder indicarte bien el camino a seguir, necesitamos confirmar un detalle: ¿podrías enviarnos la fecha exacta o una foto del documento del que nos hablas? Quedamos muy atentos a tu mensaje para continuar. Un saludo cordial.`;
    setGuionAudioGenerado(script);
  };

  // Copy helper
  const handleCopy = (text: string, type: 'text' | 'audio') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);

    // If associated to a client, update status to 'copiado'
    if (selectedClient) {
      const record: EstefaniaMessageRecord = {
        id: `EST-${Date.now().toString().slice(-4)}`,
        clientId: selectedClient.id,
        clientExpediente: selectedClient.numeroExpediente,
        clientNombre: selectedClient.nombre,
        fechaHora: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        mensajeRecibido: mensajeCliente || undefined,
        intencionRespuesta: intencionFrancisco || undefined,
        respuestaSugerida: respuestaGenerada,
        guionAudio: guionAudioGenerado || undefined,
        estado: 'copiado'
      };
      onSaveMessageToClient(selectedClient.id, record);
      setHistorialSesion(prev => [record, ...prev]);
    }
  };

  // Manual confirmation: Francisco confirms it was actually sent
  const handleConfirmarEnviado = (recordId: string) => {
    setHistorialSesion(prev => prev.map(rec => rec.id === recordId ? { ...rec, estado: 'enviado_confirmado' } : rec));
    if (selectedClient && selectedClient.historialMensajesEstefania) {
      const updatedList = selectedClient.historialMensajesEstefania.map(rec => rec.id === recordId ? { ...rec, estado: 'enviado_confirmado' as MessageRecordStatus } : rec);
      selectedClient.historialMensajesEstefania = updatedList;
    }
  };

  // Audio Recording (Browser native getUserMedia + MediaRecorder, zero cost)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('No se pudo acceder al micrófono. Verifique los permisos de su navegador para grabar audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  // File upload for existing audio
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedAudioUrl(url);
    }
  };

  const activeAudioUrl = recordedAudioUrl || uploadedAudioUrl;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Módulo de Atención Telefónica y Mensajería</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Estefanía — Asistente de Atención
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Herramienta sencilla para ayudar a Licenciado David Antony Carrillo a redactar respuestas de WhatsApp profesionales, amables y prudentes, y transformar textos en guiones de audio listos para grabar.
            </p>
          </div>

          {/* Client Selector (Section C) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 min-w-[280px]">
            <label className="text-[11px] font-semibold text-slate-400 block flex items-center justify-between">
              <span>Asociar a un Expediente:</span>
              {selectedClient && (
                <span className="text-amber-400 font-mono text-[10px] font-bold">
                  {selectedClient.numeroExpediente}
                </span>
              )}
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
            >
              <option value="">(Sin asociar — Consulta libre)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroExpediente} • {c.nombre} ({c.paisOrigen})
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>WhatsApp: {selectedClient.whatsapp || selectedClient.telefono}</span>
                <span className="text-emerald-400">Expediente Activo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Section A (Text Response) and Section B (Audio Script) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Section A - Preparar Respuesta de WhatsApp */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-card rounded-2xl p-5 sm:p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h2 className="font-serif text-lg font-bold text-white">
                  A. Preparar Respuesta de WhatsApp
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Paso 1: Mensaje Escrito
              </span>
            </div>

            {/* Input 1: Client Message */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                1. Mensaje recibido del cliente (Pegar texto):
              </label>
              <textarea
                rows={3}
                placeholder="Ej. 'Hola buenas tardes, me dieron una cita para la corte de inmigración el próximo mes pero no tengo abogado, ¿qué tengo que hacer?'"
                value={mensajeCliente}
                onChange={(e) => setMensajeCliente(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Quick Intentions */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">
                Atajos de intención rápida:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'pedir_documento', label: 'Pedir documento / foto' },
                  { id: 'primera_orientacion', label: 'Orientación inicial' },
                  { id: 'recordatorio_corte', label: 'No faltar a cita' },
                  { id: 'caso_complejo', label: 'Requiere revisión legal' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => applyQuickIntention(opt.id)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                  >
                    + {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Francisco's desired response */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                2. ¿Qué desea responder o enfatizar Francisco? (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. 'Pedirle que nos mande foto de la hoja de corte y recordarle que no falte'"
                value={intencionFrancisco}
                onChange={(e) => setIntencionFrancisco(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerarRespuesta}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-300/40 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Generar Respuesta con Estefanía</span>
            </button>

            {/* Result Box */}
            {respuestaGenerada && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                    Respuesta Sugerida por Estefanía:
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {respuestaGenerada.length} caracteres
                  </span>
                </div>

                <textarea
                  rows={6}
                  value={respuestaGenerada}
                  onChange={(e) => setRespuestaGenerada(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200 outline-none leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(respuestaGenerada, 'text')}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 border border-amber-500/40 transition cursor-pointer"
                  >
                    {copiedType === 'text' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">¡Respuesta Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Respuesta</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrepararAudio}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Preparar Audio →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Section B - Preparar Guion de Audio y Grabación */}
        <div className="lg:col-span-6 space-y-5">
          <div className="glass-card rounded-2xl p-5 sm:p-6 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-400" />
                <h2 className="font-serif text-lg font-bold text-white">
                  B. Preparar Audio para el Cliente
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Paso 2: Nota de Voz
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Estefanía adapta la respuesta a un guion conversacional y cercano, listo para ser leído o grabado en nota de voz humana.
            </p>

            {/* Audio Script Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Guion de Audio (Listo para ElevenLabs):
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium">
                  Compatible con ElevenLabs
                </span>
              </div>
              <textarea
                rows={4}
                placeholder="El guion adaptado para leer o grabar aparecerá aquí..."
                value={guionAudioGenerado}
                onChange={(e) => setGuionAudioGenerado(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* Copy Script Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleCopy(guionAudioGenerado, 'audio')}
                disabled={!guionAudioGenerado}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                {copiedType === 'audio' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Guion Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Guion para ElevenLabs</span>
                  </>
                )}
              </button>
            </div>

            {/* Recorder and File Management (Native browser - Zero external cost) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <FileAudio className="w-4 h-4 text-emerald-400" />
                  Grabación y Descarga de Audio
                </span>
                <span className="text-[10px] text-slate-400">Micrófono Local</span>
              </div>

              {/* Record / Stop Button */}
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Grabar Nota de Voz</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition animate-pulse cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Detener Grabación ({recordingSeconds}s)</span>
                  </button>
                )}

                {/* Upload audio button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
                  title="Cargar archivo de audio grabado previamente"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>

              {/* Player and Download if Audio exists */}
              {activeAudioUrl && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-300 font-semibold block">
                    Reproducción previa del audio:
                  </span>
                  <audio
                    src={activeAudioUrl}
                    controls
                    className="w-full h-8 outline-none"
                  />
                  <div className="flex justify-end pt-1">
                    <a
                      href={activeAudioUrl}
                      download={`nota_voz_${selectedClient?.numeroExpediente || 'cliente'}.webm`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Archivo de Audio</span>
                    </a>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-500 leading-relaxed">
                ℹ️ Esta función graba directamente mediante el micrófono de su navegador y guarda el archivo en su dispositivo sin costos ni suscripciones a servicios externos de voz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section C: Historial de la Sesión / Guardado en Expediente */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif text-base font-bold text-white">
              C. Registro e Historial de Respuestas de Estefanía
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {historialSesion.length} registro(s) generados en esta sesión
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Los mensajes copiados se guardan como borradores o registro histórico. Conforme a las reglas del despacho: <strong>copiar una respuesta no la envía automáticamente</strong>. Francisco debe confirmar manualmente cuando el mensaje o audio haya sido despachado al cliente.
        </p>

        {historialSesion.length > 0 ? (
          <div className="space-y-3">
            {historialSesion.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold">
                      {rec.clientExpediente || 'Sin Expediente'}
                    </span>
                    <span className="font-semibold text-white">
                      {rec.clientNombre || 'Cliente General'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {rec.fechaHora}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.estado === 'enviado_confirmado'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : rec.estado === 'copiado'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rec.estado === 'enviado_confirmado' ? '✓ Enviado Confirmado' : rec.estado === 'copiado' ? 'Copiado al Portapapeles' : 'Borrador'}
                    </span>
                  </div>

                  <p className="text-slate-300 line-clamp-2 italic">
                    "{rec.respuestaSugerida}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rec.estado !== 'enviado_confirmado' ? (
                    <button
                      type="button"
                      onClick={() => handleConfirmarEnviado(rec.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar como Enviado</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmado por Francisco</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500 text-xs rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
            Aún no se han generado respuestas en esta sesión. Escriba un mensaje arriba para comenzar.
          </div>
        )}
      </div>

      {/* Safety & Ethics Card for Legal Prudence */}
      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 block mb-0.5">Directrices de Prudencia Legal de Estefanía:</strong>
          La asistente nunca promete aprobaciones de visas, residencia, permisos ni fianzas, no inventa plazos, y recuerda al cliente que todo trámite delicado debe ser evaluado directamente por un profesional autorizado de inmigración.
        </div>
      </div>
    </div>
  );
};
