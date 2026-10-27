import React, { useState } from 'react';
import { 
  Stethoscope, 
  Fingerprint, 
  Copy, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ShieldCheck, 
  FileCheck2
} from 'lucide-react';
import { TRAMITES_PREVIOS_INFO } from '../data/initialData';
import { sendWhatsAppMessage } from '../utils/speech';

export const TramitesPreviosGuia: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [targetPhone, setTargetPhone] = useState('');
  const [clientName, setClientName] = useState('');

  const medicalMsg = `🩺 *INSTRUCCIONES OFICIALES: EXAMEN MÉDICO CIVIL (I-693)*
*Bufete de Abogados David Antony Carrillo*

Estimado/a ${clientName || 'cliente'},

Para que avancemos con su trámite migratorio, usted debe realizar su examen médico con un Cirujano Civil autorizado por USCIS:

1️⃣ *Dónde ir:* Ingrese al enlace oficial del gobierno para buscar un médico en su código postal:
🔗 https://my.uscis.gov/findadoctor

2️⃣ *Qué llevar:*
• Su pasaporte vigente
• Cartilla o comprobante de vacunas anteriores
• Documento de identidad

3️⃣ *REGLA DE ORO DE USCIS:* 
El médico le entregará un sobre **SELLADO**. ⚠️ *NO LO ABRA*. Si el sello se rompe, USCIS lo anula automáticamente y perderá su dinero.

Al tener el sobre sellado en mano, contáctenos para adjuntarlo formalmente a su expediente legal.`;

  const bioMsg = `👆 *INSTRUCCIONES OFICIALES: TOMA DE BIOMÉTRICOS (ASC)*
*Bufete de Abogados David Antony Carrillo*

Estimado/a ${clientName || 'cliente'},

Le enviamos las pautas para su cita de huellas y fotografía en el Centro de Asistencia de Solicitudes (ASC) de USCIS:

1️⃣ *Documentos obligatorios para ingresar:*
• Notificación de Cita Original (Formulario I-797C)
• Su Pasaporte vigente o documento con fotografía emitido por el gobierno

2️⃣ *Hora de llegada:*
Llegue con 15 minutos de anticipación. No ingrese con cámaras fotográficas, armas ni acompañantes innecesarios.

3️⃣ *Comprobante sellado:*
Al finalizar la toma de huellas, asegúrese de que el oficial le estampe el **SELLO OFICIAL** en su hoja de cita.

📸 *Tome una foto clara del comprobante sellado y envíenosla por este medio* para certificar ante el Juez o USCIS que su trámite fue cumplido.`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Fase Previa: Responsabilidad Directa del Solicitante</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Trámites Previos: Examen Médico y Datos Biométricos
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Tal como le explicamos al cliente: <em>"Usted se encarga de realizar su examen médico oficial y su toma de huellas; nosotros en el bufete nos encargamos de todo el litigio, la defensa en corte y la fianza"</em>. Aquí tienes las guías exactas y los mensajes listos para enviar por WhatsApp.
        </p>
      </div>

      {/* Quick WhatsApp Dispatcher */}
      <div className="glass-card rounded-2xl p-5 border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 to-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-4 h-4" />
            Enviar Instrucciones a un Cliente por WhatsApp
          </span>
          <span className="text-[11px] text-slate-400">
            Personaliza el nombre y envía con 1 clic
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nombre del Cliente (ej. Carlos Mendoza)"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
          />
          <input
            type="tel"
            placeholder="Número de WhatsApp (ej. +1 786 555 1234)"
            value={targetPhone}
            onChange={(e) => setTargetPhone(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Two Main Cards: Medical Exam vs Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODULE 1: EXAMEN MEDICO I-693 */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Examen Médico Civil (I-693)
                </h3>
                <span className="text-[11px] text-slate-400">
                  Formulario obligatorio para USCIS y Cortes
                </span>
              </div>
            </div>

            <a
              href="https://my.uscis.gov/findadoctor"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <span>Buscar Médico</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {TRAMITES_PREVIOS_INFO.examenMedico.descripcion}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Pasos que debe seguir el cliente:
            </h4>
            <div className="space-y-2">
              {TRAMITES_PREVIOS_INFO.examenMedico.pasosCliente.map((paso, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{paso}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Alerta al Cliente:</strong> El costo aproximado oscila entre $250 y $450 USD pagados directamente al centro médico. Recuerda advertirle que NUNCA abra el sobre con sello lacrado.
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleCopy(medicalMsg, 'medical')}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              {copiedType === 'medical' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion Médico</span>
                </>
              )}
            </button>

            <button
              onClick={() => sendWhatsAppMessage(targetPhone, medicalMsg)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
        </div>

        {/* MODULE 2: BIOMETRICOS (ASC) */}
        <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  Toma Biométrica (Huellas & Foto)
                </h3>
                <span className="text-[11px] text-slate-400">
                  Application Support Center (ASC - USCIS)
                </span>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-bold uppercase">
              Cita Obligatoria
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {TRAMITES_PREVIOS_INFO.biometricos.descripcion}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Pasos para la cita de Biométricos:
            </h4>
            <div className="space-y-2">
              {TRAMITES_PREVIOS_INFO.biometricos.pasosCliente.map((paso, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span>{paso}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-2 text-xs text-blue-200">
            <FileCheck2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong>Comprobante Sellado:</strong> Si el cliente no se presenta a esta cita, USCIS o el Juez considerarán la solicitud como abandonada y emitirán orden de deportación en ausencia.
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleCopy(bioMsg, 'bio')}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              {copiedType === 'bio' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guion Biométrico</span>
                </>
              )}
            </button>

            <button
              onClick={() => sendWhatsAppMessage(targetPhone, bioMsg)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
