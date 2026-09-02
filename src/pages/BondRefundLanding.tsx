import React, { useState } from 'react';
import { firmData } from '../config/firmData';

const BondRefundLanding: React.FC = () => {
  const [bondAmount, setBondAmount] = useState<number | ''>('');
  const [yearsPassed, setYearsPassed] = useState<number | ''>('');
  const [formData, setFormData] = useState({ name: '', phone: '', state: '', amount: '' });

  // ICE typically pays Treasury rates, approx 1-3% depending on the year. We estimate 2% simple interest.
  const calculateRefund = () => {
    if (!bondAmount || !yearsPassed) return 0;
    const principal = Number(bondAmount);
    const interest = principal * 0.02 * Number(yearsPassed);
    return principal + interest;
  };

  const estimatedRefund = calculateRefund();

  const handleWhatsAppCalc = () => {
    const message = `Hola, deseo iniciar la consulta para reclamar mi fianza de $${bondAmount || '___'} pagada en el año ${yearsPassed ? (new Date().getFullYear() - Number(yearsPassed)) : '___'}. Por favor indiquen los pasos para revisar mi estatus.`;
    window.open(`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWhatsAppForm = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `SOLICITUD DE DIAGNÓSTICO DE FIANZA:\n\nPagador (Obligor): ${formData.name}\nTeléfono: ${formData.phone}\nEstado: ${formData.state}\nMonto Estimado: $${formData.amount}\n\nSolicito evaluación gratuita.`;
    window.open(`https://wa.me/${firmData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
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
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Línea Directa</p>
            <p className="font-bold text-navy-900 text-lg">{firmData.phone}</p>
          </div>
          <button 
            onClick={handleWhatsAppCalc}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition shadow-lg shadow-emerald-900/20"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <span>WhatsApp</span>
          </button>
        </div>
        {/* Mobile Call Button */}
        <a href={`tel:${firmData.phone}`} className="md:hidden bg-navy-900 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-phone"></i>
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
            <h2 className="text-4xl md:text-6xl font-black mb-6 font-serif leading-[1.1] text-white">
              ¿Pagó una Fianza en Efectivo a ICE? <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-yellow-200">Reclame su Dinero con Intereses.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              Recuperamos fondos retenidos por el gobierno federal para casos con orden de corte finalizada, salida voluntaria o deportación ejecutada. Gestionamos el cobro formal incluso si extravió el recibo original mediante la Declaración Jurada I-395 oficial.
            </p>
            
            {/* Grid 3 Pilares */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <i className="fa-solid fa-building-columns text-gold-400 text-2xl mb-2 block"></i>
                <h3 className="font-bold text-white text-sm mb-1">Depósito Directo del Tesoro</h3>
                <p className="text-xs text-slate-400 leading-snug">El pago no pasa por terceros; se transfiere vía ACH oficial (FMS 3881) a nombre del titular.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <i className="fa-solid fa-file-shield text-gold-400 text-2xl mb-2 block"></i>
                <h3 className="font-bold text-white text-sm mb-1">Solución para Recibos Perdidos</h3>
                <p className="text-xs text-slate-400 leading-snug">Preparación de la Declaración Jurada I-395 notariada que anula la necesidad del recibo físico I-305.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                <i className="fa-solid fa-magnifying-glass-chart text-gold-400 text-2xl mb-2 block"></i>
                <h3 className="font-bold text-white text-sm mb-1">Diagnóstico Previo</h3>
                <p className="text-xs text-slate-400 leading-snug">Comprobación de que la fianza cuenta con orden de cancelación (Formulario I-391) antes del trámite.</p>
              </div>
            </div>
          </div>
          
          {/* 3. CALCULADORA */}
          <div className="md:w-2/5 w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-t-8 border-gold-500 text-slate-800 transform hover:-translate-y-1 transition duration-300">
              <h3 className="text-2xl font-black text-navy-900 mb-2 text-center">Calculadora de Rescate</h3>
              <p className="text-slate-500 text-xs text-center mb-6">Estima tu reembolso (Capital + Intereses Federales)</p>
              
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

      {/* 5. PREGUNTAS FRECUENTES Y 6. FORMULARIO RÁPIDO */}
      <section className="py-20 px-6 md:px-12 bg-slate-100 border-y border-slate-200">
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
              <button type="submit" className="w-full mt-4 bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-xl transition shadow-lg text-lg">
                Solicitar Diagnóstico Gratuito
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-3"><i className="fa-solid fa-lock"></i> Sus datos están protegidos y son confidenciales.</p>
            </form>
          </div>

        </div>
      </section>

      {/* 7. FOOTER INSTITUCIONAL */}
      <footer className="bg-navy-900 text-slate-400 py-12 px-6 border-t border-slate-800 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-4">Centro Nacional de Recuperación</h4>
            <p className="mb-2"><i className="fa-solid fa-building-flag mr-2 text-gold-500"></i> Sede: {firmData.officeAddress}</p>
            <p className="mb-2"><i className="fa-solid fa-phone mr-2 text-gold-500"></i> {firmData.phone}</p>
            <p><i className="fa-solid fa-envelope mr-2 text-gold-500"></i> {firmData.email}</p>
          </div>
          <div className="md:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><i className="fa-solid fa-scale-unbalanced text-gold-500"></i> Aviso de Descargo Legal y Normativo</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Esta entidad brinda servicios de asistencia y preparación documental administrativa especializada. No prestamos servicios de litigio legal ni actuamos como agencia aseguradora de fianzas privadas (Bail Bondsmen). Toda recuperación de fondos está sujeta a la aprobación final del ICE Debt Management Center y los tiempos de procesamiento del U.S. Department of the Treasury. El cálculo de intereses es una estimación basada en las tasas históricas federales y no constituye una garantía matemática.
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
