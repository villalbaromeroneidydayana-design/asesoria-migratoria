import React, { useState } from 'react';
import { Scale, PhoneCall, ExternalLink, ShieldCheck, ChevronRight, FileCheck, Briefcase, Users } from 'lucide-react';
import { firmData } from '../config/firmData';
import { getServicesByCategory } from '../config/servicesData';
import type { ServiceCategory } from '../config/servicesData';
import LegalFooter from '../components/LegalFooter';
import QuickExit from '../components/QuickExit';
import ImmigrationNewsFeed from '../components/ImmigrationNewsFeed';
import LegalFAQAccordion from '../components/LegalFAQAccordion';
import OfficeLocator from '../components/OfficeLocator';
import ImmigrationActivityMap from '../components/ImmigrationActivityMap';

export default function PublicPortal() {
  const categories = getServicesByCategory();
  const [activeTab, setActiveTab] = useState<ServiceCategory>('Protección Humanitaria y Cortes');
  
  const tabIcons: Record<string, React.ReactNode> = {
     'Protección Humanitaria y Cortes': <Scale size={18} />,
     'Empleo e Identificación Oficial': <Briefcase size={18} />,
     'Familia y Residencia Permanente': <Users size={18} />,
     'Ciudadanía y Mantenimiento': <FileCheck size={18} />
  };
  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      <QuickExit />
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <Scale className="text-gold-500 w-8 h-8" />
          <span className="text-2xl font-bold tracking-wide text-white font-serif">Bufete Legal de Inmigración</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/client" className="text-slate-300 hover:text-white transition font-medium">Mi Caso Seguro</a>
          <a href="/crm" className="text-slate-500 hover:text-white transition text-sm">Acceso Interno</a>
          <a href="/client" className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-2.5 rounded-lg font-bold transition shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]">
            Evaluación Rápida
          </a>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-navy-800/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

         <div className="max-w-3xl mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-[1.1] text-white">
              Defendiendo tus Derechos Migratorios con Firmeza y Verdad
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Asesoría legal experta en asilo, TPS y ajustes de estatus. No arriesgues tu futuro en Estados Unidos. Confía en profesionales acreditados con décadas de experiencia.
            </p>
            <a href="/client" className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-gold-500/20 w-full sm:w-auto transform hover:-translate-y-1">
               <PhoneCall size={22} className="opacity-80" /> 
               Habla con un Abogado Acreditado Ahora
            </a>
         </div>

         {/* Authority Card */}
         <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden mt-16 max-w-5xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-[80px]"></div>
            
            <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 md:gap-12 items-start relative z-10">
               {/* Photo & Basic Info */}
               <div className="flex flex-col md:flex-row gap-6 items-center md:items-start md:border-r md:border-slate-700/50 md:pr-12">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-slate-600 shrink-0 relative group shadow-lg">
                     <div className="absolute inset-0 bg-gold-500/10 group-hover:bg-transparent transition z-10"></div>
                     <img src={firmData.lawyerPhotoUrl} alt={firmData.lawyerName} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-500" />
                  </div>
                  <div className="flex flex-col h-full justify-center items-center md:items-start text-center md:text-left">
                     <h3 className="text-2xl font-serif font-bold text-white mb-1">{firmData.lawyerName}</h3>
                     <p className="text-slate-400 text-sm mb-4 font-medium max-w-[250px]">{firmData.title}</p>
                     
                     <div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-3.5 mb-4 w-full">
                        <p className="text-gold-500 font-bold text-sm tracking-wide">{firmData.barAssociation} | Bar Card #{firmData.barNumber}</p>
                        <p className="text-emerald-400 text-xs font-semibold flex items-center justify-center md:justify-start gap-1.5 mt-2">
                           <span className="relative flex h-2.5 w-2.5 shrink-0">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                           </span>
                           <span className="leading-tight">{firmData.barStatus}</span>
                        </p>
                     </div>
                     
                     <a href={firmData.verificationDirectoryUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition border border-slate-600 hover:border-gold-500/50 group w-full shadow-md">
                        <ShieldCheck size={16} className="text-gold-500 group-hover:text-gold-400 shrink-0" />
                        Verificar Licencia en TexasBar.com <ExternalLink size={14} className="text-slate-400 group-hover:text-white shrink-0" />
                     </a>
                  </div>
               </div>

               {/* Memberships & Dynamic Cases */}
               <div className="flex flex-col h-full justify-center border-t border-slate-700/50 pt-8 md:border-0 md:pt-0">
                  <div className="mb-6">
                     <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Jurisdicción de Práctica:</p>
                     <p className="text-white text-sm font-medium">{firmData.practiceJurisdiction}</p>
                     <p className="text-slate-500 text-xs mt-1">{firmData.admissionCourts}</p>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-3">
                     {firmData.recentCases.slice(0,2).map((c, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                           <span className="text-slate-300 font-medium text-sm">{c.type}</span>
                           <span className="text-slate-500 text-xs text-right ml-4">{c.location}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Metrics */}
               <div className="grid grid-cols-2 md:grid-cols-1 gap-6 text-center md:text-right border-t border-slate-700/50 pt-8 md:border-0 md:pt-0 md:border-l md:border-slate-700/50 md:pl-12">
                  <div>
                     <div className="text-3xl font-bold text-white mb-1">{firmData.successMetrics.yearsExp}</div>
                     <div className="text-slate-400 text-sm">de Experiencia Legal</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-white mb-1">{firmData.successMetrics.casesResolved}</div>
                     <div className="text-slate-400 text-sm">Casos Resueltos</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                     <div className="text-3xl font-bold text-white mb-1">{firmData.successMetrics.approvalRate}</div>
                     <div className="text-slate-400 text-sm">Tasa de Aprobación</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Interactive Services Catalog */}
         <div className="mt-24 max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-white mb-4 text-center">Catálogo de Servicios Migratorios</h2>
            <p className="text-slate-400 text-center mb-10">Seleccione el área de práctica para ver los requisitos, formularios y tasas oficiales vigentes.</p>
            
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
               {Object.keys(categories).map((cat) => {
                  const isActive = activeTab === cat;
                  return (
                     <button 
                        key={cat}
                        onClick={() => setActiveTab(cat as ServiceCategory)}
                        className={`px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition border ${isActive ? 'bg-gold-500 text-navy-950 border-gold-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500 hover:bg-slate-800'}`}
                     >
                        {tabIcons[cat]} {cat}
                     </button>
                  );
               })}
            </div>

            {/* Service Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500" key={activeTab}>
               {categories[activeTab].map((service) => (
                  <div key={service.id} className="bg-slate-900 border border-slate-800 hover:border-gold-500/50 rounded-2xl p-6 transition group flex flex-col h-full shadow-lg hover:shadow-gold-500/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/5 rounded-bl-full transition group-hover:bg-gold-500/10"></div>
                     
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="bg-slate-800 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">{service.code}</span>
                        {service.uscisFee === 0 ? (
                           <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Tasa USCIS: Gratis</span>
                        ) : (
                           <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tasa USCIS: ${service.uscisFee}</span>
                        )}
                     </div>
                     
                     <h3 className="text-xl font-bold text-white mb-2 relative z-10">{service.name}</h3>
                     <p className="text-slate-400 text-sm mb-6 flex-1 relative z-10 leading-relaxed">{service.description}</p>
                     
                     <div className="mt-auto relative z-10">
                        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                           <ShieldCheck size={14} className="text-gold-500" /> Requiere {service.requiredDocs.length} documentos clave
                        </p>
                        <a href={`/client?service=${service.id}`} className="block w-full text-center bg-slate-800 hover:bg-gold-500 hover:text-navy-950 text-white font-bold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                           Iniciar Trámite <ChevronRight size={16} />
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Viral Map Section */}
         <div className="mt-24 max-w-7xl mx-auto px-4 md:px-6">
            <ImmigrationActivityMap />
         </div>

         {/* Immigration News Feed Section */}
         <div className="mt-24 max-w-6xl mx-auto border-t border-slate-800 pt-20">
            <ImmigrationNewsFeed />
         </div>

         {/* Office Locator Section */}
         <div className="mt-24 max-w-5xl mx-auto">
            <OfficeLocator />
         </div>

         {/* FAQ & Security Section */}
         <div className="mt-24 bg-slate-900 border-t border-b border-slate-800 py-20">
            <div className="max-w-4xl mx-auto px-6">
               <LegalFAQAccordion />
            </div>
         </div>
      </main>

      <LegalFooter />
    </div>
  );
}
