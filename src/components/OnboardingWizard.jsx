import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  Calendar as CalendarIcon, 
  Clock, 
  Scissors, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ExternalLink,
  Bot,
  Zap,
  Check
} from 'lucide-react';
import { db } from '../../server/db';

export function OnboardingWizard({ onFinishOnboarding }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Paso 1: Datos del Negocio
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Barbería & Peluquería');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [address, setAddress] = useState('');

  // Paso 2: Google Calendar
  const [googleEmail, setGoogleEmail] = useState('');
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [connectingCalendar, setConnectingCalendar] = useState(false);

  // Paso 3: Horarios de Atención
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6]); // Lun-Sáb
  const [openHour, setOpenHour] = useState(10);
  const [closeHour, setCloseHour] = useState(20);
  const [slotInterval, setSlotInterval] = useState(30);

  // Paso 4: Tarifas & Servicios
  const [servicesList, setServicesList] = useState([
    { id: '1', name: 'Corte de Pelo', durationMin: 30, price: 16, description: 'Corte clásico o degradado' },
    { id: '2', name: 'Corte + Barba', durationMin: 45, price: 24, description: 'Corte completo y toalla caliente' },
    { id: '3', name: 'Arreglo de Barba', durationMin: 25, price: 12, description: 'Perfilado y navaja' }
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('30');

  // Conectar Google Calendar Simulado / OAuth
  const handleConnectCalendar = () => {
    if (!googleEmail || !googleEmail.includes('@')) {
      alert("Por favor ingresa un correo de Google válido (@gmail.com)");
      return;
    }
    setConnectingCalendar(true);
    setTimeout(() => {
      setIsCalendarConnected(true);
      setConnectingCalendar(false);
    }, 1000);
  };

  const toggleDay = (dayIndex) => {
    if (workingDays.includes(dayIndex)) {
      setWorkingDays(workingDays.filter(d => d !== dayIndex));
    } else {
      setWorkingDays([...workingDays, dayIndex].sort());
    }
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    const newSrv = {
      id: `srv-${Date.now()}`,
      name: newServiceName,
      price: parseFloat(newServicePrice) || 0,
      durationMin: parseInt(newServiceDuration) || 30,
      description: 'Servicio profesional'
    };
    setServicesList([...servicesList, newSrv]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleDeleteService = (id) => {
    setServicesList(servicesList.filter(s => s.id !== id));
  };

  const handleCompleteOnboarding = () => {
    // Guardar el nuevo negocio en la base de datos de Turnia
    const createdBiz = db.addBusiness({
      name: businessName || 'Mi Barbería',
      category: category,
      phone: whatsappPhone || '+34 600 000 000',
      address: address || 'Dirección del Local',
      googleCalendarId: googleEmail || 'barberia@gmail.com',
      googleCalendarConnected: true,
      workingDays: workingDays,
      openHour: parseInt(openHour),
      closeHour: parseInt(closeHour),
      slotIntervalMin: parseInt(slotInterval),
      botActive: true,
      pricingPlan: "PRO"
    });

    // Guardar sus servicios
    servicesList.forEach(s => {
      db.addService({
        businessId: createdBiz.id,
        name: s.name,
        price: s.price,
        durationMin: s.durationMin,
        description: s.description
      });
    });

    if (onFinishOnboarding) onFinishOnboarding(createdBiz);
  };

  const daysLabels = [
    { idx: 1, label: 'Lunes' },
    { idx: 2, label: 'Martes' },
    { idx: 3, label: 'Miércoles' },
    { idx: 4, label: 'Jueves' },
    { idx: 5, label: 'Viernes' },
    { idx: 6, label: 'Sábado' },
    { idx: 0, label: 'Domingo' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      
      {/* Header del Wizard */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> Alta Rápida en 5 Minutos
        </span>
        <h2 className="font-display font-extrabold text-3xl text-slate-100">
          Conecta tu Negocio a TURNIA
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Solo ingresa tu WhatsApp Business, vincula tu Google Calendar y define tus tarifas. Nuestro número central se encarga de todo.
        </p>
      </div>

      {/* Barra de Progreso de Pasos */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        {[
          { step: 1, label: '1. WhatsApp' },
          { step: 2, label: '2. Google Calendar' },
          { step: 3, label: '3. Horarios' },
          { step: 4, label: '4. Tarifas' }
        ].map(item => (
          <div key={item.step} className="space-y-1.5 text-center">
            <div className={`h-1.5 rounded-full transition-all ${
              currentStep >= item.step ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-dark-800'
            }`}></div>
            <span className={`text-[11px] font-semibold block ${
              currentStep === item.step ? 'text-emerald-400' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Contenedor del Paso Activo */}
      <div className="sleek-card p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl border border-white/10">
        
        {/* ============================================================ */}
        {/* PASO 1: DATOS DEL NEGOCIO & WHATSAPP BUSINESS */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-dark-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600/20 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">
                  Paso 1: Datos de tu Negocio & WhatsApp
                </h3>
                <p className="text-xs text-slate-400">
                  El cliente le escribirá a tu número de WhatsApp de siempre.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Nombre de la Barbería / Comercio *</label>
                <input
                  type="text"
                  placeholder="Ej. Barbería Deluxe Madrid"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Tipo de Negocio</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Barbería & Peluquería">Barbería & Peluquería Masculina</option>
                    <option value="Salón de Peluquería & Estética">Salón de Peluquería & Estética Femenina</option>
                    <option value="Centro de Estética & Uñas">Centro de Estética & Uñas</option>
                    <option value="Consultorio Odontológico / Salud">Consultorio Odontológico / Salud</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Número de WhatsApp Business del Local *</label>
                  <input
                    type="text"
                    placeholder="+34 612 345 678"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Dirección del Local (Para la confirmación del turno)</label>
                <input
                  type="text"
                  placeholder="Calle Gran Vía 28, Madrid"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!businessName}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Siguiente: Conectar Google Calendar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 2: CONECTAR GOOGLE CALENDAR */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-dark-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">
                  Paso 2: Conectar tu Google Calendar
                </h3>
                <p className="text-xs text-slate-400">
                  Turnia leerá tus huecos libres y bloqueará las citas directamente aquí.
                </p>
              </div>
            </div>

            <div className="p-5 bg-dark-950/80 rounded-2xl border border-dark-800 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">Tu Cuenta de Google (@gmail.com)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="tu.barberia@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    disabled={isCalendarConnected}
                    className="flex-1 bg-dark-900 border border-dark-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleConnectCalendar}
                    disabled={connectingCalendar || isCalendarConnected}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isCalendarConnected 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    }`}
                  >
                    {connectingCalendar ? (
                      <span>Conectando...</span>
                    ) : isCalendarConnected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>¡Conectado con Éxito!</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="w-4 h-4" />
                        <span>Vincular en 1 Clic</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isCalendarConnected && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sincronización bidireccional activa con <strong>{googleEmail}</strong>. Las citas se crearán solas en tu móvil.</span>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Siguiente: Horarios de Trabajo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 3: HORARIOS DE TRABAJO */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-dark-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-amber-600/20 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">
                  Paso 3: Horarios de Atención
                </h3>
                <p className="text-xs text-slate-400">
                  Define en qué días y franjas horarias Turnia puede ofrecer turnos.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Días que abres tu local:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {daysLabels.map(d => {
                    const isSelected = workingDays.includes(d.idx);
                    return (
                      <button
                        key={d.idx}
                        type="button"
                        onClick={() => toggleDay(d.idx)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          isSelected 
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow' 
                            : 'bg-dark-950 border-dark-800 text-slate-500'
                        }`}
                      >
                        {d.label} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hora Apertura</label>
                  <select
                    value={openHour}
                    onChange={(e) => setOpenHour(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                  >
                    <option value="8">08:00 hs</option>
                    <option value="9">09:00 hs</option>
                    <option value="10">10:00 hs</option>
                    <option value="11">11:00 hs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Hora Cierre</label>
                  <select
                    value={closeHour}
                    onChange={(e) => setCloseHour(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                  >
                    <option value="18">18:00 hs</option>
                    <option value="19">19:00 hs</option>
                    <option value="20">20:00 hs</option>
                    <option value="21">21:00 hs</option>
                    <option value="22">22:00 hs</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Intervalo de Turnos</label>
                  <select
                    value={slotInterval}
                    onChange={(e) => setSlotInterval(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                  >
                    <option value="20">Cada 20 min</option>
                    <option value="30">Cada 30 min (Recomendado)</option>
                    <option value="45">Cada 45 min</option>
                    <option value="60">Cada 60 min (1 h)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <span>Siguiente: Tarifas y Servicios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PASO 4: TARIFAS & SERVICIOS */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 border-b border-dark-800 pb-3">
              <div className="p-2.5 rounded-2xl bg-purple-600/20 text-purple-400">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">
                  Paso 4: Servicios y Precios
                </h3>
                <p className="text-xs text-slate-400">
                  Estos son los servicios y tarifas que el bot ofrecerá en WhatsApp.
                </p>
              </div>
            </div>

            {/* Lista actual de servicios */}
            <div className="space-y-2.5">
              {servicesList.map(srv => (
                <div key={srv.id} className="p-3 bg-dark-950/80 border border-dark-800 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-100">{srv.name}</h4>
                    <span className="text-[11px] text-slate-400">{srv.durationMin} min • {srv.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {srv.price} €
                    </span>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulario rápido para agregar otro servicio */}
            <form onSubmit={handleAddService} className="p-4 bg-dark-950/40 border border-dark-800 rounded-2xl space-y-3 text-xs">
              <span className="font-bold text-slate-300 block">+ Agregar otro servicio</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nombre del servicio"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                />
                <input
                  type="number"
                  placeholder="Precio (€)"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                />
                <select
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                  className="bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-slate-100 text-xs"
                >
                  <option value="20">20 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-200"
              >
                + Añadir a la lista
              </button>
            </form>

            <div className="flex justify-between pt-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Atrás
              </button>
              <button
                onClick={handleCompleteOnboarding}
                className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>¡Activar y Probar en WhatsApp!</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
