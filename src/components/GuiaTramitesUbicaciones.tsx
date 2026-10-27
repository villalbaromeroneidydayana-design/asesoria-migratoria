import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Bot, 
  FileText, 
  Search, 
  Stethoscope, 
  Fingerprint, 
  Scale, 
  DollarSign, 
  AlertTriangle,
  FolderPlus,
  Globe,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Sparkles,
  Building2,
  Clock
} from 'lucide-react';
import type { ClientLead } from '../types';

interface GuiaTramitesUbicacionesProps {
  clients: ClientLead[];
  onUpdateClient: (updated: ClientLead) => void;
  onSendToEstefania: (clientId: string, instructionText: string) => void;
}

export const GuiaTramitesUbicaciones: React.FC<GuiaTramitesUbicacionesProps> = ({
  clients,
  onUpdateClient,
  onSendToEstefania
}) => {
  // Client selection
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  
  // Search parameters
  const [selectedEstado, setSelectedEstado] = useState<string>('Texas');
  const [ciudadZip, setCiudadZip] = useState<string>('');
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<string>('asilo');
  const [activeCategory, setActiveCategory] = useState<'rastreador' | 'biometria' | 'medico' | 'formularios' | 'cortes'>('rastreador');
  const [idiomaInstrucciones, setIdiomaInstrucciones] = useState<'es' | 'en'>('es');
  
  // Online Case Tracking state
  const [numeroConsultaInput, setNumeroConsultaInput] = useState<string>('');
  const [copiedNumberSuccess, setCopiedNumberSuccess] = useState(false);

  // UI states
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Sync client when selected
  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      if (client.estadoResidenciaEEUU) {
        setSelectedEstado(client.estadoResidenciaEEUU);
      }
      if (client.numeroReciboUSCIS) {
        setNumeroConsultaInput(client.numeroReciboUSCIS);
      } else if (client.numeroA) {
        setNumeroConsultaInput(client.numeroA);
      }
      // Infer procedure
      const t = (client.tramiteSolicitado || '').toLowerCase();
      if (t.includes('fianza') || client.estaDetenido) {
        setTramiteSeleccionado('fianza');
        setActiveCategory('cortes');
      } else if (t.includes('asilo')) {
        setTramiteSeleccionado('asilo');
      } else if (t.includes('ajuste') || t.includes('petición') || t.includes('familiar')) {
        setTramiteSeleccionado('ajuste');
        setActiveCategory('medico');
      } else if (t.includes('cancelación') || client.tieneCorte) {
        setTramiteSeleccionado('cancelacion');
        setActiveCategory('cortes');
      } else if (t.includes('permiso') || t.includes('trabajo') || t.includes('tps')) {
        setTramiteSeleccionado('permiso');
      }
    }
  };

  // Generate instructions in Spanish or English
  const getInstrucciones = () => {
    const nombre = selectedClient ? selectedClient.nombre.split(' ')[0] : (idiomaInstrucciones === 'es' ? 'Estimado/a cliente' : 'Dear client');
    const estado = selectedEstado || 'Estados Unidos';
    const numA = selectedClient?.numeroA ? ` (A-Number: ${selectedClient.numeroA})` : '';

    if (idiomaInstrucciones === 'es') {
      switch (activeCategory) {
        case 'rastreador':
          return `🔍 *VERIFICACIÓN OFICIAL DE CASO MIGRATORIO (USCIS & CORTE EOIR)*
Para: ${nombre}

1️⃣ *Para Trámites ante USCIS (Permiso de trabajo I-765, Asilo I-589, Petición Familiar I-130, Residencia I-485):*
• Página oficial directa del gobierno de EE. UU.:
🔗 https://egov.uscis.gov/
• Ingrese su Número de Recibo (Receipt Number) de 13 caracteres (ejemplo: IOE, MSC, LIN, WAC, EAC, SRC seguido de 10 dígitos).
• Se ubica en la esquina superior izquierda de su notificación oficial Formulario I-797C (Notice of Action).

2️⃣ *Para Fechas de Audiencia en Corte de Inmigración (EOIR con el Juez):*
• Portal oficial ACIS en español:
🔗 https://acis.eoir.justice.gov/es/
• Línea telefónica automatizada 24/7: 📞 1-800-898-7180 (Opción 2 para español).
• Ingrese su Número A (A-Number) de 9 dígitos${numA}.
• Aquí verifica: fecha exacta de audiencia, juez asignado y dirección del tribunal.

3️⃣ *Localizador de Detenidos ICE (si una persona está bajo custodia):*
🔗 https://locator.ice.gov/odls/

⚠️ *Nota de seguridad y confidencialidad:* Todas las consultas deben realizarse en portales oficiales con terminación '.gov'. No comparta sus números con páginas no autorizadas.`;

        case 'biometria':
          return `👆 *INSTRUCCIONES OFICIALES: CITA DE BIOMETRÍA (HUELLAS Y FOTO)*
Para: ${nombre}

1️⃣ *Tipo de Cita:* La cita de biométricos es *asignada formalmente por USCIS o ICE*, no se elige libremente. Debe esperar la llegada de su Notificación oficial (Formulario I-797C, Notice of Action).
2️⃣ *Lugar y Horario:* El aviso indicará la dirección exacta de su Centro de Asistencia de Solicitudes (ASC) en el estado de ${estado} y su horario obligatorio.
3️⃣ *Buscador oficial de oficinas:* Puede verificar la ubicación de las oficinas de USCIS aquí:
🔗 https://www.uscis.gov/about-us/find-a-uscis-office
4️⃣ *Qué llevar:* Su aviso original I-797C y su pasaporte vigente o identificación con foto.
⚠️ *Reprogramación:* Si tiene una emergencia justificada, debe solicitar la reprogramación antes de la fecha programada en su cuenta en línea de USCIS (my.uscis.gov) o llamando al 1-800-375-5283.`;

        case 'medico':
          return `🩺 *INSTRUCCIONES OFICIALES: EXAMEN MÉDICO CIVIL (I-693)*
Para: ${nombre}

1️⃣ *Tipo de Cita:* El examen médico es un trámite que *usted busca y agenda directamente por su cuenta* con un Cirujano Civil designado por USCIS.
2️⃣ *Localizador de médicos autorizados:* Ingrese su código postal o ciudad en el buscador oficial del gobierno para encontrar un médico autorizado cerca de usted en ${estado}:
🔗 https://www.uscis.gov/tools/find-a-civil-surgeon
3️⃣ *Qué llevar a su consulta:*
• Pasaporte vigente
• Registro de vacunas previas
• Formulario I-693 vigente (generalmente el médico lo provee)
⚠️ *REGLA OBLIGATORIA:* El médico le entregará los resultados en un sobre completamente *SELLADO*. NO lo abra por ningún motivo; romper el sello anula el examen ante USCIS y el Juez.`;

        case 'formularios':
          return `📄 *INFORMACIÓN OFICIAL: FORMULARIOS Y TARIFAS DE PRESENTACIÓN*
Para: ${nombre} • Trámite: ${tramiteSeleccionado.toUpperCase()}

1️⃣ *Enlaces Oficiales del Gobierno:*
• Formularios USCIS: https://www.uscis.gov/forms
• Tabla Oficial de Tarifas Vigentes: https://www.uscis.gov/forms/filing-fees
2️⃣ *Tarifas según trámite:*
• Asilo (I-589): $0 USD (Sin costo de presentación).
• Permiso de Trabajo (I-765): $470 USD en línea / $520 USD en papel (Exento en 1ª solicitud bajo asilo pendiente categoría (c)(8)).
• Petición Familiar (I-130): $625 USD en línea / $675 USD en papel.
• Residencia / Ajuste (I-485): $1,440 USD.
• Fianza de Inmigración: Mínimo fijado por ley $1,500 USD (determinado por el Juez o ICE).
⚠️ *Nota de seguridad:* Las tarifas vigentes están sujetas a la tabla oficial de tarifas de USCIS. Siempre verifique en el enlace oficial antes de emitir cheques o pagos.`;

        case 'cortes':
          return `🏛️ *INFORMACIÓN OFICIAL: CORTE DE INMIGRACIÓN Y AUDIENCIAS (EOIR)*
Para: ${nombre}${numA}

1️⃣ *Tipo de Cita:* La audiencia ante el Juez es una *comparecencia judicial asignada obligatoria*. La falta de asistencia puede generar una orden de deportación en ausencia.
2️⃣ *Consulta oficial de su caso (24/7):*
• Portal Oficial ACIS en línea: https://acis.eoir.justice.gov/es/
• Sistema telefónico automatizado: 1-800-898-7180 (Tenga a la mano su Número A de 9 dígitos).
3️⃣ *Directorio de tribunales migratorios:*
🔗 https://www.justice.gov/eoir/immigration-court-information
Localice los juzgados de inmigración en ${estado} para conocer dirección y requisitos de acceso.`;
      }
    } else {
      // English version
      switch (activeCategory) {
        case 'rastreador':
          return `🔍 *OFFICIAL IMMIGRATION CASE TRACKER (USCIS & IMMIGRATION COURT)*
For: ${nombre}

1️⃣ *USCIS Filings (Work Authorization I-765, Asylum I-589, Green Card I-485, Petition I-130):*
• Official US Government Portal:
🔗 https://egov.uscis.gov/
• Enter your 13-character Receipt Number (e.g., IOE, MSC, LIN, WAC, EAC, SRC + 10 digits).
• Located on the top-left corner of your Form I-797C Notice of Action.

2️⃣ *Immigration Court Hearings (EOIR with the Immigration Judge):*
• Official ACIS Portal:
🔗 https://acis.eoir.justice.gov/en/
• 24/7 Automated Phone Hotline: 📞 1-800-898-7180 (Option 2 for Spanish, Option 1 for English).
• Enter your 9-digit Alien Registration Number (A-Number)${numA}.
• Check: Hearing date, assigned judge, and court location.

3️⃣ *ICE Detainee Locator:*
🔗 https://locator.ice.gov/odls/

⚠️ *Confidentiality notice:* Only verify case status on official government portals ending in '.gov'.`;

        case 'biometria':
          return `👆 *OFFICIAL INSTRUCTIONS: BIOMETRICS APPOINTMENT (ASC)*
For: ${nombre}

1️⃣ *Appointment Nature:* Biometrics appointments are *assigned by USCIS/ICE*, not chosen by the applicant. You must wait for Form I-797C (Notice of Action).
2️⃣ *Location:* Your notice specifies the exact Application Support Center (ASC) in ${estado}.
3️⃣ *USCIS Office Locator:*
🔗 https://www.uscis.gov/about-us/find-a-uscis-office
4️⃣ *What to bring:* Original I-797C notice and unexpired passport or government-issued photo ID.
⚠️ *Rescheduling:* If you have an emergency, reschedule prior to your appointment via your USCIS online account (my.uscis.gov) or call 1-800-375-5283.`;

        case 'medico':
          return `🩺 *OFFICIAL INSTRUCTIONS: IMMIGRATION MEDICAL EXAM (I-693)*
For: ${nombre}

1️⃣ *Appointment Nature:* This exam is *scheduled directly by you* with a USCIS-certified Civil Surgeon.
2️⃣ *Official Civil Surgeon Locator:* Enter your ZIP code or city to locate authorized doctors in ${estado}:
🔗 https://www.uscis.gov/tools/find-a-civil-surgeon
3️⃣ *What to bring:* Valid passport, immunization records, and Form I-693.
⚠️ *CRITICAL RULE:* The doctor will provide your results in a *SEALED ENVELOPE*. Do NOT open it. A broken seal invalidates the exam.`;

        case 'formularios':
          return `📄 *OFFICIAL INFORMATION: FORMS & FILING FEES*
For: ${nombre} • Procedure: ${tramiteSeleccionado.toUpperCase()}

1️⃣ *Official Government Links:*
• USCIS Forms: https://www.uscis.gov/forms
• Official Filing Fee Schedule: https://www.uscis.gov/forms/filing-fees
2️⃣ *Standard Fees:*
• Asylum (I-589): $0 USD (No filing fee).
• Work Authorization (I-765): $470 online / $520 paper (Fee exempt for initial (c)(8) pending asylum).
• Family Petition (I-130): $625 online / $675 paper.
• Green Card / Adjustment (I-485): $1,440 USD.
• Immigration Bond: Minimum $1,500 USD set by IJ or ICE.
⚠️ *Always verify:* Filing fees are subject to the official USCIS fee schedule. Confirm on the official website before payment.`;

        case 'cortes':
          return `🏛️ *OFFICIAL INFORMATION: IMMIGRATION COURT & HEARINGS (EOIR)*
For: ${nombre}${numA}

1️⃣ *Hearing Nature:* Court appearances are *mandatorily scheduled judicial proceedings*. Failure to attend may result in an in-absentia removal order.
2️⃣ *Check Case Status (24/7):*
• ACIS Online Portal: https://acis.eoir.justice.gov/en/
• Automated Phone Hotline: 1-800-898-7180 (Have your 9-digit A-Number ready).
3️⃣ *Court Directory:*
🔗 https://www.justice.gov/eoir/immigration-court-information
Find immigration courts located in ${estado}.`;
      }
    }
  };

  const instruccionesTexto = getInstrucciones();

  const handleCopy = () => {
    navigator.clipboard.writeText(instruccionesTexto);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleOpenSource = () => {
    switch (activeCategory) {
      case 'rastreador':
        window.open('https://egov.uscis.gov/', '_blank');
        break;
      case 'biometria':
        window.open('https://www.uscis.gov/about-us/find-a-uscis-office', '_blank');
        break;
      case 'medico':
        window.open('https://www.uscis.gov/tools/find-a-civil-surgeon', '_blank');
        break;
      case 'formularios':
        window.open('https://www.uscis.gov/forms/filing-fees', '_blank');
        break;
      case 'cortes':
        window.open('https://acis.eoir.justice.gov/es/', '_blank');
        break;
    }
  };

  const handleSendScriptToEstefania = () => {
    if (selectedClient) {
      onSendToEstefania(selectedClient.id, instruccionesTexto);
    } else {
      onSendToEstefania('', instruccionesTexto);
    }
  };

  const handleRegistrarEnExpediente = () => {
    if (!selectedClient) {
      alert('Por favor seleccione un cliente de la lista para registrar el seguimiento en su expediente.');
      return;
    }

    const fechaHoy = new Date().toLocaleDateString([], { dateStyle: 'short' });
    const notaSeguimiento = `[${fechaHoy}] Guía de Trámites y Ubicaciones consultada: Categoría '${activeCategory}' para el estado de ${selectedEstado}. Instrucciones oficiales generadas.`;

    const updatedClient: ClientLead = {
      ...selectedClient,
      observacionesIniciales: selectedClient.observacionesIniciales 
        ? `${selectedClient.observacionesIniciales}\n${notaSeguimiento}`
        : notaSeguimiento,
      ultimaLlamada: `Guía provista el ${fechaHoy}`
    };

    onUpdateClient(updatedClient);
    setRegistroExitoso(true);
    setTimeout(() => setRegistroExitoso(false), 2500);
  };

  // Online Case Tracking helpers
  const cleanInput = (numeroConsultaInput || '').trim().replace(/[-\s]/g, '');
  const isUSCIS = /^[a-zA-Z]{3}\d{10}$/.test(cleanInput) || /^(IOE|MSC|NBC|LIN|WAC|EAC|SRC)/i.test(cleanInput);
  const isEOIR = /^\d{9}$/.test(cleanInput) || /^A\d{8,9}$/i.test(cleanInput) || (/^\d{8,9}$/.test(cleanInput) && cleanInput.length >= 8);

  const handleOpenUSCIS = () => {
    if (cleanInput) {
      navigator.clipboard.writeText(cleanInput.toUpperCase());
      setCopiedNumberSuccess(true);
      setTimeout(() => setCopiedNumberSuccess(false), 2500);
    }
    window.open('https://egov.uscis.gov/', '_blank');
  };

  const handleOpenEOIR = () => {
    const digitsOnly = cleanInput.replace(/\D/g, '');
    if (digitsOnly) {
      navigator.clipboard.writeText(digitsOnly);
      setCopiedNumberSuccess(true);
      setTimeout(() => setCopiedNumberSuccess(false), 2500);
    }
    window.open('https://acis.eoir.justice.gov/es/', '_blank');
  };

  const clientsWithNumbers = clients.filter(c => c.numeroA || c.numeroReciboUSCIS);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Directorio Oficial de Trámites, Sedes y Regulaciones</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Guía de Trámites y Ubicaciones Oficiales
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consulta en tiempo real para encontrar sedes de biometría, médicos civiles certificados por USCIS, tablas de tarifas vigentes y juzgados de inmigración (EOIR), conectado a sus expedientes y a Estefanía.
            </p>
          </div>

          {/* Client Selector */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 min-w-[280px]">
            <label className="text-[11px] font-semibold text-slate-400 block flex items-center justify-between">
              <span>Seleccionar Cliente:</span>
              {selectedClient && (
                <span className="text-amber-400 font-mono text-[10px] font-bold">
                  {selectedClient.numeroExpediente}
                </span>
              )}
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => handleClientSelect(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white outline-none focus:border-amber-500"
            >
              <option value="">(Búsqueda libre sin cliente)</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.numeroExpediente} • {c.nombre} ({c.estadoResidenciaEEUU || c.paisOrigen})
                </option>
              ))}
            </select>
            {selectedClient && (
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>Trámite: {selectedClient.tramiteSolicitado}</span>
                <span className="text-emerald-400 font-mono">{selectedClient.numeroA || 'Sin Nº A'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Parameters Strip */}
      <div className="glass-card rounded-2xl p-5 border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Parameter 1: State */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Estado de Residencia en EE.UU.:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-500"
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

          {/* Parameter 2: City or ZIP code */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Ciudad o Código Postal (ZIP Code):
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ej. 77002 o Houston"
                value={ciudadZip}
                onChange={(e) => setCiudadZip(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Parameter 3: Procedure */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Trámite Migratorio:
            </label>
            <select
              value={tramiteSeleccionado}
              onChange={(e) => setTramiteSeleccionado(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-semibold outline-none focus:border-amber-500"
            >
              <option value="asilo">Asilo Político (I-589)</option>
              <option value="ajuste">Ajuste de Estatus / Petición Familiar (I-130 / I-485)</option>
              <option value="permiso">Permiso de Trabajo EAD (I-765)</option>
              <option value="fianza">Moción de Fianza / Liberación ICE</option>
              <option value="cancelacion">Cancelación de Remoción (EOIR-42B)</option>
              <option value="general">Consulta General de Trámites</option>
            </select>
          </div>
        </div>

        {/* Category Tabs: Rastreador Oficial + Trámites y Sedes */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800 scrollbar-none">
          {[
            { id: 'rastreador', label: 'Rastreador Oficial de Casos (USCIS / Cortes)', icon: Search, tag: 'En Línea Online' },
            { id: 'medico', label: 'Médico Civil (I-693)', icon: Stethoscope, tag: 'Solicita el cliente' },
            { id: 'biometria', label: 'Toma Biometría (ASC)', icon: Fingerprint, tag: 'Asignada por autoridad' },
            { id: 'formularios', label: 'Formularios & Tarifas', icon: DollarSign, tag: 'Oficial USCIS' },
            { id: 'cortes', label: 'Cortes Migratorias (EOIR)', icon: Scale, tag: 'Audiencia judicial' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Educational Guides and Official Sources */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            
            {/* Category 0: Rastreador Oficial de Casos (USCIS / Corte EOIR) */}
            {activeCategory === 'rastreador' && (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                      <Search className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Rastreador Oficial de Casos en Línea
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Consulta oficial en vivo: USCIS, Cortes EOIR, Detenidos ICE y Registro I-94
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span>Sitios Oficiales .gov</span>
                  </span>
                </div>

                {/* Clarification banner about the Mobile App */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-blue-500/30 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-blue-300 font-bold">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>¿Qué es la aplicación ("Mis Casos" / "Migra") que le dio el abogado?</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Las aplicaciones para celular (como <em>Case Tracker</em>, <em>Lawfully</em>, <em>MiCaso</em> o <em>Migra</em>) son visores privados que consultan las mismas páginas web del gobierno de EE. UU. <strong>Desde esta pantalla usted tiene acceso directo a los sitios web oficiales del gobierno (.gov)</strong> de forma 100% gratuita, sin anuncios, en tiempo real y con total confidencialidad legal.
                  </p>
                </div>

                {/* Quick Client Selector Chips */}
                {clientsWithNumbers.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Cargar número de un cliente registrado:</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {clientsWithNumbers.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedClientId(c.id);
                            setNumeroConsultaInput(c.numeroReciboUSCIS || c.numeroA || '');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                            selectedClientId === c.id
                              ? 'bg-amber-500/25 text-amber-300 border-amber-500/50'
                              : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
                          }`}
                        >
                          {c.nombre.split(' ')[0]} {c.numeroReciboUSCIS ? `(Recibo: ${c.numeroReciboUSCIS})` : `(A#: ${c.numeroA})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Input & Auto-Detection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 block flex items-center justify-between">
                    <span>Número de Caso a Consultar:</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Recibo USCIS (13 car.) o Número A (9 dígitos)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={numeroConsultaInput}
                      onChange={(e) => setNumeroConsultaInput(e.target.value)}
                      placeholder="Ej. IOE0923456789 o 234567890 (A-Number)"
                      className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 uppercase"
                    />
                    {numeroConsultaInput && (
                      <button
                        onClick={() => setNumeroConsultaInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  {/* Auto-Detection Indicator */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isUSCIS ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-emerald-300 font-semibold">
                            Detectado: Recibo USCIS (Receipt Number)
                          </span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">• Permisos I-765, Asilo I-589, I-130, I-485</span>
                        </>
                      ) : isEOIR ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                          <span className="text-purple-300 font-semibold">
                            Detectado: Número A (Alien Registration Number)
                          </span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">• Cortes EOIR y Detenciones ICE</span>
                        </>
                      ) : cleanInput.length > 0 ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          <span className="text-amber-300">
                            Formato no estándar (USCIS son 13 caracteres; A-Number son 9 números)
                          </span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">
                            Escriba el número o seleccione un cliente para detectar el portal
                          </span>
                        </>
                      )}
                    </div>
                    {copiedNumberSuccess && (
                      <span className="text-[10px] text-emerald-400 font-bold animate-bounce">
                        ¡Número copiado!
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Direct Verification Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Button 1: USCIS Case Status */}
                  <button
                    onClick={handleOpenUSCIS}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isUSCIS
                        ? 'bg-emerald-600/25 border-emerald-500/50 shadow-lg shadow-emerald-950/30 hover:bg-emerald-600/35'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          USCIS
                        </span>
                        <span className="font-bold text-white text-xs">Case Status Online</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Para permisos de trabajo (I-765), asilo, residencia y peticiones.
                    </p>
                    <div className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                      <span>🔗 egov.uscis.gov</span>
                      <span className="text-[9px] text-slate-400 font-normal">(Copia número y abre)</span>
                    </div>
                  </button>

                  {/* Button 2: EOIR ACIS Court Portal */}
                  <button
                    onClick={handleOpenEOIR}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isEOIR
                        ? 'bg-purple-600/25 border-purple-500/50 shadow-lg shadow-purple-950/30 hover:bg-purple-600/35'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          EOIR / JUEZ
                        </span>
                        <span className="font-bold text-white text-xs">Corte de Inmigración</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Para fecha de audiencia, juez asignado y dirección del tribunal.
                    </p>
                    <div className="text-[11px] text-purple-300 font-semibold flex items-center gap-1">
                      <span>🔗 acis.eoir.justice.gov/es</span>
                      <span className="text-[9px] text-slate-400 font-normal">(Copia A# y abre)</span>
                    </div>
                  </button>
                </div>

                {/* Additional Government Services Row */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-200 block text-[11px]">
                    Otros Portales Oficiales del Gobierno de EE. UU. (.gov):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <a
                      href="tel:18008987180"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-between transition border border-slate-700/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <strong className="block text-white">Línea Cortes 24/7</strong>
                          <span className="text-[10px] text-slate-400">1-800-898-7180 (Opción 2)</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold">Llamar</span>
                    </a>

                    <a
                      href="https://locator.ice.gov/odls/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-between transition border border-slate-700/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-red-400" />
                        <div>
                          <strong className="block text-white">Detenidos ICE</strong>
                          <span className="text-[10px] text-slate-400">locator.ice.gov</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href="https://i94.cbp.dhs.gov/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-between transition border border-slate-700/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <div>
                          <strong className="block text-white">Registro I-94 / CBP</strong>
                          <span className="text-[10px] text-slate-400">i94.cbp.dhs.gov</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href="https://egov.uscis.gov/processing-times/"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-between transition border border-slate-700/60"
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <div>
                          <strong className="block text-white">Tiempos USCIS</strong>
                          <span className="text-[10px] text-slate-400">egov.uscis.gov/times</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>

                {/* Educational Box: Where to find each number */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Guía de Documentos: ¿Dónde encontrar cada número?</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <strong className="text-emerald-400 block font-sans">
                        1. Número de Recibo USCIS (Receipt #)
                      </strong>
                      <p className="text-slate-300 leading-relaxed">
                        • <strong>Formato:</strong> 13 caracteres (3 letras + 10 números), ej. <span className="font-mono text-emerald-300">IOE0923456789</span>, <span className="font-mono text-emerald-300">MSC2490123456</span>
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        • <strong>Dónde está:</strong> Esquina superior izquierda de la carta <strong className="text-white">I-797C Notice of Action</strong>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <strong className="text-purple-400 block font-sans">
                        2. Número A (Alien Registration #)
                      </strong>
                      <p className="text-slate-300 leading-relaxed">
                        • <strong>Formato:</strong> 9 dígitos, ej. <span className="font-mono text-purple-300">A 234 567 890</span> (o sólo los números).
                      </p>
                      <p className="text-slate-400 leading-relaxed">
                        • <strong>Dónde está:</strong> En la orden <strong className="text-white">Notice to Appear (NTA)</strong>, brazalete o <strong className="text-white">I-220A</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category 1: Medico Civil */}
            {activeCategory === 'medico' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Localizador de Médicos Civiles de USCIS
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Cita que el solicitante debe buscar y concertar por su cuenta
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Cita Privada
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para el Formulario I-693, el examen no puede realizarlo cualquier médico general. Debe ser un <strong>Cirujano Civil formalmente designado por USCIS</strong>.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-amber-300 block">Cómo encontrar un médico cerca del cliente:</span>
                  <p className="text-slate-300">
                    1. Ingrese a la herramienta oficial del gobierno: <strong className="text-white">my.uscis.gov/findadoctor</strong> o al localizador de médicos civiles.
                  </p>
                  <p className="text-slate-300">
                    2. Ingrese el código postal {ciudadZip ? `(${ciudadZip})` : 'del cliente'} o la ciudad en {selectedEstado}.
                  </p>
                  <p className="text-slate-300">
                    3. Llame a 2 o 3 consultorios para comparar precios (los honorarios varían entre $250 y $450 USD según las vacunas requeridas).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Regla inviolable del sobre sellado:</strong> El médico entrega los resultados en un sobre cerrado con sello de lacre. <strong>El cliente jamás debe abrir el sobre</strong>, pues romper el sello anula de inmediato el examen médico ante las autoridades.
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.uscis.gov/tools/find-a-civil-surgeon"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <span>Abrir Localizador Oficial de Médicos USCIS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Category 2: Biometría */}
            {activeCategory === 'biometria' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Centro de Asistencia de Solicitudes (ASC)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Cita formal asignada por USCIS / ICE (Obligatoria)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    Asignada por Autoridad
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  A diferencia del examen médico, <strong>la cita de biométricos no se solicita a voluntad</strong>. Es emitida automáticamente por la autoridad tras radicar un formulario.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-blue-300 block">Cómo revisar y preparar la cita:</span>
                  <p className="text-slate-300">
                    • <strong>Notificación I-797C:</strong> Llegará por correo postal indicando fecha, hora y el centro ASC asignado según el código postal del cliente.
                  </p>
                  <p className="text-slate-300">
                    • <strong>Qué llevar:</strong> Aviso original I-797C y documento de identidad vigente con fotografía (pasaporte).
                  </p>
                  <p className="text-slate-300">
                    • <strong>Comprobante sellado:</strong> Al concluir, el oficial estampa un sello de recibido. El cliente debe guardar y fotografiar ese comprobante.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200">
                  <strong>Reprogramación por fuerza mayor:</strong> Si el cliente no puede asistir por enfermedad justificada, debe solicitar reprogramación <em>antes</em> de la cita a través de su cuenta en línea en <strong>my.uscis.gov</strong> o llamando al Contact Center 1-800-375-5283.
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.uscis.gov/about-us/find-a-uscis-office"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <span>Ver Directorio de Oficinas y Centros ASC</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Category 3: Formularios y Tarifas */}
            {activeCategory === 'formularios' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Formularios Oficiales y Tarifas Vigentes
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Regulación de tarifas de USCIS (vigente desde abril 2024)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    Tabla Oficial
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Asilo Político (Formulario I-589)</strong>
                      <div className="text-[11px] text-slate-400">Presentación ante USCIS o Corte EOIR</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">$0 USD (Gratuito)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Permiso de Trabajo EAD (Formulario I-765)</strong>
                      <div className="text-[11px] text-slate-400">Categoría (c)(8) inicial exenta; renovación con tarifa</div>
                    </div>
                    <span className="font-mono font-bold text-amber-300">$470 online / $520 papel</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Petición Familiar (Formulario I-130)</strong>
                      <div className="text-[11px] text-slate-400">Para cónyuges, hijos o padres</div>
                    </div>
                    <span className="font-mono font-bold text-amber-300">$625 online / $675 papel</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Ajuste de Estatus / Green Card (Form I-485)</strong>
                      <div className="text-[11px] text-slate-400">Solicitud de Residencia Permanente</div>
                    </div>
                    <span className="font-mono font-bold text-amber-300">$1,440 USD</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <strong className="text-white">Fianza de Inmigración (ICE / Corte)</strong>
                      <div className="text-[11px] text-slate-400">Depósito reembolsable de garantía civil</div>
                    </div>
                    <span className="font-mono font-bold text-red-300">Mínimo legal $1,500 USD</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href="https://www.uscis.gov/forms"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <span>Formularios USCIS</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://www.uscis.gov/forms/filing-fees"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/40 transition"
                  >
                    <span>Tabla Oficial de Tarifas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Category 4: Cortes Migratorias EOIR */}
            {activeCategory === 'cortes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Tribunales Migratorios y Audiencias (EOIR)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Executive Office for Immigration Review (Departamento de Justicia)
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    Corte de Inmigración
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Las fechas de audiencia ante un Juez de Inmigración son <strong>órdenes judiciales de estricto cumplimiento</strong>.
                </p>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-purple-300 block">Sistemas oficiales para consultar audiencias:</span>
                  <p className="text-slate-300">
                    • <strong>Portal ACIS de la Corte en línea:</strong> Ingrese el Número A del cliente en <em>acis.eoir.justice.gov/es/</em> para ver juez, tribunal y próximas audiencias.
                  </p>
                  <p className="text-slate-300">
                    • <strong>Línea telefónica automatizada 24/7:</strong> Marque al <strong className="text-white">1-800-898-7180</strong> (disponible en español) e ingrese los 9 dígitos del Número A.
                  </p>
                  <p className="text-slate-300">
                    • <strong>Sedes judiciales en {selectedEstado}:</strong> Consulte la dirección y código del tribunal en el directorio del DOJ.
                  </p>
                </div>

                <div className="flex gap-2 pt-1">
                  <a
                    href="https://acis.eoir.justice.gov/es/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-500/40 transition"
                  >
                    <span>Consultar Caso (ACIS)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://www.justice.gov/eoir/immigration-court-information"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
                  >
                    <span>Directorio Tribunales EOIR</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Instructions (WhatsApp Ready) & Integrations */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Instrucciones Listas para el Cliente
                </h3>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                <button
                  type="button"
                  onClick={() => setIdiomaInstrucciones('es')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    idiomaInstrucciones === 'es' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Español
                </button>
                <button
                  type="button"
                  onClick={() => setIdiomaInstrucciones('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    idiomaInstrucciones === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Texto estructurado y claro con enlaces gubernamentales oficiales para orientar al cliente por WhatsApp sin confusiones.
            </p>

            {/* Generated Instructions Display */}
            <textarea
              rows={9}
              readOnly
              value={instruccionesTexto}
              className="w-full p-3.5 text-xs rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 outline-none leading-relaxed font-mono"
            />

            {/* Action Buttons as requested by user */}
            <div className="space-y-2.5 pt-1">
              
              {/* Button 1: Copiar instrucciones para WhatsApp */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
              >
                {copiedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Instrucciones Copiadas para WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Instrucciones para WhatsApp</span>
                  </>
                )}
              </button>

              {/* Button 2: Abrir fuente oficial correspondiente */}
              <button
                type="button"
                onClick={handleOpenSource}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Abrir Fuente Oficial del Gobierno</span>
              </button>

              {/* Button 3: Preparar guion de audio con Estefanía */}
              <button
                type="button"
                onClick={handleSendScriptToEstefania}
                className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 font-semibold text-xs flex items-center justify-center gap-2 border border-purple-500/40 transition cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>Preparar Guion de Audio con Estefanía →</span>
              </button>

              {/* Button 4: Registrar seguimiento en el expediente */}
              <button
                type="button"
                onClick={handleRegistrarEnExpediente}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-800 transition cursor-pointer"
              >
                {registroExitoso ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">¡Seguimiento Registrado en Expediente!</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>Registrar este Seguimiento en el Expediente</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
