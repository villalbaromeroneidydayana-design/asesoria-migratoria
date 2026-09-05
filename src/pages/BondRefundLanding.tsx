import React, { useState } from 'react';
import { firmData } from '../config/firmData';
import { supabase } from '../lib/supabase';

const BondRefundLanding: React.FC = () => {
  const [bondAmount, setBondAmount] = useState<number | ''>('');
  const [yearsPassed, setYearsPassed] = useState<number | ''>('');
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', amount: '', referredBy: '', serviceType: 'Verificacion_Tramite' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const amountPresets = [2500, 5000, 7500, 10000, 15000];

  const handleWhatsAppCalc = () => {
    const yearPaid = yearsPassed !== '' ? (new Date().getFullYear() - Number(yearsPassed)) : '___';
    const message = `Hola, deseo evaluar una fianza de $${bondAmount || '___'} depositada en el año ${yearPaid} para saber qué información se puede verificar.`;
    window.open(`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppGeneral = (motivo: string) => {
    const message = `Hola, deseo iniciar una verificación sobre: ${motivo}.`;
    window.open(`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (supabase) {
        await supabase.from('fianzas_leads').insert([
          {
            nombre: formData.name,
            telefono: formData.phone,
            estado: formData.state,
            monto: formData.amount,
            referido: formData.referredBy,
            tipo_servicio: formData.serviceType,
            timestamp: new Date().toISOString(),
          }
        ]);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-gold-500 selection:text-navy-900 overflow-x-hidden">
      
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
          <button 
            onClick={() => handleWhatsAppGeneral("Verificación Documental")}
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition shadow-lg"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Iniciar Consulta</span>
          </button>
        </div>
        <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="md:hidden bg-navy-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <i className="fa-brands fa-whatsapp text-xl"></i>
        </a>
      </header>

      {/* Aviso de Transparencia */}
      <div className="bg-slate-800 border-b border-slate-700 text-slate-300 text-xs py-3 px-6 text-center shadow-inner">
        <strong>Aviso Oficial:</strong> No somos una agencia gubernamental. Somos un servicio independiente enfocado en contrastar información con bases de datos públicas y registros oficiales cuando estén disponibles.
      </div>

      {/* 1. HERO SECTION */}
      <section className="bg-navy-900 text-white py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-navy-900/40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-3/5 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-serif leading-[1.1] text-white tracking-tight drop-shadow-2xl">
              ¿PAGÓ POR UN TRÁMITE DE INMIGRACIÓN <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-200 to-gold-400">Y NO SABE SI REALMENTE LO HICIERON?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Antes de seguir pagando, verifique qué puede comprobarse sobre su trámite, su fianza y la documentación que le entregaron.
            </p>

            <div className="inline-block bg-slate-800/80 border-l-4 border-gold-500 rounded-r-xl p-4 mb-10 text-left">
              <p className="font-bold text-white tracking-widest uppercase text-sm sm:text-base">
                <i className="fa-solid fa-check-double text-gold-500 mr-2"></i>
                NO ACUSAMOS. NO PROMETEMOS. VERIFICAMOS.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => handleWhatsAppGeneral("Verificar mi caso")}
                className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-4 px-8 rounded-xl shadow-lg shadow-gold-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-file-shield text-xl"></i> VERIFICAR MI CASO
              </button>
              <button 
                onClick={() => handleWhatsAppGeneral("Verificar mi fianza")}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-8 rounded-xl shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-money-check-dollar text-xl"></i> ¿PAGÓ UNA FIANZA? VERIFICARLA
              </button>
            </div>
          </div>
          
          {/* CALCULADORA (Evaluación de Fianza) */}
          <div className="lg:w-2/5 w-full relative z-20 mt-12 lg:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-slate-500 rounded-[2rem] blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/40 text-slate-800 transform hover:-translate-y-2 transition duration-500">
              
              <div className="text-center mb-6">
                <i className="fa-solid fa-magnifying-glass text-4xl text-navy-900 mb-3"></i>
                <h3 className="text-2xl font-black text-navy-900 mb-1">Evaluación de Fianza</h3>
                <p className="text-slate-500 text-sm">Descubra qué información podemos investigar sobre su fianza.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Valor de la Fianza Pagada</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {amountPresets.map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setBondAmount(amt)}
                        className={`px-3 py-1 text-sm font-bold rounded-md transition ${bondAmount === amt ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        ${amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      value={bondAmount}
                      onChange={(e) => setBondAmount(Number(e.target.value) || '')}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 font-bold text-lg"
                      placeholder="Monto exacto..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">¿En qué año se pagó?</label>
                  <select 
                    value={yearsPassed}
                    onChange={(e) => setYearsPassed(Number(e.target.value) || '')}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 font-bold text-lg"
                  >
                    <option value="">Seleccione el año</option>
                    {[...Array(15)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={i}>{year}</option>
                    })}
                  </select>
                </div>

                <div className="bg-slate-100 rounded-xl p-4 text-center mt-4 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    <i className="fa-solid fa-circle-info text-slate-400 mr-1"></i>
                    Esta evaluación preliminar nos ayuda a entender la antigüedad del caso. <strong>Esta información es únicamente orientativa y no confirma que exista un reembolso.</strong>
                  </p>
                </div>

                <button 
                  onClick={handleWhatsAppCalc}
                  className="w-full mt-2 bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-lg group"
                >
                  <i className="fa-solid fa-shield-halved text-xl group-hover:scale-110 transition"></i>
                  <span>Iniciar Verificación</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ¿POR QUÉ VERIFICAR ANTES DE PAGAR MÁS? */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-6 font-serif">¿Por qué verificar antes de pagar más?</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Muchas personas pagan durante meses por trámites migratorios sin saber exactamente qué se ha presentado, qué documentos existen o cuál es el estado de su proceso. <strong>Nuestro objetivo es ayudarle a organizar la información disponible y contrastarla con fuentes y registros oficiales cuando sea posible.</strong>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
                <i className="fa-solid fa-comment-dots"></i>
              </div>
              <h3 className="font-black text-navy-900 text-xl mb-3">LO QUE LE DIJERON</h3>
              <p className="text-slate-600 text-sm">Las promesas verbales, garantías de éxito o tiempos de espera que le comunicó quien tomó su caso inicial.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 relative transform transition hover:-translate-y-1 hover:shadow-lg mt-8 md:mt-0">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              <h3 className="font-black text-navy-900 text-xl mb-3">LO QUE APARECE EN LA DOCUMENTACIÓN</h3>
              <p className="text-slate-600 text-sm">Los recibos, cartas, folios y notificaciones físicas que usted tiene en su poder actualmente.</p>
            </div>

            <div className="bg-navy-900 text-white rounded-2xl p-8 border border-gold-500/30 relative transform transition hover:-translate-y-1 shadow-xl mt-8 md:mt-0">
              <div className="w-16 h-16 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg">
                <i className="fa-solid fa-magnifying-glass-chart"></i>
              </div>
              <h3 className="font-black text-gold-400 text-xl mb-3">LO QUE PUDIMOS VERIFICAR</h3>
              <p className="text-slate-300 text-sm">El cruce real de esos datos con los sistemas disponibles para saber si lo que le dijeron y lo que le dieron coincide con la realidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ¿QUÉ PODEMOS VERIFICAR? */}
      <section className="py-20 px-6 md:px-12 bg-slate-100 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-4 font-serif">¿Qué podemos verificar?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Analizamos minuciosamente cuatro áreas clave de su expediente migratorio para brindarle claridad total.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition">
              <div className="text-gold-500 text-4xl shrink-0"><i className="fa-regular fa-folder-open"></i></div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Trámites Migratorios</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Verificamos la información disponible para determinar si existe evidencia de que el trámite fue presentado y cuál es el estado que puede comprobarse en los sistemas respectivos.</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition">
              <div className="text-gold-500 text-4xl shrink-0"><i className="fa-solid fa-user-tie"></i></div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Representantes y Abogados</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Revisamos la información disponible sobre la persona que afirma representar o gestionar el caso y contrastamos la información proporcionada por el cliente con directorios oficiales.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition">
              <div className="text-gold-500 text-4xl shrink-0"><i className="fa-solid fa-file-contract"></i></div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Fianzas de Inmigración</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Investigamos la documentación relacionada con la fianza, monto, referencias, datos del Obligor y la posible procedencia de devolución, según la información disponible.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex gap-6 hover:shadow-md transition">
              <div className="text-gold-500 text-4xl shrink-0"><i className="fa-solid fa-list-check"></i></div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Documentos y Comprobantes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">Revisamos minuciosamente fechas, números de recibos, montos declarados y la coherencia general entre todos los documentos que le fueron proporcionados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EL PROCESO DE VERIFICACIÓN */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-4 font-serif">El Proceso de Verificación</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Un flujo estructurado, lógico y documentado para llegar a la verdad sobre su trámite.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-1 bg-slate-200 -z-10 w-3/4 mx-auto"></div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-4 border-4 border-white shadow-lg"><i className="fa-solid fa-inbox"></i></div>
              <h3 className="font-bold text-navy-900 mb-2 uppercase text-sm">Paso 1: Recopilamos la Información</h3>
              <p className="text-xs text-slate-600">El cliente proporciona los documentos, recibos e información necesarios para iniciar nuestra investigación privada.</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-4 border-4 border-white shadow-lg"><i className="fa-solid fa-layer-group"></i></div>
              <h3 className="font-bold text-navy-900 mb-2 uppercase text-sm">Paso 2: Organizamos y Contrastamos</h3>
              <p className="text-xs text-slate-600">Comparamos nombres, fechas, números de folio, montos, recibos y demás información relevante que entregó.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-xl mx-auto mb-4 border-4 border-white shadow-lg"><i className="fa-solid fa-globe"></i></div>
              <h3 className="font-bold text-navy-900 mb-2 uppercase text-sm">Paso 3: Consultamos Fuentes Disponibles</h3>
              <p className="text-xs text-slate-600">Cuando técnicamente sea posible, contrastamos la información con fuentes y sistemas oficiales correspondientes.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm">
              <div className="w-16 h-16 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center text-xl mx-auto mb-4 border-4 border-white shadow-lg"><i className="fa-solid fa-file-pdf"></i></div>
              <h3 className="font-bold text-navy-900 mb-2 uppercase text-sm">Paso 4: Entregamos el Resultado</h3>
              <p className="text-xs text-slate-600">El cliente recibe un informe detallado con todo lo hallado, las inconsistencias y posibles próximos pasos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RESULTADOS Y EL INFORME DE VERIFICACIÓN */}
      <section className="py-20 px-6 md:px-12 bg-slate-900 border-t border-slate-800 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Resultados */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 font-serif">Posibles Resultados</h2>
            <p className="text-slate-400 mb-10 text-lg">Al finalizar la investigación, su trámite o fianza se clasificará bajo uno de estos estados estrictamente documentados:</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                <div>
                  <h4 className="font-bold text-emerald-400">VERIFICADO</h4>
                  <p className="text-xs text-slate-300">La información disponible presenta evidencia consistente y real.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                <div>
                  <h4 className="font-bold text-yellow-400">EN VERIFICACIÓN</h4>
                  <p className="text-xs text-slate-300">Existe información, pero todavía requiere comprobación adicional.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                <div>
                  <h4 className="font-bold text-orange-400">INCONSISTENCIAS DETECTADAS</h4>
                  <p className="text-xs text-slate-300">Encontramos diferencias importantes que deben revisarse inmediatamente.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                <div>
                  <h4 className="font-bold text-red-400">NO SE PUDO VERIFICAR</h4>
                  <p className="text-xs text-slate-300">No encontramos evidencia suficiente con la información proporcionada. <strong>Ojo: Esto no significa automáticamente un fraude</strong>, solo que los datos no pudieron ser validados en los sistemas disponibles.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <div className="w-4 h-4 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.8)]"></div>
                <div>
                  <h4 className="font-bold text-slate-400">INFORMACIÓN INSUFICIENTE</h4>
                  <p className="text-xs text-slate-300">No existen suficientes datos para emitir una conclusión investigativa.</p>
                </div>
              </div>
            </div>
          </div>

          {/* El Informe (Mockup) */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 to-blue-500/20 blur-xl rounded-[3rem]"></div>
            <div className="bg-white rounded-2xl p-8 shadow-2xl relative border border-slate-200 text-slate-800">
              <div className="border-b-2 border-slate-200 pb-4 mb-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-navy-900 uppercase">El Informe de Verificación</h3>
                  <p className="text-xs text-slate-500 mt-1">Usted NO está comprando una promesa. Está comprando una investigación documentada.</p>
                </div>
                <i className="fa-solid fa-stamp text-4xl text-red-700/20"></i>
              </div>
              
              <div className="space-y-4 text-sm font-mono bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">CASO ANALIZADO:</span>
                  <span className="font-bold text-navy-900">#REV-2026-984</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">INFO. PROPORCIONADA:</span>
                  <span className="font-bold text-navy-900">A-Number, Recibo de Fianza</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">FUENTES CONSULTADAS:</span>
                  <span className="font-bold text-navy-900">EOIR, Verificación ICE</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">DATOS COINCIDENTES:</span>
                  <span className="font-bold text-emerald-600">Nombre, Fecha Ingreso</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">INCONSISTENCIAS:</span>
                  <span className="font-bold text-orange-600">Recibo no hallado en sistema</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">INFO. NO VERIFICABLE:</span>
                  <span className="font-bold text-slate-600">Dirección declarada</span>
                </div>
                <div className="flex justify-between bg-navy-900 text-white p-3 rounded mt-4">
                  <span className="font-bold">RESULTADO FINAL:</span>
                  <span className="font-black text-orange-400">INCONSISTENCIAS DETECTADAS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. NUESTROS SERVICIOS */}
      <section className="py-16 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-navy-900 mb-10 text-center font-serif">Nuestros Servicios de Verificación</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-navy-900 transition">
              <i className="fa-solid fa-passport text-3xl text-gold-500 mb-4"></i>
              <h4 className="font-bold text-navy-900 mb-2">Verificación de Trámite</h4>
              <p className="text-xs text-slate-600">Validación de estatus, folios presentados y fechas en procesos activos o concluidos.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-navy-900 transition">
              <i className="fa-solid fa-money-bill-transfer text-3xl text-gold-500 mb-4"></i>
              <h4 className="font-bold text-navy-900 mb-2">Verificación de Fianza</h4>
              <p className="text-xs text-slate-600">Investigación de registro de pago, cancelación de orden y factibilidad de devolución.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-navy-900 transition">
              <i className="fa-solid fa-file-signature text-3xl text-gold-500 mb-4"></i>
              <h4 className="font-bold text-navy-900 mb-2">Verificación Documental</h4>
              <p className="text-xs text-slate-600">Análisis detallado de recibos, cartas y formas entregadas al cliente por terceros.</p>
            </div>
            <div className="bg-navy-900 border border-navy-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 text-gold-500 text-6xl"><i className="fa-solid fa-star"></i></div>
              <i className="fa-solid fa-magnifying-glass-plus text-3xl text-gold-400 mb-4 relative z-10"></i>
              <h4 className="font-bold text-white mb-2 relative z-10">Investigación Completa</h4>
              <p className="text-xs text-slate-300 relative z-10">Combina trámite + documentos + fianza + cruce de información del representante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. AUTORIDAD Y MENSAJE DE CONFIANZA */}
      <section className="py-20 px-6 md:px-12 bg-slate-100 border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-black text-navy-900 mb-6 font-serif">¿Cómo Trabajamos?</h3>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              Somos un servicio independiente de investigación y verificación documental. Utilizamos la documentación proporcionada por el cliente y, cuando corresponde y está disponible, contrastamos la información con fuentes oficiales.
            </p>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed font-bold text-red-800 bg-red-50 p-4 rounded-lg border border-red-100">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i> No somos ICE, USCIS, DHS ni una agencia del Gobierno de Estados Unidos. No sustituimos la representación legal de un abogado.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              Nuestro trabajo consiste en investigar, organizar, contrastar y explicar la información disponible para empoderar al usuario.
            </p>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-black text-navy-900 mb-6 font-serif">Fuentes Oficiales Consultadas</h3>
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

        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-navy-900 mb-6 font-serif uppercase tracking-tight">
            "SI SU ABOGADO O REPRESENTANTE HIZO EL TRABAJO, LA VERIFICACIÓN DEBERÍA PODER ENCONTRAR EVIDENCIA."
          </h2>
          <p className="text-xl text-slate-600 mb-10 italic">
            Y si algo no coincide, usted tiene derecho a saberlo.
          </p>
          <div className="inline-block border-2 border-navy-900 px-8 py-4 rounded-xl bg-white shadow-xl">
            <p className="font-black text-navy-900 tracking-widest uppercase md:text-lg">
              NO ACUSAMOS. NO INVENTAMOS. NO PROMETEMOS.<br/><span className="text-gold-600">VERIFICAMOS.</span>
            </p>
          </div>
        </div>
      </section>

      {/* 8. PROGRAMA DE REFERIDOS */}
      <section className="py-12 px-6 md:px-12 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                Programa de Referidos
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                ¿Conoces a alguien que pagó por un trámite migratorio y no sabe qué se ha hecho realmente? Puedes recomendar nuestro servicio de verificación. Ayudemos juntos a la comunidad a encontrar respuestas y organizar su información.
              </p>
              <a 
                href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, deseo conocer cómo recomendar a alguien para que verifique su trámite.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-navy-900 font-bold py-3 px-8 rounded-xl transition shadow-lg hover:bg-slate-200"
              >
                Saber Más
              </a>
            </div>
            <div className="flex-1 relative border-4 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop" alt="Ayuda a la comunidad" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL & FORMULARIO RÁPIDO */}
      <section className="py-20 px-6 md:px-12 bg-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-6 font-serif leading-tight">
              ¿Ya pagó por su trámite?
            </h2>
            <p className="text-lg text-slate-600 mb-10">
              Antes de seguir entregando dinero, descubra qué información puede verificarse verdaderamente sobre su caso.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => handleWhatsAppGeneral("Verificar mi caso de forma completa")}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg text-lg"
              >
                <i className="fa-solid fa-file-circle-check text-2xl"></i>
                <span>QUIERO VERIFICAR MI CASO</span>
              </button>
              <button 
                onClick={() => handleWhatsAppGeneral("Verificar el estado de mi fianza pagada")}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg text-lg"
              >
                <i className="fa-solid fa-money-check-dollar text-2xl"></i>
                <span>QUIERO VERIFICAR MI FIANZA</span>
              </button>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-8 border-navy-900">
            <h3 className="text-2xl font-black text-navy-900 mb-2">Solicitud Rápida</h3>
            <p className="text-slate-500 text-sm mb-6">Envíe sus datos básicos para que nuestros especialistas le contacten.</p>
            <form onSubmit={handleWhatsAppForm} className="space-y-5">
              {isSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-200 text-center animate-pulse">
                  <i className="fa-solid fa-circle-check text-4xl text-emerald-500 mb-2"></i>
                  <h4 className="font-bold text-lg">¡Solicitud Recibida!</h4>
                  <p className="text-sm mt-1">Por favor haga clic en cualquier botón de WhatsApp para contactarse de inmediato con el verificador.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Servicio Requerido</label>
                    <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 font-bold">
                      <option value="Auditoria">Verificación de Trámite o Caso</option>
                      <option value="Fianza">Verificación de Fianza</option>
                      <option value="Documental">Verificación Documental</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nombre Completo</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Su nombre" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Teléfono / WhatsApp</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="(123) 456-7890" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Estado Actual en EE. UU.</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Ej. Texas, California..." />
                  </div>
                  
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
          &copy; {new Date().getFullYear()} Centro Nacional de Verificación Documental. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
};

export default BondRefundLanding;
