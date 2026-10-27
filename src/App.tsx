import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CallIntakeWizard } from './components/CallIntakeWizard';
import { ClientsCRM } from './components/ClientsCRM';
import { TramitesPreviosGuia } from './components/TramitesPreviosGuia';
import { FianzasYCortes } from './components/FianzasYCortes';
import { AsistenteVirtualAudios } from './components/AsistenteVirtualAudios';
import { GuiaEstrategica } from './components/GuiaEstrategica';
import { NewClientModal } from './components/NewClientModal';
import { EstefaniaAssistant } from './components/EstefaniaAssistant';
import { GuiaTramitesUbicaciones } from './components/GuiaTramitesUbicaciones';
import { BulkImportModal } from './components/BulkImportModal';
import { LawyerProfileModal } from './components/LawyerProfileModal';
import { FormulariosYTarifas } from './components/FormulariosYTarifas';
import { PublicLandingPage } from './components/PublicLandingPage';
import { MigraConnectConsole } from './components/MigraConnectConsole';
import { CrmAuthModal } from './components/CrmAuthModal';
import { INITIAL_CLIENTS, USER_INITIAL_LEADS, LAWYER_PROFILE } from './data/initialData';
import type { ClientLead, EstefaniaMessageRecord } from './types';
import { Scale, ShieldCheck } from 'lucide-react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('bufete_crm_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState<'landing' | 'crm'>(() => {
    try {
      const isAuth = localStorage.getItem('bufete_crm_authenticated') === 'true';
      if (typeof window !== 'undefined' && window.location.hash === '#crm' && isAuth) {
        return 'crm';
      }
      const saved = localStorage.getItem('bufete_legal_view_mode');
      if (saved === 'crm' && isAuth) {
        return 'crm';
      }
    } catch (e) {
      // ignore
    }
    return 'landing';
  });

  // Si alguien intenta abrir #crm sin estar autenticado, bloquearlo y pedir el PIN
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#crm') {
      if (!isAuthenticated) {
        setIsAuthModalOpen(true);
        setViewMode('landing');
      }
    }
  }, [isAuthenticated]);

  const handleSwitchView = (mode: 'landing' | 'crm') => {
    if (mode === 'crm' && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setViewMode(mode);
    try {
      localStorage.setItem('bufete_legal_view_mode', mode);
      if (mode === 'crm') {
        window.location.hash = '#crm';
      } else {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleAuthenticatedSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setViewMode('crm');
    try {
      localStorage.setItem('bufete_legal_view_mode', 'crm');
      window.location.hash = '#crm';
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('bufete_crm_authenticated');
      localStorage.setItem('bufete_legal_view_mode', 'landing');
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
    setViewMode('landing');
    window.history.replaceState(null, '', window.location.pathname);
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Inicializa la plataforma con los prospectos reales del Lic. David Antony Carrillo
  const [clients, setClients] = useState<ClientLead[]>(() => {
    try {
      const stored = localStorage.getItem('bufete_legal_clientes');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: ClientLead) => {
            if (c.id === 'LEAD-101' || c.numeroExpediente === 'EXP-2024-001') {
              return {
                ...c,
                ...USER_INITIAL_LEADS[0]
              };
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.error('Error cargando clientes almacenados:', e);
    }
    // Carga inicial con los 10 prospectos proporcionados por el usuario
    return USER_INITIAL_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bufete_legal_clientes', JSON.stringify(clients));
    } catch (e) {
      console.error('Error guardando clientes en localStorage:', e);
    }
  }, [clients]);

  const [selectedClient, setSelectedClient] = useState<ClientLead | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [estefaniaPrefill, setEstefaniaPrefill] = useState<{
    clientId?: string;
    messageText?: string;
  }>({});

  // Compute next sequential unique expediente number
  const nextExpedienteNumber = `EXP-2024-${String(clients.length + 1).padStart(3, '0')}`;

  const handleResetToZero = () => {
    setClients([]);
    setSelectedClient(null);
    localStorage.removeItem('bufete_legal_clientes');
  };

  const handleLoadDemoData = () => {
    setClients(INITIAL_CLIENTS);
  };

  const handleLoadUserLeads = () => {
    setClients(USER_INITIAL_LEADS);
    setActiveTab('clients');
  };

  // Bulk import leads handler
  const handleBulkImport = (newLeads: ClientLead[]) => {
    setClients(prev => [...newLeads, ...prev]);
    setActiveTab('clients');
  };

  // Bridge from Guía de Trámites to Estefanía
  const handleSendToEstefania = (clientId: string, instructionText: string) => {
    setEstefaniaPrefill({
      clientId,
      messageText: instructionText
    });
    setActiveTab('estefania');
  };

  // Add lead from the interactive call wizard
  const handleSaveLead = (newLead: ClientLead) => {
    setClients(prev => [newLead, ...prev]);
  };

  // Add client from the "+ Nuevo Cliente" modal
  const handleSaveNewClient = (newClient: ClientLead) => {
    setClients(prev => [newClient, ...prev]);
  };

  // Update existing client
  const handleUpdateClient = (updated: ClientLead) => {
    setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedClient && selectedClient.id === updated.id) {
      setSelectedClient(updated);
    }
  };

  // Save message from Estefania to client record
  const handleSaveMessageToClient = (clientId: string, record: EstefaniaMessageRecord) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          historialMensajesEstefania: [record, ...(c.historialMensajesEstefania || [])]
        };
      }
      return c;
    }));
  };

  // Count urgent cases
  const urgentCount = clients.filter(c => c.estaDetenido || c.status === 'detenido_fianza').length;

  if (viewMode === 'landing') {
    return (
      <>
        <PublicLandingPage
          onEnterCRM={() => handleSwitchView('crm')}
          onSaveLeadFromWebsite={handleSaveNewClient}
        />
        <CrmAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticated={handleAuthenticatedSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickCall={() => setActiveTab('intake')}
        onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onViewWebsite={() => handleSwitchView('landing')}
        onLogout={handleLogout}
        clientsCount={clients.length}
        urgentCount={urgentCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            clients={clients}
            onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
            onStartIntake={() => setActiveTab('intake')}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onSelectClient={(client) => {
              setSelectedClient(client);
              setActiveTab('clients');
            }}
            onResetToZero={handleResetToZero}
            onLoadDemoData={handleLoadDemoData}
            onLoadUserLeads={handleLoadUserLeads}
            onOpenBulkImport={() => setIsBulkImportOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'migraconnect' && (
          <MigraConnectConsole
            clients={clients}
            onUpdateClient={handleUpdateClient}
          />
        )}

        {activeTab === 'tarifas' && (
          <FormulariosYTarifas
            onStartIntake={() => setActiveTab('intake')}
          />
        )}

        {activeTab === 'ubicaciones' && (
          <GuiaTramitesUbicaciones
            clients={clients}
            onUpdateClient={handleUpdateClient}
            onSendToEstefania={handleSendToEstefania}
          />
        )}

        {activeTab === 'estefania' && (
          <EstefaniaAssistant
            clients={clients}
            onSaveMessageToClient={handleSaveMessageToClient}
            preselectedClientId={estefaniaPrefill.clientId}
            initialMessageText={estefaniaPrefill.messageText}
          />
        )}

        {activeTab === 'intake' && (
          <CallIntakeWizard
            onSaveLead={handleSaveLead}
            onNavigateToClients={() => setActiveTab('clients')}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsCRM
            clients={clients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            onUpdateClient={handleUpdateClient}
            onStartIntake={() => setActiveTab('intake')}
            onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
            onOpenBulkImport={() => setIsBulkImportOpen(true)}
          />
        )}

        {activeTab === 'tramites' && (
          <TramitesPreviosGuia />
        )}

        {activeTab === 'fianzas' && (
          <FianzasYCortes />
        )}

        {activeTab === 'audios' && (
          <AsistenteVirtualAudios />
        )}

        {activeTab === 'estrategia' && (
          <GuiaEstrategica />
        )}
      </main>

      {/* Modal: + Nuevo Cliente */}
      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSaveClient={handleSaveNewClient}
        nextExpedienteNumber={nextExpedienteNumber}
        onStartIntakeForClient={(_client) => {
          setActiveTab('intake');
        }}
      />

      {/* Modal: Carga Masiva de Prospectos */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportLeads={handleBulkImport}
        existingCount={clients.length}
      />

      {/* Modal: Perfil del Licenciado David Antony Carrillo */}
      <LawyerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#070b14] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif font-bold text-slate-200">
                {LAWYER_PROFILE.despacho} • {LAWYER_PROFILE.titulo}
              </p>
              <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-mono font-semibold">📞 {LAWYER_PROFILE.telefono}</span>
                <span>•</span>
                <span className="text-slate-300">✉️ {LAWYER_PROFILE.email}</span>
                <span>•</span>
                <span>Horario: {LAWYER_PROFILE.horario}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Confidencialidad Legal Protegida
            </span>
            <span>•</span>
            <span>Línea Telefónica EOIR: 1-800-898-7180</span>
            <span>•</span>
            <span>Portal CeBONDS de ICE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
