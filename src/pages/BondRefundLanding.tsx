import React, { useState } from 'react';
import { firmData } from '../config/firmData';
import { supabase } from '../lib/supabase';

const BondRefundLanding: React.FC = () => {
  const [bondAmount, setBondAmount] = useState<number | ''>('');
  const [yearsPassed, setYearsPassed] = useState<number | ''>('');
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', amount: '', referredBy: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ICE typically pays Treasury rates. We implement a progressive estimated rate from 2.0% to 4.5% depending on the age of the bond (older bonds had lower/different rates, recent ones higher).
  const calculateRefund = () => {
    if (!bondAmount || yearsPassed === '') return 0;
    const principal = Number(bondAmount);
    const years = Number(yearsPassed);
    
    // Base rate starts at 2.0% for 15 years ago, goes up to 4.5% for recent years
    const minRate = 0.02;
    const maxRate = 0.045;
    const maxYears = 15;
    
    // Closer to 0 years (recent) -> higher rate. Closer to 15 years -> lower rate.
    // This is an estimation model per federal guidance approximation.
    const effectiveRate = maxRate - ((years / maxYears) * (maxRate - minRate));
    
    const interest = principal * effectiveRate * years;
    return principal + interest;
  };

  const estimatedRefund = calculateRefund();

  const handleWhatsAppCalc = () => {
    const yearPaid = yearsPassed !== '' ? (new Date().getFullYear() - Number(yearsPassed)) : '___';
    const message = `Hola, calculé mi rescate en la web: Capital de $${bondAmount || '___'} depositado en el año ${yearPaid}, con un estimado total de $${estimatedRefund > 0 ? estimatedRefund.toFixed(2) : '___'}. Deseo verificar mi expediente ante el Debt Management Center.`;
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

  const amountPresets = [2500, 5000, 7500, 10000, 15000];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-gold-500 selection:text-navy-900 overflow-x-hidden">
      
      {/* 1. IDENTIDAD CORPORATIVA Y CREDIBILIDAD INSTITUCIONAL */}
      {/* Top Security Bar */}
      <div className="bg-slate-900 text-slate-300 text-[10px] sm:text-xs py-2 px-4 flex flex-wrap justify-center sm:justify-between items-center gap-2 text-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-building-columns text-slate-400"></i>
          <span>Gestión Administrativa Formal ante el ICE Debt Management Center (Williston, VT)</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <i className="fa-solid fa-lock"></i>
          <span>Conexión Cifrada SSL 256-Bit | Cumplimiento Federal de Protección de Datos Privados</span>
        </div>
      </div>

      <header className="bg-white py-4 px-6 md:px-12 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-landmark text-navy-900 text-3xl"></i>
          <div>
            <h1 className="font-serif font-black text-lg md:text-xl text-navy-900 tracking-tight leading-none">Centro Nacional de Recuperación</h1>
            <p className="text-xs md:text-sm text-gold-600 font-bold tracking-wide">US Bond Recovery Services</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right mr-4 border-r border-slate-200 pr-4">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">WhatsApp Oficial</p>
            <p className="font-bold text-navy-900 text-lg">
              <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                {firmData.phone}
              </a>
            </p>
          </div>
          <button 
            onClick={handleWhatsAppCalc}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition shadow-lg shadow-emerald-900/20"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>Iniciar Consulta</span>
          </button>
        </div>
        {/* Mobile WhatsApp Button */}
        <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="md:hidden bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <i className="fa-brands fa-whatsapp text-xl"></i>
        </a>
      </header>

      {/* Aviso de Transparencia Legal (Banner) */}
      <div className="bg-blue-50 border-b border-blue-100 text-blue-800 text-xs py-3 px-6 text-center shadow-inner">
        <strong>Aviso Oficial:</strong> Trámite 100% administrativo y financiero. Los reembolsos son emitidos de forma directa por el Departamento del Tesoro de los Estados Unidos (U.S. Department of the Treasury) a la cuenta bancaria del pagador original (Obligor).
      </div>

      {/* 2. HERO SECTION */}
      <section className="bg-navy-900 text-white py-20 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-3/5 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black mb-6 font-serif leading-[1.1] text-white tracking-tight drop-shadow-2xl">
              ¿Pagó una Fianza en Efectivo a ICE? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-200 to-gold-400 animate-gradient-x">Reclame su Dinero con Intereses.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Recuperamos fondos retenidos por el gobierno federal para casos con orden de corte finalizada, salida voluntaria o deportación ejecutada. Gestionamos el cobro formal incluso si extravió el recibo original mediante la Declaración Jurada I-395 oficial.
            </p>
            
            {/* Grid 3 Pilares - Premium Glassmorphism */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-12">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/15 transition duration-300 transform hover:-translate-y-1">
                <i className="fa-solid fa-building-columns text-gold-400 text-3xl mb-4 block drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"></i>
                <h3 className="font-bold text-white text-md mb-2">Depósito Directo del Tesoro</h3>
                <p className="text-sm text-slate-300 leading-snug">El pago no pasa por terceros; se transfiere vía ACH oficial (FMS 3881) a nombre del titular.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/15 transition duration-300 transform hover:-translate-y-1">
                <i className="fa-solid fa-file-shield text-gold-400 text-3xl mb-4 block drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"></i>
                <h3 className="font-bold text-white text-md mb-2">Solución para Recibos Perdidos</h3>
                <p className="text-sm text-slate-300 leading-snug">Preparación de la Declaración Jurada I-395 notariada que anula la necesidad del recibo físico I-305.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/15 transition duration-300 transform hover:-translate-y-1">
                <i className="fa-solid fa-magnifying-glass-chart text-gold-400 text-3xl mb-4 block drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"></i>
                <h3 className="font-bold text-white text-md mb-2">Diagnóstico Previo Seguro</h3>
                <p className="text-sm text-slate-300 leading-snug">Comprobación de que la fianza cuenta con orden de cancelación antes de iniciar el trámite.</p>
              </div>
            </div>
          </div>
          
          {/* 3. CALCULADORA PREMIUM */}
          <div className="md:w-2/5 w-full relative z-20">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-emerald-500 rounded-[2rem] blur opacity-30 animate-pulse"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/40 text-slate-800 transform hover:-translate-y-2 transition duration-500">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-[2rem] shadow-md uppercase tracking-wider">
                Evaluación Gratis
              </div>
              <h3 className="text-3xl font-black text-navy-900 mb-2 text-center mt-2">Calculadora de Rescate</h3>
              <p className="text-slate-500 text-sm text-center mb-8">Estima tu reembolso (Capital + Intereses Federales)</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Monto Pagado a ICE</label>
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
                      placeholder="Otro monto..."
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

                <div className="bg-slate-900 rounded-xl p-6 text-center mt-6 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <i className="fa-solid fa-sack-dollar text-8xl text-gold-500"></i>
                  </div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1 relative z-10">Total a Reclamar Estimado</p>
                  <p className="text-4xl font-black text-emerald-400 font-serif relative z-10 tracking-tight">
                    ${estimatedRefund > 0 ? estimatedRefund.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                  </p>
                </div>

                <button 
                  onClick={handleWhatsAppCalc}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg text-lg group animate-pulse hover:animate-none"
                >
                  <i className="fa-brands fa-whatsapp text-2xl group-hover:scale-110 transition"></i>
                  <span>Consultar mi Reembolso</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EL PROCESO TRANSPARENTE EN 4 PASOS */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-4 font-serif">El Proceso de Rescate en 4 Pasos</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Un flujo de trabajo estrictamente administrativo diseñado para obligar al sistema federal a liberar sus fondos.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-1 bg-slate-200 -z-10 w-3/4 mx-auto"></div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 border-4 border-white shadow-lg">1</div>
              <h3 className="font-bold text-navy-900 mb-2">Localización del Expediente</h3>
              <p className="text-sm text-slate-600">Búsqueda mediante el A-Number del extranjero y confirmación de la orden de cancelación (I-391).</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 border-4 border-white shadow-lg">2</div>
              <h3 className="font-bold text-navy-900 mb-2">Preparación Documental</h3>
              <p className="text-sm text-slate-600">Redacción del Formulario I-395 ante notario público, actualización de domicilio y registro bancario ACH.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-navy-900 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 border-4 border-white shadow-lg">3</div>
              <h3 className="font-bold text-navy-900 mb-2">Radicación Oficial</h3>
              <p className="text-sm text-slate-600">Envío físico rastreado por USPS Certified Mail ante el ICE Debt Management Center en Vermont.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center relative shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-gold-500 text-navy-900 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4 border-4 border-white shadow-lg">4</div>
              <h3 className="font-bold text-navy-900 mb-2">Pago Oficial Directo</h3>
              <p className="text-sm text-slate-600">Emisión de fondos por el Departamento del Tesoro de EE. UU. directo a la cuenta del pagador.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMA DE REFERIDOS */}
      <section className="py-12 px-6 md:px-12 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto bg-navy-900 rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <i className="fa-solid fa-handshake-angle text-9xl text-gold-500"></i>
          </div>
          <div className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 flex items-center justify-center md:justify-start gap-3">
                <span>🤝</span> Programa de Aliados: Ayuda y Gana
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Ayuda a un familiar a rescatar sus miles de dólares del gobierno y recibe $100 de agradecimiento. Muchos familiares dan por perdido su dinero por miedo o por no tener el recibo. Al compartirles la información, los ayudas a recuperar lo que con tanto sacrificio pagaron, y nosotros te premiamos con $100 USD en cuanto se tramite su caso.
              </p>
              <ol className="text-slate-300 text-sm space-y-3 mb-8 text-left max-w-lg mx-auto md:mx-0 list-decimal list-inside">
                <li><strong className="text-white">Comparte</strong> el enlace de nuestra plataforma.</li>
                <li><strong className="text-white">Pídeles que ingresen</strong> tu nombre o teléfono al enviar su consulta.</li>
                <li><strong className="text-white">Te transferimos $100 USD</strong> de agradecimiento en cuanto procesemos su expediente.</li>
              </ol>
              <a 
                href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, deseo más información sobre el programa de referidos para ganar comisiones.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-3 px-8 rounded-xl transition shadow-lg shadow-gold-500/20"
              >
                Quiero ser Aliado / Referir Conocidos
              </a>
            </div>
            
            <div className="flex-1 relative group cursor-pointer border-4 border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl hover:border-gold-500 transition-all duration-300 transform hover:-translate-y-1 order-1 md:order-2">
              <img src="/referral-video.jpg" alt="Video Programa de Aliados" className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gold-500/90 text-navy-900 rounded-full flex items-center justify-center text-2xl pl-1 shadow-xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-play"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES Y 6. FORMULARIO RÁPIDO */}
      <section className="py-20 px-6 md:px-12 bg-slate-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-black text-navy-900 mb-8 font-serif">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-navy-900 mb-2 flex gap-2"><i className="fa-solid fa-circle-question text-gold-500 mt-1"></i> ¿Qué sucede si perdí el recibo verde/azul original (I-305)?</h4>
                <p className="text-sm text-slate-600">Es el problema más común. La ley permite solucionar esto mediante el Formulario Oficial I-395 (Declaración Jurada). Nosotros preparamos este documento legal para que ICE proceda con el pago sin el recibo original.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-navy-900 mb-2 flex gap-2"><i className="fa-solid fa-circle-question text-gold-500 mt-1"></i> ¿Si a mi familiar lo deportaron, aún puedo cobrar?</h4>
                <p className="text-sm text-slate-600">Sí. La ley federal establece que la fianza es una garantía de presentación. Si la persona cumplió con sus cortes, incluso si el resultado fue la deportación o salida voluntaria, el dinero DEBE ser devuelto.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-navy-900 mb-2 flex gap-2"><i className="fa-solid fa-circle-question text-gold-500 mt-1"></i> ¿A nombre de quién sale el dinero?</h4>
                <p className="text-sm text-slate-600">El dinero se emite <strong>exclusivamente a nombre del pagador original (Obligor)</strong> que firmó el contrato de fianza (I-352). Nosotros no tocamos su dinero; el cheque del Tesoro le llega directamente a usted.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h4 className="font-bold text-navy-900 mb-2 flex gap-2"><i className="fa-solid fa-circle-question text-gold-500 mt-1"></i> ¿Cuánto tiempo demora el desembolso?</h4>
                <p className="text-sm text-slate-600">Una vez radicado el paquete perfecto ante el centro de finanzas en Vermont, el Departamento del Tesoro suele tardar entre 4 a 12 semanas en procesar el cheque o depósito ACH.</p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-t-8 border-navy-900">
            <h3 className="text-2xl font-black text-navy-900 mb-2">Evaluación de Caso Rápida</h3>
            <p className="text-slate-500 text-sm mb-8">Llene sus datos para que nuestros especialistas ubiquen su fianza en el sistema federal.</p>
            <form onSubmit={handleWhatsAppForm} className="space-y-5">
              {isSuccess ? (
                <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-200 text-center animate-pulse">
                  <i className="fa-solid fa-circle-check text-4xl text-emerald-500 mb-2"></i>
                  <h4 className="font-bold text-lg">¡Datos Registrados!</h4>
                  <p className="text-sm mt-1">Hemos recibido tu información. Por favor regresa al chat de WhatsApp con el abogado para continuar.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Nombre del Pagador (Obligor)</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Quien firmó los papeles de ICE" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Teléfono / WhatsApp</label>
                    <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="(123) 456-7890" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Estado Actual en EE. UU.</label>
                    <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="Ej. Texas, California..." />
                  </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Monto Pagado a ICE</label>
                <input required type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500" placeholder="$" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase flex items-center justify-between">
                  <span>¿Quién te recomendó?</span>
                  <span className="text-gold-600 bg-gold-50 px-2 py-0.5 rounded text-[10px]">Opcional</span>
                </label>
                <input type="text" value={formData.referredBy} onChange={e => setFormData({...formData, referredBy: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500" placeholder="Nombre o Teléfono de quien te refirió" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-navy-900 hover:bg-navy-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg text-lg flex justify-center items-center gap-2">
                {isSubmitting ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Procesando...</>
                ) : (
                  'Solicitar Diagnóstico Gratuito'
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-3"><i className="fa-solid fa-lock"></i> Sus datos están protegidos y son confidenciales.</p>
              </>
              )}
            </form>

            {/* Alternativa Directa a WhatsApp */}
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <h4 className="text-lg font-black text-slate-700 mb-2">🔒 ¿Prefieres no dejar datos aquí?</h4>
              <p className="text-sm text-slate-500 mb-6">No te preocupes. Puedes escribirnos de forma 100% confidencial y privada directamente a nuestro WhatsApp personal sin llenar ningún formulario.</p>
              <a 
                href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, deseo realizar una consulta privada sin llenar el formulario.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg flex justify-center items-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                <span>Hablar por Privado en WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FOOTER INSTITUCIONAL */}
      <footer className="bg-navy-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-4">Centro Nacional de Recuperación</h4>
            <p className="mb-2"><i className="fa-solid fa-building-flag mr-2 text-gold-500"></i> Sede: {firmData.officeAddress}</p>
            <p className="mb-2">
              <a href={`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition">
                <i className="fa-brands fa-whatsapp mr-2 text-gold-500"></i> {firmData.phone}
              </a>
            </p>
            <p><i className="fa-solid fa-envelope mr-2 text-gold-500"></i> {firmData.email}</p>
          </div>
          <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><i className="fa-solid fa-scale-unbalanced text-gold-500"></i> Aviso de Descargo Legal y Normativo</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              Esta entidad brinda servicios de gestión y preparación documental administrativa especializada. No prestamos servicios de litigio legal ni actuamos como agencia aseguradora de fianzas privadas (Bail Bondsman).
            </p>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              Toda recuperación de fondos está sujeta a la aprobación final del ICE Debt Management Center. El Formulario Oficial I-395 notariado se utiliza para sustituir el recibo perdido I-305.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              El reembolso del capital y los intereses devengados los emite directamente el <strong>U.S. Department of the Treasury</strong> a nombre exclusivo del Pagador (Obligor). El cálculo de intereses es una estimación basada en las tasas promedio anuales federales publicadas por el Secretario del Tesoro bajo la normativa 8 CFR § 293.2 y no constituye una garantía matemática.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center mt-12 pt-8 border-t border-slate-800 text-xs">
          &copy; {new Date().getFullYear()} US Bond Recovery Services. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
};

export default BondRefundLanding;
