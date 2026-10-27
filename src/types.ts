export type CaseStatus = 
  | 'nuevo_lead'
  | 'calificado'
  | 'tramites_previos' // Examen médico o biométricos pendientes
  | 'en_corte'         // Esperando fecha de juez
  | 'detenido_fianza'  // En centro de detención ICE / fianza pendiente
  | 'caso_sometido'    // Enviado a USCIS / EOIR
  | 'aprobado';

export type ContactStatus = 
  | 'nuevo_por_contactar'
  | 'llamada_realizada'
  | 'sin_respuesta'
  | 'mensaje_enviado'
  | 'en_seguimiento';

export type DocumentStatus = 
  | 'esperando_documentos'
  | 'documentos_recibidos'
  | 'en_revision'
  | 'completos';

export type EvaluationStatus = 
  | 'pendiente'
  | 'en_proceso'
  | 'completada';

export type CaseLifecycle = 
  | 'activo'
  | 'finalizado'
  | 'en_pausa';

export type ContactSource = 
  | 'anuncio'
  | 'referido'
  | 'whatsapp'
  | 'feria_legal'
  | 'formulario_web'
  | 'otra';

export type EntryMethod = 
  | 'visa'             // Visa B1/B2, F1, etc.
  | 'parole'           // Parole humanitario / CBP One
  | 'frontera_sin_inspeccion' // Cruce sin inspección / EWI
  | 'otro';

export type CriminalRecord = 
  | 'ninguno'          // Récord limpio
  | 'faltas_menores'   // Tráfico, multas
  | 'arresto_ice'      // Detenido en frontera únicamente
  | 'delito_mayor';    // Felony / DUI / orden previa

export interface CallLog {
  id: string;
  fechaHora: string;
  resultado: 'atendio' | 'sin_respuesta' | 'buzon';
  responsable: string;
  notas?: string;
}

export interface ClientLead {
  id: string; // ID interno (ej. CLI-101)
  numeroExpediente: string; // Número de expediente automático y único (ej. EXP-2024-001)
  fechaRegistro: string;    // Fecha automática de registro (YYYY-MM-DD)
  horaRegistro: string;     // Hora automática de registro (HH:MM AM/PM)
  
  // Datos personales de contacto
  nombre: string;
  telefono: string;
  whatsapp: string;
  email?: string;
  paisOrigen: string;
  estadoResidenciaEEUU: string; // Estado donde reside (ej. Texas, Florida, California)
  idiomaPreferido: string;      // Español, Inglés, Maya/K'iche', Créole, etc.
  
  // Origen y atribución
  fuenteContacto: ContactSource;
  referidoPor?: string;         // Nombre o código de quien lo recomendó
  tramiteSolicitado: string;     // Asilo, Fianza, Ajuste, Cancelación, etc.
  observacionesIniciales?: string;
  responsable: string;          // Licenciado David Antony Carrillo, Asistente Sofía, etc.

  // Estados Operativos del Tablero
  estadoContacto: ContactStatus;
  estadoDocumentos: DocumentStatus;
  estadoEvaluacion: EvaluationStatus;
  estadoCaso: CaseLifecycle;
  fechaSeguimientoProgramado?: string; // YYYY-MM-DD
  esSeguimientoHoy?: boolean;
  
  // Registro de llamadas
  llamadasRealizadasCount: number;
  llamadasSinRespuestaCount: number;
  historialLlamadas?: CallLog[];

  // Información migratoria específica
  fechaIngreso: string;
  formaEntrada: EntryMethod;
  tiempoEnEEUU: string; // ej. "8 meses", "2 años"
  record: CriminalRecord;
  tieneNumeroA: boolean;
  numeroA?: string;
  numeroReciboUSCIS?: string; // Número de recibo USCIS de 13 caracteres (ej. IOE, MSC, LIN, WAC, EAC, SRC...)
  // Documentos de identidad y foto
  tipoDocumentoIdentidad?: 'pasaporte' | 'id_estatal' | 'licencia' | 'matricula_consular' | 'otro';
  numeroIdentificacion?: string; // Número de pasaporte o ID
  fechaNacimiento?: string;      // YYYY-MM-DD
  fotoIdUrl?: string;            // Imagen base64 o URL del pasaporte / ID

  tieneCorte: boolean;
  fechaCorte?: string;
  juezNombre?: string;
  ciudadCorte?: string;
  estaDetenido: boolean;
  centroDetencion?: string;
  montoFianzaSugerido?: number;
  fianzaPagada?: boolean;
  
  // Trámites previos que el cliente debe adelantar
  examenMedicoStatus?: 'pendiente' | 'agendado' | 'completado';
  medicoCivilNotas?: string;
  biometricosStatus?: 'pendiente' | 'agendado' | 'completado';
  fechaBiometricos?: string;
  
  // Lazos familiares
  tieneFamiliarEstatus?: boolean;
  parentescoFamiliar?: 'conyuge_ciudadano' | 'hijo_ciudadano_21' | 'padre_ciudadano' | 'residente_permanente' | 'ninguno';

  // Diagnóstico legal
  viaMigratoriaSugerida?: string;
  probabilidadExito?: 'alta' | 'media' | 'requiere_analisis_profundo';
  notasCaso?: string;
  status: CaseStatus;
  fechaCreacion?: string;
  ultimaLlamada?: string;
  historialMensajesEstefania?: EstefaniaMessageRecord[];
}

export type MessageRecordStatus = 'borrador' | 'copiado' | 'enviado_confirmado';

export interface EstefaniaMessageRecord {
  id: string;
  clientId?: string;
  clientExpediente?: string;
  clientNombre?: string;
  fechaHora: string;
  mensajeRecibido?: string;
  intencionRespuesta?: string;
  respuestaSugerida: string;
  guionAudio?: string;
  audioBlobUrl?: string;
  estado: MessageRecordStatus;
}

export interface AssistantAudioTemplate {
  id: string;
  titulo: string;
  subtitulo: string;
  categoria: 'bienvenida' | 'examen_medico' | 'biometricos' | 'corte_juez' | 'fianza_ice' | 'urgente';
  guionVoz: string;
  duracionEstimada: string;
  mensajeWhatsApp: string;
  icono: string;
  audioFileUrl?: string; // Archivo de audio generado con ElevenLabs (MP3/WAV)
}

export interface IntakeQuestionStep {
  id: number;
  fase: string;
  titulo: string;
  instruccionAbogado: string;
  quePreguntar: string;
  tipLegal: string;
}
