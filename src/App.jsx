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
  X
} from 'lucide-react';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { GoogleCalendarView } from './components/GoogleCalendarView';
import { RemindersManager } from './components/RemindersManager';
import { AppointmentsCalendar } from './components/AppointmentsCalendar';
import { ServicesManager } from './components/ServicesManager';
import { QrLinkGenerator } from './components/QrLinkGenerator';
import { PitchPresentation } from './components/PitchPresentation';
import { TwilioSettings } from './components/TwilioSettings';
import { db } from '../server/db';

function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [stats, setStats] = useState({
    todayAppointments: 1,
    totalAppointments: 2,
    totalRevenue: 40,
    totalBusinesses: 2
  });

  const loadStats = () => {
    const appointments = db.getAppointments();
    const todayStr = new Date().toISOString().split('T')[0];
    const confirmed = appointments.filter(a => a.status === 'Confirmado');
    const today = confirmed.filter(a => a.date === todayStr);
    const revenue = confirmed.reduce((acc, curr) => acc + (curr.price || 0), 0);

    setStats({
      todayAppointments: today.length,
      totalAppointments: confirmed.length,
      totalRevenue: revenue,
      totalBusinesses: db.getBusinesses().length
    });
  };

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const handleAppointmentBooked = () => {
    setRefreshKey(prev => prev + 1);
  };

  const navItems = [
    { id: 'simulator', label: 'Simulador WhatsApp Bot', icon: Bot, badge: 'Live Chat' },
    { id: 'gcalendar', label: 'Google Calendar Sync', icon: CalendarIcon, badge: 'Auto-Sync' },
    { id: 'reminders', label: 'Recordatorios (24h y 2h)', icon: Bell, badge: '-70% No-Shows' },
    { id: 'calendar', label: 'Agenda de Citas', icon: CalendarCheck },
    { id: 'services', label: 'Servicios & Precios', icon: Scissors },
    { id: 'qr', label: 'Links & Códigos QR', icon: QrCode },
    { id: 'pitch', label: 'Propuesta Comercial & Precios', icon: Award, highlight: true },
    { id: 'twilio', label: 'Conexión Twilio (Webhook)', icon: Key }
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row relative">
      
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
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2.5 mb-6">
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

          {/* Business Info Card */}
          <div className="bg-dark-950/70 border border-dark-800 rounded-2xl p-3.5 mb-4 relative overflow-hidden shadow-lg">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Recepcionista 24/7</span>
            </div>
            <h3 className="font-display font-bold text-sm text-slate-100 mb-0.5">
              Barbería & Estilo King
            </h3>
            <p className="text-[10px] text-slate-400">
              Google Calendar: <strong className="text-slate-300">Conectado</strong>
            </p>
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
                        ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
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
        
        {/* Metricas Rápidas en Cabecera */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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
              <span>Facturación Citas</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-display font-black text-2xl text-amber-400 mt-1 font-mono">
              {stats.totalRevenue} €
            </span>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Ahorro Tiempo Mensual</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-display font-black text-2xl text-purple-400 mt-1">
              10 - 16 h
            </span>
          </div>
        </div>

        {/* Renderizado de Vistas */}
        <div className="flex-1">
          {activeTab === 'simulator' && (
            <WhatsAppSimulator onAppointmentBooked={handleAppointmentBooked} />
          )}

          {activeTab === 'gcalendar' && (
            <GoogleCalendarView refreshKey={refreshKey} />
          )}

          {activeTab === 'reminders' && (
            <RemindersManager refreshKey={refreshKey} />
          )}

          {activeTab === 'calendar' && (
            <AppointmentsCalendar refreshKey={refreshKey} />
          )}

          {activeTab === 'services' && (
            <ServicesManager />
          )}

          {activeTab === 'qr' && (
            <QrLinkGenerator onOpenSimulator={() => setActiveTab('simulator')} />
          )}

          {activeTab === 'pitch' && (
            <PitchPresentation />
          )}

          {activeTab === 'twilio' && (
            <TwilioSettings />
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
