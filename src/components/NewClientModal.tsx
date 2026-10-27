import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Globe, 
  Tag, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  Send,
  PhoneCall,
  FileImage,
  Upload,
  Camera
} from 'lucide-react';
import type { ClientLead, ContactSource } from '../types';
import { sendWhatsAppMessage } from '../utils/speech';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveClient: (client: ClientLead) => void;
  nextExpedienteNumber: string;
  onStartIntakeForClient?: (client: ClientLead) => void;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSaveClient,
  nextExpedienteNumber,
  onStartIntakeForClient
}) => {
  // Automatic Fields
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [horaRegistro, setHoraRegistro] = useState('');

  // Required Fields
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('Honduras');
  const [estadoResidenciaEEUU, setEstadoResidenciaEEUU] = useState('Texas');
  const [idiomaPreferido, setIdiomaPreferido] = useState('Español');
  
  // Origin & Attribution
  const [fuenteContacto, setFuenteContacto] = useState<ContactSource>('whatsapp');
  const [referidoPor, setReferidoPor] = useState('');
  const [tramiteSolicitado, setTramiteSolicitado] = useState('Asilo Político (Afirmativo / Defensivo)');
  const [observacionesIniciales, setObservacionesIniciales] = useState('');
  const [responsable, setResponsable] = useState('Licenciado David Antony Carrillo');

  // Identity document fields
  const [tipoDocumentoIdentidad, setTipoDocumentoIdentidad] = useState<'pasaporte' | 'id_estatal' | 'licencia' | 'matricula_consular' | 'otro'>('pasaporte');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [fotoIdUrl, setFotoIdUrl] = useState<string | undefined>(undefined);

  // Success State
  const [savedClient, setSavedClient] = useState<ClientLead | null>(null);

  // Set automatic date & time when opening modal
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setFechaRegistro(now.toISOString().split('T')[0]);
      setHoraRegistro(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSavedClient(null);
      setNumeroIdentificacion('');
      setFotoIdUrl(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setTelefono(val);
    if (sameAsPhone) {
      setWhatsapp(val);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoIdUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) {
      alert('Por favor ingrese el nombre y teléfono del cliente.');
      return;
    }

    const newClient: ClientLead = {
      id: `CLI-${Date.now().toString().slice(-4)}`,
      numeroExpediente: nextExpedienteNumber,
      fechaRegistro,
      horaRegistro,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      whatsapp: sameAsPhone ? telefono.trim() : (whatsapp.trim() || telefono.trim()),
      email: email.trim() || undefined,
      paisOrigen,
      estadoResidenciaEEUU,
      idiomaPreferido,
      fuenteContacto,
      referidoPor: referidoPor.trim() || undefined,
      tramiteSolicitado,
      observacionesIniciales: observacionesIniciales.trim() || undefined,
      responsable,
      tipoDocumentoIdentidad,
      numeroIdentificacion: numeroIdentificacion.trim() || undefined,
      fotoIdUrl: fotoIdUrl || undefined,

      // Operational Statuses
      estadoContacto: 'nuevo_por_contactar',
      estadoDocumentos: 'esperando_documentos',
      estadoEvaluacion: 'pendiente',
      estadoCaso: 'activo',
      fechaSeguimientoProgramado: fechaRegistro,
      esSeguimientoHoy: true,
      llamadasRealizadasCount: 0,
      llamadasSinRespuestaCount: 0,

      // Initial Legal defaults
      fechaIngreso: fechaRegistro,
      formaEntrada: 'frontera_sin_inspeccion',
      tiempoEnEEUU: 'Reciente',
      record: 'ninguno',
      tieneNumeroA: false,
      tieneCorte: false,
      estaDetenido: false,
      examenMedicoStatus: 'pendiente',
      biometricosStatus: 'pendiente',
      tieneFamiliarEstatus: false,
      parentescoFamiliar: 'ninguno',
      viaMigratoriaSugerida: tramiteSolicitado,
      probabilidadExito: 'media',
      notasCaso: observacionesIniciales || `Trámite solicitado: ${tramiteSolicitado}`,
      status: 'nuevo_lead',
      fechaCreacion: fechaRegistro
    };

    onSaveClient(newClient);
    setSavedClient(newClient);
  };

  const handleOpenWhatsApp = () => {
    if (!savedClient) return;
    const text = `Hola ${savedClient.nombre}, le saluda el Licenciado David Antony Carrillo del Bufete de Asesoría Migratoria. Le confirmamos que hemos registrado formalmente su contacto en nuestro sistema con el expediente ${savedClient.numeroExpediente} para su trámite de ${savedClient.tramiteSolicitado}. ¿En qué momento podemos hablar brevemente para revisar los detalles?`;
    sendWhatsAppMessage(savedClient.whatsapp || savedClient.telefono, text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card rounded-3xl max-w-2xl w-full border-amber-500/30 shadow-2xl overflow-hidden my-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-amber-600/5 to-slate-900 border-b border-amber-500/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/40">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  + Registrar Nuevo Cliente
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {nextExpedienteNumber}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Apertura formal de expediente en el CRM del Licenciado David Antony Carrillo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Form OR Success View */}
        {savedClient ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-serif text-white">
                ¡Cliente Registrado con Éxito!
              </h3>
              <p className="text-sm text-slate-300">
                Se ha generado el expediente <strong className="text-amber-300 font-mono">{savedClient.numeroExpediente}</strong> para <strong>{savedClient.nombre}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Trámite Solicitado:</span>
                <span className="text-amber-300 font-semibold">{savedClient.tramiteSolicitado}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">WhatsApp / Teléfono:</span>
                <span className="text-emerald-400 font-mono font-semibold">{savedClient.whatsapp}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Responsable Asignado:</span>
                <span className="text-slate-200">{savedClient.responsable}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Saludo por WhatsApp</span>
              </button>

              {onStartIntakeForClient && (
                <button
                  type="button"
                  onClick={() => {
                    onStartIntakeForClient(savedClient);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Iniciar Intake Telefónico</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cerrar y Ver en Tablero
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Automatic Record Strip */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Nº de Expediente</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{nextExpedienteNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Fecha Registro</span>
                <span className="text-slate-200 font-medium">{fechaRegistro}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Hora Registro</span>
                <span className="text-slate-200 font-medium">{horaRegistro}</span>
              </div>
            </div>

            {/* Section 1: Contact Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                <span>1. Información Personal y de Contacto</span>
              </h3>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nombre Completo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. José Roberto Hernández Morales"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-slate-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Teléfono Principal <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (xxx) xxx-xxxx"
                      value={telefono}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-300">
                      Número de WhatsApp
                    </label>
                    <label className="flex items-center gap-1.5 text-[10px] text-emerald-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsPhone}
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setWhatsapp(telefono);
                        }}
                        className="w-3.5 h-3.5 rounded text-emerald-500 bg-slate-900 border-slate-700"
                      />
                      <span>Mismo que teléfono</span>
                    </label>
                  </div>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      disabled={sameAsPhone}
                      placeholder="+1 (xxx) xxx-xxxx"
                      value={sameAsPhone ? telefono : whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white placeholder-slate-500 outline-none transition disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Correo Electrónico (Opcional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    País de Nacionalidad
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={paisOrigen}
                      onChange={(e) => setPaisOrigen(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    >
                      <option value="Honduras">Honduras</option>
                      <option value="Guatemala">Guatemala</option>
                      <option value="El Salvador">El Salvador</option>
                      <option value="Venezuela">Venezuela</option>
                      <option value="Colombia">Colombia</option>
                      <option value="México">México</option>
                      <option value="Cuba">Cuba</option>
                      <option value="Haití">Haití</option>
                      <option value="Nicaragua">Nicaragua</option>
                      <option value="Ecuador">Ecuador</option>
                      <option value="Perú">Perú</option>
                      <option value="República Dominicana">República Dominicana</option>
                      <option value="Otro">Otro país</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Estado de Residencia en EE.UU.
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={estadoResidenciaEEUU}
                      onChange={(e) => setEstadoResidenciaEEUU(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    >
                      <option value="Texas">Texas (TX)</option>
                      <option value="Florida">Florida (FL)</option>
                      <option value="California">California (CA)</option>
                      <option value="New York">New York (NY)</option>
                      <option value="Georgia">Georgia (GA)</option>
                      <option value="North Carolina">North Carolina (NC)</option>
                      <option value="Illinois">Illinois (IL)</option>
                      <option value="New Jersey">New Jersey (NJ)</option>
                      <option value="Arizona">Arizona (AZ)</option>
                      <option value="Virginia">Virginia (VA)</option>
                      <option value="Otro Estado">Otro Estado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Idioma Preferido
                  </label>
                  <select
                    value={idiomaPreferido}
                    onChange={(e) => setIdiomaPreferido(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    <option value="Español">Español</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Maya / K'iche' / Mam">Maya / Dialecto Indígena</option>
                    <option value="Créole / Francés">Créole Haitiano / Francés</option>
                    <option value="Portugués">Portugués</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section: Documento de Identificación / Pasaporte (Opcional) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <FileImage className="w-4 h-4" />
                  <span>Documento de Identificación o Pasaporte (Opcional)</span>
                </h3>
                <span className="text-[10px] text-slate-400">
                  Foto / Número
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={tipoDocumentoIdentidad}
                    onChange={(e) => setTipoDocumentoIdentidad(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    <option value="pasaporte">Pasaporte Extranjero</option>
                    <option value="id_estatal">ID Estatal / Licencia de Conducir</option>
                    <option value="matricula_consular">Matrícula Consular</option>
                    <option value="licencia">Cédula / DPI / Tarjeta de Identidad</option>
                    <option value="otro">Otro Documento</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Número de Documento / Pasaporte
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. P12345678 o Nº Cédula"
                    value={numeroIdentificacion}
                    onChange={(e) => setNumeroIdentificacion(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Foto Upload Area */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                {fotoIdUrl ? (
                  <div className="relative group shrink-0">
                    <img
                      src={fotoIdUrl}
                      alt="Vista previa documento"
                      className="w-28 h-18 object-cover rounded-lg border border-slate-600 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setFotoIdUrl(undefined)}
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-600 text-white text-[10px] shadow cursor-pointer"
                      title="Quitar foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <p className="text-xs font-semibold text-slate-200">
                    {fotoIdUrl ? 'Foto de identificación cargada correctamente' : '¿El cliente te envió una foto de su ID o Pasaporte?'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Puedes subirla aquí para guardarla en su expediente, o <strong>pasármela en este chat</strong> para que yo extraiga automáticamente los datos.
                  </p>
                </div>

                <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shrink-0">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>{fotoIdUrl ? 'Cambiar Foto' : 'Subir Foto ID'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Section 2: Origin, Procedure and Case Owner */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>2. Fuente del Contacto y Trámite Solicitado</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Fuente del Contacto
                  </label>
                  <select
                    value={fuenteContacto}
                    onChange={(e) => setFuenteContacto(e.target.value as ContactSource)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    <option value="whatsapp">WhatsApp Directo</option>
                    <option value="anuncio">Anuncio en Redes (Meta/TikTok/Google)</option>
                    <option value="referido">Referido / Recomendado</option>
                    <option value="feria_legal">Feria Legal / Comunitaria</option>
                    <option value="otra">Otra Fuente</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nombre o Código de Quien Recomendó
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pastor Samuel / Ref: Mario Solís / Campaña #04"
                    value={referidoPor}
                    onChange={(e) => setReferidoPor(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Trámite Solicitado
                  </label>
                  <select
                    value={tramiteSolicitado}
                    onChange={(e) => setTramiteSolicitado(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-semibold outline-none"
                  >
                    <option value="Asilo Político (Afirmativo / Defensivo)">Asilo Político (Afirmativo / Defensivo)</option>
                    <option value="Moción de Fianza Urgente ante Juez (Bond Hearing)">Moción de Fianza Urgente ante Juez (Bond Hearing)</option>
                    <option value="Petición Familiar / Ajuste I-130 / I-485">Petición Familiar / Ajuste I-130 / I-485</option>
                    <option value="Cancelación de Remoción (Ley de 10 Años EOIR-42B)">Cancelación de Remoción (Ley de 10 Años EOIR-42B)</option>
                    <option value="Permiso de Trabajo EAD (Formulario I-765)">Permiso de Trabajo EAD (Formulario I-765)</option>
                    <option value="Renovación de TPS / DACA">Renovación de TPS / DACA</option>
                    <option value="Defensa Contra Deportación en Corte">Defensa Contra Deportación en Corte</option>
                    <option value="Visa U / VAWA (Alivio Humanitario)">Visa U / VAWA (Alivio Humanitario)</option>
                    <option value="Consulta Migratoria Inicial">Consulta Migratoria Inicial</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Responsable Asignado
                  </label>
                  <select
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  >
                    <option value="Licenciado David Antony Carrillo">Licenciado David Antony Carrillo</option>
                    <option value="Asistente Sofía">Asistente Sofía</option>
                    <option value="Paralegal Carlos Mendoza">Paralegal Carlos Mendoza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Observaciones Iniciales del Contacto
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles revelados en el mensaje inicial o motivo de la consulta..."
                  value={observacionesIniciales}
                  onChange={(e) => setObservacionesIniciales(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 border border-amber-400/40 transition cursor-pointer hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Registrar Expediente</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
