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
  Smartphone
} from 'lucide-react';
import { db } from '../../server/db';

export function GoogleCalendarView({ refreshKey }) {
  const [appointments, setAppointments] = useState([]);
  const [business, setBusiness] = useState(db.getBusinesses()[0]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Hace unos segundos');

  const loadData = () => {
    setAppointments(db.getAppointments('biz-1'));
    setBusiness(db.getBusinesses()[0]);
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      loadData();
    }, 800);
  };

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
              <CheckCircle2 className="w-3 h-3" /> Conectado en Tiempo Real
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada vez que un cliente reserva por WhatsApp, Turnia bloquea automáticamente el hueco en el Google Calendar de la barbería.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sincronizar Ahora
          </button>

          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            Abrir Google Calendar
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Info Card de Cuenta de Google Calendar Conectada */}
      <div className="glass-panel border-blue-500/20 bg-gradient-to-r from-blue-950/30 to-dark-900/90 rounded-2xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Calendario Activo:</span>
            <h3 className="font-display font-bold text-base text-slate-100">{business.googleCalendarId}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comercio: <strong>{business.name}</strong> • Última sincronización: <span className="text-emerald-400">{lastSyncTime}</span>
            </p>
          </div>
        </div>

        <div className="bg-dark-950/80 border border-dark-800 p-3 rounded-xl text-xs text-slate-300 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500">Beneficio para el Barbero:</span>
          <p className="text-slate-300 leading-snug">
            Tú no cambias de costumbre. Sigues mirando tu calendario de siempre en el móvil y las citas ya aparecen creadas.
          </p>
        </div>
      </div>

      {/* Vista de Citas Sincronizadas en Google Calendar */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Eventos creados automáticamente en Google Calendar ({appointments.length})
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Bloqueo bidireccional de agenda
          </span>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 bg-dark-950/60 hover:bg-dark-950/90 border border-dark-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono shrink-0 mt-0.5 text-xs">
                  {apt.time}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm text-slate-100">
                      {apt.serviceName} — {apt.clientName}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Google Calendar Event ID: {apt.googleCalendarEventId}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {apt.date} a las {apt.time} hs
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {apt.price} €
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {apt.clientPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <a
                  href={apt.googleCalendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>Ver en Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
