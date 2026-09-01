import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Download, ChevronRight, File, MapPin, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';
import { firmData } from '../config/firmData';
import { servicesCatalog } from '../config/servicesData';
import type { ImmigrationService } from '../config/servicesData';
import OfficialLookupConsole from '../components/OfficialLookupConsole';
import DocumentUploadSection from '../components/DocumentUploadSection';
import ClientActionTasks from '../components/ClientActionTasks';
import PaymentMilestones from '../components/PaymentMilestones';
import QuickExit from '../components/QuickExit';
import OfficeLocator from '../components/OfficeLocator';
import OfficialLocationsMap from '../components/OfficialLocationsMap';
import LegalFAQAccordion from '../components/LegalFAQAccordion';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function ClientPortal() {
  const { t } = useTranslation();
  const [step, setStep] = useState<'intake' | 'roadmap'>('intake');
  const [selectedServices, setSelectedServices] = useState<ImmigrationService[]>([]);

  useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const serviceId = params.get('service');
     if (serviceId) {
        const found = servicesCatalog.find(s => s.id === serviceId);
        if (found) setSelectedServices([found]);
     } else {
        setSelectedServices([servicesCatalog[0]]); // Default to first service if none selected
     }
  }, []);
  
  // Intake State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    aNumber: '',
    entryType: 'CBP',
    entryDate: '',
    state: 'FL',
    address: '',
    phone: '',
    consent: false
  });

  // A-Number Auto-Formatter
  const handleANumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (val.length > 9) val = val.substring(0, 9); // Limit to 9 digits
    
    let formatted = '';
    if (val.length > 0) {
      formatted += 'A-' + val.substring(0, 3);
    }
    if (val.length > 3) {
      formatted += '-' + val.substring(3, 6);
    }
    if (val.length > 6) {
      formatted += '-' + val.substring(6, 9);
    }
    
    setFormData({ ...formData, aNumber: formatted });
  };

  // Dynamic Routing Logic based on state
  const getLockbox = (state: string) => {
    const txLockboxStates = ['FL', 'TX', 'NM', 'OK'];
    if (txLockboxStates.includes(state)) {
       return {
          name: "USCIS Texas Service Center",
          address: "Attn: Formularios de Inmigración\nP.O. Box 660867\nDallas, TX 75266-0867"
       };
    }
    return {
       name: "USCIS Chicago Lockbox",
       address: "Attn: Formularios de Inmigración\nP.O. Box 805887\nChicago, IL 60680-4120"
    };
  };

  // Dynamic Packages Logic
  const getPackages = (entryType: string) => {
     let pkgs = [];
     if (entryType === 'EWI') {
        pkgs.push({ name: "I-589 Application for Asylum", desc: "Asilo Defensivo (EOIR)", color: "red" });
        pkgs.push({ name: "I-765 Work Authorization", desc: "Categoría (c)(8)", color: "blue" });
     } else if (entryType === 'CBP') {
        pkgs.push({ name: "I-765 Work Authorization", desc: "Categoría (c)(11) Parole", color: "blue" });
        pkgs.push({ name: "I-589 Application for Asylum", desc: "Asilo Afirmativo (USCIS)", color: "red" });
     } else {
        pkgs.push({ name: "I-130 / I-485", desc: "Ajuste de Estatus", color: "emerald" });
        pkgs.push({ name: "I-765 Work Authorization", desc: "Categoría (c)(9)", color: "blue" });
     }
     pkgs.push({ name: "G-1145 E-Notification", desc: "Confirmación SMS/Email", color: "emerald" });
     return pkgs;
  };

  const lockboxInfo = getLockbox(formData.state);
  const packagesInfo = getPackages(formData.entryType);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Phase 7: Save to local storage so CRM can read it
    const newLead = {
       id: Date.now().toString(),
       ...formData,
       services: selectedServices.map(s => s.id),
       timestamp: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('acesoria_leads') || '[]');
    // Keep only latest 10 to avoid bloating localstorage
    localStorage.setItem('acesoria_leads', JSON.stringify([newLead, ...existing].slice(0, 10)));

    setStep('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <QuickExit />
      
      {/* Privacy & ICE Protection Banner */}
      <div className="bg-emerald-950 text-emerald-100 py-3 px-6 shadow-md border-b border-emerald-900/50">
         <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-sm text-center">
            <Lock size={16} className="text-emerald-400 shrink-0" />
            <p>
               <strong>{t('clientPortal.banner.title')}</strong> {t('clientPortal.banner.desc1')}
               <span className="block md:inline md:ml-1 text-emerald-300 font-medium">{t('clientPortal.banner.desc2')}</span>
            </p>
         </div>
      </div>

      <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-navy-950 text-white p-6 flex flex-col shrink-0 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[40px]"></div>
         <a href="/" className="text-emerald-400 hover:text-emerald-300 font-bold mb-4 block border border-emerald-500/30 w-fit px-4 py-2 rounded-lg bg-emerald-900/20 transition hover:bg-emerald-900/40">
            {t('clientPortal.sidebar.backBtn')}
         </a>
         
         <div className="mb-8">
            <LanguageSwitcher />
         </div>

         <div className="flex items-center gap-4 mb-10 relative z-10">
           <ShieldCheck className="text-gold-500" size={28} />
           <h2 className="text-xl font-serif font-bold text-white">{t('clientPortal.sidebar.title')}</h2>
        </div>
        
        <nav className="space-y-2 flex-1 relative z-10">
          <button 
             onClick={() => setStep('intake')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${step === 'intake' ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <FileText size={20} /> {t('clientPortal.sidebar.intakeForm')}
          </button>
          <button 
             disabled={step === 'intake'}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${step === 'roadmap' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-500 opacity-50 cursor-not-allowed'}`}
          >
            <CheckCircle size={20} /> {t('clientPortal.sidebar.roadmap')}
          </button>
        </nav>

        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800">
           <p className="text-xs text-slate-500 mb-2">{t('clientPortal.sidebar.assistedBy')}</p>
           <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                 <img src={firmData.lawyerPhotoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" alt="Abogado" />
                 <div>
                    <p className="font-bold text-sm text-slate-200">{firmData.lawyerName}</p>
                    <p className="text-xs text-gold-500 font-semibold">{firmData.barAssociation}</p>
                 </div>
              </div>
              <div className="bg-slate-900 rounded p-2 text-xs border border-slate-800">
                 <span className="text-slate-400 block mb-0.5">Bar Card #{firmData.barNumber}</span>
                 <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck size={12} /> <span className="font-medium truncate">{firmData.barStatus.split('/')[0].trim()}</span>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {step === 'intake' && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
             <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">{t('clientPortal.intake.title')}</h1>
                <p className="text-slate-600 text-lg">{t('clientPortal.intake.subtitle')}</p>
             </header>

             <form onSubmit={handleContinue} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.firstName')}</label>
                      <input type="text" required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3" placeholder="Ej. Juan Carlos" />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.lastName')}</label>
                      <input type="text" required value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3" placeholder="Ej. Pérez" />
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.state')}</label>
                      <select value={formData.state} onChange={e=>setFormData({...formData, state: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3">
                         <option value="FL">Florida (FL)</option>
                         <option value="TX">Texas (TX)</option>
                         <option value="NY">New York (NY)</option>
                         <option value="CA">California (CA)</option>
                         <option value="IL">Illinois (IL)</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.phone')}</label>
                      <input type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3" placeholder="(XXX) XXX-XXXX" />
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                         <Lock size={12} className="text-emerald-600" />
                         {t('clientPortal.intake.phoneDisclaimer')}
                      </p>
                   </div>
                   
                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.address')} <span className="text-slate-400 font-normal">{t('clientPortal.intake.addressOptional')}</span></label>
                      <input type="text" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3" placeholder="123 Main St, Apt 4B, City, ST 12345" />
                   </div>

                   <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.aNumber')} <span className="text-slate-400 font-normal">{t('clientPortal.intake.aNumberOptional')}</span></label>
                      <input type="text" value={formData.aNumber} onChange={handleANumberChange} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3 font-mono" placeholder="A-000-000-000" />
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.entryType')}</label>
                      <select value={formData.entryType} onChange={e=>setFormData({...formData, entryType: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3 font-semibold text-navy-800">
                         <option value="CBP">{t('clientPortal.intake.entryOptions.cbp')}</option>
                         <option value="VISA">{t('clientPortal.intake.entryOptions.visa')}</option>
                         <option value="EWI">{t('clientPortal.intake.entryOptions.ewi')}</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t('clientPortal.intake.entryDate')}</label>
                      <input type="date" required value={formData.entryDate} onChange={e=>setFormData({...formData, entryDate: e.target.value})} className="w-full border-slate-200 rounded-lg focus:ring-navy-500 focus:border-navy-500 bg-slate-50 px-4 py-3" />
                   </div>
                </div>

                {/* Consent Checkbox */}
                <div className="bg-navy-50 p-5 rounded-xl border border-navy-100 mb-8">
                   <div className="flex items-start gap-4">
                      <input 
                         type="checkbox" 
                         id="consent"
                         required
                         checked={formData.consent}
                         onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                         className="w-5 h-5 rounded border-navy-300 text-navy-700 focus:ring-navy-500 mt-1 cursor-pointer"
                      />
                      <label htmlFor="consent" className="text-sm text-slate-700 cursor-pointer">
                         <strong className="text-navy-900 block mb-1">{t('clientPortal.intake.consentTitle')}</strong>
                         {t('clientPortal.intake.consentDesc')}
                      </label>
                   </div>
                </div>

                <div className="flex justify-end">
                   <button type="submit" disabled={!formData.consent} className={`px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition shadow-lg ${formData.consent ? 'bg-navy-900 hover:bg-navy-800 text-white shadow-navy-900/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                      {t('clientPortal.intake.submitBtn')} <ChevronRight size={20} />
                   </button>
                </div>
             </form>
          </div>
        )}

        {step === 'roadmap' && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
             <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-3">{t('clientPortal.roadmap.title')} {formData.firstName} {formData.lastName}</h1>
                  <p className="text-slate-600 text-lg">{t('clientPortal.roadmap.strategy')} {formData.entryType === 'CBP' ? t('clientPortal.roadmap.strategyCbp') : formData.entryType === 'EWI' ? t('clientPortal.roadmap.strategyEwi') : t('clientPortal.roadmap.strategyVisa')}</p>
                </div>
             </header>

             {/* Generador de Paquetes */}
             <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-500"></div>
                <h2 className="text-2xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                   <FileText className="text-gold-500" /> {t('clientPortal.roadmap.formsTitle')}
                </h2>
                <p className="text-slate-600 mb-6">{t('clientPortal.roadmap.formsSubtitle')} ({formData.entryDate}).</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                   {packagesInfo.map((pkg, idx) => (
                      <div key={idx} onClick={() => window.print()} className="border-2 border-slate-100 p-5 rounded-xl flex justify-between items-center hover:border-navy-500 hover:shadow-md transition cursor-pointer group bg-slate-50" title="Imprimir formulario">
                        <div className="flex items-center gap-4">
                           <div className={`bg-${pkg.color}-100 p-3 rounded-lg text-${pkg.color}-600 group-hover:bg-${pkg.color}-600 group-hover:text-white transition`}>
                              <File size={24} />
                           </div>
                           <div>
                              <span className="font-bold text-slate-800 block">{pkg.name}</span>
                              <span className="text-xs text-slate-500 font-medium">{pkg.desc}</span>
                           </div>
                        </div>
                        <Download size={22} className="text-slate-400 group-hover:text-navy-600 transition" />
                      </div>
                   ))}
                </div>
             </section>

             {/* Instrucciones de Radicación Reales */}
             <div className="grid md:grid-cols-2 gap-8">
                {/* Lockbox Info */}
                <section className="bg-navy-950 text-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                   <div className="absolute -right-10 -top-10 text-navy-800 opacity-20"><MapPin size={200} /></div>
                   <h2 className="text-xl font-bold text-gold-500 mb-6 flex items-center gap-3 relative z-10">
                      <MapPin size={24} /> {t('clientPortal.roadmap.uscisTitle')} ({formData.state})
                   </h2>
                   <div className="relative z-10">
                      <p className="text-slate-300 text-sm mb-4">{t('clientPortal.roadmap.uscisDesc')}</p>
                      
                      <div className="bg-navy-900 p-5 rounded-xl border border-navy-700 mb-6 shadow-inner">
                         <p className="font-bold text-lg mb-2">{lockboxInfo.name}</p>
                         <p className="text-slate-300 font-mono text-sm whitespace-pre-line leading-relaxed">{lockboxInfo.address}</p>
                      </div>
                   </div>
                </section>

                <OfficialLocationsMap />

                {/* Local Guides */}
                <section className="space-y-6">
                   {formData.entryType === 'EWI' && (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                            <AlertTriangle className="text-orange-500" size={20} /> {t('clientPortal.roadmap.eoirTitle')}
                         </h3>
                         <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                            {t('clientPortal.roadmap.eoirDesc1')} <strong>1-800-898-7180</strong> {t('clientPortal.roadmap.eoirDesc2')} <span className="font-mono bg-slate-100 px-1">{formData.aNumber}</span>.
                         </p>
                      </div>
                   )}
                   
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                         <ShieldCheck className="text-emerald-500" size={20} /> {t('clientPortal.roadmap.licenseTitle')} {formData.state}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                         {t('clientPortal.roadmap.licenseDesc')} {formData.state}.
                      </p>
                      <button className="text-navy-600 font-bold text-sm hover:underline flex items-center gap-1">{t('clientPortal.roadmap.licenseBtn')} <ChevronRight size={16} /></button>
                   </div>
                </section>
             </div>
             
             {/* Nuevos Módulos Integrados */}
             <div className="mt-12 space-y-8">
                <PaymentMilestones services={selectedServices} />
                <DocumentUploadSection services={selectedServices} />
                <ClientActionTasks services={selectedServices} />
             </div>

             {/* Herramientas Oficiales y Buscadores */}
             <div className="mt-12 space-y-6">
                <OfficialLookupConsole />
                <OfficeLocator />
             </div>

             <div className="mt-12 bg-slate-900 rounded-2xl p-8 shadow-xl">
                <LegalFAQAccordion />
             </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
