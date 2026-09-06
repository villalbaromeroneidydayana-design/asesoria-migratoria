import React, { useState } from 'react';
import { firmData } from '../config/firmData';
import { supabase } from '../lib/supabase';

const BondRefundLanding: React.FC = () => {
  const [bondAmount, setBondAmount] = useState<number | ''>('');
  const [yearsPassed, setYearsPassed] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    serviceType: 'Verificacion_Antes_Contratar',
    name: '',
    phone: '',
    state: '',
    // Nuevos campos para "Antes de Contratar"
    profName: '',
    profPhone: '',
    profWeb: '',
    tramiteOfertado: '',
    precioCobrado: '',
    promesas: '',
    comments: ''
  });

  const amountPresets = [2500, 5000, 7500, 10000, 15000];

  const handleWhatsAppGeneral = (motivo: string) => {
    const message = `Hola, deseo iniciar una verificación sobre: ${motivo}.`;
    window.open(`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const sharePage = (platform: 'whatsapp' | 'facebook' | 'copy') => {
    const text = "¿Vas a pagar por un trámite migratorio? Verifica primero. Mira esta página antes de entregar tu dinero.";
    const url = window.location.href;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Enlace copiado al portapapeles.");
    }
  };

  const handleWhatsAppForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Empaquetando los datos para que no rompa la base de datos si las columnas no existen.
    let combinedStateInfo = formData.state;
    if (formData.serviceType === 'Verificacion_Antes_Contratar') {
      combinedStateInfo = `Estado: ${formData.state} | Prof: ${formData.profName} | TelProf: ${formData.profPhone} | Web: ${formData.profWeb} | Trámite: ${formData.tramiteOfertado} | Precio: ${formData.precioCobrado} | Promesas: ${formData.promesas} | Notas: ${formData.comments}`;
    }

    // Por seguridad en Supabase, si no han cambiado el constraint de la BD, mapeamos los valores nuevos a los viejos cuando aplique.
    let dbServiceType = formData.serviceType;
    if (dbServiceType === 'Verificacion_Tramite') dbServiceType = 'Auditoria';
    if (dbServiceType === 'Verificacion_Fianza') dbServiceType = 'Fianza';
    if (dbServiceType === 'Verificacion_Documental') dbServiceType = 'Documental';

    try {
      if (supabase) {
        await supabase.from('fianzas_leads').insert([
          {
            nombre: formData.name,
            telefono: formData.phone,
            estado: combinedStateInfo,
            monto: formData.precioCobrado || "N/A", // Reutilizamos monto para precio en este caso
            referido: "N/A",
            tipo_servicio: dbServiceType,
            timestamp: new Date().toISOString(),
          }
        ]);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      // En caso de error de constraint, abrimos whatsapp directamente
      handleWhatsAppGeneral("Solicitud de Verificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-gold-500 selection:text-navy-900 overflow-x-hidden scroll-smooth">
      
      {/* Top Security Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-xs py-2 px-4 flex flex-wrap justify-center sm:justify-between items-center gap-2 text-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-slate-400"></i>
          <span>Servicio Independiente de Investigación y Orientación Documental</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <i className="fa-solid fa-lock"></i>
          <span>Conexión Cifrada SSL 256-Bit | Privacidad de Datos</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-magnifying-glass-chart text-navy-900 text-3xl"></i>
          <div>
            <h1 className="font-serif font-black text-lg md:text-xl text-navy-900 tracking-tight leading-none">Centro Nacional de Verificación</h1>
            <p className="text-xs md:text-sm text-gold-600 font-bold tracking-wide">Documental & Audit Services</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right mr-4 border-r border-slate-200 pr-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Atención Confidencial</p>
            <p className="font-bold text-navy-900 text-lg">
              <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                {firmData.phone}
              </a>
            </p>
          </div>
          <a 
            href="#formulario"
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition shadow-lg"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Iniciar Consulta</span>
          </a>
        </div>
      </header>

      {/* Aviso de Transparencia */}
      <div className="bg-slate-800 border-b border-slate-700 text-slate-300 text-xs py-3 px-6 text-center shadow-inner">
        <strong>Aviso Oficial:</strong> No somos una agencia gubernamental. Somos un servicio independiente enfocado en contrastar información con bases de datos públicas y registros oficiales cuando estén disponibles.
      </div>

      {/* 1. HERO SECTION DUAL */}
      <section className="bg-navy-900 text-white py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/40"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-serif leading-[1.1] text-white tracking-tight drop-shadow-2xl uppercase">
            ¿YA PAGÓ O ESTÁ A PUNTO DE <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-200 to-gold-400">CONTRATAR UN TRÁMITE DE INMIGRACIÓN?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Antes de seguir entregando dinero —o antes de entregar su primer pago— compruebe qué información puede verificarse sobre el trámite, los documentos y la persona o empresa que le ofrece el servicio.
          </p>

          <div className="inline-block bg-slate-800/80 border-l-4 border-gold-500 rounded-r-xl p-4 mb-12 text-center shadow-2xl">
            <p className="font-bold text-white tracking-widest uppercase md:text-lg">
              <i className="fa-solid fa-check-double text-gold-500 mr-2"></i>
              NO ACUSAMOS. NO INVENTAMOS. NO PROMETEMOS. <span className="text-gold-400">VERIFICAMOS.</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a 
              href="#formulario"
              onClick={() => setFormData({...formData, serviceType: 'Verificacion_Antes_Contratar'})}
              className="bg-navy-800 hover:bg-navy-700 border border-blue-400/30 text-white font-black py-6 px-8 rounded-2xl shadow-2xl transition transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 group-hover:opacity-40 transition"></div>
              <div className="flex items-center gap-3 text-blue-400 text-sm tracking-widest uppercase">
                <i className="fa-solid fa-circle text-[8px] animate-pulse"></i> VOY A CONTRATAR
              </div>
              <span className="text-2xl">QUIERO VERIFICAR PRIMERO</span>
            </a>
            
            <a 
              href="#formulario"
              onClick={() => setFormData({...formData, serviceType: 'Verificacion_Tramite'})}
              className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-6 px-8 rounded-2xl shadow-2xl shadow-gold-500/20 transition transform hover:-translate-y-1 flex flex-col items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 group-hover:opacity-60 transition"></div>
              <div className="flex items-center gap-3 text-navy-800/70 text-sm tracking-widest uppercase">
                <i className="fa-solid fa-circle text-[8px]"></i> YA PAGUÉ
              </div>
              <span className="text-2xl">QUIERO VERIFICAR MI CASO</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ANTES DE PAGAR, VERIFIQUE */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-6 font-serif">ANTES DE PAGAR, VERIFIQUE.</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              ¿Alguien le ofreció realizar un trámite migratorio y está pensando en contratarlo? Antes de entregar documentos o realizar un pago, puede solicitar una revisión independiente de la información disponible sobre el profesional, representante o empresa y sobre el servicio que le están ofreciendo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg text-center">
              <i className="fa-solid fa-id-card text-4xl text-navy-900 mb-6"></i>
              <h3 className="font-black text-navy-900 mb-3">IDENTIDAD E INFORMACIÓN PROFESIONAL</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Información proporcionada sobre la persona, firma o empresa.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg text-center">
              <i className="fa-solid fa-globe text-4xl text-blue-600 mb-6"></i>
              <h3 className="font-black text-navy-900 mb-3">REGISTROS DISPONIBLES</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Fuentes oficiales y registros públicos que técnicamente puedan consultarse.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg text-center">
              <i className="fa-solid fa-handshake-angle text-4xl text-gold-500 mb-6"></i>
              <h3 className="font-black text-navy-900 mb-3">SERVICIO OFRECIDO</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Qué trámite afirma realizar, qué documentos solicita y qué condiciones fueron comunicadas.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg text-center">
              <i className="fa-solid fa-triangle-exclamation text-4xl text-orange-500 mb-6"></i>
              <h3 className="font-black text-navy-900 mb-3">SEÑALES DE INCONSISTENCIA</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Diferencias entre la información proporcionada y aquello que pueda ser contrastado.</p>
            </div>
          </div>

          <div className="bg-slate-100 p-6 rounded-xl border-l-4 border-slate-400 text-sm text-slate-600 max-w-4xl mx-auto flex gap-4 items-start">
            <i className="fa-solid fa-circle-info text-xl text-slate-400 mt-1"></i>
            <p>Una verificación no constituye una recomendación profesional ni garantiza un resultado migratorio. Una información que no pueda encontrarse tampoco significa por sí sola que exista fraude.</p>
          </div>
        </div>
      </section>

      {/* 3. ¿QUÉ VERIFICAMOS? (AMPLIADO) */}
      <section className="py-20 px-6 md:px-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-serif">¿Qué Verificamos?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-solid fa-magnifying-glass"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">ANTES DE CONTRATAR</h3>
                <p className="text-sm text-slate-400">Información disponible sobre la persona, representante o empresa que ofrece el servicio, así como datos relacionados con el trámite que afirma realizar.</p>
              </div>
            </div>
            
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-solid fa-user-tie"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">PERSONA / PROFESIONAL</h3>
                <p className="text-sm text-slate-400">Información disponible sobre quien ofrece el servicio.</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-regular fa-folder-open"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">TRÁMITE</h3>
                <p className="text-sm text-slate-400">Información y evidencia disponible relacionada con el trámite que afirma realizar.</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-solid fa-file-contract"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">DOCUMENTOS</h3>
                <p className="text-sm text-slate-400">Recibos, formularios, cartas, contratos y demás documentación proporcionada.</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-solid fa-building"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">EMPRESA / REPRESENTANTE</h3>
                <p className="text-sm text-slate-400">Información disponible sobre la empresa, representante o profesional.</p>
              </div>
            </div>

            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition flex gap-6">
              <div className="text-gold-500 text-3xl shrink-0"><i className="fa-solid fa-money-bill-transfer"></i></div>
              <div>
                <h3 className="font-bold text-white mb-2">FIANZA</h3>
                <p className="text-sm text-slate-400">Documentación e información disponible relacionada con la fianza, cuando corresponda.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TIPOS DE VERIFICACIÓN (SIN PRECIOS) */}
      <section className="py-20 px-6 md:px-12 bg-slate-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-6 font-serif">¿Qué tipo de verificación necesita?</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Cada situación es diferente. Cuéntenos qué necesita verificar y revisaremos qué tipo de investigación corresponde a su caso. Una revisión independiente puede ayudarle a tomar una decisión con más información.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Tier 1 */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 flex flex-col hover:border-emerald-500 hover:shadow-2xl transition">
              <div className="mb-6">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Para los que NO han pagado</span>
                <h3 className="text-2xl font-black text-navy-900 mt-4 mb-2">Verificación Antes de Contratar</h3>
                <p className="text-slate-500 text-xs mt-2">Revisión de la información disponible sobre un profesional, representante o empresa antes de iniciar un trámite o realizar un pago.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> Información profesional proporcionada</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> Registros y fuentes disponibles</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> Información sobre el servicio ofrecido</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> Documentación básica proporcionada</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> Señales de inconsistencia</li>
                <li className="flex gap-3 font-bold text-navy-900"><i className="fa-solid fa-file-pdf text-red-500 mt-1"></i> Informe de verificación previa</li>
              </ul>
              <a href="#formulario" onClick={() => setFormData({...formData, serviceType: 'Verificacion_Antes_Contratar'})} className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold py-4 rounded-xl text-center transition">
                QUIERO VERIFICAR ANTES DE PAGAR
              </a>
            </div>

            {/* Tier 2 */}
            <div className="bg-navy-900 rounded-3xl shadow-2xl border-4 border-gold-500 p-8 flex flex-col transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-navy-900 text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Más Solicitado
              </div>
              <div className="mb-6 mt-2">
                <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Para los que YA pagaron</span>
                <h3 className="text-2xl font-black text-white mt-4 mb-2">Verificación de Caso</h3>
                <p className="text-slate-400 text-xs mt-2">Para personas que ya entregaron dinero y necesitan revisar qué puede comprobarse.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Organización de documentación</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Recibos y comprobantes</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Información del trámite</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Fuentes disponibles</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Información del representante</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-gold-500 mt-1"></i> Coincidencias e inconsistencias</li>
                <li className="flex gap-3 font-bold text-white"><i className="fa-solid fa-file-pdf text-red-500 mt-1"></i> Informe documentado</li>
              </ul>
              <a href="#formulario" onClick={() => setFormData({...formData, serviceType: 'Verificacion_Tramite'})} className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-4 rounded-xl text-center transition shadow-lg">
                YA PAGUÉ — QUIERO VERIFICAR
              </a>
            </div>

            {/* Tier 3 */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 flex flex-col hover:border-blue-500 hover:shadow-2xl transition">
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Revisión Ampliada</span>
                <h3 className="text-2xl font-black text-navy-900 mt-4 mb-2">Investigación Completa</h3>
                <p className="text-slate-500 text-xs mt-2">Para casos que requieren una revisión documental mucho más extensa.</p>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-600">
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Verificación de trámite</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Revisión documental</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Información del representante</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Revisión de fianza cuando corresponda</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Contraste de información</li>
                <li className="flex gap-3"><i className="fa-solid fa-check text-blue-500 mt-1"></i> Identificación de inconsistencias</li>
                <li className="flex gap-3 font-bold text-navy-900"><i className="fa-solid fa-file-pdf text-red-500 mt-1"></i> Informe completo</li>
              </ul>
              <a href="#formulario" onClick={() => setFormData({...formData, serviceType: 'Investigacion_Completa'})} className="w-full bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold py-4 rounded-xl text-center transition border border-slate-300">
                NECESITO UNA INVESTIGACIÓN COMPLETA
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-xs text-slate-500 max-w-3xl mx-auto italic">
            El servicio no garantiza resultados migratorios, devolución de dinero ni determina por sí solo que una persona haya cometido fraude. Tampoco certificamos si un profesional es legítimo o confiable; únicamente verificamos información disponible.
          </div>
        </div>
      </section>

      {/* 5. EL SEMÁFORO Y FLUJO LÓGICO */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h3 className="text-lg font-bold text-gold-500 uppercase tracking-widest mb-2">El Proceso de Revisión</h3>
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-8 font-serif">¿Está pensando en contratar a alguien?</h2>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
              <p className="text-sm text-slate-700 font-bold mb-4">Antes de pagar, puede solicitar una revisión de la información disponible. Revisamos:</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-navy-900 shadow">1</div> <span>Lo que le dijeron</span></div>
                <div className="flex items-center gap-4 pl-4 border-l-2 border-slate-300 ml-4 h-4"><i className="fa-solid fa-arrow-down text-slate-300"></i></div>
                <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-navy-900 shadow">2</div> <span>Lo que usted recibió</span></div>
                <div className="flex items-center gap-4 pl-4 border-l-2 border-slate-300 ml-4 h-4"><i className="fa-solid fa-arrow-down text-slate-300"></i></div>
                <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-navy-900 shadow">3</div> <span>Lo que puede comprobarse</span></div>
                <div className="flex items-center gap-4 pl-4 border-l-2 border-slate-300 ml-4 h-4"><i className="fa-solid fa-arrow-down text-slate-300"></i></div>
                <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center font-bold text-white shadow">4</div> <span className="font-bold text-navy-900">Lo que NO pudo comprobarse</span></div>
              </div>
            </div>
          </div>

          {/* Resultados Semáforo */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Resultados del Informe</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <h4 className="font-bold text-emerald-400">INFORMACIÓN CONSISTENTE</h4>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                <h4 className="font-bold text-yellow-400">REQUIERE VERIFICACIÓN ADICIONAL</h4>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                <h4 className="font-bold text-orange-400">INCONSISTENCIAS DETECTADAS</h4>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                <h4 className="font-bold text-red-400">NO SE PUDO CONFIRMAR</h4>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.8)]"></div>
                <h4 className="font-bold text-slate-400">INFORMACIÓN INSUFICIENTE</h4>
              </div>
            </div>
            <div className="mt-6 text-xs text-slate-400 italic bg-black/20 p-4 rounded-lg border border-white/5">
              Los resultados representan el nivel de información que pudo ser contrastado durante la investigación. Un resultado de verificación no constituye por sí mismo una acusación de fraude. Documentamos lo que encontramos y también aquello que no pudimos confirmar.
            </div>
          </div>
        </div>
      </section>

      {/* 6. BLOQUE VIRAL (NUEVO) */}
      <section className="py-20 px-6 md:px-12 bg-gold-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-navy-900 font-bold uppercase tracking-widest mb-4">Verifica antes de pagar</p>
          <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-8 font-serif leading-tight">
            ¿CONOCES A ALGUIEN QUE ESTÁ A PUNTO DE ENTREGAR DINERO POR UN TRÁMITE MIGRATORIO?
          </h2>
          <p className="text-xl text-navy-800 mb-4 font-bold">Comparte esta página antes de que pague.</p>
          <p className="text-navy-900/80 mb-10 max-w-2xl mx-auto">
            No importa quién le recomendó el servicio. No importa cuántos seguidores tenga. Antes de pagar, organice la información y compruebe qué puede verificarse.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => sharePage('whatsapp')} className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
              <i className="fa-brands fa-whatsapp text-2xl"></i> COMPARTIR POR WHATSAPP
            </button>
            <button onClick={() => sharePage('facebook')} className="w-full sm:w-auto bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-4 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
              <i className="fa-brands fa-facebook text-2xl"></i> COMPARTIR EN FACEBOOK
            </button>
            <button onClick={() => sharePage('copy')} className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
              <i className="fa-regular fa-copy text-xl"></i> COPIAR ENLACE
            </button>
          </div>
        </div>
      </section>

      {/* 7. REPRESENTANTES Y ABOGADOS */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h3 className="text-3xl font-black text-navy-900 mb-6 font-serif">Profesionales, Representantes y Empresas</h3>
            <p className="text-slate-700 mb-4 leading-relaxed">
              Revisamos la información disponible sobre la persona, profesional, representante o empresa que afirma ofrecer o gestionar un servicio migratorio y la contrastamos con fuentes que puedan consultarse técnicamente.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed font-bold bg-slate-50 p-4 rounded-lg border border-slate-200">
              <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
              No calificamos la calidad profesional del abogado ni garantizamos su actuación. Verificamos información disponible y documentamos aquello que pudo o no pudo ser confirmado.
            </p>
          </div>
          <div className="md:w-1/2">
             <div className="space-y-3">
              <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 hover:border-navy-900 hover:shadow-md transition">
                <i className="fa-solid fa-building-flag text-navy-900"></i>
                <span className="font-bold text-slate-800 text-sm">USCIS (Servicios de Ciudadanía e Inmigración)</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 ml-auto text-xs"></i>
              </a>
              <a href="https://www.ice.gov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 hover:border-navy-900 hover:shadow-md transition">
                <i className="fa-solid fa-building-shield text-navy-900"></i>
                <span className="font-bold text-slate-800 text-sm">ICE (Inmigración y Control de Aduanas)</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 ml-auto text-xs"></i>
              </a>
              <a href="https://www.justice.gov/eoir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 hover:border-navy-900 hover:shadow-md transition">
                <i className="fa-solid fa-scale-balanced text-navy-900"></i>
                <span className="font-bold text-slate-800 text-sm">EOIR (Oficina Ejecutiva para Revisión Migratoria)</span>
                <i className="fa-solid fa-arrow-up-right-from-square text-slate-300 ml-auto text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PROGRAMA DE REFERIDOS (ACTUALIZADO) */}
      <section className="py-12 px-6 md:px-12 bg-slate-900 border-y border-slate-800">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Ayude a proteger a su comunidad
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              ¿Conoce a alguien que ya pagó por un trámite o está a punto de contratarlo? Comparta esta página para que pueda conocer las opciones de verificación disponibles.
            </p>
            <button 
              onClick={() => sharePage('whatsapp')}
              className="inline-block bg-white text-navy-900 font-bold py-3 px-8 rounded-xl transition shadow-lg hover:bg-slate-200"
            >
              COMPARTIR CON ALGUIEN
            </button>
          </div>
          <div className="flex-1 w-full relative border-4 border-slate-700 rounded-2xl overflow-hidden shadow-2xl h-64">
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" alt="Comunidad" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </section>

      {/* 9. FORMULARIO FINAL */}
      <section id="formulario" className="py-20 px-6 md:px-12 bg-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <p className="text-gold-600 font-bold tracking-widest uppercase mb-4">Antes de pagar, verifique.</p>
            <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 font-serif leading-tight">
              Puede tomar unos minutos organizar la información antes de entregar su dinero.
            </h2>
            <p className="text-lg text-slate-600 mb-10">
              No tienes que creernos. Puedes comprobarlo.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setFormData({...formData, serviceType: 'Verificacion_Antes_Contratar'})}
                className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg text-lg border-2 ${formData.serviceType === 'Verificacion_Antes_Contratar' ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-navy-900 border-navy-900 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-file-circle-check text-2xl"></i>
                <span>VOY A CONTRATAR — VERIFICAR PRIMERO</span>
              </button>
              <button 
                onClick={() => setFormData({...formData, serviceType: 'Verificacion_Tramite'})}
                className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg text-lg border-2 ${formData.serviceType === 'Verificacion_Tramite' ? 'bg-gold-500 text-navy-900 border-gold-500' : 'bg-white text-navy-900 border-slate-300 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-magnifying-glass-chart text-2xl"></i>
                <span>YA PAGUÉ — VERIFICAR MI CASO</span>
              </button>
            </div>
          </div>

          {/* Formulario Dinámico */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-8 border-navy-900">
            <h3 className="text-2xl font-black text-navy-900 mb-2">Solicitud de Verificación</h3>
            <p className="text-slate-500 text-sm mb-6">Complete la información para iniciar el proceso de revisión independiente.</p>
            <form onSubmit={handleWhatsAppForm} className="space-y-5">
              {isSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-200 text-center animate-pulse">
                  <i className="fa-solid fa-circle-check text-4xl text-emerald-500 mb-2"></i>
                  <h4 className="font-bold text-lg">¡Solicitud Recibida!</h4>
                  <p className="text-sm mt-1">Nos pondremos en contacto contigo pronto. Si deseas atención inmediata, toca el botón de WhatsApp abajo.</p>
                  <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=Acabo%20de%20enviar%20mi%20solicitud%20de%20verificaci%C3%B3n`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-navy-900 text-white px-6 py-2 rounded-lg font-bold">Hablar por WhatsApp</a>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Servicio a Solicitar</label>
                    <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 font-bold text-navy-900">
                      <option value="Verificacion_Antes_Contratar">Verificación Antes de Contratar</option>
                      <option value="Verificacion_Tramite">Verificación de Caso Ya Pagado</option>
                      <option value="Investigacion_Completa">Investigación Completa</option>
                      <option value="Verificacion_Fianza">Solo Verificación de Fianza</option>
                      <option value="Verificacion_Documental">Solo Revisión Documental</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Su Nombre</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Nombre completo" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Teléfono / WhatsApp</label>
                      <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="(123) 456-7890" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Estado Actual en EE. UU.</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Ej. Texas, California..." />
                  </div>

                  {/* CAMPOS DINÁMICOS PARA "ANTES DE CONTRATAR" */}
                  {formData.serviceType === 'Verificacion_Antes_Contratar' && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2"><i className="fa-solid fa-user-shield"></i> Datos de quien ofrece el servicio</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Nombre / Empresa</label>
                          <input type="text" value={formData.profName} onChange={e => setFormData({...formData, profName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Ej. Abogado Juan Pérez" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Teléfono del Profesional</label>
                          <input type="text" value={formData.profPhone} onChange={e => setFormData({...formData, profPhone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Opcional" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Red Social / Sitio Web</label>
                        <input type="text" value={formData.profWeb} onChange={e => setFormData({...formData, profWeb: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Página de Facebook, web, etc." />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Trámite que ofrecen</label>
                          <input type="text" value={formData.tramiteOfertado} onChange={e => setFormData({...formData, tramiteOfertado: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Ej. Asilo, TPS..." />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Precio Cobrado</label>
                          <input type="text" value={formData.precioCobrado} onChange={e => setFormData({...formData, precioCobrado: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="$..." />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">¿Qué le prometieron?</label>
                        <input type="text" value={formData.promesas} onChange={e => setFormData({...formData, promesas: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Ej. Permiso de trabajo en 1 mes" />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase">Comentarios Adicionales</label>
                        <textarea value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} rows={2} className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-navy-500 text-sm" placeholder="Información extra..."></textarea>
                      </div>
                    </div>
                  )}
                  
                  <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg text-lg flex justify-center items-center gap-2">
                    {isSubmitting ? (
                      <><i className="fa-solid fa-spinner fa-spin"></i> Registrando...</>
                    ) : (
                      'Enviar Solicitud'
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-3"><i className="fa-solid fa-lock"></i> Sus datos son confidenciales y solo se usan para contacto inicial.</p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 10. FOOTER AVISO LEGAL */}
      <footer className="bg-navy-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-4">Centro Nacional de Verificación</h4>
            <p className="mb-2"><i className="fa-solid fa-building-flag mr-2 text-gold-500"></i> Sede: {firmData.officeAddress}</p>
            <p className="mb-2">
              <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">
                <i className="fa-brands fa-whatsapp mr-2 text-gold-500"></i> {firmData.phone}
              </a>
            </p>
            <p><i className="fa-solid fa-envelope mr-2 text-gold-500"></i> {firmData.email}</p>
          </div>
          <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><i className="fa-solid fa-scale-unbalanced text-gold-500"></i> Aviso Legal e Independencia</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              Somos un servicio independiente de investigación y orientación documental. No somos ICE, USCIS, DHS ni ninguna agencia del Gobierno de Estados Unidos.
            </p>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              La investigación realizada no constituye asesoría legal ni garantiza la aprobación de un trámite, la devolución de una fianza o cualquier resultado migratorio.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              Una información no encontrada o no verificada no significa necesariamente que no exista. El resultado de nuestro informe depende estrictamente de la información disponible en el momento y de las fuentes públicas u oficiales que puedan consultarse técnicamente. No sustituimos a un abogado licenciado.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center mt-12 pt-8 border-t border-slate-800 text-xs">
          <p className="font-bold text-slate-300 mb-2">NO TIENES QUE CREERNOS. PUEDES COMPROBARLO.</p>
          &copy; {new Date().getFullYear()} Centro Nacional de Verificación Documental. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
};

export default BondRefundLanding;
