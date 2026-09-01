import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CalendarCheck, 
  Calendar as CalendarIcon,
  Scissors, 
  QrCode, 
  Key, 
  Sparkles, 
  Building2, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  Award, 
  Menu, 
  X, 
  Globe, 
  LayoutDashboard,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { SleekLanding } from './components/SleekLanding';
import { OnboardingWizard } from './components/OnboardingWizard';
import { WhatsAppConnectionQR } from './components/WhatsAppConnectionQR';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { GoogleCalendarView } from './components/GoogleCalendarView';
import { RemindersManager } from './components/RemindersManager';
import { AppointmentsCalendar } from './components/AppointmentsCalendar';
import { ServicesManager } from './components/ServicesManager';
import { QrLinkGenerator } from './components/QrLinkGenerator';
import { BusinessAuthModal } from './components/BusinessAuthModal';
import { SuperAdminManager } from './components/SuperAdminManager';
import { db } from '../server/db';

function App() {
  // 'landing' o 'dashboard'
  const [currentMode, setCurrentMode] = useState('landing');
  const [userRole, setUserRole] = useState('business'); // 'business' (dueño de local aislado) o 'superadmin' (dueño de turnia)
  const [activeTab, setActiveTab] = useState('simulator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(db.getBusinesses()[0]);
  const [subscriptionPaid, setSubscriptionPaid] = useState(false);

  const [stats, setStats] = useState({
    todayAppointments: 1,
    totalAppointments: 2,
    totalRevenue: 40,
    totalBusinesses: 2,
    mrr: 0,
    trialTenants: 0
  });

  const loadStats = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const platformStats = db.getPlatformStats();

    if (userRole === 'superadmin') {
      const allAppts = db.getAppointments().filter(a => a.status === 'Confirmado');
      setStats({
        todayAppointments: allAppts.filter(a => a.date === todayStr).length,
        totalAppointments: allAppts.length,
        totalRevenue: allAppts.reduce((acc, curr) => acc + (curr.price || 0), 0),
        totalBusinesses: platformStats.totalTenants,
        mrr: platformStats.monthlyRecurringRevenue,
        trialTenants: platformStats.trialTenantsCount
      });
    } else {
      // Métricas exclusivamente aisladas del local del cliente logueado
      const bizId = currentBusiness?.id || 'biz-1';
      const myAppts = db.getAppointments(bizId).filter(a => a.status === 'Confirmado');
      const today = myAppts.filter(a => a.date === todayStr);
      const revenue = myAppts.reduce((acc, curr) => acc + (curr.price || 0), 0);

      setStats({
        todayAppointments: today.length,
        totalAppointments: myAppts.length,
        totalRevenue: revenue,
        totalBusinesses: 1,
        mrr: currentBusiness?.monthlyPrice || 39,
        trialTenants: currentBusiness?.subscriptionStatus === 'trial' ? 1 : 0
      });
    }
  };

  useEffect(() => {
    loadStats();
    if (currentBusiness) {
      const refreshed = db.getBusinessById(currentBusiness.id);
      if (refreshed) setCurrentBusiness(refreshed);
    }
  }, [refreshKey, userRole, currentBusiness?.id]);

  const handleAppointmentBooked = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFinishOnboarding = (newBiz) => {
    setRefreshKey(prev => prev + 1);
    setCurrentBusiness(newBiz);
    setUserRole('business');
    setCurrentMode('dashboard');
    setActiveTab('services');
  };

  const handleActivateSubscription = () => {
    db.activateSubscription(currentBusiness.id);
    setSubscriptionPaid(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setSubscriptionPaid(false), 4000);
  };

  const navItems = [
    ...(userRole === 'superadmin' ? [
      { id: 'superadmin', label: 'Master Control (SuperAdmin)', icon: ShieldCheck, badge: 'Dueño Turnia', highlight: true }
    ] : []),
    { id: 'whatsapp-qr', label: 'Conectar WhatsApp (QR)', icon: QrCode, badge: 'Sin Twilio', highlight: userRole !== 'superadmin' },
    { id: 'simulator', label: 'Simulador WhatsApp Bot', icon: Bot, badge: 'Live Chat' },
    { id: 'gcalendar', label: 'Google Calendar Sync', icon: CalendarIcon, badge: 'Auto-Sync' },
    { id: 'services', label: 'Horarios, Servicios & Precios', icon: Scissors },
    { id: 'reminders', label: 'Recordatorios (24h y 2h)', icon: Bell, badge: '-70% No-Shows' },
    { id: 'calendar', label: 'Agenda de Citas', icon: CalendarCheck },
    { id: 'qr', label: 'Links & Códigos QR', icon: Globe },
    ...(userRole === 'superadmin' ? [
      { id: 'onboarding', label: 'Alta Manual de Local', icon: UserPlus }
    ] : [])
  ];

  // Modo Landing Page Pública (turnia.es)
  if (currentMode === 'landing') {
    return (
      <div className="relative">
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setCurrentMode('dashboard')}
            className="sleek-card px-4 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-400/30 transition-all hover:scale-105"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Abrir Panel de Control & Simulador</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <SleekLanding
          onOpenSimulator={() => {
            setCurrentMode('dashboard');
            setActiveTab('simulator');
          }}
          onOpenDashboard={() => {
            setCurrentMode('dashboard');
            setActiveTab('calendar');
          }}
          onStartOnboarding={() => {
            setCurrentMode('dashboard');
            setActiveTab('onboarding');
          }}
          onOpenLogin={() => setIsAuthModalOpen(true)}
        />

        <BusinessAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(biz, role = 'business') => {
            if (biz) setCurrentBusiness(biz);
            setUserRole(role);
            setCurrentMode('dashboard');
            setActiveTab(role === 'superadmin' ? 'superadmin' : 'services');
          }}
        />
      </div>
    );
  }

  // Modo Dashboard / Panel de Gestión de Barberías
  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col md:flex-row relative">
      
      {/* Auth Modal */}
      <BusinessAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(biz, role = 'business') => {
          if (biz) setCurrentBusiness(biz);
          setUserRole(role);
          setActiveTab(role === 'superadmin' ? 'superadmin' : 'services');
          setRefreshKey(prev => prev + 1);
        }}
      />

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-900 border-b border-dark-800 z-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            TURNIA
          </span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-400 hover:text-white p-1"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-dark-900/95 md:bg-dark-900 border-r border-dark-800 p-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo & Switch a Landing */}
          <div className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent block">
                  TURNIA
                </span>
                <span className="text-[10px] text-slate-400 italic block -mt-1">
                  Tu agenda responde sola.
                </span>
              </div>
            </div>
          </div>

          {/* Botón Ver Landing Pública */}
          <button
            onClick={() => setCurrentMode('landing')}
            className="w-full mb-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ver Landing Page Pública</span>
          </button>

          {/* Business Info Card / Auth Switcher */}
          <div className={`border rounded-2xl p-3.5 mb-4 relative overflow-hidden shadow-lg space-y-2 ${
            userRole === 'superadmin'
              ? 'bg-purple-950/40 border-purple-500/30'
              : 'bg-dark-950/70 border-dark-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className={`w-3.5 h-3.5 ${userRole === 'superadmin' ? 'text-purple-400' : 'text-emerald-400'}`} />
                <span className={userRole === 'superadmin' ? 'text-purple-300' : 'text-emerald-400'}>
                  {userRole === 'superadmin' ? 'Dueño Turnia' : 'Local Conectado'}
                </span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                userRole === 'superadmin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : currentBusiness?.subscriptionStatus === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {userRole === 'superadmin' ? 'SuperAdmin' : (currentBusiness?.subscriptionStatus === 'active' ? 'Plan Activo' : '15d Gratis')}
              </span>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-slate-100 truncate">
                {userRole === 'superadmin' ? 'Control Master Turnia' : (currentBusiness?.name || 'Mi Negocio')}
              </h3>
              <p className="text-[10px] text-slate-400 truncate">
                {userRole === 'superadmin' 
                  ? 'Gestión global de clientes y bajas' 
                  : `${currentBusiness?.category || 'Comercio'} • ${currentBusiness?.phone}`}
              </p>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-dark-900 hover:bg-dark-800 border border-dark-800 text-[10px] font-bold text-blue-400 flex items-center justify-center gap-1 transition-all"
            >
              <UserPlus className="w-3 h-3" />
              <span>{userRole === 'superadmin' ? 'Cambiar de Cuenta' : 'Acceso Master / Cambiar Local'}</span>
            </button>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                      : item.highlight
                        ? 'text-purple-300 hover:text-purple-200 bg-purple-500/15 border border-purple-500/25 hover:bg-purple-500/25'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1 ${
                      isActive ? 'bg-black/30 text-white' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-3 border-t border-dark-800 text-center space-y-1">
          <div className="text-[10px] text-slate-500 font-mono">
            turnia.es • Sin instalar apps
          </div>
          <div className="text-[10px] text-emerald-400/80">
            Ahorro: 200 - 400 € / mes
          </div>
        </div>
      </aside>

      {/* Backdrop overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col overflow-y-auto max-h-screen space-y-6">
        
        {/* BANNER DE ESTADO DE SUSCRIPCIÓN & 15 DÍAS GRATIS (Oculto en SuperAdmin) */}
        {userRole !== 'superadmin' && (
          <>
            {currentBusiness?.subscriptionStatus === 'trial' ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-dark-900 to-dark-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Periodo de Prueba de 15 Días
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        {currentBusiness.trialDaysLeft} días restantes
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Estás probando Turnia en <strong>{currentBusiness.name}</strong>. Al terminar el periodo, tu cobro mensual será de <strong>{currentBusiness.monthlyPrice} €/mes</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleActivateSubscription}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Activar Plan Mensual ({currentBusiness.monthlyPrice} €/mes)</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300 shadow-md">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Suscripción Mensual Activa ({currentBusiness?.pricingPlan || 'PRO'} • {currentBusiness?.monthlyPrice} €/mes). Renovación automática activa.</span>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">Al día</span>
              </div>
            )}
          </>
        )}

        {subscriptionPaid && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>¡Pago y suscripción mensual activada con éxito! Tu bot seguirá respondiendo citas 24/7 sin interrupciones.</span>
          </div>
        )}
        
        {/* Metricas Rápidas en Cabecera */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          
          {userRole === 'superadmin' ? (
            <>
              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-l-2 border-l-emerald-500">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>MRR (Facturación Global)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-display font-black text-2xl text-emerald-400 mt-1 font-mono">
                  {stats.mrr} € <span className="text-xs text-slate-400 font-normal">/mes</span>
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-l-2 border-l-purple-500">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Locales Registrados</span>
                  <Building2 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-display font-black text-2xl text-purple-400 mt-1">
                  {stats.totalBusinesses} clientes
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-l-2 border-l-amber-500">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>En Prueba de 15 Días</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-display font-black text-2xl text-amber-400 mt-1">
                  {stats.trialTenants} en prueba
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between border-l-2 border-l-blue-500">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Citas Totales del Bot</span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-display font-black text-2xl text-blue-400 mt-1">
                  {stats.totalAppointments} citas
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Citas para Hoy</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-display font-black text-2xl text-slate-100 mt-1">
                  {stats.todayAppointments}
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Google Calendar Sync</span>
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <span className="font-display font-black text-2xl text-blue-400 mt-1">
                  {stats.totalAppointments} bloqueados
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Facturación de Citas</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-display font-black text-2xl text-amber-400 mt-1 font-mono">
                  {stats.totalRevenue} €
                </span>
              </div>

              <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Bot WhatsApp</span>
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-display font-bold text-sm text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {currentBusiness?.whatsappConnected ? '24/7 Conectado' : 'Esperando QR'}
                </span>
              </div>
            </>
          )}

        </div>

        {/* Renderizado de Vistas del Panel */}
        <div className="flex-1">
          {activeTab === 'superadmin' && (
            <SuperAdminManager onSelectBusinessToInspect={(biz) => setCurrentBusiness(biz)} />
          )}

          {activeTab === 'whatsapp-qr' && (
            <WhatsAppConnectionQR currentBusiness={currentBusiness} userRole={userRole} />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingWizard onFinishOnboarding={handleFinishOnboarding} />
          )}

          {activeTab === 'simulator' && (
            <WhatsAppSimulator onAppointmentBooked={handleAppointmentBooked} />
          )}

          {activeTab === 'gcalendar' && (
            <GoogleCalendarView refreshKey={refreshKey} currentBusiness={currentBusiness} userRole={userRole} />
          )}

          {activeTab === 'reminders' && (
            <RemindersManager refreshKey={refreshKey} />
          )}

          {activeTab === 'calendar' && (
            <AppointmentsCalendar refreshKey={refreshKey} />
          )}

          {activeTab === 'services' && (
            <ServicesManager currentBusiness={currentBusiness} userRole={userRole} />
          )}

          {activeTab === 'qr' && (
            <QrLinkGenerator onOpenSimulator={() => setActiveTab('simulator')} />
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
