import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Users, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Phone, 
  MapPin, 
  Trash2,
  FileText
} from 'lucide-react';
import type { ClientLead } from '../types';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: ClientLead[]) => void;
  existingCount: number;
}


// Geographic map of area codes to help intake
const US_AREA_CODES: Record<string, string> = {
  '859': 'Kentucky (Lexington / Covington)',
  '213': 'California (Los Angeles)',
  '872': 'Illinois (Chicago)',
  '331': 'Illinois (Chicago Suburbs)',
  '561': 'Florida (West Palm Beach / Boca)',
  '828': 'North Carolina (Asheville / Western NC)',
  '945': 'Texas (Dallas / Fort Worth)',
  '903': 'Texas (Tyler / East Texas)',
  '786': 'Florida (Miami)',
  '305': 'Florida (Miami)',
  '832': 'Texas (Houston)',
  '713': 'Texas (Houston)',
  '281': 'Texas (Houston)'
};

export const parseRawContactText = (rawText: string, startIndex: number): ClientLead[] => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const results: ClientLead[] = [];
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  lines.forEach((line, idx) => {
    // Check for phone number pattern (+XXX or 10-digit US)
    // Matches patterns like +591 675259 89 or 859 760 6299 or (213) 401-8321
    const intlMatch = line.match(/^(\+\d{1,4}[\s\d\-]{6,15})/);
    const usMatch = line.match(/^([\(]?\d{3}[\)\s\.\-]?\s*\d{3}[\s\.\-]?\s*\d{4})/);

    let phoneRaw = '';
    let restOfLine = '';

    if (intlMatch) {
      phoneRaw = intlMatch[1].trim();
      restOfLine = line.substring(intlMatch[0].length).trim();
    } else if (usMatch) {
      phoneRaw = usMatch[1].trim();
      restOfLine = line.substring(usMatch[0].length).trim();
    } else {
      // Check if phone is at the end or somewhere else
      const anyPhone = line.match(/(\+?\d[\d\s\(\)\-\.]{7,16}\d)/);
      if (anyPhone) {
        phoneRaw = anyPhone[1].trim();
        restOfLine = line.replace(anyPhone[0], '').trim();
      } else {
        // Line without recognizable phone, treat whole line as name or note
        restOfLine = line;
      }
    }

    // Clean restOfLine from leading tabs, dashes or colons
    const cleanName = restOfLine.replace(/^[\t\-\:\,\;\|]+/, '').trim();

    // Standardize phone
    const digitsOnly = phoneRaw.replace(/\D/g, '');
    let formattedPhone = phoneRaw;
    let whatsapp = phoneRaw;
    let location = 'Estados Unidos';
    let paisOrigen = 'Por determinar';

    if (phoneRaw.startsWith('+591')) {
      paisOrigen = 'Bolivia';
      location = 'Bolivia (Consulta Internacional)';
      formattedPhone = `+591 ${digitsOnly.slice(3)}`;
      whatsapp = `+${digitsOnly}`;
    } else if (phoneRaw.startsWith('+52')) {
      paisOrigen = 'México';
      location = 'México (Consulta Internacional)';
      formattedPhone = `+52 ${digitsOnly.slice(2, 5)} ${digitsOnly.slice(5, 8)} ${digitsOnly.slice(8)}`;
      whatsapp = `+${digitsOnly}`;
    } else if (digitsOnly.length === 10) {
      const area = digitsOnly.slice(0, 3);
      location = US_AREA_CODES[area] || `EE.UU. (Área ${area})`;
      formattedPhone = `+1 (${area}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
      whatsapp = `+1${digitsOnly}`;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      const area = digitsOnly.slice(1, 4);
      location = US_AREA_CODES[area] || `EE.UU. (Área ${area})`;
      formattedPhone = `+1 (${area}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
      whatsapp = `+${digitsOnly}`;
    } else if (phoneRaw) {
      formattedPhone = phoneRaw;
      whatsapp = digitsOnly ? `+${digitsOnly}` : '';
    }

    const assignedNumber = startIndex + idx + 1;
    const finalName = cleanName || `Prospecto Pendiente (${phoneRaw || 'Sin número'})`;

    results.push({
      id: `LEAD-${Date.now()}-${assignedNumber}`,
      numeroExpediente: `EXP-2024-${String(assignedNumber).padStart(3, '0')}`,
      fechaRegistro: today,
      horaRegistro: currentTime,
      nombre: finalName,
      telefono: formattedPhone || 'No proporcionado',
      whatsapp: whatsapp || formattedPhone,
      paisOrigen: paisOrigen,
      estadoResidenciaEEUU: location,
      idiomaPreferido: 'Español',
      fuenteContacto: 'whatsapp',
      tramiteSolicitado: 'Asesoría Migratoria / Consulta Inicial',
      observacionesIniciales: `Registrado en lote el ${today}. Contacto original: "${line}".`,
      responsable: 'Abogado Francisco Hernández',
      estadoContacto: 'nuevo_por_contactar',
      estadoDocumentos: 'esperando_documentos',
      estadoEvaluacion: 'pendiente',
      estadoCaso: 'activo',
      fechaSeguimientoProgramado: today,
      esSeguimientoHoy: true,
      llamadasRealizadasCount: 0,
      llamadasSinRespuestaCount: 0,
      fechaIngreso: '',
      formaEntrada: 'otro',
      tiempoEnEEUU: '',
      record: 'ninguno',
      tieneNumeroA: false,
      tieneCorte: false,
      estaDetenido: false,
      status: 'nuevo_lead'
    });
  });

  return results;
};

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImportLeads,
  existingCount
}) => {
  const defaultRawText = `859 760 6299\tElfido y Maribel\t\t
213 401 8321\tLuzda\t\t
872 300 6569\tAlexis Rafael Cardozo Durán\t\t
+591 675259 89\tRosan\t\t
561 878 3364\t\t\t
828 560 7742\tDiego Parra\t\t
945 427 7545\tJaime García Ávila\t\t
331 312 5112\tFrclara\t\t
+52 667 317 5570\tOlga\t\t
903 254 7507`;

  const [rawText, setRawText] = useState(defaultRawText);
  const [parsedLeads, setParsedLeads] = useState<ClientLead[]>(() => 
    parseRawContactText(defaultRawText, existingCount)
  );

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseRawContactText(text, existingCount);
    setParsedLeads(parsed);
  };

  const handleConfirmImport = () => {
    if (parsedLeads.length === 0) return;
    onImportLeads(parsedLeads);
    onClose();
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...parsedLeads];
    updated.splice(index, 1);
    setParsedLeads(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-card rounded-2xl sm:rounded-3xl border-amber-500/40 p-5 sm:p-7 shadow-2xl my-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Carga Rápida de Prospectos
                </span>
                <span className="text-xs text-slate-400">• {parsedLeads.length} detectados</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Importar Lista de Contactos al CRM
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-5">
          {/* Left Column: Textarea input */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Pega aquí la lista de teléfonos y nombres:
              </label>
              <button
                type="button"
                onClick={() => handleTextChange(defaultRawText)}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Restablecer lista actual (10)
              </button>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Ejemplo:&#10;859 760 6299  Elfido y Maribel&#10;213 401 8321  Luzda&#10;+591 675259 89  Rosan"
              rows={11}
              className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/80 border border-slate-700/80 text-amber-200 placeholder-slate-600 outline-none focus:border-amber-500 transition resize-none leading-relaxed"
            />

            <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Detección inteligente automática:
              </p>
              <p>• Identifica códigos de área de EE.UU. (KY, CA, TX, IL, NC, FL) y países (+591 Bolivia, +52 México).</p>
              <p>• Asigna expediente único (EXP-2024-...) y crea botones directos para WhatsApp y llamada.</p>
            </div>
          </div>

          {/* Right Column: Preview of detected contacts */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Vista previa de prospectos a registrar ({parsedLeads.length}):
              </span>
            </div>

            <div className="flex-1 max-h-[340px] overflow-y-auto space-y-2 pr-1 rounded-xl">
              {parsedLeads.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500">
                  <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
                  <p className="text-xs">No se detectaron contactos válidos en el texto.</p>
                </div>
              ) : (
                parsedLeads.map((lead, i) => (
                  <div
                    key={lead.id || i}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold">
                          {lead.numeroExpediente}
                        </span>
                        <span className="font-semibold text-white truncate">
                          {lead.nombre}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400 font-mono">
                          <Phone className="w-3 h-3" />
                          {lead.telefono}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-amber-400/80" />
                          {lead.estadoResidenciaEEUU}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(i)}
                      className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Los prospectos se integrarán con estatus <span className="text-amber-300 font-semibold">"Nuevo por contactar"</span> y seguimiento hoy.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={parsedLeads.length === 0}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 transition cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Importar {parsedLeads.length} Prospectos al CRM</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
