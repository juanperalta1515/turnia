import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall, 
  Smartphone,
  HelpCircle,
  Award,
  Zap
} from 'lucide-react';

export function PitchPresentation() {
  const [selectedPlan, setSelectedPlan] = useState('PRO');

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-2">
      
      {/* 1. HERO SLIDE */}
      <div className="text-center space-y-4 pt-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" /> Funciona por WhatsApp
        </span>
        <h1 className="font-display font-black text-4xl md:text-6xl text-slate-100 tracking-tight">
          TURNIA
        </h1>
        <p className="font-display font-bold text-2xl md:text-3xl text-emerald-400 italic">
          Tu agenda responde sola.
        </p>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Para peluquerías, barberías y centros de estética que reciben sus reservas por WhatsApp y quieren dejar de contestarlas a mano.
        </p>
      </div>

      {/* 2. ¿TE SUENA ALGUNA DE ESTAS? (LOS 4 DOLORES) */}
      <div className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl text-slate-100 text-center">
          ¿Te suena alguna de estas situaciones?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-rose-500">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg text-xs font-mono font-bold">❌</span>
              Suena el WhatsApp mientras estás cortando
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O contestas y pierdes la concentración en el corte, o no contestas a tiempo y el cliente se va a otro local.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-amber-500">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-mono font-bold">🌙</span>
              Te escriben a las 23:00 hs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Y cuando lo ves a las 9 de la mañana siguiente, esa persona ya reservó en otro sitio que le respondió al instante.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-purple-500">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-mono font-bold">⚠️</span>
              Has reservado dos veces el mismo hueco
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Doble reserva por error manual. Un cliente se queda sin cita frustrado y el otro con mala experiencia.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-l-emerald-500">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-mono font-bold">🔔</span>
              No aparece y no avisa (No-show)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Una hora muerta en el sillón y ningún recordatorio automático que lo hubiera prevenido o reprogramado.
            </p>
          </div>
        </div>
      </div>

      {/* 3. LO QUE TE CUESTA CADA MES */}
      <div className="glass-panel bg-gradient-to-b from-dark-900 to-dark-950 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl border border-dark-800">
        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-100">
            Lo que te cuesta cada mes
          </h2>
          <p className="text-xs text-slate-400 italic">
            Hablamos de tiempo y dinero real. No de tecnicismos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-5 bg-dark-950/80 rounded-2xl border border-dark-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Al Mes</span>
            <div className="font-display font-black text-3xl text-slate-100">10 - 16 h</div>
            <p className="font-bold text-xs text-slate-300">Contestando WhatsApp</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Tiempo que podrías estar cortando, atendiendo a quien tienes delante o descansando en casa.
            </p>
          </div>

          <div className="p-5 bg-dark-950/80 rounded-2xl border border-dark-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Citas Perdidas</span>
            <div className="font-display font-black text-3xl text-amber-400">1 de cada 10</div>
            <p className="font-bold text-xs text-slate-300">Se queda sin venir</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Sin recordatorio, la tasa de no-shows está en torno al 10%. Cada hueco vacío es dinero que no entra.
            </p>
          </div>

          <div className="p-5 bg-dark-950/80 rounded-2xl border border-dark-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Pérdida Económica</span>
            <div className="font-display font-black text-3xl text-rose-400 font-mono">200 - 400 €</div>
            <p className="font-bold text-xs text-slate-300">En reservas perdidas</p>
            <p className="text-[11px] text-slate-500 leading-snug">
              Entre tiempo, no-shows y mensajes no contestados a tiempo. Tirando a la baja.
            </p>
          </div>
        </div>
      </div>

      {/* 4. ¿QUÉ ES TURNIA? */}
      <div className="glass-panel border-emerald-500/30 bg-emerald-950/20 p-8 rounded-3xl text-center space-y-4">
        <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">¿Qué es Turnia?</span>
        <h2 className="font-display font-black text-2xl md:text-4xl text-slate-100 max-w-2xl mx-auto leading-tight">
          Una recepcionista que contesta tu WhatsApp, te bloquea las citas en el calendario y manda los recordatorios para que la gente venga.
        </h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Tú no instalas nada. Tu cliente no descarga nada. Sigues trabajando como siempre, pero el WhatsApp ya no te interrumpe ni te bloquea.
        </p>
      </div>

      {/* 5. COMPARATIVA VS BOOKSY / FRESHA */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-100">
            ¿Y en qué se diferencia esto de Booksy o Fresha?
          </h2>
          <p className="text-xs text-slate-400">
            Buena pregunta. Te lo contamos sin vender humo:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lo Habitual (Apps) */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-rose-500/20 bg-rose-950/10">
            <h3 className="font-bold text-sm text-rose-400 uppercase tracking-wider">
              Lo Habitual: Apps de Reservas
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Tu cliente debe descargar una app pesada
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                O entrar a una web y crear cuenta con contraseña
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Tienes que migrar toda tu agenda de siempre
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Obligas al cliente a cambiar de costumbre
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Si no descarga la app, no reserva
              </li>
            </ul>
          </div>

          {/* Con Turnia */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 border border-emerald-500/40 bg-emerald-950/20 shadow-xl">
            <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Con Turnia: WhatsApp de Siempre
            </h3>
            <ul className="space-y-3 text-xs text-slate-200 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Tu cliente te escribe como siempre por WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Cero aplicaciones que descargar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Conectamos directo con tu Google Calendar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Tú no cambias de costumbre al trabajar
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Si tiene WhatsApp, puede reservar en 30 segundos
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. PLANES Y PRECIOS */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="font-display font-extrabold text-2xl text-slate-100">
            ¿Cuánto cuesta?
          </h2>
          <p className="text-xs text-slate-400">
            Dos opciones claras. Sin letra pequeña ni sorpresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Plan Esencial */}
          <div className={`glass-panel p-6 md:p-8 rounded-3xl space-y-5 transition-all ${
            selectedPlan === 'ESENCIAL' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-dark-800'
          }`}>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Esencial</span>
              <p className="text-xs text-slate-400 mt-1">Para barbería o peluquería de 1 profesional.</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display font-black text-4xl text-slate-100">39 €</span>
                <span className="text-xs text-slate-400">/ mes</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp Conectado 24/7
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 150 reservas/mes incluidas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recordatorios automáticos anti no-show
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sincronización con Google Calendar
              </li>
            </ul>

            <button
              onClick={() => setSelectedPlan('ESENCIAL')}
              className="w-full py-2.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-bold text-slate-200"
            >
              Elegir Esencial
            </button>
          </div>

          {/* Plan Pro */}
          <div className={`glass-panel p-6 md:p-8 rounded-3xl space-y-5 relative overflow-hidden transition-all ${
            selectedPlan === 'PRO' ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/10' : 'border-dark-800'
          }`}>
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Recomendado
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Pro</span>
              <p className="text-xs text-slate-400 mt-1">Para peluquerías con varios profesionales.</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display font-black text-4xl text-emerald-400">79 €</span>
                <span className="text-xs text-slate-400">/ mes</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasta 5 profesionales
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 500 reservas/mes incluidas
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cobro de señal opcional
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lista de espera automática
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Panel completo + métricas
              </li>
            </ul>

            <button
              onClick={() => setSelectedPlan('PRO')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20"
            >
              Elegir Plan Pro
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-2xl max-w-xl mx-auto">
          💡 Mira el cálculo: 39 €/mes a cambio de 200-400 € que ahora pierdes en tiempo y reservas no contestadas.
        </div>
      </div>

      {/* 7. PREGUNTAS FRECUENTES (FAQ) */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display font-extrabold text-2xl text-slate-100 text-center">
          Las dudas que siempre nos hacen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-xs text-slate-100">¿Y si el cliente pregunta algo raro?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Si Turnia no entiende, no inventa: te avisa a ti. La conversación queda en pausa y tú puedes responder manualmente.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-xs text-slate-100">¿Tengo que cambiar mi número de WhatsApp?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No. Trabajamos con un número dedicado para Turnia. Tu número personal se queda como está.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-xs text-slate-100">¿Y si quiero hablar yo con el cliente?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              En cualquier momento entras tú en la conversación desde el panel y Turnia se calla. Vuelve a contestar cuando tú lo decidas.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-xs text-slate-100">¿Puedo darme de baja cuando quiera?</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sí, sin permanencia. Mes a mes. Si Turnia no te aporta, lo paras y ya está. Los datos de tu agenda son tuyos.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
