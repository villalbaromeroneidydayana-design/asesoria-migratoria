import React, { useState } from 'react';
import { 
  PhoneCall, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Shield, 
  UserCheck, 
  HeartHandshake, 
  FileText, 
  Scale, 
  Copy, 
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import type { ClientLead, EntryMethod, CriminalRecord } from '../types';
import { INTAKE_STEPS } from '../data/initialData';
import { sendWhatsAppMessage } from '../utils/speech';

interface CallIntakeWizardProps {
  onSaveLead: (lead: ClientLead) => void;
  onNavigateToClients: () => void;
}

export const CallIntakeWizard: React.FC<CallIntakeWizardProps> = ({
  onSaveLead,
  onNavigateToClients
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [copiedQuestion, setCopiedQuestion] = useState(false);

  // Form State
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('Honduras');
  const [formaEntrada, setFormaEntrada] = useState<EntryMethod>('frontera_sin_inspeccion');
  const [tiempoEnEEUU, setTiempoEnEEUU] = useState('< 1 año');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [record, setRecord] = useState<CriminalRecord>('ninguno');
  const [tieneNumeroA, setTieneNumeroA] = useState(false);
  const [numeroA, setNumeroA] = useState('');
  const [tieneCorte, setTieneCorte] = useState(false);
  const [fechaCorte, setFechaCorte] = useState('');
  const [ciudadCorte, setCiudadCorte] = useState('');
  const [juezNombre, setJuezNombre] = useState('');
  const [estaDetenido, setEstaDetenido] = useState(false);
  const [centroDetencion, setCentroDetencion] = useState('');
  const [tieneFamiliarEstatus, setTieneFamiliarEstatus] = useState(false);
  const [parentescoFamiliar, setParentescoFamiliar] = useState<'conyuge_ciudadano' | 'hijo_ciudadano_21' | 'padre_ciudadano' | 'residente_permanente' | 'ninguno'>('ninguno');
  const [notasAdicionales, setNotasAdicionales] = useState('');
  const [leadSaved, setLeadSaved] = useState(false);

  const currentStep = INTAKE_STEPS[currentStepIndex];

  // Real-time legal diagnosis logic
  const calculateDiagnosis = () => {
    if (estaDetenido) {
      return {
        via: 'Moción Urgente de Fianza ante Juez (Bond Hearing) + Asilo Defensivo',
        probabilidad: 'media' as const,
        prioridad: 'Crítica / Emergencia (Persona Detenida)',
        explicacion: 'El cliente o familiar está bajo custodia de ICE. Se debe solicitar redeterminación de fianza ante el Juez de Inmigración demostrando que no es un riesgo de fuga ni peligro público.',
        montoEstimadoFianza: 5000,
        acciones: [
          'Localizar el Centro de Detención y verificar el Número A del detenido.',
          'Identificar a un familiar ciudadano o residente legal que sirva de Fiador (Obligor).',
          'Presentar Moción de Fianza ante la Corte de Inmigración (EOIR).',
          'Preparar el pago oficial al Juez o ICE a través de CeBONDS.'
        ]
      };
    }

    if (tieneFamiliarEstatus && (parentescoFamiliar === 'conyuge_ciudadano' || parentescoFamiliar === 'hijo_ciudadano_21')) {
      if (formaEntrada === 'visa' || formaEntrada === 'parole') {
        return {
          via: 'Ajuste de Estatus Directo (Formulario I-130 / I-485 - Residencia Legal)',
          probabilidad: 'alta' as const,
          prioridad: 'Vía Verde (Alta Viabilidad)',
          explicacion: 'Excelente perfil. Entró con inspección legal (visa o parole) y tiene familiar inmediato ciudadano. Puede obtener permiso de trabajo en 4-6 meses y Green Card directa.',
          montoEstimadoFianza: 0,
          acciones: [
            'Examen Médico Oficial (Formulario I-693) con Cirujano Civil de USCIS.',
            'Cita de huellas y fotografía (Biométricos).',
            'Presentar paquete concurrente I-130 / I-485 / I-765.'
          ]
        };
      } else {
        return {
          via: 'Petición Familiar I-130 + Perdón Provisional por Presencia Ilegal (I-601A)',
          probabilidad: 'media' as const,
          prioridad: 'Proceso con Perdón',
          explicacion: 'Al haber entrado sin inspección, requiere perdón I-601A demostrando sufrimiento extremo a su familiar calificado antes del trámite consular.',
          montoEstimadoFianza: 0,
          acciones: [
            'Radicar petición I-130.',
            'Recopilar pruebas médicas/psicológicas para el perdón I-601A.',
            'Monitorear fecha de prioridad.'
          ]
        };
      }
    }

    if (tiempoEnEEUU === '< 1 año') {
      return {
        via: 'Asilo Político / Defensivo (Cumple con la Regla del Año - INA § 208)',
        probabilidad: record === 'ninguno' ? ('alta' as const) : ('media' as const),
        prioridad: 'Plazo Perentorio (1 Año)',
        explicacion: 'El cliente tiene derecho a radicar solicitud de asilo (Formulario I-589) antes de cumplir los 12 meses de ingreso al país. Debe acreditar miedo creíble o persecución.',
        montoEstimadoFianza: tieneCorte ? 3500 : 0,
        acciones: [
          'Radicar I-589 de inmediato para detener el reloj de deportación.',
          'Acudir a la cita de Biométricos obligatoria de USCIS/Corte.',
          'Solicitar Permiso de Trabajo (I-765 C8) a los 150 días de radicado el asilo.'
        ]
      };
    }

    if (tiempoEnEEUU === '> 10 años' && record === 'ninguno') {
      return {
        via: 'Cancelación de Remoción para No Residentes (Formulario EOIR-42B)',
        probabilidad: 'media' as const,
        prioridad: 'Defensa en Corte',
        explicacion: 'Más de 10 años de presencia física continua, buen carácter moral (sin antecedentes) y familiares que sufrirían dificultad excepcional y extremadamente inusual.',
        montoEstimadoFianza: 0,
        acciones: [
          'Reunir 10 años de declaraciones de impuestos (ITIN o W2).',
          'Pruebas de lazos familiares y registros médicos de hijos ciudadanos.',
          'Preparar comparecencia ante el Juez de Inmigración.'
        ]
      };
    }

    return {
      via: 'Evaluación de Alivio Humanitario / Salida Voluntaria / Regularización',
      probabilidad: 'requiere_analisis_profundo' as const,
      prioridad: 'Análisis Complejo',
      explicacion: 'Caso que requiere revisión de récord migratorio con FOIA (Freedom of Information Act) para determinar si existen órdenes de deportación previas.',
      montoEstimadoFianza: tieneCorte ? 5000 : 0,
      acciones: [
        'Solicitar récord migratorio completo vía FOIA ante CBP y USCIS.',
        'Verificar estatus en el tribunal telefónico 1-800-898-7180.',
        'Cita médica preliminar y preparación de expediente.'
      ]
    };
  };

  const diagnosis = calculateDiagnosis();

  const handleSaveLead = () => {
    const newLead: ClientLead = {
      id: `CLI-${Date.now().toString().slice(-4)}`,
      numeroExpediente: `EXP-2024-${Date.now().toString().slice(-3)}`,
      fechaRegistro: new Date().toISOString().split('T')[0],
      horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nombre: nombre || 'Prospecto sin nombre',
      telefono: telefono || '+1 (000) 000-0000',
      whatsapp: telefono || '+1 (000) 000-0000',
      paisOrigen,
      estadoResidenciaEEUU: 'EE.UU.',
      idiomaPreferido: 'Español',
      fuenteContacto: 'whatsapp',
      tramiteSolicitado: diagnosis.via,
      observacionesIniciales: notasAdicionales || 'Evaluación realizada en vivo con el Licenciado David Antony Carrillo',
      responsable: 'Licenciado David Antony Carrillo',
      estadoContacto: 'llamada_realizada',
      estadoDocumentos: 'esperando_documentos',
      estadoEvaluacion: 'completada',
      estadoCaso: 'activo',
      esSeguimientoHoy: true,
      llamadasRealizadasCount: 1,
      llamadasSinRespuestaCount: 0,
      fechaIngreso: fechaIngreso || new Date().toISOString().split('T')[0],
      formaEntrada,
      tiempoEnEEUU,
      record,
      tieneNumeroA,
      numeroA: tieneNumeroA ? numeroA : undefined,
      tieneCorte,
      fechaCorte: tieneCorte ? fechaCorte : undefined,
      ciudadCorte: tieneCorte ? ciudadCorte : undefined,
      juezNombre: tieneCorte ? juezNombre : undefined,
      estaDetenido,
      centroDetencion: estaDetenido ? centroDetencion : undefined,
      montoFianzaSugerido: diagnosis.montoEstimadoFianza,
      fianzaPagada: false,
      examenMedicoStatus: 'pendiente',
      biometricosStatus: 'pendiente',
      tieneFamiliarEstatus,
      parentescoFamiliar,
      viaMigratoriaSugerida: diagnosis.via,
      probabilidadExito: diagnosis.probabilidad,
      notasCaso: notasAdicionales || diagnosis.explicacion,
      status: estaDetenido ? 'detenido_fianza' : tieneCorte ? 'en_corte' : 'calificado',
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimaLlamada: 'Hoy (Intake telefónico)'
    };

    onSaveLead(newLead);
    setLeadSaved(true);
  };

  const handleOpenWhatsApp = () => {
    const text = `Hola ${nombre || 'amigo/a'}, le saluda el Licenciado David Antony Carrillo del Bufete de Asesoría Migratoria. Ha sido un gusto hablar con usted sobre su caso migratorio. Le confirmo que ya aperturamos su expediente preliminar para iniciar su estrategia legal (${diagnosis.via}). Quedo atento a su respuesta para coordinar sus trámites previos. ¡Un cordial saludo!`;
    sendWhatsAppMessage(telefono, text);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 border-amber-500/20 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>Protocolo de Calificación y Abordaje en Vivo</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Guía Interactiva de Llamada por WhatsApp
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Cuando recibas un número de WhatsApp, sigue este guion paso a paso. Haz las preguntas clave para calificar la situación legal del cliente y obtener su compromiso con el examen médico y biométricos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setNombre('');
                setTelefono('');
                setLeadSaved(false);
                setCurrentStepIndex(0);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Formulario</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: The Interactive Script (Steps 1 to 8) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Client Contact Strip */}
          <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Datos del Prospecto que Estás Llamando</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900/90 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Número de WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+1 (xxx) xxx-xxxx"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900/90 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">País de Origen</label>
                <select
                  value={paisOrigen}
                  onChange={(e) => setPaisOrigen(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900/90 border border-slate-700 focus:border-amber-500 text-white outline-none"
                >
                  <option value="Honduras">Honduras</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Colombia">Colombia</option>
                  <option value="México">México</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Perú">Perú</option>
                  <option value="Otro">Otro país</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stepper Navigator */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
            {INTAKE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  currentStepIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                  {step.id}
                </span>
                <span className="hidden sm:inline">{step.fase}</span>
              </button>
            ))}
          </div>

          {/* ACTIVE STEP CARD: What to say during the call */}
          <div className="glass-card-gold rounded-2xl p-6 relative border-amber-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Fase {currentStep.id} de {INTAKE_STEPS.length} • {currentStep.fase}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  {currentStep.titulo}
                </h2>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentStep.quePreguntar);
                  setCopiedQuestion(true);
                  setTimeout(() => setCopiedQuestion(false), 2500);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  copiedQuestion
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Copiar pregunta exacta de la llamada para leerla o prepararla"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedQuestion ? '¡Pregunta Copiada!' : 'Copiar Pregunta'}</span>
              </button>
            </div>

            {/* Instruction for Francisco */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-200">Objetivo del Abogado:</p>
                <p className="text-xs text-slate-300 mt-0.5">{currentStep.instruccionAbogado}</p>
              </div>
            </div>

            {/* Script Text to read aloud */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-slate-900/60 border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                🗣️ Qué decirle al cliente (Guion Telefónico):
              </span>
              <p className="text-sm font-medium text-amber-100 italic leading-relaxed">
                {currentStep.quePreguntar}
              </p>
            </div>

            {/* Legal Tip */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-start gap-2 text-xs text-blue-200">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-300">Pauta Legal de Valor: </strong>
                <span>{currentStep.tipLegal}</span>
              </div>
            </div>

            {/* Interactive Form Controls for this step */}
            <div className="pt-3 border-t border-slate-800">
              {currentStepIndex === 2 && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Selecciona la forma en que ingresó:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'visa', label: 'Con Visa (Turista/Trabajo)', desc: 'Entrada legal I-94' },
                      { id: 'parole', label: 'CBP One / Parole', desc: 'Permiso humanitario' },
                      { id: 'frontera_sin_inspeccion', label: 'Sin Inspección (Frontera)', desc: 'Cruce no autorizado' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormaEntrada(opt.id as EntryMethod)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          formaEntrada === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStepIndex === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Tiempo acumulado viviendo en EE.UU.:
                    </label>
                    <select
                      value={tiempoEnEEUU}
                      onChange={(e) => setTiempoEnEEUU(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    >
                      <option value="< 1 año">Menos de 1 año (Candidato Asilo INA 208)</option>
                      <option value="1 a 3 años">1 a 3 años</option>
                      <option value="3 a 9 años">3 a 9 años</option>
                      <option value="> 10 años">Más de 10 años (Cancelación de Remoción 42B)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Fecha aproximada de entrada:
                    </label>
                    <input
                      type="date"
                      value={fechaIngreso}
                      onChange={(e) => setFechaIngreso(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {currentStepIndex === 4 && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">
                    ¿Tiene antecedentes o detenciones con ICE/Policía?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'ninguno', label: 'Récord Limpio', desc: 'Sin ningún arresto' },
                      { id: 'arresto_ice', label: 'Detención en Frontera (ICE)', desc: 'Procesado al entrar' },
                      { id: 'faltas_menores', label: 'Faltas menores / Tráfico', desc: 'Sin felonies' },
                      { id: 'delito_mayor', label: 'DUI / Delito Mayor', desc: 'Riesgo de deportación expedita' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRecord(opt.id as CriminalRecord)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          record === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-red-300 font-medium">
                      <input
                        type="checkbox"
                        checked={estaDetenido}
                        onChange={(e) => setEstaDetenido(e.target.checked)}
                        className="w-4 h-4 rounded text-red-600 bg-slate-900 border-slate-700 focus:ring-red-500"
                      />
                      <span>🚨 ¿La persona está ACTUALMENTE DETENIDA por ICE / en la cárcel?</span>
                    </label>
                    {estaDetenido && (
                      <div className="mt-2 pl-6">
                        <input
                          type="text"
                          placeholder="Nombre o centro de detención (ej. Houston Processing Center)"
                          value={centroDetencion}
                          onChange={(e) => setCentroDetencion(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-red-950/30 border border-red-800/60 text-white placeholder-red-400/50 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStepIndex === 5 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tieneNumeroA}
                          onChange={(e) => setTieneNumeroA(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500"
                        />
                        <span>Tiene Número de Registro "A" (A-Number)</span>
                      </label>
                      {tieneNumeroA && (
                        <input
                          type="text"
                          placeholder="A000-000-000 (9 dígitos)"
                          value={numeroA}
                          onChange={(e) => setNumeroA(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none font-mono"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tieneCorte}
                          onChange={(e) => setTieneCorte(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500"
                        />
                        <span>Tiene Audiencia Programada ante el Juez</span>
                      </label>
                      {tieneCorte && (
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={fechaCorte}
                            onChange={(e) => setFechaCorte(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Ciudad de la Corte (ej. Miami, Houston, LA)"
                            value={ciudadCorte}
                            onChange={(e) => setCiudadCorte(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Nombre del Juez (si figura en NTA)"
                            value={juezNombre}
                            onChange={(e) => setJuezNombre(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStepIndex === 6 && (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tieneFamiliarEstatus}
                      onChange={(e) => setTieneFamiliarEstatus(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                    />
                    <span>¿Tiene familiar directo con ciudadanía o residencia permanente?</span>
                  </label>

                  {tieneFamiliarEstatus && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {[
                        { id: 'conyuge_ciudadano', label: 'Cónyuge Ciudadano(a)', desc: 'Prioridad máxima (inmediato)' },
                        { id: 'hijo_ciudadano_21', label: 'Hijo(a) Ciudadano mayor de 21', desc: 'Petición directa' },
                        { id: 'padre_ciudadano', label: 'Padre/Madre Ciudadano(a)', desc: 'Petición familiar' },
                        { id: 'residente_permanente', label: 'Cónyuge o Padre Residente Legal', desc: 'Categoría F2A con espera' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setParentescoFamiliar(opt.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                            parentescoFamiliar === opt.id
                              ? 'bg-emerald-500/20 border-emerald-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                          <div className="text-[10px] text-slate-400">{opt.desc}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentStepIndex === 7 && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Compromiso de Trabajo Mutuo</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Recuerda enfatizarle al cliente: <strong>"Usted se encarga de ir a realizarse su examen médico y poner sus huellas biométricas. De todo lo demás —la representación legal, la corte con el juez, la moción de fianza y la defensa jurídica— nos encargamos nosotros en el bufete."</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← Fase Anterior
              </button>

              <span className="text-xs text-slate-500">
                Paso {currentStepIndex + 1} de {INTAKE_STEPS.length}
              </span>

              <button
                type="button"
                disabled={currentStepIndex === INTAKE_STEPS.length - 1}
                onClick={() => setCurrentStepIndex(prev => Math.min(INTAKE_STEPS.length - 1, prev + 1))}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <span>Siguiente Fase</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Legal Diagnosis & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-Time Assessment Box */}
          <div className="glass-card rounded-2xl p-6 border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Diagnóstico Migratorio en Vivo
                </h3>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                diagnosis.probabilidad === 'alta'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : diagnosis.probabilidad === 'media'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}>
                Viabilidad: {diagnosis.probabilidad === 'alta' ? 'Alta' : diagnosis.probabilidad === 'media' ? 'Media' : 'Análisis Detallado'}
              </span>
            </div>

            {/* Recommended Legal Pathway */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Vía Jurídica Identificada:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm font-bold text-amber-300">
                {diagnosis.via}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {diagnosis.explicacion}
              </p>
            </div>

            {/* Bond indicator if applicable */}
            {diagnosis.montoEstimadoFianza > 0 && (
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    Trámite de Fianza con el Juez/ICE
                  </span>
                  <span className="text-xs font-mono font-bold text-red-200">
                    Est. ~${diagnosis.montoEstimadoFianza.toLocaleString()} USD
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Monto sugerido para solicitar en la Moción de Redeterminación de Fianza ante el Juez.
                </p>
              </div>
            )}

            {/* Immediate Next Steps for Client & Lawyer */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Plan de Acción Inmediato:
              </span>
              <div className="space-y-1.5">
                {diagnosis.acciones.map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lawyer's Private Notes */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-semibold text-slate-400">
                Notas Privadas de la Llamada:
              </label>
              <textarea
                rows={2}
                placeholder="Detalles revelados por el cliente, nombres de familiares, antecedentes, etc."
                value={notasAdicionales}
                onChange={(e) => setNotasAdicionales(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Bottom Actions: Save & Open WhatsApp */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSaveLead}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                  leadSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold border border-amber-400/40'
                }`}
              >
                {leadSaved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Expediente Guardado Exitosamente!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Aperturar Expediente de {nombre || 'Cliente'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Confirmación a WhatsApp</span>
              </button>

              {leadSaved && (
                <button
                  type="button"
                  onClick={onNavigateToClients}
                  className="w-full py-2 text-xs text-center text-slate-400 hover:text-white transition"
                >
                  Ver en el listado de clientes y expedientes →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
