import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCheck, 
  Clock, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { db } from '../../server/db';

export function RemindersManager({ refreshKey }) {
  const [appointments, setAppointments] = useState([]);
  const [lastSentNotification, setLastSentNotification] = useState(null);

  const loadData = () => {
    setAppointments(db.getAppointments('biz-1').filter(a => a.status === 'Confirmado'));
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleSendReminder = (appointmentId, type) => {
    const apt = db.triggerReminder(appointmentId, type);
    if (apt) {
      loadData();
      const text = type === '24h' 
        ? `¡Hola ${apt.clientName}! Te recordamos tu cita de mañana a las ${apt.time} hs para ${apt.serviceName} en Barbería King. Responde SI para confirmar o avísanos si necesitas cambiarla.`
        : `¡Hola ${apt.clientName}! Tu cita en Barbería King es hoy en 2 horas (${apt.time} hs). ¡Te esperamos! 💈`;

      setLastSentNotification({
        client: apt.clientName,
        phone: apt.clientPhone,
        type: type === '24h' ? 'Recordatorio 24 horas antes' : 'Recordatorio 2 horas antes',
        message: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-400" />
          Sistema de Recordatorios Automáticos (Anti No-Shows)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Turnia envía recordatorios automáticos por WhatsApp 24h y 2h antes de cada cita para que nadie se olvide de asistir.
        </p>
      </div>

      {/* KPI de Impacto en el Negocio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel border-emerald-500/20 bg-emerald-950/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Reducción de No-Shows</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-2xl font-display font-black text-emerald-400">
            Del 10% ➔ 3-5%
          </div>
          <p className="text-[11px] text-slate-400">
            Los clientes que reciben aviso confirman su asistencia o liberan el hueco con tiempo.
          </p>
        </div>

        <div className="glass-panel border-amber-500/20 bg-amber-950/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Ahorro Estimado al Mes</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-display font-black text-amber-400 font-mono">
            200 - 400 €
          </div>
          <p className="text-[11px] text-slate-400">
            En horas muertas y sillas vacías recuperadas automáticamente.
          </p>
        </div>

        <div className="glass-panel border-blue-500/20 bg-blue-950/20 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold">
            <span>Frecuencia de Envío</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-display font-bold text-slate-100">
            24h antes + 2h antes
          </div>
          <p className="text-[11px] text-slate-400">
            Mensajes amables por WhatsApp con confirmación en 1 toque.
          </p>
        </div>
      </div>

      {/* Cola de Recordatorios por Cita */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Cola de Envío para Citas Agendadas ({appointments.length})
          </h3>
          <span className="text-[11px] text-slate-500">
            Disparos automáticos por cron
          </span>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 bg-dark-950/70 border border-dark-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-slate-100">
                    {apt.clientName}
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    ({apt.clientPhone})
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  ✂️ {apt.serviceName} • 📅 <strong>{apt.date} a las {apt.time} hs</strong>
                </p>
              </div>

              {/* Botones de Estado y Disparo de Prueba */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* 24h antes */}
                <div className="flex items-center gap-1.5 bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-800 text-xs">
                  <span className="text-slate-400">24h antes:</span>
                  {apt.reminders?.sent24h ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Enviado
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendReminder(apt.id, '24h')}
                      className="text-amber-400 hover:text-amber-300 font-semibold underline text-[11px]"
                    >
                      Disparar ahora
                    </button>
                  )}
                </div>

                {/* 2h antes */}
                <div className="flex items-center gap-1.5 bg-dark-900 px-3 py-1.5 rounded-xl border border-dark-800 text-xs">
                  <span className="text-slate-400">2h antes:</span>
                  {apt.reminders?.sent2h ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5" /> Enviado
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendReminder(apt.id, '2h')}
                      className="text-blue-400 hover:text-blue-300 font-semibold underline text-[11px]"
                    >
                      Disparar ahora
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast / Visualizador del Mensaje de WhatsApp Enviado */}
      {lastSentNotification && (
        <div className="glass-panel border-emerald-500/30 bg-emerald-950/30 rounded-2xl p-4 shadow-xl space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-1.5">
              <CheckCheck className="w-4 h-4" /> Mensaje de WhatsApp entregado exitosamente
            </span>
            <span className="font-mono text-slate-400">{lastSentNotification.time}</span>
          </div>

          <div className="p-3 bg-dark-950/80 rounded-xl border border-dark-800 text-xs text-slate-200 font-mono">
            <span className="text-slate-500 block mb-1">Para: {lastSentNotification.client} ({lastSentNotification.phone})</span>
            <p className="text-emerald-300">"{lastSentNotification.message}"</p>
          </div>
        </div>
      )}

    </div>
  );
}
