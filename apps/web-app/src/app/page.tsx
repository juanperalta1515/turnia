'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  CheckCircle2, 
  Send,
  ArrowRight,
  ShieldCheck,
  Globe,
  X,
  ChevronRight,
  QrCode,
  CreditCard
} from 'lucide-react';
import { t } from '@turnia/i18n';

export default function Home() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    { sender: 'client', text: 'Hola! ¿Queda algún hueco para corte y barba mañana por la tarde?' },
    { sender: 'turnia', text: '¡Hola! Te puedo ofrecer mañana:\n\n16:30\n18:00\n19:15' },
    { sender: 'client', text: 'Las 18:00 me va bien.' },
    { sender: 'turnia', text: 'Perfecto, te reservo mañana a las 18:00.\n\nCorte + barba — 24 €\n\nTe escribo 24h antes para confirmar.' }
  ]);

  const [inputText, setInputText] = useState('');
  const [market, setMarket] = useState<'es-ES' | 'es-AR'>('es-ES');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'esencial' | 'pro' | null>(null);

  // Setup Wizard Form States
  const [wizardData, setWizardData] = useState({
    businessName: '',
    phone: '',
    calendarConnected: false,
    paymentCompleted: false
  });

  // Handle message send simulation
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessages = [...messages, { sender: 'client', text: inputText }];
    setMessages(newMessages);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'turnia', 
        text: '¡Entendido! Esto es una simulación del asistente automatizado de Turnia respondiendo en tiempo real.' 
      }]);
    }, 1200);
  };

  const slots = ['16:30', '18:00', '19:15'];

  const startOnboarding = (plan: 'esencial' | 'pro') => {
    setSelectedPlan(plan);
    setWizardStep(1);
    setShowWizard(true);
  };

  // Dynamically initialize the PayPal hosted button when the payment step is mounted
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showWizard && wizardStep === 4 && selectedPlan === 'esencial') {
      timer = setTimeout(() => {
        const containerId = "#paypal-container-J38N5WXD5G2YS";
        const container = document.querySelector(containerId);
        
        if (container && (window as any).paypal) {
          container.innerHTML = ""; // Clear duplicate render instances
          try {
            (window as any).paypal.HostedButtons({
              hostedButtonId: "J38N5WXD5G2YS"
            })
            .render(containerId);
            console.log("PayPal Hosted Button rendered successfully.");
          } catch (err) {
            console.error("Error rendering PayPal Hosted Button:", err);
          }
        }
      }, 300);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showWizard, wizardStep, selectedPlan]);

  return (
    <div className="min-h-screen bg-[#06050F] text-[#E4E3EC] font-sans antialiased overflow-x-hidden relative selection:bg-indigo-500 selection:text-white">
      {/* Load PayPal Hosted Buttons SDK Script */}
      <Script 
        src="https://www.paypal.com/sdk/js?client-id=BAA5Q7YVPzONSpWno64mksw1u9oNkuZBKdObQCwzHuelOXixRRkYBrjMPAT1zjvDNWYRaOqknki6V_xDTg&components=hosted-buttons&disable-funding=venmo&currency=EUR"
        crossOrigin="anonymous" 
        strategy="lazyOnload"
      />

      {/* Background glow animations */}
      <div className="absolute top-[-5%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#06050F]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">TURNIA</span>
              <span className="text-[10px] block text-indigo-400 font-mono tracking-wider">Tu agenda responde sola.</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMarket(market === 'es-ES' ? 'es-AR' : 'es-ES')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-all font-mono"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              {market === 'es-ES' ? 'España (EUR €)' : 'Argentina (ARS $)'}
            </button>
            <button 
              onClick={() => startOnboarding('esencial')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-all text-xs font-semibold text-white shadow-md shadow-indigo-600/10"
            >
              Prueba de Onboarding
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Onboarding 100% Self-Service</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Tu agenda <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">responde sola</span>.
          </h1>
          
          <p className="text-gray-400 text-base leading-relaxed">
            Para peluquerías, barberías y centros de estética. Configura tu número de WhatsApp y tu calendario en 5 minutos a través de nuestro asistente inteligente guiado.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => startOnboarding('esencial')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-sm font-bold text-white text-center shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Probar Asistente de Configuración <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#pricing" 
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold text-white text-center flex items-center justify-center"
            >
              Ver Planes
            </a>
          </div>
        </div>

        {/* Hero Right: Live Interactive Simulator */}
        <div id="demo" className="lg:col-span-7 grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* WhatsApp Chat Simulator */}
          <div className="md:col-span-6 rounded-2xl border border-white/10 bg-[#0A0915] overflow-hidden flex flex-col shadow-2xl shadow-indigo-950/20 h-[460px]">
            <div className="px-4 py-3 bg-[#111026] border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Asistente Virtual</h4>
                <p className="text-[10px] text-green-400">En línea</p>
              </div>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-3 text-xs flex flex-col justify-end">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${
                    msg.sender === 'client' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#111026] border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe un mensaje..." 
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 transition-all text-white placeholder-gray-500"
              />
              <button type="submit" className="p-1.5 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-lg text-white">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Calendar App Dashboard View */}
          <div className="md:col-span-6 rounded-2xl border border-white/10 bg-[#0A0915] p-4 flex flex-col justify-between shadow-2xl shadow-indigo-950/20 h-[460px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white">Tu Calendario Sincronizado</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono">
                  {market === 'es-ES' ? 'Citas' : 'Turnos'}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Agenda de mañana</p>
                <div className="space-y-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all text-left ${
                        selectedSlot === slot
                          ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 text-gray-400'
                      }`}
                    >
                      <span className="text-xs font-semibold font-mono">{slot} hs</span>
                      {selectedSlot === slot ? (
                        <span className="text-[9px] text-indigo-400 font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" /> Reservado por WhatsApp
                        </span>
                      ) : (
                        <span className="text-[9px] text-gray-500">Disponible</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              {selectedSlot ? (
                <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center">
                  <p className="text-[10px] font-semibold">
                    Cita confirmada y bloqueada en tu Google Calendar.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-white/5 text-gray-500 text-[10px] text-center">
                  Selecciona una hora para ver la sincronización.
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Onboarding Setup Wizard Popup Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-[#06050F]/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F0E28] border border-indigo-500/30 rounded-3xl p-8 relative shadow-2xl shadow-indigo-500/10 flex flex-col justify-between min-h-[500px]">
            {/* Close button */}
            <button 
              onClick={() => setShowWizard(false)}
              className="absolute top-6 right-6 p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Stepper Header */}
            <div>
              <div className="flex items-center gap-3 text-indigo-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">Configuración de Turnia</span>
              </div>
              
              {/* Step indicator */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step} 
                    className={`flex-1 h-1.5 rounded-full transition-all ${
                      wizardStep >= step ? 'bg-indigo-500' : 'bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Step Contents */}
            <div className="flex-grow my-6 overflow-y-auto pr-1">
              {/* STEP 1: Business Details */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-slide-up">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Cuéntanos sobre tu negocio</h3>
                    <p className="text-xs text-gray-400">Comencemos por el nombre comercial y mercado operativo.</p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Nombre del local</label>
                      <input 
                        type="text" 
                        value={wizardData.businessName}
                        onChange={(e) => setWizardData({...wizardData, businessName: e.target.value})}
                        placeholder="Ej. Barbería Córdoba" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Zona Horaria e Idioma</label>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 flex justify-between items-center">
                        <span>{market === 'es-ES' ? 'España (Europe/Madrid - es-ES)' : 'Argentina (America/Buenos_Aires - es-AR)'}</span>
                        <Globe className="w-4 h-4 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Connect WhatsApp */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-slide-up">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Conecta tu WhatsApp Business</h3>
                    <p className="text-xs text-gray-400">Escanea el código QR desde tu app para habilitar las respuestas automáticas.</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-lg relative flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-900" />
                      <div className="absolute inset-0 bg-[#0F0E28]/40 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-green-500 text-white font-bold text-[10px] tracking-wide uppercase shadow-lg shadow-green-500/20">Listo para vincular</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center max-w-xs">
                      Ve a WhatsApp &gt; Dispositivos vinculados &gt; Vincular un dispositivo. El número personal se mantendrá intacto.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: Sync Google Calendar */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-slide-up">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Sincroniza tu Google Calendar</h3>
                    <p className="text-xs text-gray-400">Esto permite a Turnia consultar disponibilidad real y bloquear citas sin solapamientos.</p>
                  </div>
                  <div className="py-6 flex flex-col items-center justify-center gap-4">
                    {wizardData.calendarConnected ? (
                      <div className="w-full p-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
                        <h4 className="text-sm font-bold text-white">Calendario Google Conectado</h4>
                        <p className="text-xs text-gray-500">hola@tu-barberia.com</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setWizardData({...wizardData, calendarConnected: true})}
                        className="px-6 py-4 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm shadow-xl flex items-center gap-3"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.48-1.12 2.73-2.38 3.58v3h3.8c2.25-2.07 3.53-5.1 3.53-8.4z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.9l-3.8-3c-1.06.7-2.42 1.13-4.16 1.13-3.2 0-5.9-2.16-6.86-5.07H1.3v3.1C3.28 21.2 7.37 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.14 14.16A7.18 7.18 0 0 1 4.8 12c0-.75.13-1.48.34-2.16V6.74H1.3a11.96 11.96 0 0 0 0 10.52l3.84-3.1z"/>
                          <path fill="#EA4335" d="M12 4.77c1.77 0 3.35.6 4.6 1.8l3.43-3.43C17.96 1.18 15.22 0 12 0 7.37 0 3.28 2.8 1.3 6.74l3.84 3.1c.96-2.9 3.66-5.07 6.86-5.07z"/>
                        </svg>
                        Conectar Google Calendar
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Activation / Subscription Payment */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-slide-up">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Activar tu suscripción</h3>
                    <p className="text-xs text-gray-400">Activa tu cuenta de Turnia para habilitar el servicio 24/7.</p>
                  </div>

                  <div className="bg-[#12112C] border border-indigo-500/20 p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Plan {selectedPlan?.toUpperCase()}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Suscripción Mensual Auto-gestionada</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-white font-mono">
                          {selectedPlan === 'esencial' ? (market === 'es-ES' ? '39 €' : '30.000 ARS') : (market === 'es-ES' ? '79 €' : '60.000 ARS')}
                        </span>
                        <span className="text-[10px] text-gray-500 block">/mes</span>
                      </div>
                    </div>

                    {selectedPlan === 'esencial' ? (
                      <div className="space-y-3 pt-2">
                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-semibold">Método de Pago Seguro (PayPal)</p>
                        
                        {/* PayPal Container for hosted button rendering */}
                        <div className="flex justify-center min-h-[50px] py-2">
                          <div id="paypal-container-J38N5WXD5G2YS" className="w-full max-w-[280px]"></div>
                        </div>
                        
                        <p className="text-[9px] text-gray-500 text-center leading-relaxed">
                          Puedes cancelar o cambiar tu suscripción en cualquier momento desde tu panel de facturación.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-gray-400 space-y-2">
                        <CreditCard className="w-8 h-8 text-indigo-400 mx-auto" />
                        <p className="font-semibold text-white">Pasarela PRO en integración</p>
                        <p className="text-[10px] text-gray-500">
                          Puedes registrarte temporalmente completando el asistente. Nos comunicaremos para habilitar tu botón de cobro de seña.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Success & Verification */}
              {wizardStep === 5 && (
                <div className="space-y-4 text-center py-6 animate-slide-up">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">¡Configuración Completa!</h3>
                    <p className="text-xs text-gray-400">Tu agenda inteligente ya está conectada y lista para recibir turnos.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-left text-gray-300 leading-relaxed max-w-sm mx-auto">
                    <p className="font-semibold text-indigo-400 mb-1">Resumen de tu Onboarding:</p>
                    <ul className="space-y-1 list-disc pl-4 text-gray-400">
                      <li>Local: {wizardData.businessName || 'Barbería Demo'}</li>
                      <li>Canal: WhatsApp Vinculado</li>
                      <li>Calendario: Google Sync Activo</li>
                      <li>Suscripción: Plan {selectedPlan?.toUpperCase()}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              {wizardStep > 1 && wizardStep < 5 ? (
                <button 
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-all"
                >
                  Atrás
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 5 ? (
                <button
                  disabled={
                    (wizardStep === 1 && !wizardData.businessName) ||
                    (wizardStep === 3 && !wizardData.calendarConnected)
                  }
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/10"
                >
                  Siguiente <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowWizard(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white transition-all shadow-lg shadow-indigo-600/20"
                >
                  Finalizar e ir al Dashboard
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Section: Problems */}
      <section className="bg-[#0B0A1C] border-y border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">¿Te suena alguna de estas situaciones?</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Gestionar tu agenda a mano consume más energía de la que crees.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold">✗</div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Suena el WhatsApp mientras cortas</h3>
                <p className="text-xs text-gray-400">O contestas y pierdes el ritmo con el cliente presente, o no contestas y pierdes la reserva.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold">☾</div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Te escriben a las 23:00</h3>
                <p className="text-xs text-gray-400">Y cuando lo ves a las 9 de la mañana del día siguiente, esa persona ya reservó en otro local.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold">☌</div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Has reservado dos veces el mismo hueco</h3>
                <p className="text-xs text-gray-400">Un error manual que te deja mal con dos clientes. Uno se queda sin cita, el otro no vuelve jamás.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">🔔</div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No aparece y no avisa (No-Show)</h3>
                <p className="text-xs text-gray-400">Una hora muerta sin facturar que podrías haber evitado con un recordatorio automático.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Cost */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Lo que te cuesta cada mes</h2>
          <p className="text-indigo-400 font-semibold text-sm">Hablamos de tiempo y dinero. No de tecnología.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#0F0E28] border border-indigo-500/10 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500" />
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold font-mono">Al Mes</span>
            <h3 className="text-5xl font-extrabold text-white my-4">10-16 h</h3>
            <p className="text-base font-bold text-white mb-2">Contestando WhatsApp</p>
            <p className="text-xs text-gray-400">Tiempo que podrías estar cortando, atendiendo a quien tienes delante o en tu casa descansando.</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F0E28] border border-indigo-500/10 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-orange-500" />
            <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold font-mono">Citas</span>
            <h3 className="text-5xl font-extrabold text-white my-4">1 de 10</h3>
            <p className="text-base font-bold text-white mb-2">Se queda sin venir</p>
            <p className="text-xs text-gray-400">Sin recordatorios automáticos, la tasa de no-shows está en torno al 10%. Cada hueco vacío es dinero perdido.</p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F0E28] border border-indigo-500/10 flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500" />
            <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold font-mono">Al Mes</span>
            <h3 className="text-5xl font-extrabold text-white my-4">
              {market === 'es-ES' ? '200-400 €' : '45.000+ $'}
            </h3>
            <p className="text-base font-bold text-white mb-2">En reservas perdidas</p>
            <p className="text-xs text-gray-400">La suma de huecos sin llenar, cancelaciones de último momento y no-shows. Tirando el cálculo a la baja.</p>
          </div>
        </div>
      </section>

      {/* Section: Solution */}
      <section className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-y border-white/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">¿Qué es Turnia?</h2>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            "Una recepcionista virtual que contesta tu WhatsApp, bloquea las citas automáticamente en tu calendario y envía recordatorios para asegurar que la gente venga."
          </blockquote>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
            Tú no instalas nada. Tu cliente no descarga nada. Sigues trabajando como siempre en tu Google Calendar, pero sin las interrupciones del WhatsApp.
          </p>
        </div>
      </section>

      {/* Section: Pricing */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">¿Cuánto cuesta?</h2>
          <p className="text-gray-400 text-sm">Dos opciones claras. Sin letra pequeña ni permanencia.</p>
        </div>

        {/* Launch Offer Banner */}
        <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-yellow-500/30 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-yellow-500 font-mono bg-yellow-500/10 px-2 py-0.5 rounded-full">Oferta de Lanzamiento</span>
            <h3 className="text-lg font-bold text-white">¡Por entrar hoy, llévate 50% de descuento!</h3>
            <p className="text-xs text-gray-400">Los primeros 2 meses al 50% + Asistente virtual de autoconfiguración a 0 € + Soporte cercano de 15 días.</p>
          </div>
          <div className="text-2xl font-black text-yellow-500 shrink-0 font-mono">
            {market === 'es-ES' ? '19,50 €/mes' : '15.000 $'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Esencial */}
          <div className="p-8 rounded-2xl bg-[#0F0E28] border border-white/10 flex flex-col justify-between relative hover:border-indigo-500/30 transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">ESENCIAL</h3>
                <p className="text-xs text-gray-500 mt-1">Para peluquerías o barberías de un solo profesional.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white font-mono">
                  {market === 'es-ES' ? '39' : '30.000'}
                </span>
                <span className="text-gray-400 text-xs font-mono">{market === 'es-ES' ? '€ / mes' : 'ARS / mes'}</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> WhatsApp conectado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 150 reservas al mes incluidas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Recordatorios automáticos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Asistente guiado de onboarding
                </li>
              </ul>
            </div>

            <button 
              onClick={() => startOnboarding('esencial')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-xs font-bold text-white mt-8 text-center shadow-lg shadow-indigo-600/10"
            >
              Comenzar Setup Esencial
            </button>
          </div>

          {/* Plan PRO */}
          <div className="p-8 rounded-2xl bg-gradient-to-b from-[#131135] to-[#0A0915] border border-indigo-500/30 flex flex-col justify-between relative shadow-xl shadow-indigo-950/20">
            <div className="absolute top-[-12px] right-6 px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider">
              Recomendado
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-400">PRO</h3>
                <p className="text-xs text-gray-400 mt-1">Para peluquerías y barberías con múltiples profesionales.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white font-mono">
                  {market === 'es-ES' ? '79' : '60.000'}
                </span>
                <span className="text-gray-400 text-xs font-mono">{market === 'es-ES' ? '€ / mes' : 'ARS / mes'}</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Hasta 5 profesionales
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> 500 reservas al mes incluidas
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Cobro de seña / señal integrado
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Lista de espera automática
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span> Asistente autogestionado completo
                </li>
              </ul>
            </div>

            <button 
              onClick={() => startOnboarding('pro')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all text-xs font-bold text-white mt-8 text-center shadow-lg shadow-indigo-600/10"
            >
              Comenzar Setup PRO
            </button>
          </div>
        </div>
      </section>

      {/* Section: Implementation Steps */}
      <section className="bg-[#0B0A1C] border-t border-white/5 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Cómo lo pones en marcha</h2>
            <p className="text-gray-400 text-sm">Cero llamadas de venta, cero visitas físicas. Todo a tu propio ritmo.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">01</span>
              <h4 className="text-sm font-bold text-white">Crea tu cuenta</h4>
              <p className="text-xs text-gray-500">Regístrate en segundos ingresando el nombre de tu salón.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">02</span>
              <h4 className="text-sm font-bold text-white">Conecta WhatsApp</h4>
              <p className="text-xs text-gray-500">Escanea el código QR en pantalla para habilitar el bot.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">03</span>
              <h4 className="text-sm font-bold text-white">Enlaza Google Calendar</h4>
              <p className="text-xs text-gray-500">Vincula tu cuenta de Google con un clic para sincronizar turnos.</p>
            </div>
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-mono text-indigo-400 font-bold block">04</span>
              <h4 className="text-sm font-bold text-white">¡Listo!</h4>
              <p className="text-xs text-gray-500">El asistente virtual ya responde y reserva por ti 24/7.</p>
            </div>
          </div>

          <div className="text-center font-bold text-sm text-indigo-400 pt-4">
            En menos de 5 minutos estás funcionando. Sin esperas.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-600 font-mono">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 TURNIA. Tu agenda responde sola. Diseñado para España y Argentina.</p>
        </div>
      </footer>
    </div>
  );
}
