import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Plus, 
  Stethoscope, 
  Fingerprint, 
  Scale, 
  ShieldCheck,
  Upload,
  Music,
  Download
} from 'lucide-react';
import { ASSISTANT_AUDIOS } from '../data/initialData';
import type { AssistantAudioTemplate } from '../types';
import { sendWhatsAppMessage } from '../utils/speech';

export const AsistenteVirtualAudios: React.FC = () => {
  const [templates, setTemplates] = useState<AssistantAudioTemplate[]>(ASSISTANT_AUDIOS);
  const [audioFiles, setAudioFiles] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Custom Audio Script Generator
  const [customTitle, setCustomTitle] = useState('');
  const [customClientName, setCustomClientName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customScript, setCustomScript] = useState(
    'Estimado cliente, le saluda la asistente legal del Licenciado David Antony Carrillo. Nos comunicamos para recordarle que su próxima comparecencia está programada y es fundamental que tengamos listos todos sus documentos. Por favor, comuníquese con nosotros ante cualquier inquietud.'
  );
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const handleCopyScriptForElevenLabs = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioFiles(prev => ({ ...prev, [id]: url }));
    }
  };

  const handleAddCustomTemplate = () => {
    if (!customTitle || !customScript) return;
    const newTemplate: AssistantAudioTemplate = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      titulo: customTitle,
      subtitulo: customClientName ? `Para: ${customClientName}` : 'Plantilla personalizada',
      categoria: 'urgente',
      icono: 'Bot',
      duracionEstimada: '0:30 min',
      guionVoz: customScript,
      mensajeWhatsApp: `⚖️ *Aviso del Despacho Legal del Licenciado David Antony Carrillo*\n\n${customScript}`,
      audioFileUrl: customAudioUrl || undefined
    };
    setTemplates([newTemplate, ...templates]);
    setCustomTitle('');
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'examen_medico':
        return <Stethoscope className="w-5 h-5 text-emerald-400" />;
      case 'biometricos':
        return <Fingerprint className="w-5 h-5 text-blue-400" />;
      case 'corte_juez':
        return <Scale className="w-5 h-5 text-amber-400" />;
      case 'fianza_ice':
        return <ShieldCheck className="w-5 h-5 text-red-400" />;
      default:
        return <Bot className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card-gold rounded-2xl p-6 border-amber-500/30 relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Locuciones Profesionales • Preparado para ElevenLabs</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Guiones y Audios Humanizados de la Asistente
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Para garantizar una atención de máxima calidez humana y profesionalismo, los audios se generan con voces hiperrealistas en ElevenLabs. Copia los guiones legales, genera los audios y sube aquí los archivos MP3 para reproducirlos con calidad de estudio.
        </p>
      </div>

      {/* ElevenLabs Status Info Strip */}
      <div className="glass-card rounded-2xl p-4 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-950/40">
            EL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Estudio de Voz ElevenLabs</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                Voz Humana de Alta Fidelidad
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Voces naturales, empáticas y fluidas para el Bufete del Licenciado David Antony Carrillo
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Sin voces sintéticas robóticas • Reproducción de audio real</span>
        </div>
      </div>

      {/* Main Grid: Audio Templates Library & Custom Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Pre-recorded Audio Templates */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-400" />
            <span>Plantillas de Guiones para ElevenLabs</span>
          </h3>

          <div className="space-y-4">
            {templates.map((tpl) => {
              const currentAudioUrl = audioFiles[tpl.id] || tpl.audioFileUrl;
              return (
                <div
                  key={tpl.id}
                  className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 mt-0.5">
                        {getCategoryIcon(tpl.categoria)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {tpl.titulo}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {tpl.subtitulo} • Duración estimada: ~{tpl.duracionEstimada}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {currentAudioUrl ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Audio Listo
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-medium">
                          Pendiente MP3
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Audio Script Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <span>Guion de Voz:</span>
                    </div>
                    "{tpl.guionVoz}"
                  </div>

                  {/* Real Audio Player (if uploaded from ElevenLabs) */}
                  {currentAudioUrl && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Music className="w-3.5 h-3.5" />
                          Locución de Estudio (ElevenLabs):
                        </span>
                        <a
                          href={currentAudioUrl}
                          download={`${tpl.id}_elevenlabs.mp3`}
                          className="text-slate-400 hover:text-white flex items-center gap-1 underline"
                        >
                          <Download className="w-3 h-3" />
                          Descargar MP3
                        </a>
                      </div>
                      <audio
                        src={currentAudioUrl}
                        controls
                        className="w-full h-8 outline-none"
                      />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      {/* Button 1: Copy script for ElevenLabs */}
                      <button
                        onClick={() => handleCopyScriptForElevenLabs(tpl.id, tpl.guionVoz)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                          copiedId === tpl.id
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/40'
                        }`}
                        title="Copiar guion al portapapeles para pegarlo en ElevenLabs"
                      >
                        {copiedId === tpl.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>¡Guion Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar para ElevenLabs</span>
                          </>
                        )}
                      </button>

                      {/* Button 2: Upload ElevenLabs Audio File */}
                      <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-blue-400" />
                        <span>{currentAudioUrl ? 'Reemplazar MP3' : 'Subir Audio MP3'}</span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(tpl.id, e)}
                        />
                      </label>
                    </div>

                    {/* Button 3: Send text to WhatsApp */}
                    <button
                      onClick={() => sendWhatsAppMessage('', tpl.mensajeWhatsApp)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-medium flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Custom Voice Message Creator for ElevenLabs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4 sticky top-24">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-serif text-lg font-bold text-white">
                Crear Nuevo Guion para ElevenLabs
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Redacta un mensaje personalizado para un cliente. Podrás copiarlo a ElevenLabs para generar el audio con voz humana y guardarlo como plantilla permanente.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Título del Mensaje
                </label>
                <input
                  type="text"
                  placeholder="Ej. Recordatorio de cita médica mañana"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Roberto Martínez"
                    value={customClientName}
                    onChange={(e) => setCustomClientName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    WhatsApp del Cliente
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 832..."
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Guion de Voz (Texto para ElevenLabs):
                </label>
                <textarea
                  rows={5}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              {/* Upload audio for custom script */}
              {customAudioUrl && (
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-1">
                  <span className="text-[10px] text-purple-300 font-semibold block">Audio ElevenLabs Asignado:</span>
                  <audio src={customAudioUrl} controls className="w-full h-8 outline-none" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyScriptForElevenLabs('custom', customScript)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition cursor-pointer ${
                  copiedId === 'custom'
                    ? 'bg-purple-600 text-white border-purple-400'
                    : 'bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border-purple-500/40'
                }`}
              >
                {copiedId === 'custom' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>¡Guion Copiado para ElevenLabs!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Guion para ElevenLabs</span>
                  </>
                )}
              </button>

              <label className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>{customAudioUrl ? 'Cambiar Archivo MP3' : 'Cargar Audio Generado (MP3/WAV)'}</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCustomAudioUrl(URL.createObjectURL(f));
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  const finalMsg = `⚖️ *Aviso del Despacho Legal del Licenciado David Antony Carrillo*\n\n${customScript}`;
                  sendWhatsAppMessage(customPhone, finalMsg);
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar este Mensaje a WhatsApp</span>
              </button>

              {customTitle && (
                <button
                  type="button"
                  onClick={handleAddCustomTemplate}
                  className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-dashed border-slate-700 hover:border-slate-500 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Guardar como Plantilla Permanente</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
