import React, { useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Award, 
  ExternalLink, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Mail, 
  FileText, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Globe,
  Building2
} from 'lucide-react';
import { LAWYER_PROFILE } from '../data/initialData';
import type { ClientLead } from '../types';

interface PublicLandingPageProps {
  onEnterCRM: () => void;
  onSaveLeadFromWebsite?: (lead: ClientLead) => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({ 
  onEnterCRM,
  onSaveLeadFromWebsite 
}) => {
  // Evaluador interactivo de caso
  const [evalStep, setEvalStep] = useState(1);
  const [evalTiempo, setEvalTiempo] = useState('');
  const [evalEntrada, setEvalEntrada] = useState('');
  const [evalSituacion, setEvalSituacion] = useState('');

  // Formulario de contacto
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estadoUbicacion, setEstadoUbicacion] = useState('');
  const [tipoCaso, setTipoCaso] = useState('residencia');
  const [mensaje, setMensaje] = useState('');
  const [formEnviado, setFormEnviado] = useState(false);

  // Preguntas Frecuentes (FAQ) acordeón
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Primera abierta por defecto

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmitContacto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim()) return;

    const newLead: ClientLead = {
      id: `WEB-${Date.now().toString().slice(-4)}`,
      numeroExpediente: `EXP-WEB-${Date.now().toString().slice(-3)}`,
      fechaRegistro: new Date().toISOString().split('T')[0],
      horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nombre,
      telefono,
      whatsapp: telefono.replace(/[^0-9+]/g, ''),
      paisOrigen: 'Por determinar',
      estadoResidenciaEEUU: estadoUbicacion || 'Por determinar',
      idiomaPreferido: 'Español',
      fuenteContacto: 'formulario_web',
      tramiteSolicitado: tipoCaso === 'residencia' ? 'Residencia Permanente (Green Card)' 
        : tipoCaso === 'corte' ? 'Defensa en Corte / Fianza' 
        : tipoCaso === 'asilo' ? 'Asilo Político (I-589)' 
        : tipoCaso === 'empleo' ? 'Visa de Empleo (EB-2 / EB-3)' 
        : 'Consulta Migratoria General',
      observacionesIniciales: `Registrado desde el formulario web oficial. Motivo: ${mensaje || 'Consulta inicial confidencial.'}`,
      responsable: LAWYER_PROFILE.nombre,
      estadoContacto: 'nuevo_por_contactar',
      estadoDocumentos: 'esperando_documentos',
      estadoEvaluacion: 'pendiente',
      estadoCaso: 'activo',
      fechaSeguimientoProgramado: new Date().toISOString().split('T')[0],
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
    };

    onSaveLeadFromWebsite?.(newLead);
    setFormEnviado(true);
  };

  const openWhatsAppDirect = (customText?: string) => {
    const defaultMsg = `Hola Estefanía, me comunico a través del sitio web oficial del Bufete del Lic. David Antony Carrillo. Quisiera solicitar una consulta confidencial sobre mi caso migratorio.`;
    const textToSend = encodeURIComponent(customText || defaultMsg);
    window.open(`https://wa.me/${LAWYER_PROFILE.whatsapp}?text=${textToSend}`, '_blank');
  };

  const faqs = [
    {
      q: '¿Si estoy en Florida, Texas, Illinois o Nueva York, me puede representar un abogado con sede en California?',
      a: '¡Absolutamente SÍ! La Ley de Inmigración es 100% FEDERAL (Título 8 del Código de Regulaciones de EE.UU. - 8 CFR § 292.1). Esto significa que un abogado con licencia activa en la Barra de Abogados de California (#177856) tiene autorización legal plena para representarle ante USCIS y ante cualquier Corte de Inmigración (EOIR) en los 50 estados del país. No tiene que viajar a California: todas las consultas se realizan por videollamada o teléfono, y la radicación de expedientes se realiza de manera electrónica federal.'
    },
    {
      q: '¿Cómo sé que este bufete es real y no una estafa como tantas que hay en internet?',
      a: 'La transparencia es nuestra máxima garantía: usted mismo puede ingresar a la página oficial del Gobierno del Estado de California (calbar.ca.gov) y verificar que la licencia #177856 del Licenciado David Antony Carrillo se encuentra ACTIVA y sin ningún historial disciplinario. Además, todo proceso con nosotros se inicia formalmente mediante un Contrato de Servicios Legales por Escrito y los pagos se realizan a cuentas bancarias institucionales en EE.UU., entregándole recibos oficiales con números de seguimiento emitidos directamente por el Departamento de Seguridad Nacional (DHS/USCIS).'
    },
    {
      q: '¿Cuánto cuesta la consulta inicial y cómo se pagan los honorarios?',
      a: 'La revisión y diagnóstico preliminar de su caso no tiene costo ni compromiso. Si determinamos que su caso es viable y califica para un alivio migratorio, le entregamos una cotización clara, fija y por escrito, desglosando las tarifas oficiales del gobierno (USCIS) de los honorarios legales. Ofrecemos planes de pago accesibles por etapas procesales para que la parte económica no sea un obstáculo para su regularización.'
    },
    {
      q: '¿Puedo obtener un Permiso de Trabajo (EAD) y cuánto tiempo tarda?',
      a: 'El permiso de trabajo depende de la vía legal aplicable: en solicitudes de Asilo Político (Formulario I-589) la ley permite solicitar la autorización de empleo al cumplir los 150 días de radicación y se concede tras los 180 días. En solicitudes de Ajuste de Estatus Familiar o Laboral (I-485), el permiso suele llegar entre 3 a 6 meses. En su evaluación gratuita le explicaremos exactamente los tiempos de su vía.'
    },
    {
      q: '¿Qué pasa si entré por frontera sin papeles o si ya tengo una fecha de corte pendiente?',
      a: 'Si entró por frontera o tiene una Notificación de Comparecencia (NTA) ante un juez de inmigración, el tiempo es su factor más crítico. Faltar a una cita de corte genera una orden automática de deportación en ausencia. Con su número de registro de extranjero (Número A de 9 dígitos), nuestro equipo consulta de inmediato el sistema del tribunal (1-800-898-7180) para verificar su juez, su fecha y radicar la debida representación legal a tiempo.'
    },
    {
      q: '¿Toda mi información es confidencial? ¿ICE o la policía pueden enterarse?',
      a: 'Bajo la ley de los Estados Unidos, toda comunicación entre usted y nuestro bufete está protegida bajo el estricto Secreto Profesional Legal (Attorney-Client Privilege). Su información es 100% privada y confidencial. Jamás compartimos ningún dato con agencias policiales ni de inmigración.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 relative">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-b border-amber-500/30 text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-amber-300">Licencia Oficial de Abogado:</span>
            <span>The State Bar of California <strong>{LAWYER_PROFILE.barNumber}</strong></span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">Jurisdicción Federal en los 50 Estados de EE.UU.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a 
              href={`tel:${LAWYER_PROFILE.telefono.replace(/[^0-9+]/g, '')}`} 
              className="hover:text-amber-300 flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold">{LAWYER_PROFILE.telefono}</span>
            </a>
            <button
              onClick={onEnterCRM}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Acceso Panel Legal / CRM</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070b14]/95 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/40">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-black tracking-wide text-lg sm:text-xl text-white">
                  LIC. DAVID ANTONY CARRILLO
                </h1>
              </div>
              <p className="text-xs text-amber-400/90 font-medium tracking-wider uppercase flex items-center gap-1">
                <span>Bufete Jurídico • Asesoría Migratoria y Cortes de EE.UU.</span>
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
            <a href="#cobertura" className="hover:text-amber-400 transition font-medium">¿Dónde estamos?</a>
            <a href="#areas" className="hover:text-amber-400 transition font-medium">Áreas de Práctica</a>
            <a href="#comparativa" className="hover:text-amber-400 transition font-medium">Garantías Anti-Fraude</a>
            <a href="#evaluador" className="hover:text-amber-400 transition font-medium">Evaluador de Casos</a>
            <a href="#faq" className="hover:text-amber-400 transition font-medium">Preguntas Frecuentes</a>
            <a href="#contacto" className="hover:text-amber-400 transition font-medium">Contacto</a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openWhatsAppDirect()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Consulta con Estefanía</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>The State Bar of California • Licencia Oficial #177856</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Defensa y Asesoría Migratoria de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Alta Confianza</span> en EE.UU.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Representación legal rigurosa ante <strong>USCIS</strong> y las <strong>Cortes de Inmigración (EOIR)</strong> en cualquier estado de la Unión Americana. Su futuro en manos de un abogado colegiado, con contrato por escrito y sin falsas promesas.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#evaluador"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition"
                >
                  <span>Evaluar mi Caso Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={LAWYER_PROFILE.barVerificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verificar Licencia en CalBar.ca.gov</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              {/* Key Trust Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-left">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">#177856</div>
                  <div className="text-[11px] text-slate-400 font-medium">Bar License Activa</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">50</div>
                  <div className="text-[11px] text-slate-400 font-medium">Estados con Cobertura</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-blue-400">100%</div>
                  <div className="text-[11px] text-slate-400 font-medium">Atención en Español</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400">0 Riesgos</div>
                  <div className="text-[11px] text-slate-400 font-medium">Contrato Legal Escrito</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-amber-500/30 via-slate-700/40 to-amber-400/20 shadow-2xl">
                <div className="overflow-hidden rounded-2xl bg-slate-950 relative aspect-[16/10]">
                  <img 
                    src="/hero-residencia.jpg" 
                    alt="Entrega de Residencia Permanente y Aprobación de Caso Legal" 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                {/* Floating Success Badge */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md max-w-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">Casos de Éxito Reales</p>
                      <p className="text-[10px] text-slate-400">Green Cards, Asilos & Fianzas</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 italic pt-1">
                    "Gracias a la asesoría directa y honesta del Licenciado Carrillo, hoy mi familia y yo tenemos nuestra Green Card."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: ¿DÓNDE ESTAMOS Y CÓMO TRABAJAMOS A DISTANCIA? (Resuelve la duda #1 de los clientes) */}
      <section id="cobertura" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Cobertura Nacional e Inmigración Federal</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              ¿Dónde estamos ubicados y cómo le representamos en su estado?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Muchas personas nos preguntan: <em>"¿Si ustedes están en California, cómo me pueden representar si yo vivo en Florida, Texas, Illinois o Nueva York?"</em>. La respuesta es clara: <strong>la ley de inmigración es 100% federal</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Sede Principal en California</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Oficina legal registrada en UC Berkeley School of Law, California Constitution Center. Matrícula activa #177856 ante The State Bar of California.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Jurisdicción Federal Total</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bajo la norma 8 CFR § 292.1, nuestra licencia de California nos autoriza a litigar en cortes (EOIR) y ante oficinas de USCIS en los 50 estados.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Atención Virtual Sin Viajes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atendemos por videollamada segura, llamada telefónica y WhatsApp. No tiene que gastar en pasajes ni perder días de trabajo para gestionar su caso.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Radicación Electrónica Oficial</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Presentamos sus peticiones en los portales federales oficiales ePortal de EOIR y USCIS Online, entregándole acuse de recibo con número de seguimiento en tiempo real.
              </p>
            </div>
          </div>

          {/* Badges de Estados con mayor presencia de clientes */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
              Estados donde representamos casos migratorios de forma activa:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {[
                '🌴 Florida (Miami, West Palm Beach, Orlando)',
                '🤠 Texas (Dallas-Fort Worth, Houston, San Antonio)',
                '🏙️ Illinois (Chicago, Aurora, Elgin)',
                '🌉 California (Los Ángeles, San Francisco, San Diego)',
                '🗽 New York & New Jersey',
                '🌲 North Carolina & Georgia'
              ].map(st => (
                <span key={st} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  {st}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. ÁREAS DE PRÁCTICA */}
      <section id="areas" className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Defensa y Trámites Federales
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Nuestras Áreas de Práctica Migratoria
            </h2>
            <p className="text-sm text-slate-400">
              Manejamos cada caso con rigor técnico, documentación probatoria sólida y apego a la ley de inmigración de los Estados Unidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Area 1 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Defensa en Corte (EOIR) & Fianzas de ICE
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Representación en audiencias preliminares (Master Calendar) e individuales. Solicitud de redeterminación de fianza ante el Juez de Inmigración y tramitación en portal CeBONDS de ICE.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
                <span>Formularios EOIR y Moción de Fianza</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area 2 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Peticiones Familiares & Residencia (Green Card)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peticiones de cónyuges, hijos y padres ciudadanos (Formulario I-130). Ajuste de Estatus dentro de EE.UU. (I-485) y Proceso Consular en el extranjero con el Centro Nacional de Visas (NVC).
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Formularios I-130 / I-485 / DS-260</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area 3 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Asilo Político & Protección Defensiva
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Radicación oportuna del Formulario I-589 dentro de la regla de oro del primer año de ingreso. Preparación de testimonio, evidencia de país y trámite de permiso de trabajo (I-765).
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center gap-1">
                <span>Formulario I-589 y Autorización Laboral</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area 4 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Visas de Empleo & Negocios (EB-2 / EB-3)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Estrategias de residencia por empleo, Certificación Laboral PERM, peticiones I-140 y visas para profesionales de interés nacional (National Interest Waiver - NIW).
              </p>
              <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1">
                <span>Peticiones I-140 y Residencia Laboral</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area 5 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Perdones Legales (Waivers I-601 / I-601A)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Defensa y perdón provisional por presencia indocumentada para evitar el castigo de los 3 y 10 años, demostrando dificultad extrema en familiares calificados.
              </p>
              <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
                <span>Formulario I-601A y Pruebas Extremas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Area 6 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition space-y-3 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">
                Permisos de Trabajo, TPS & DACA
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Solicitud inicial y renovaciones de Autorización de Empleo (EAD), registros de Estatus de Protección Temporal (TPS) y permisos para viajar (Advance Parole).
              </p>
              <div className="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Formulario I-765 / I-821 / I-131</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TABLA COMPARATIVA: ABOGADO COLEGIADO VS NOTARIO (Elimina el miedo al fraude) */}
      <section id="comparativa" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantía de Seguridad y Confianza</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              No arriesgue su futuro con personas sin licencia
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              En Estados Unidos, un "Notario" no es abogado. Conozca las diferencias críticas antes de entregar su dinero o sus documentos.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900/60">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              
              {/* Feature descriptions */}
              <div className="md:col-span-6 p-6 space-y-6">
                <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider text-slate-400">
                  Garantía de Protección Legal
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="font-bold text-white">1. Matrícula y Licencia Pública del Estado</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Verificable por cualquier persona en el portal oficial calbar.ca.gov</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="font-bold text-white">2. Representación y Litigio frente al Juez</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Autorizado legalmente para hablar y defenderle en audiencias de corte</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="font-bold text-white">3. Contrato de Servicios Formal por Escrito</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Obligaciones, plazos y costos detallados con validez legal federal</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <p className="font-bold text-white">4. Secreto Profesional Abogado-Cliente</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Protección total de confidencialidad respaldada por la ley</p>
                  </div>
                </div>
              </div>

              {/* Bufete Lic. Carrillo */}
              <div className="md:col-span-3 p-6 bg-amber-500/5 space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Nuestro Bufete
                  </span>
                  <p className="font-bold text-sm text-white pt-1">Lic. David Antony Carrillo</p>
                </div>

                <div className="space-y-7 pt-2 text-xs">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>Licencia #177856</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>Litigio en Cortes EOIR</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>Contrato Escrito</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-5 h-5" />
                    <span>100% Confidencial</span>
                  </div>
                </div>
              </div>

              {/* Notarios o tramitadores */}
              <div className="md:col-span-3 p-6 bg-slate-950/80 space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full border border-red-500/30">
                    Peligro Común
                  </span>
                  <p className="font-bold text-sm text-slate-300 pt-1">"Notarios" / Tramitadores</p>
                </div>

                <div className="space-y-7 pt-2 text-xs">
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold">
                    <X className="w-5 h-5" />
                    <span>Sin Licencia Legal</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold">
                    <X className="w-5 h-5" />
                    <span>Prohibido en Cortes</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold">
                    <X className="w-5 h-5" />
                    <span>Sin Contrato Válido</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-red-400 font-bold">
                    <X className="w-5 h-5" />
                    <span>Sin Secreto Profesional</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. EVALUADOR RÁPIDO DE CASOS INTERACTIVO */}
      <section id="evaluador" className="py-20 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Herramienta Gratuita
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Evaluador Preliminar de Caso Migratorio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Responde estas 3 breves preguntas para identificar qué tipo de vía legal se adapta mejor a tu situación actual.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
            
            {evalStep === 1 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-amber-400 font-bold">Paso 1 de 3</span>
                <h3 className="font-serif text-lg font-bold text-white">
                  ¿Cuánto tiempo llevas viviendo en los Estados Unidos?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Menos de 1 año', value: 'menos_1_ano', desc: 'Clave para solicitud de Asilo' },
                    { label: 'Entre 1 y 10 años', value: '1_a_10_anos', desc: 'Vías por familia o empleo' },
                    { label: 'Más de 10 años', value: 'mas_10_anos', desc: 'Posible cancelación de expulsión' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setEvalTiempo(opt.value);
                        setEvalStep(2);
                      }}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                        evalTiempo === opt.value 
                          ? 'bg-amber-500/20 border-amber-400 text-white' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {evalStep === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-amber-400 font-bold">Paso 2 de 3</span>
                <h3 className="font-serif text-lg font-bold text-white">
                  ¿Cómo ingresaste al territorio estadounidense?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Con Visa de Turista / Trabajo', value: 'visa', desc: 'Inspección legal demostrable' },
                    { label: 'Parole / CBP One', value: 'parole', desc: 'Entrada bajo permiso humanitario' },
                    { label: 'Frontera sin inspección', value: 'frontera', desc: 'Puede requerir perdón legal' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setEvalEntrada(opt.value);
                        setEvalStep(3);
                      }}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                        evalEntrada === opt.value 
                          ? 'bg-amber-500/20 border-amber-400 text-white' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setEvalStep(1)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Volver al paso anterior
                </button>
              </div>
            )}

            {evalStep === 3 && (
              <div className="space-y-4">
                <span className="text-xs font-mono text-amber-400 font-bold">Paso 3 de 3</span>
                <h3 className="font-serif text-lg font-bold text-white">
                  ¿Tienes algún familiar con estatus o fecha de corte?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Cónyuge o Hijos Ciudadanos', value: 'familiar_ciudadano', desc: 'Vía directa a Green Card' },
                    { label: 'Tengo Corte / Número A', value: 'corte', desc: 'Defensa obligatoria en juicio' },
                    { label: 'Ninguno por ahora', value: 'ninguno', desc: 'Evaluación por asilo o empleo' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setEvalSituacion(opt.value);
                      }}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                        evalSituacion === opt.value 
                          ? 'bg-amber-500/20 border-amber-400 text-white' 
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-white">{opt.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {evalSituacion && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Diagnóstico preliminar listo: Caso con viabilidad para análisis formal.</span>
                    </p>
                    <button
                      onClick={() => {
                        const summary = `Hola Estefanía, completé el evaluador en su sitio web: Llevo (${evalTiempo}), entré por (${evalEntrada}) y mi situación es (${evalSituacion}). Quisiera que el Licenciado Carrillo revise mi caso.`;
                        openWhatsAppDirect(summary);
                      }}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Enviar mi diagnóstico al Licenciado por WhatsApp</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setEvalStep(2)}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  ← Volver al paso anterior
                </button>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 8. SECCIÓN DE PREGUNTAS FRECUENTES (FAQ ACORDEÓN) - Responde todas las dudas reales */}
      <section id="faq" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Claridad Absoluta</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Preguntas Frecuentes de Nuestros Clientes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Respuestas directas y honestas a las dudas más comunes sobre ubicación, costos y seguridad legal.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-white">
                      {faq.q}
                    </span>
                    <span className="shrink-0 p-1.5 rounded-lg bg-slate-800 text-amber-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. FORMULARIO DE CONTACTO DIRECTO */}
      <section id="contacto" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                Atención Confidencial
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Comuníquese Directamente con Nuestro Bufete
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Su consulta está amparada por el secreto profesional legal. Permítanos revisar su caso para indicarle con certeza su mejor camino migratorio.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dirección Oficial en California</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{LAWYER_PROFILE.direccion}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Teléfono & WhatsApp Directo</h4>
                    <p className="text-xs text-emerald-300 font-mono font-bold mt-0.5">{LAWYER_PROFILE.telefono}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-blue-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Correo Electrónico</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{LAWYER_PROFILE.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horario de Atención</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{LAWYER_PROFILE.horario} (Hora del Pacífico)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Lead Intake Form */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                
                {formEnviado ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      ¡Consulta Recibida Exitosamente!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                      Hemos registrado su caso de forma confidencial. Nuestro equipo legal se comunicará con usted a la brevedad.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => openWhatsAppDirect(`Hola Lic. Carrillo, acabo de enviar mi formulario desde el sitio web a nombre de ${nombre}. Quisiera confirmar la recepción.`)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Abrir WhatsApp Ahora</span>
                      </button>
                      <button
                        onClick={() => {
                          setFormEnviado(false);
                          setNombre('');
                          setTelefono('');
                          setMensaje('');
                        }}
                        className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Enviar otro mensaje
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContacto} className="space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white">
                        Solicite su Consulta Legal
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Complete sus datos para que el Licenciado David Antony Carrillo evalúe su situación.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ej. Juan Pérez"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Teléfono / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          placeholder="Ej. +1 (555) 123-4567"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Estado donde reside en EE.UU.
                        </label>
                        <input
                          type="text"
                          value={estadoUbicacion}
                          onChange={(e) => setEstadoUbicacion(e.target.value)}
                          placeholder="Ej. California, Florida, Illinois, Texas..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Trámite de Interés
                        </label>
                        <select
                          value={tipoCaso}
                          onChange={(e) => setTipoCaso(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-amber-400"
                        >
                          <option value="residencia">Residencia Permanente (Green Card)</option>
                          <option value="corte">Corte de Inmigración / Fianza de ICE</option>
                          <option value="asilo">Asilo Político / Protección Defensiva</option>
                          <option value="empleo">Visas de Trabajo (EB-2 / EB-3)</option>
                          <option value="perdon">Perdón Legal (Waiver I-601A)</option>
                          <option value="otro">Otro trámite migratorio</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Breve resumen de su situación o dudas
                      </label>
                      <textarea
                        rows={3}
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Describa brevemente cómo ingresó a EE.UU., si tiene familiares o si ha recibido citación de corte..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Consulta Confidencial</span>
                    </button>

                    <p className="text-[10px] text-slate-500 text-center">
                      🔒 Toda la información enviada está protegida bajo estricto secreto profesional legal.
                    </p>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. BOTÓN FLOTANTE PERMANENTE DE WHATSAPP CON ESTEFANÍA */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="hidden sm:block bg-slate-900/95 border border-emerald-500/40 px-3.5 py-2 rounded-2xl shadow-2xl backdrop-blur-md">
          <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>¿Tiene dudas sobre su caso?</span>
          </p>
          <p className="text-[10px] text-slate-400">Escríbale a Estefanía, asistente legal</p>
        </div>

        <button
          onClick={() => openWhatsAppDirect()}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-950/80 hover:scale-110 transition-transform cursor-pointer border-2 border-emerald-300/40"
          title="Consultar por WhatsApp con el despacho"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      </div>

      {/* 11. FOOTER LEGAL */}
      <footer className="border-t border-slate-800 bg-[#04060d] py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-sm">
                  {LAWYER_PROFILE.despacho}
                </p>
                <p className="text-[11px] text-slate-400">
                  Lic. David Antony Carrillo • The State Bar of California License {LAWYER_PROFILE.barNumber}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a href="#cobertura" className="hover:text-amber-400 transition">¿Dónde estamos?</a>
              <span>•</span>
              <a href="#areas" className="hover:text-amber-400 transition">Áreas de Práctica</a>
              <span>•</span>
              <a href="#comparativa" className="hover:text-amber-400 transition">Garantías</a>
              <span>•</span>
              <a href="#faq" className="hover:text-amber-400 transition">Preguntas Frecuentes</a>
              <span>•</span>
              <a href="#contacto" className="hover:text-amber-400 transition">Contacto</a>
              <span>•</span>
              <button 
                onClick={onEnterCRM} 
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Acceso Abogados / CRM</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center sm:text-left space-y-2">
            <p>
              <strong>Aviso Legal y Descargo de Responsabilidad:</strong> La información contenida en este sitio web tiene propósitos exclusivamente informativos y no debe interpretarse como asesoría legal formal para ningún caso particular. El envío de información a través de formularios o WhatsApp no establece automáticamente una relación abogado-cliente. La representación formal solo se inicia tras la firma de un contrato de servicios legales por escrito.
            </p>
            <p className="text-slate-400">
              © {new Date().getFullYear()} Bufete Jurídico Lic. David Antony Carrillo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
