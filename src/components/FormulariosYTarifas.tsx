import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Calculator, 
  CheckCircle2, 
  Copy, 
  Send, 
  PhoneCall, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WHITEBOARD_FORMULARIOS, PASOS_PROCESO_TARIFAS, ORGANIZACION_LLAMADA_FLOW, LAWYER_PROFILE } from '../data/initialData';
import { sendWhatsAppMessage } from '../utils/speech';

interface FormulariosYTarifasProps {
  onStartIntake?: () => void;
}

export const FormulariosYTarifas: React.FC<FormulariosYTarifasProps> = ({ onStartIntake }) => {
  const [activeSubTab, setActiveSubTab] = useState<'formularios' | 'etapas' | 'protocolo'>('formularios');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fee Calculator State
  const [selectedForms, setSelectedForms] = useState<string[]>(['I-485', 'I-765']);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([1, 2, 4]);
  const [clientNameCalc, setClientNameCalc] = useState('');
  const [clientPhoneCalc, setClientPhoneCalc] = useState('');

  // Categories extraction
  const categories = ['todos', ...Array.from(new Set(WHITEBOARD_FORMULARIOS.map(f => f.categoria)))];

  // Filtered forms
  const filteredForms = WHITEBOARD_FORMULARIOS.filter(form => {
    const matchesSearch = 
      form.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'todos' || form.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyFormInfo = (form: typeof WHITEBOARD_FORMULARIOS[0]) => {
    const text = `⚖️ *Información Oficial de Trámite: Formulario ${form.codigo}*\n*${LAWYER_PROFILE.despacho}*\n\n📋 *Trámite:* ${form.nombre}\n🏛️ *Tarifa Oficial de USCIS:* ${form.tarifaUSCIS > 0 ? `$${form.tarifaUSCIS.toLocaleString()} USD` : 'Exento / Sin tarifa'}\n📌 *Descripción:* ${form.descripcion}\n\nPara revisar la viabilidad de su caso y los requisitos específicos, comuníquese con nuestra oficina al ${LAWYER_PROFILE.telefono}.`;
    navigator.clipboard.writeText(text);
    setCopiedId(form.codigo);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Calculator computations
  const totalUSCISFees = selectedForms.reduce((acc, code) => {
    const f = WHITEBOARD_FORMULARIOS.find(item => item.codigo === code);
    return acc + (f ? f.tarifaUSCIS : 0);
  }, 0);

  const totalMinServices = selectedSteps.reduce((acc, stepNum) => {
    const s = PASOS_PROCESO_TARIFAS.find(item => item.paso === stepNum);
    return acc + (s ? s.costoMin : 0);
  }, 0);

  const totalMaxServices = selectedSteps.reduce((acc, stepNum) => {
    const s = PASOS_PROCESO_TARIFAS.find(item => item.paso === stepNum);
    return acc + (s ? s.costoMax : 0);
  }, 0);

  const handleSendQuoteWhatsApp = () => {
    const formsList = selectedForms.map(code => {
      const f = WHITEBOARD_FORMULARIOS.find(item => item.codigo === code);
      return `• ${f?.codigo}: ${f?.nombre} ($${f?.tarifaUSCIS} USD)`;
    }).join('\n');

    const stepsList = selectedSteps.map(num => {
      const s = PASOS_PROCESO_TARIFAS.find(item => item.paso === num);
      return `• ${s?.nombre}: $${s?.costoMin.toLocaleString()} - $${s?.costoMax.toLocaleString()} USD`;
    }).join('\n');

    const quoteMsg = `📋 *PRESUPUESTO ESTIMADO DE TRÁMITE MIGRATORIO*
${LAWYER_PROFILE.despacho} • ${LAWYER_PROFILE.titulo}
Lic. David Antony Carrillo (California Bar ${LAWYER_PROFILE.barNumber})

Estimado/a ${clientNameCalc || 'cliente'}, le compartimos el desglose estimado para su proceso:

🏛️ *ARANCELES Y FORMULARIOS DE USCIS:*
${formsList || '• Sin formularios seleccionados'}
*Total Tarifas de Gobierno:* $${totalUSCISFees.toLocaleString()} USD

⚖️ *ETAPAS DEL PROCESO Y HONORARIOS LEGALES:*
${stepsList || '• Sin etapas seleccionadas'}
*Rango Estimado del Proceso:* $${totalMinServices.toLocaleString()} a $${totalMaxServices.toLocaleString()} USD

📌 *INVERSIÓN TOTAL ESTIMADA (Gobierno + Proceso):*
De $${(totalUSCISFees + totalMinServices).toLocaleString()} a $${(totalUSCISFees + totalMaxServices).toLocaleString()} USD

⚠️ *Condiciones:* Las tarifas gubernamentales se pagan directamente a USCIS. Ofrecemos planes de pago flexibles por etapas según avance su expediente.

📞 Para agendar su cita o iniciar: ${LAWYER_PROFILE.telefono}`;

    if (clientPhoneCalc) {
      sendWhatsAppMessage(clientPhoneCalc, quoteMsg);
    } else {
      navigator.clipboard.writeText(quoteMsg);
      alert('Presupuesto formal copiado al portapapeles listo para enviar por WhatsApp.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/15 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pizarrón Maestro de Operaciones & Tarifas Oficiales</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Formularios, Tarifas & Protocolo de Llamada
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Catálogo completo de los 20 formularios de USCIS, desglose de costos por etapas del proceso y protocolo de 5 pasos para la toma de llamadas.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {onStartIntake && (
              <button
                onClick={onStartIntake}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-emerald-200" />
                <span>Aplicar en Intake en Vivo</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 pt-6 border-t border-slate-800/80 mt-6 overflow-x-auto">
          {[
            { id: 'formularios', label: 'Catálogo de Formularios (20)', icon: FileText },
            { id: 'etapas', label: 'Cotizador & Pasos del Proceso (1 al 6)', icon: Calculator },
            { id: 'protocolo', label: 'Organización de Llamada (5 Pasos)', icon: PhoneCall }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/40' 
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: FORMULARIOS USCIS */}
      {activeSubTab === 'formularios' && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="glass-card rounded-2xl p-4 border-slate-800 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar formulario por código (I-485, I-130, I-765...) o trámite..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map(form => (
              <div 
                key={form.codigo}
                className="glass-card rounded-2xl p-5 border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-base font-extrabold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {form.codigo}
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block text-[10px] uppercase font-bold">Tarifa USCIS</span>
                      <span className="font-mono text-base font-black text-emerald-400">
                        {form.tarifaUSCIS > 0 ? `$${form.tarifaUSCIS.toLocaleString()} USD` : 'Exento'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition">
                    {form.nombre}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                    {form.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {form.categoria}
                  </span>

                  <button
                    onClick={() => handleCopyFormInfo(form)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 transition cursor-pointer font-semibold text-[11px]"
                    title="Copiar resumen para WhatsApp"
                  >
                    {copiedId === form.codigo ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Ficha</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ETAPAS DEL PROCESO & COTIZADOR */}
      {activeSubTab === 'etapas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Las 6 Etapas del Pizarrón */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-6 border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    Las 6 Etapas Oficiales del Proceso (Whiteboard)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rango de honorarios y servicios por cada fase según el manual del despacho.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {PASOS_PROCESO_TARIFAS.map(paso => {
                  const isChecked = selectedSteps.includes(paso.paso);
                  return (
                    <div
                      key={paso.paso}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedSteps(selectedSteps.filter(p => p !== paso.paso));
                        } else {
                          setSelectedSteps([...selectedSteps, paso.paso]);
                        }
                      }}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                        isChecked 
                          ? 'bg-amber-500/10 border-amber-500/50' 
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isChecked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {paso.paso}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {paso.nombre}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {paso.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm font-extrabold text-amber-300 block">
                          ${paso.costoMin.toLocaleString()} - ${paso.costoMax.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">USD</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Calculadora / Cotizador Interactivo */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card-gold rounded-2xl p-6 border-amber-500/40 space-y-5 sticky top-24 shadow-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block mb-1">
                  Cotizador Oficial del Despacho
                </span>
                <h3 className="text-xl font-serif font-bold text-white">
                  Presupuesto Integrado de Trámite
                </h3>
              </div>

              {/* Client Data for Quote */}
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Nombre del cliente (ej. Elfido)"
                  value={clientNameCalc}
                  onChange={(e) => setClientNameCalc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="WhatsApp del cliente (ej. +1 859 760 6299)"
                  value={clientPhoneCalc}
                  onChange={(e) => setClientPhoneCalc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-amber-500"
                />
              </div>

              {/* Forms selection */}
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1.5">
                  Formularios USCIS que aplican:
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                  {WHITEBOARD_FORMULARIOS.map(f => {
                    const selected = selectedForms.includes(f.codigo);
                    return (
                      <label key={f.codigo} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-900 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedForms([...selectedForms, f.codigo]);
                              } else {
                                setSelectedForms(selectedForms.filter(c => c !== f.codigo));
                              }
                            }}
                            className="accent-amber-500"
                          />
                          <span className="font-semibold text-slate-200">{f.codigo}</span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">{f.nombre}</span>
                        </div>
                        <span className="font-mono text-emerald-400 font-bold text-[11px]">
                          ${f.tarifaUSCIS}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Total Summary Breakdown */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Tarifas Gobierno (USCIS):</span>
                  <span className="font-mono font-bold text-emerald-400">${totalUSCISFees.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Honorarios por Etapas ({selectedSteps.length}):</span>
                  <span className="font-mono font-bold text-amber-300">
                    ${totalMinServices.toLocaleString()} - ${totalMaxServices.toLocaleString()} USD
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white">Inversión Estimada:</span>
                  <div className="text-right font-mono font-black text-amber-400">
                    ${(totalUSCISFees + totalMinServices).toLocaleString()} - ${(totalUSCISFees + totalMaxServices).toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal block">USD</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSendQuoteWhatsApp}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Presupuesto por WhatsApp</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: ORGANIZACIÓN DE LLAMADA (5 PASOS) */}
      {activeSubTab === 'protocolo' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-slate-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Protocolo de Conversión y Confianza Legal</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">
                Diagrama de Flujo: Organización de la Llamada
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                Estructura de 5 pasos diseñada para guiar la conversación con clientes nuevos o con dudas previas (como el señor Elfido), desarmar objeciones y cerrar el caso con autoridad profesional.
              </p>
            </div>

            {/* Visual Step-by-Step Flow */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {ORGANIZACION_LLAMADA_FLOW.map((fase, i) => (
                <div 
                  key={fase.paso}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-500/40">
                        {fase.paso}
                      </span>
                      {i < 4 && (
                        <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white font-serif">
                      {fase.nombre}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {fase.proposito}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-amber-200/90 space-y-1">
                    <span className="font-semibold text-amber-300 block text-[10px] uppercase">
                      Clave de Éxito:
                    </span>
                    <p>{fase.clave}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Advice Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Aplicación Inmediata en el Intake Telefónico
                </h4>
                <p className="text-slate-300">
                  Esta misma estructura está programada paso a paso en el <strong>Asistente de Intake en Vivo</strong> para que cualquier miembro del equipo la siga en tiempo real durante la llamada.
                </p>
              </div>

              {onStartIntake && (
                <button
                  onClick={onStartIntake}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shrink-0"
                >
                  <span>Abrir Asistente de Llamada</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
