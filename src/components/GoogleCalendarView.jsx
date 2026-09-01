import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Clock, 
  User, 
  Scissors, 
  Building2, 
  Check, 
  Sparkles,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Wrench,
  HeartPulse,
  Mail
} from 'lucide-react';
import { db } from '../../server/db';

export function GoogleCalendarView({ refreshKey, currentBusiness, userRole = 'business' }) {
  const [businesses, setBusinesses] = useState(db.getBusinesses());
  const [selectedBizId, setSelectedBizId] = useState(currentBusiness?.id || 'biz-1');
  const [appointments, setAppointments] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Hace unos instantes');
  const [showGuide, setShowGuide] = useState(true);
  const [testSuccess, setTestSuccess] = useState(false);

  const loadData = () => {
    const list = db.getBusinesses();
    setBusinesses(list);
    const targetId = (userRole === 'business' && currentBusiness?.id) ? currentBusiness.id : selectedBizId;
    setAppointments(db.getAppointments(targetId));
  };

  useEffect(() => {
    if (currentBusiness?.id && userRole === 'business') {
      setSelectedBizId(currentBusiness.id);
    }
    loadData();
  }, [selectedBizId, refreshKey, currentBusiness?.id]);

  const currentBiz = businesses.find(b => b.id === selectedBizId) || currentBusiness || businesses[0] || {};

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      loadData();
    }, 600);
  };

  const handleCreateTestEvent = () => {
    const today = new Date().toISOString().split('T')[0];
    const services = db.getServices(selectedBizId);
    const service = services[0] || { id: 'srv-test', name: 'Turno de Prueba', price: 20 };

    db.createAppointment({
      businessId: selectedBizId,
      clientName: "Cliente de Prueba (Google Sync)",
      clientPhone: "+34 600 999 888",
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      date: today,
      time: "19:00"
    });

    loadData();
    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  const getIndustryIcon = (category = '') => {
    if (category.includes('Taller') || category.includes('Autos')) return Wrench;
    if (category.includes('Dental') || category.includes('Odont')) return HeartPulse;
    return Scissors;
  };

  const IndustryIcon = getIndustryIcon(currentBiz.category);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-blue-400" />
              Sincronización con Google Calendar
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Auto-Sync Activo
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada vez que un cliente reserva por WhatsApp, Turnia bloquea automáticamente el horario en el Google Calendar del negocio.
          </p>
        </div>

        {/* Acciones y Selector de Negocio */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {userRole === 'superadmin' ? (
            <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 shadow-sm">
              <Building2 className="w-4 h-4 text-purple-400" />
              <select
                value={selectedBizId}
                onChange={(e) => setSelectedBizId(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                {businesses.map(b => (
                  <option key={b.id} value={b.id} className="bg-dark-900 text-slate-300">
                    {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3.5 py-2 shadow-sm text-xs font-bold text-emerald-300">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{currentBiz.name}</span>
            </div>
          )}

          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-2 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            <span>Ver en Google Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Info Card de Cuenta de Google Calendar Conectada */}
      <div className="glass-panel border-blue-500/20 bg-gradient-to-r from-blue-950/30 to-dark-900/90 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <IndustryIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Google Calendar Conectado:</span>
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <span>{currentBiz.googleCalendarId}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Negocio: <strong className="text-slate-200">{currentBiz.name}</strong> • Sincronización: <span className="text-emerald-400 font-mono">{lastSyncTime}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateTestEvent}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Crear Cita de Prueba</span>
          </button>
        </div>
      </div>

      {testSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Cita de prueba generada y bloqueada en Google Calendar con éxito!</span>
        </div>
      )}

      {/* GUÍA PASO A PASO: CÓMO CONECTAR TU GOOGLE CALENDAR */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border border-blue-500/20">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="font-display font-bold text-sm text-slate-100">
              Guía de Configuración: ¿Cómo conectar tu Google Calendar en 3 pasos?
            </h3>
          </div>
          {showGuide ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-dark-800 animate-fadeIn">
            
            {/* Paso 1 */}
            <div className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-200">Indica tu cuenta de Google</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ingresa el correo de Gmail o Google Workspace de tu negocio (ej. <strong className="text-slate-300">{currentBiz.googleCalendarId}</strong>) en el panel de Turnia.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-200">Autorización Automática</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Turnia conecta con la API de Google Calendar para leer tus horarios ocupados (para no superponer turnos) y escribir las nuevas reservas del bot.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-200">¡Listo en tu Móvil!</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Cada reserva confirmada por WhatsApp aparece al instante en la app de <strong>Google Calendar</strong> de tu teléfono con el nombre, servicio y teléfono del cliente.
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Citas Agendadas y Bloqueadas en Google Calendar */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Citas Activas Bloqueadas en este Calendario ({appointments.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Sincronización Bidireccional
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No hay citas agendadas aún para este comercio. Prueba creando una cita de prueba o simulando en el bot.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 hover:border-blue-500/40 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    {apt.time} hs • {apt.date}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> En Google Cal
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">
                    {apt.serviceName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.clientName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Tel: {apt.clientPhone} • Precio: <strong className="text-slate-200">{apt.price} €</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-dark-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-mono">{apt.googleCalendarEventId}</span>
                  <a
                    href={apt.googleCalendarLink || "https://calendar.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                  >
                    <span>Abrir</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
