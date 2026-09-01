import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertTriangle, FileText, Settings, User, Users, CheckCircle, Search, MessageCircle, CheckSquare, DollarSign, Lock } from 'lucide-react';
import OfficialLookupConsole from '../components/OfficialLookupConsole';
import CoverLetterGenerator from '../components/CoverLetterGenerator';
import OfficeLocator from '../components/OfficeLocator';
import { servicesCatalog } from '../config/servicesData';
import { supabase } from '../lib/supabase';

export default function CrmDashboard() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('es-ES');
  const [copilotData, setCopilotData] = useState<any>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [extractedNumbers, setExtractedNumbers] = useState({ aNumber: '', receiptNumber: '' });
  const [selectedServiceId, setSelectedServiceId] = useState(servicesCatalog[0].id);
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Check support for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
        analyzeTranscript(currentTranscript);
        
        // Auto-scroll to bottom of textarea
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
            setIsListening(false);
        }
      };

      recognition.onend = () => {
         // Auto-restart if it stops unexpectedly but we still want to listen
         if (isListening) {
             recognition.start();
         }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
    
    return () => {
       if (recognitionRef.current) {
           recognitionRef.current.stop();
       }
    };
  }, []); // Run once on mount

  // Phase 7: Load leads from Supabase (fallback to localStorage)
  useEffect(() => {
     const fetchLeads = async () => {
        if (supabase) {
           try {
             const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
             if (data && !error && data.length > 0) {
                 const mapped = data.map((d: any) => ({
                    id: d.id,
                    firstName: d.first_name,
                    lastName: d.last_name,
                    aNumber: d.a_number,
                    phone: d.phone,
                    entryType: d.entry_type,
                    entryDate: d.entry_date,
                    state: d.state,
                    address: d.address,
                    services: d.services,
                    timestamp: d.created_at
                 }));
                 setLeads(mapped);
                 setSelectedLead(mapped[0]);
                 if (mapped[0].services && mapped[0].services.length > 0) {
                    setSelectedServiceId(mapped[0].services[0]);
                 }
                 return; // exit if supabase succeeded
             }
           } catch (e) { console.error("Supabase fetch error:", e); }
        }
        
        // Fallback
        const stored = JSON.parse(localStorage.getItem('acesoria_leads') || '[]');
        setLeads(stored);
        if (stored.length > 0) {
           setSelectedLead(stored[0]);
           if (stored[0].services && stored[0].services.length > 0) {
              setSelectedServiceId(stored[0].services[0]);
           }
        }
     };
     fetchLeads();
  }, []);

  // Update language dynamically
  useEffect(() => {
      if (recognitionRef.current) {
          recognitionRef.current.lang = language;
          if (isListening) {
              recognitionRef.current.stop();
              setTimeout(() => recognitionRef.current.start(), 100);
          }
      }
  }, [language, isListening]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript(''); // Clear previous on new call
      setCopilotData(null);
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const analyzeTranscript = (text: string) => {
    const lower = text.toLowerCase();
    
    // MOCK LLM LOGIC (Keyword based)
    // Real implementation would debounce this and send to LLM API (OpenAI/Gemini)
    /*
    const fetchLLM = async (text) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
           'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           model: 'gpt-4',
           messages: [
             { role: 'system', content: 'ROL Y OBJETIVO: Eres el Copiloto Legal...' },
             { role: 'user', content: text }
           ]
        })
      });
      // Parse response...
    };
    */

    let data = {
       diagnostico: {
         recomendacion: "Analizando...",
         alertas: [] as string[],
         dialogo: "Continúa escuchando..."
       },
       formularios: [] as string[],
       tarifas: 0,
       checklist: [] as string[],
       json: {}
    };

    let shouldTrigger = false;

    if (lower.includes('frontera') || lower.includes('corte') || lower.includes('asilo')) {
       shouldTrigger = true;
       data.diagnostico.recomendacion = "Asilo Defensivo (EOIR)";
       data.diagnostico.alertas.push("1-Year Filing Deadline: Verificar fecha exacta de entrada.");
       data.formularios.push("I-589", "I-765");
       data.tarifas = 0; // I-589 is free
       data.checklist = ["Pasaporte/ID", "Declaración Jurada detallada", "Pruebas de país de origen"];
       
       data.diagnostico.dialogo = "Entiendo que cruzaste por frontera. Necesitamos presentar tu asilo (I-589) antes de cumplir el año para protegerte y poder pedir tu permiso de trabajo.";
    }

    if (lower.includes('miami')) {
       shouldTrigger = true;
       data.diagnostico.alertas.push("Jurisdicción: Corte de Miami. Alta congestión, prepararse para Master Calendar rápido.");
       data.checklist.push("Traducciones certificadas obligatorias para Miami.");
    }
    
    if (lower.includes('licencia')) {
       shouldTrigger = true;
       data.diagnostico.dialogo = "Veo que mencionaste la licencia de conducir. En tu estado, con el recibo oficial del I-589 radicado podemos ir adelantando ese trámite mientras llega el permiso de trabajo.";
    }

    if (shouldTrigger) {
       let foundANumber = '';
       let foundReceipt = '';
       
       if (lower.includes('a-') || lower.match(/a\s*\d{3}/)) {
           foundANumber = "A-123-456-789"; // Mock extraction
       }
       if (lower.includes('ioe') || lower.includes('lin') || lower.includes('src')) {
           foundReceipt = "IOE0912345678"; // Mock extraction
       }

       if (foundANumber || foundReceipt) {
           setExtractedNumbers({ 
              aNumber: foundANumber || extractedNumbers.aNumber, 
              receiptNumber: foundReceipt || extractedNumbers.receiptNumber 
           });
       }

       data.json = {
          client_data: { 
             first_name: selectedLead?.firstName || "Unknown",
             last_name: selectedLead?.lastName || "Unknown",
             a_number: foundANumber || selectedLead?.aNumber || "",
             phone: selectedLead?.phone || "",
             entry_type: lower.includes('frontera') ? "EWI" : (selectedLead?.entryType || "UNKNOWN"), 
             current_state: lower.includes('miami') ? "FL" : (selectedLead?.state || "") 
          },
          immigration_path: data.diagnostico.recomendacion,
          forms_required: data.formularios,
          uscis_fee_total: data.tarifas
       };
       setCopilotData(data);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (pinInput === '1234') { // Default mock PIN, could be configurable
        setIsAuthenticated(true);
     } else {
        alert("PIN Incorrecto. Acceso denegado.");
        setPinInput('');
     }
  };

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative z-10">
              <div className="bg-red-500/20 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                 <Lock className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Área Restringida</h2>
              <p className="text-slate-400 text-sm mb-8">El acceso al CRM y expedientes está protegido por secreto profesional. Ingrese su PIN administrativo.</p>
              
              <form onSubmit={handlePinSubmit}>
                 <input 
                    type="password" 
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-center text-white text-xl tracking-[0.5em] font-mono py-4 rounded-xl mb-6 focus:ring-red-500 focus:border-red-500 transition" 
                    placeholder="••••"
                    required
                 />
                 <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-600/20">
                    Desbloquear Panel
                 </button>
              </form>
              <a href="/" className="block mt-6 text-sm text-slate-500 hover:text-white transition">Volver al Portal Público</a>
           </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Left Panel: Audio & Transcript */}
      <div className="w-full md:w-1/2 p-4 md:p-6 border-r border-slate-800 flex flex-col h-screen">
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-navy-900 p-2 rounded-lg border border-navy-700 shadow-[0_0_15px_rgba(30,58,138,0.5)]">
                 <User className="text-gold-500" size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold font-serif text-white">Copiloto Legal</h1>
                <p className="text-xs text-emerald-400">Live Assistant En Línea</p>
             </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
             <Settings size={16} className="text-slate-400 ml-2" />
             <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border-none focus:ring-0 text-sm py-1 cursor-pointer"
             >
                <option value="es-ES">Español</option>
                <option value="en-US">English</option>
             </select>
          </div>
        </header>

        <div className="bg-slate-900 rounded-xl p-6 flex-1 flex flex-col relative shadow-inner border border-slate-800">
           <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
              <h2 className="font-bold text-slate-300 flex items-center gap-2">
                 Transcripción en Vivo
                 {isListening && <span className="flex h-2 w-2 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>}
              </h2>
              <button 
                 onClick={toggleListening}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'}`}
              >
                 {isListening ? <><MicOff size={18} /> Detener Audio</> : <><Mic size={18} /> Iniciar Escucha</>}
              </button>
           </div>
           
           <textarea 
             ref={textareaRef}
             value={transcript}
             onChange={(e) => {
                setTranscript(e.target.value);
                analyzeTranscript(e.target.value);
             }}
             className="w-full flex-1 bg-transparent border-none text-xl leading-relaxed text-slate-200 placeholder-slate-700 resize-none focus:outline-none focus:ring-0"
             placeholder="Haz clic en 'Iniciar Escucha' o escribe las notas de la llamada aquí..."
           />
        </div>
      </div>

      {/* Right Panel: Teleprompter & Leads */}
      <div className="w-full md:w-1/2 p-4 md:p-6 bg-slate-900/50 flex flex-col h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6 shrink-0">
           <h2 className="text-xl font-bold text-gold-500 flex items-center gap-2">
              <FileText size={20} /> Teleprompter y Leads
           </h2>
           <a href="/" className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded border border-slate-700 text-sm font-bold transition">
              Ir al Portal Público
           </a>
        </div>

        {/* Phase 7: Leads selector */}
        {leads.length > 0 && (
           <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h3 className="text-emerald-400 font-bold mb-3 text-sm flex items-center gap-2"><Users size={16}/> Prospectos Entrantes (Web)</h3>
              <select 
                 className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white font-bold"
                 value={selectedLead?.id || ''}
                 onChange={(e) => {
                    const l = leads.find(x => x.id === e.target.value);
                    setSelectedLead(l);
                    if (l && l.services && l.services.length > 0) {
                       setSelectedServiceId(l.services[0]);
                    }
                 }}
              >
                 {leads.map((l:any) => (
                    <option key={l.id} value={l.id}>
                       {l.firstName} {l.lastName} - {l.phone} ({l.state})
                    </option>
                 ))}
              </select>
           </div>
        )}

        {copilotData ? (
          <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Bloque 1 */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
               <h3 className="text-emerald-400 font-bold mb-4 uppercase text-xs tracking-widest">[1] Diagnóstico Legal</h3>
               <div className="mb-5">
                 <span className="text-slate-400 text-sm block mb-1">Recomendación:</span>
                 <span className="text-2xl font-bold text-white tracking-tight">{copilotData.diagnostico.recomendacion}</span>
               </div>
               
               {copilotData.diagnostico.alertas.length > 0 && (
                 <div className="mb-5 bg-red-950/40 p-4 rounded-lg border border-red-500/30">
                    <span className="text-red-400 font-bold flex items-center gap-2 text-sm mb-2"><AlertTriangle size={18} /> Alertas Críticas:</span>
                    <ul className="list-disc pl-5 text-red-200 text-sm space-y-1">
                       {copilotData.diagnostico.alertas.map((a:string, i:number)=><li key={i}>{a}</li>)}
                    </ul>
                 </div>
               )}

               <div className="bg-navy-950/80 p-5 rounded-lg border border-navy-800 shadow-inner">
                  <span className="text-gold-500 font-bold text-sm block mb-2">Respuesta Sugerida (Léelo al cliente):</span>
                  <p className="text-white text-lg leading-relaxed font-serif tracking-wide">"{copilotData.diagnostico.dialogo}"</p>
               </div>
            </div>

            {/* Bloque 2 & 3 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
               {/* Bloque 2 */}
               <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gold-500"></div>
                  <h3 className="text-gold-400 font-bold mb-4 uppercase text-xs tracking-widest">[2] Formularios</h3>
                  <div className="flex gap-2 flex-wrap mb-6">
                     {copilotData.formularios.map((f:string, i:number)=><span key={i} className="bg-slate-700 px-3 py-1.5 rounded-md text-sm font-bold text-white border border-slate-600 shadow-sm">{f}</span>)}
                  </div>
                  <div className="pt-4 border-t border-slate-700/50">
                     <span className="text-slate-400 text-sm block mb-1">Tarifas Oficiales USCIS:</span>
                     <span className="block text-2xl font-bold text-white">${copilotData.tarifas}</span>
                  </div>
               </div>

               {/* Bloque 3 */}
               <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-navy-500"></div>
                  <h3 className="text-navy-400 font-bold mb-4 uppercase text-xs tracking-widest">[3] Checklist de Pruebas</h3>
                  <ul className="text-slate-300 text-sm space-y-3">
                     {copilotData.checklist.map((c:string, i:number)=>(
                         <li key={i} className="flex gap-3 items-start">
                             <CheckCircle size={16} className="mt-0.5 text-navy-400 shrink-0"/> 
                             <span className="leading-tight">{c}</span>
                         </li>
                     ))}
                  </ul>
               </div>
            </div>

            {/* Bloque 4: Cover Letter & JSON */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 group relative">
               <h3 className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest flex justify-between items-center">
                  <span>[4] Documentación & JSON</span>
               </h3>
               
               <CoverLetterGenerator 
                  clientName={copilotData.json.client_data?.first_name || "[Nombre del Cliente]"} 
                  aNumber={extractedNumbers.aNumber || "[A-Number]"} 
                  formTypes={copilotData.formularios} 
               />

               <pre className="text-xs text-emerald-300/80 overflow-x-auto p-4 bg-slate-950 rounded-lg font-mono border border-slate-900 shadow-inner mt-6">
                  {JSON.stringify(copilotData.json, null, 2)}
               </pre>
            </div>
            
            {/* Seguimiento Operativo (WhatsApp & Cotizaciones) */}
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
               <h3 className="text-slate-400 font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
                  <DollarSign size={14} /> Asignación de Trámite y Cotización
               </h3>
               
               <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-300 mb-2">Trámite a Radicar</label>
                  <select 
                     value={selectedServiceId} 
                     onChange={(e) => setSelectedServiceId(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:border-emerald-500"
                  >
                     {servicesCatalog.map(s => (
                        <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                     ))}
                  </select>
               </div>

               {(() => {
                  const srv = servicesCatalog.find(s => s.id === selectedServiceId)!;
                  const honorarios = 2000;
                  const clientPhone = selectedLead?.phone?.replace(/\D/g, '') || "";
                  const uniqueLink = selectedLead ? `https://bufetelegal.com/client?service=${srv.id}&id=${selectedLead.id}` : `https://bufetelegal.com/client?service=${srv.id}`;
                  const quoteMsg = `Hola ${selectedLead?.firstName || ''}, soy el equipo del Abogado Francisco Hernandez.\n\nTras analizar tu caso, recomendamos iniciar: ${srv.name}.\n\nCotización Oficial:\n- Honorarios: $${honorarios}\n- Tasas USCIS: $${srv.uscisFee}\n- Total Estimado: $${honorarios + srv.uscisFee}\n\nEntra a tu portal seguro para continuar:\n${uniqueLink}`;
                  
                  return (
                     <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                           <span>Honorarios Legales (Base):</span> <strong>$2,000</strong>
                        </div>
                        <div className="flex justify-between text-sm mb-2 text-slate-300">
                           <span>Tasas USCIS ({srv.code}):</span> <strong>${srv.uscisFee}</strong>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-emerald-400 border-t border-slate-700 pt-2 mt-2">
                           <span>Total:</span> <span>${2000 + srv.uscisFee}</span>
                        </div>
                        
                        <a href={`https://wa.me/${clientPhone}?text=${encodeURIComponent(quoteMsg)}`} target="_blank" rel="noreferrer" className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20">
                           <MessageCircle size={18} /> Enviar Cotización por WhatsApp
                        </a>
                     </div>
                  );
               })()}

               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500" /> Tareas del Cliente</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                     <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" /> Fotos 2x2 Entregadas</label>
                     <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" /> Money Order $</label>
                     <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" /> Biométricos Asistidos</label>
                     <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" className="rounded border-slate-600 bg-slate-800 text-emerald-500" /> Docs Subidos al Locker</label>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500" /> Plantillas de Acción Inmediata (WhatsApp)</h4>
                  <div className="grid gap-3">
                     <a href={`https://wa.me/${selectedLead?.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Hola ' + (selectedLead?.firstName||'') + ', te escribo del bufete. Por favor sube las pruebas faltantes a tu portal.')}`} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded border border-slate-700 text-sm transition text-center">
                        📲 Solicitar Pruebas Faltantes
                     </a>
                     <a href={`https://wa.me/${selectedLead?.phone?.replace(/\D/g, '') || ''}?text=${encodeURIComponent('Recordatorio: Tu cita de biométricos está programada. No olvides llevar tu pasaporte.')}`} target="_blank" rel="noreferrer" className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-3 rounded border border-slate-700 text-sm transition text-center">
                        📅 Enviar Recordatorio de Cita
                     </a>
                  </div>
               </div>

               {/* Buscador de Cortes (EOIR) / Oficinas (USCIS) para acceso rápido del abogado */}
               <div className="mt-6">
                  <OfficeLocator />
               </div>
            </div>
          </div>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-900/50">
              <div className="bg-slate-800 p-4 rounded-full mb-6">
                 <Mic size={48} className="text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Teleprompter Inactivo</h3>
              <p className="max-w-sm mx-auto">El análisis automático comenzará al escuchar palabras clave de inmigración durante la llamada.</p>
           </div>
        )}
      </div>

      {/* Floating Console Toggle */}
      <button 
         onClick={() => setIsConsoleOpen(!isConsoleOpen)}
         className={`fixed right-0 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-l-xl shadow-2xl transition z-50 flex items-center gap-2 ${isConsoleOpen ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
      >
         <Search size={20} /> <span className="writing-vertical font-bold text-sm">Consultas</span>
      </button>

      {/* Sliding Console */}
      <div className={`fixed right-0 top-0 h-full w-96 shadow-2xl z-40 transition-transform duration-300 ${isConsoleOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <OfficialLookupConsole 
            theme="dark" 
            isOpen={isConsoleOpen} 
            onClose={() => setIsConsoleOpen(false)}
            extractedData={extractedNumbers}
         />
      </div>
    </div>
  );
}
