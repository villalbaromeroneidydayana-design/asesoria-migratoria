import React from 'react';
import { 
  Scale, 
  PhoneCall, 
  Users, 
  Stethoscope, 
  ShieldAlert, 
  Mic, 
  BookOpen, 
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  Bot,
  Compass,
  Upload,
  UserCheck,
  Calculator,
  Globe,
  Search,
  Lock
} from 'lucide-react';
import { LAWYER_PROFILE } from '../data/initialData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickCall: () => void;
  onOpenNewClientModal: () => void;
  onOpenBulkImport?: () => void;
  onOpenProfile?: () => void;
  onViewWebsite?: () => void;
  onLogout?: () => void;
  clientsCount: number;
  urgentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickCall,
  onOpenNewClientModal,
  onOpenBulkImport,
  onOpenProfile,
  onViewWebsite,
  onLogout,
  clientsCount,
  urgentCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'migraconnect', label: '🔍 Rastreador MigraConnect', icon: Search, highlight: true },
    { id: 'tarifas', label: 'Formularios & Tarifas', icon: Calculator },
    { id: 'intake', label: 'Intake / Guía de Llamada', icon: PhoneCall },
    { id: 'clients', label: 'Expedientes & Clientes', icon: Users, badge: clientsCount },
    { id: 'ubicaciones', label: 'Sedes Oficiales', icon: Compass },
    { id: 'estefania', label: 'Estefanía (Asistente)', icon: Bot },
    { id: 'tramites', label: 'Médicos & Biométricos', icon: Stethoscope },
    { id: 'fianzas', label: 'Fianzas & Cortes (Juez)', icon: ShieldAlert, alertBadge: urgentCount },
    { id: 'audios', label: 'Audios (ElevenLabs)', icon: Mic },
    { id: 'estrategia', label: 'Manual de Abordaje', icon: BookOpen }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/90 border-b border-slate-800/80 shadow-2xl">
      {/* Top Bar with Law Firm Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-slate-800/60">
          
          {/* Lawyer Brand & Direct Contact */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:scale-105 transition cursor-pointer"
              title="Ver perfil oficial de WhatsApp Business del Lic. David Antony Carrillo"
            >
              <Scale className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-wide text-slate-100">
                  {LAWYER_PROFILE.nombre.toUpperCase()}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {LAWYER_PROFILE.titulo}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-400 mt-0.5">
                <a 
                  href={`tel:${LAWYER_PROFILE.telefono.replace(/[^0-9+]/g, '')}`} 
                  className="text-emerald-400 font-mono hover:underline font-semibold"
                >
                  📞 {LAWYER_PROFILE.telefono}
                </a>
                <span className="hidden sm:inline text-slate-600">•</span>
                <a 
                  href={`mailto:${LAWYER_PROFILE.email}`} 
                  className="hidden sm:inline text-slate-300 hover:text-amber-300 transition"
                >
                  ✉️ {LAWYER_PROFILE.email}
                </a>
                <span className="hidden md:inline text-slate-600">•</span>
                <span className="hidden md:inline text-slate-400">
                  Horario: {LAWYER_PROFILE.horario}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onViewWebsite && (
              <button
                onClick={onViewWebsite}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-md transition cursor-pointer"
                title="Ver Sitio Web Público del Despacho"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">🌐 Sitio Web</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold shadow-md transition cursor-pointer"
                title="Cerrar Sesión del CRM Legal"
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            )}

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 text-xs font-semibold transition cursor-pointer"
                title="Tarjeta de Presentación Oficial"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Perfil Legal</span>
              </button>
            )}

            {onOpenBulkImport && (
              <button
                onClick={onOpenBulkImport}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-md transition cursor-pointer"
                title="Pegar lista de prospectos y teléfonos"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">+ Carga Masiva</span>
              </button>
            )}

            <button
              onClick={onOpenNewClientModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-950/40 border border-amber-300/40 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 fill-slate-950" />
              <span>+ Nuevo Cliente</span>
            </button>

            <button
              onClick={onOpenQuickCall}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-emerald-200" />
              <span>Intake Llamada</span>
            </button>

            <a
              href="https://web.whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
              title="Abrir WhatsApp Web"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Web</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 border border-amber-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                } ${item.highlight && !isActive ? 'ring-1 ring-emerald-500/30 text-emerald-300' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
                {item.alertBadge !== undefined && item.alertBadge > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-red-950/80 text-red-400 border border-red-800/50 animate-pulse">
                    {item.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
