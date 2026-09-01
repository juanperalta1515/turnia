import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight, 
  Play, 
  Scissors, 
  CheckCircle2, 
  DollarSign, 
  Zap, 
  Smartphone, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Bot,
  Bell,
  Star,
  UserPlus,
  Lock,
  Gift
} from 'lucide-react';

export function SleekLanding({ onOpenSimulator, onOpenDashboard, onStartOnboarding, onOpenLogin }) {
  const [billingCycle, setBillingCycle] = useState('launch'); // 'launch' (50% off) or 'regular'
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "¿Cómo funciona la prueba gratuita de 15 días?",
      a: "Puedes conectar tu local y probar todas las funcionalidades durante 15 días completos sin pagar nada ni ingresar tarjeta de crédito. Al finalizar los 15 días, decides si activar tu plan mensual o darte de baja sin compromiso."
    },
    {
      q: "¿Y si un cliente me pregunta algo raro por WhatsApp?",
      a: "Si Turnia no entiende la pregunta o es algo fuera de agenda, no inventa: te avisa a ti. La conversación queda pausada y tú puedes entrar a responder desde tu móvil en cualquier momento."
    },
    {
      q: "¿Tengo que cambiar mi número de WhatsApp?",
      a: "No. El cliente le sigue escribiendo al número de WhatsApp de tu barbería, taller o clínica. Nosotros nos encargamos de conectar las respuestas predeterminadas por detrás."
    },
    {
      q: "¿Cómo se conecta con mi Google Calendar?",
      a: "Solo inicias sesión con tu cuenta de Google Calendar en nuestro asistente de 5 minutos. Cada vez que un cliente reserva por WhatsApp, el evento se crea solo en tu calendario con el nombre del cliente, teléfono y servicio."
    },
    {
      q: "¿Tiene permanencia o penalización de baja?",
      a: "Cero permanencia. El cobro tras los 15 días gratis es mensual. Si en algún momento no te aporta valor, lo cancelas en 1 clic y los datos de tu agenda siempre son 100% tuyos."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Background Radial Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 blur-[160px] pointer-events-none -z-10"></div>

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-blue-950/80 border-b border-emerald-500/20 py-2 px-4 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
        <Gift className="w-3.5 h-3.5 text-emerald-400" />
        <span><strong>15 Días de Prueba 100% Gratis:</strong> Prueba Turnia en tu negocio sin tarjeta de crédito. Cancela cuando quieras.</span>
      </div>

      {/* 1. FLOATING SLEEK NAVBAR */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <div className="sleek-card rounded-full px-5 py-3 flex items-center justify-between shadow-2xl backdrop-blur-2xl border border-white/10">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              TURNIA
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              WhatsApp + Calendar
            </span>
          </div>

          {/* Links Navegación */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Cómo funciona</a>
            <a href="#beneficios" className="hover:text-emerald-400 transition-colors">Beneficios</a>
            <a href="#comparativa" className="hover:text-emerald-400 transition-colors">Comparativa</a>
            <a href="#precios" className="hover:text-emerald-400 transition-colors">Precios (15d Gratis)</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all"
            >
              <Lock className="w-3 h-3 text-blue-400" />
              <span>Acceso Locales</span>
            </button>

            <button
              onClick={onStartOnboarding}
              className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 flex items-center gap-1.5"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>15 Días Gratis</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-20 pb-16 px-4 max-w-5xl mx-auto text-center space-y-8 relative">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-glow text-xs font-semibold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>LA RECEPCIONISTA INVISIBLE PARA BARBERÍAS, TALLERES Y CLÍNICAS</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-gradient-hero leading-[1.08] max-w-4xl mx-auto">
          Tu agenda de WhatsApp <br />
          <span className="text-gradient-emerald">responde sola.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          Tus clientes le escriben a tu WhatsApp de siempre. Turnia contesta al instante con respuestas predeterminadas, bloquea el hueco en tu <strong className="text-slate-200">Google Calendar</strong> y manda los recordatorios. <strong className="text-emerald-400">Pruébalo 15 días gratis.</strong>
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 flex-wrap">
          <button
            onClick={onStartOnboarding}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>Empezar 15 Días Gratis</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Acceso Locales (Precios & Horarios)</span>
          </button>

          <button
            onClick={onOpenSimulator}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Ver Demo de WhatsApp</span>
          </button>
        </div>

        {/* Stats Ticker */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="sleek-card p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="font-display font-black text-xl text-emerald-400">30 seg</div>
            <p className="text-[11px] text-slate-400">Tiempo de respuesta</p>
          </div>

          <div className="sleek-card p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="font-display font-black text-xl text-blue-400">-70%</div>
            <p className="text-[11px] text-slate-400">Menos ausencias (no-shows)</p>
          </div>

          <div className="sleek-card p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="font-display font-black text-xl text-amber-400">10-16 h</div>
            <p className="text-[11px] text-slate-400">Ahorro mensual en chat</p>
          </div>

          <div className="sleek-card p-3.5 rounded-2xl text-center space-y-0.5">
            <div className="font-display font-black text-xl text-purple-400">0 apps</div>
            <p className="text-[11px] text-slate-400">El cliente usa WhatsApp</p>
          </div>
        </div>

      </section>

      {/* 3. SHOWCASE DUAL: WHATSAPP + GOOGLE CALENDAR (CORE VISUAL) */}
      <section id="como-funciona" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Así de simple</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-100">
            La conversación de siempre. <br />
            <span className="text-slate-400">La diferencia es quién contesta.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Mockup Chat WhatsApp (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#0b141a] rounded-[32px] border-4 border-slate-800 shadow-2xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">Tu Barbería</h4>
                    <span className="text-[10px] text-emerald-400">en línea</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">WhatsApp</span>
              </div>

              <div className="space-y-2.5 text-xs py-2">
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow">
                    Hola, ¿queda hueco mañana por la tarde para corte y barba?
                    <span className="text-[9px] text-slate-300 block text-right mt-1">18:42</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-slate-100 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow border border-slate-700/50 space-y-1">
                    <p>¡Hola! Te puedo ofrecer mañana:</p>
                    <div className="flex gap-2 font-bold text-emerald-400 pt-1">
                      <span className="bg-dark-950/60 px-2 py-0.5 rounded">16:30</span>
                      <span className="bg-dark-950/60 px-2 py-0.5 rounded">18:00</span>
                      <span className="bg-dark-950/60 px-2 py-0.5 rounded">19:15</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block text-right mt-1">18:42</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] shadow">
                    Las 18:00 me va bien
                    <span className="text-[9px] text-slate-300 block text-right mt-1">18:43</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-[#202c33] text-emerald-300 p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow border border-emerald-500/30 space-y-1">
                    <p className="text-slate-100">Perfecto, te reservo mañana a las <strong>18:00 hs</strong>.</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">Corte + barba — 24 €</p>
                    <p className="text-[11px] text-slate-300">Te escribo 24h antes para confirmar 👌</p>
                    <span className="text-[9px] text-slate-400 block text-right mt-1">18:43</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explicación y Google Calendar Card (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="sleek-card p-6 rounded-3xl space-y-4 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <CalendarIcon className="w-4 h-4" />
                <span>Sincronización Automática</span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-100">
                Aparece al instante en tu Google Calendar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No tienes que tocar nada ni aprender ningún software nuevo. Abres tu calendario en el móvil y la cita ya está metida con el nombre, teléfono y servicio del cliente.
              </p>

              {/* Mini Event Preview */}
              <div className="bg-dark-950/80 border border-blue-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    Corte + Barba — David Morales
                  </div>
                  <span className="text-[11px] text-slate-400">Mañana 18:00 - 18:45 • Google Calendar</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  24 €
                </span>
              </div>
            </div>

            {/* Los 4 pasos */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="sleek-card p-3.5 rounded-2xl space-y-1">
                <span className="font-bold text-emerald-400">1. Pregunta</span>
                <p className="text-[11px] text-slate-400">El cliente escribe en lenguaje normal.</p>
              </div>
              <div className="sleek-card p-3.5 rounded-2xl space-y-1">
                <span className="font-bold text-blue-400">2. Consulta</span>
                <p className="text-[11px] text-slate-400">Turnia mira tus huecos libres reales.</p>
              </div>
              <div className="sleek-card p-3.5 rounded-2xl space-y-1">
                <span className="font-bold text-purple-400">3. Bloquea</span>
                <p className="text-[11px] text-slate-400">Se mete sola en Google Calendar.</p>
              </div>
              <div className="sleek-card p-3.5 rounded-2xl space-y-1">
                <span className="font-bold text-amber-400">4. Recuerda</span>
                <p className="text-[11px] text-slate-400">Aviso 24h y 2h antes anti no-show.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. LOS 4 PROBLEMAS REALES (BENTO GRID) */}
      <section id="beneficios" className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">El problema de fondo</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-100">
            ¿Cuánto dinero y tiempo te cuesta no contestar a tiempo?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="sleek-card sleek-card-hover p-6 rounded-3xl space-y-3 border-t-2 border-t-rose-500">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Cortar tranquilo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              El WhatsApp ya no te interrumpe mientras trabajas. Al final del día, todas las citas están agendadas.
            </p>
          </div>

          <div className="sleek-card sleek-card-hover p-6 rounded-3xl space-y-3 border-t-2 border-t-amber-500">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Agenda sin huecos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los que escriben a las 23:00 ya no se enfrían. Turnia los atiende en segundos mientras cenas.
            </p>
          </div>

          <div className="sleek-card sleek-card-hover p-6 rounded-3xl space-y-3 border-t-2 border-t-emerald-500">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Menos sillones vacíos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Con el recordatorio del día antes y de 2h antes, las ausencias bajan drásticamente del 10% al 3%.
            </p>
          </div>

          <div className="sleek-card sleek-card-hover p-6 rounded-3xl space-y-3 border-t-2 border-t-blue-500">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Clientes felices</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Respuesta en 30 segundos sin obligarles a descargar ninguna app pesada ni crear contraseñas.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COMPARATIVA DIRECTA VS BOOKSY / FRESHA */}
      <section id="comparativa" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Diferenciación</span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-100">
            ¿En qué se diferencia de Booksy o Fresha?
          </h2>
          <p className="text-xs text-slate-400">Te lo contamos sin vender humo:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lo habitual */}
          <div className="sleek-card p-6 md:p-8 rounded-3xl space-y-4 border border-rose-500/20 bg-rose-950/10">
            <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Lo habitual</span>
            <h3 className="font-display font-bold text-lg text-slate-200">Apps de Reservas Externas</h3>
            
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Tu cliente debe descargar una app pesada
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                O entrar a una web y crear cuenta con email y clave
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Tienes que migrar y cambiar toda tu agenda
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" />
                Si el cliente no descarga la app, no reserva
              </li>
            </ul>
          </div>

          {/* Con Turnia */}
          <div className="sleek-card p-6 md:p-8 rounded-3xl space-y-4 border border-emerald-500/40 bg-emerald-950/20 shadow-2xl relative">
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Fricción Cero
            </div>

            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Con Turnia</span>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              WhatsApp de Siempre
            </h3>
            
            <ul className="space-y-3 text-xs text-slate-200 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Tu cliente escribe en WhatsApp como siempre
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Cero aplicaciones que descargar
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Conectamos directo a tu Google Calendar
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                Tú no cambias tu forma de trabajar
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. PRECIOS Y OFERTA DE LANZAMIENTO */}
      <section id="precios" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider">
            Oferta de Lanzamiento • 5 Plazas al mes
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-100">
            Planes claros. Sin letra pequeña.
          </h2>
          
          {/* Toggle Oferta */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs ${billingCycle === 'regular' ? 'text-white font-bold' : 'text-slate-400'}`}>Precio Estándar</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'launch' ? 'regular' : 'launch')}
              className="w-12 h-6 rounded-full bg-emerald-600 p-1 transition-colors relative"
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${billingCycle === 'launch' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs flex items-center gap-1 ${billingCycle === 'launch' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              50% Dto. Primeros 2 Meses
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* Plan Esencial */}
          <div className="sleek-card p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Esencial</span>
                <p className="text-xs text-slate-400 mt-1">Para barbería o peluquería de 1 profesional.</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display font-black text-4xl text-slate-100">
                    {billingCycle === 'launch' ? '19,50 €' : '39 €'}
                  </span>
                  <span className="text-xs text-slate-400">/ mes</span>
                  {billingCycle === 'launch' && (
                    <span className="text-xs text-slate-500 line-through ml-1">39 €</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp conectado 24/7
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 150 reservas/mes incluidas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recordatorios automáticos (24h y 2h)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sincronizado con Google Calendar
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 0 € coste de instalación
                </li>
              </ul>
            </div>

            <button
              onClick={onStartOnboarding}
              className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
            >
              Empezar 15 Días Gratis
            </button>
          </div>

          {/* Plan Pro */}
          <div className="sleek-card p-6 md:p-8 rounded-3xl space-y-6 border border-emerald-500/50 bg-emerald-950/20 shadow-2xl relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider">
              Recomendado
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pro</span>
                <p className="text-xs text-slate-400 mt-1">Para peluquerías con varios profesionales.</p>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display font-black text-4xl text-emerald-400">
                    {billingCycle === 'launch' ? '39,50 €' : '79 €'}
                  </span>
                  <span className="text-xs text-slate-400">/ mes</span>
                  {billingCycle === 'launch' && (
                    <span className="text-xs text-slate-500 line-through ml-1">79 €</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hasta 5 profesionales
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 500 reservas/mes incluidas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cobro de señal opcional
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lista de espera automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Panel completo + métricas
                </li>
              </ul>
            </div>

            <button
              onClick={onStartOnboarding}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Empezar 15 Días Gratis
            </button>
          </div>

        </div>

        {/* Garantía de 15 Días Gratis */}
        <div className="mt-8 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 max-w-xl mx-auto text-center space-y-1">
          <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4" />
            <span>15 Días de Prueba 100% Gratis en Todos los Planes</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Prueba todas las funcionalidades sin tarjeta de crédito. Al finalizar los 15 días, continúas con tu suscripción mensual (desde {billingCycle === 'launch' ? '19,50 €' : '39 €'}/mes) o cancelas con 1 solo clic. Sin permanencia ni letra pequeña.
          </p>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400 max-w-md mx-auto">
          💡 <strong className="text-emerald-400">Cálculo real:</strong> 39 €/mes a cambio de 200-400 € que ahora pierdes en tiempo y reservas no contestadas a tiempo.
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (FAQ) */}
      <section id="faq" className="py-16 px-4 max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Dudas habituales</span>
          <h2 className="font-display font-extrabold text-3xl text-slate-100">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="sleek-card rounded-2xl overflow-hidden border border-white/5 transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-2 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER / FINAL CTA BANNER */}
      <footer className="py-12 px-4 border-t border-white/10 text-center space-y-6 max-w-5xl mx-auto">
        <div className="sleek-card p-8 md:p-12 rounded-3xl space-y-4 border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-dark-950">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-slate-100">
            Probemos una semana juntos.
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sin compromiso. Sin permanencia. Sin instalar nada. En menos de 1 hora lo dejamos funcionando en tu local.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartOnboarding}
              className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 transition-all hover:scale-105"
            >
              Conectar mi Barbería en 5 Minutos
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-6">
          <span>TURNIA • turnia.es • Tu agenda responde sola.</span>
          <span className="mt-2 sm:mt-0 font-mono">hola@turnia.es • WhatsApp Platform</span>
        </div>
      </footer>

    </div>
  );
}
