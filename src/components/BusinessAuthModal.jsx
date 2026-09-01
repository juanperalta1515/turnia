import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Gift, 
  Smartphone,
  Scissors,
  Wrench,
  HeartPulse
} from 'lucide-react';
import { db } from '../../server/db';

export function BusinessAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedQuickBiz, setSelectedQuickBiz] = useState('biz-1');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Formulario de Registro
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('Peluquería & Barbería');
  const [businessPhone, setBusinessPhone] = useState('');

  if (!isOpen) return null;

  const businesses = db.getBusinesses();

  const handleQuickLogin = (bizId) => {
    const res = db.login(bizId);
    if (res.success) {
      setSuccessMsg(`¡Bienvenido de nuevo, ${res.business.ownerName || res.business.name}!`);
      setTimeout(() => {
        onLoginSuccess(res.business, 'business');
        onClose();
      }, 500);
    }
  };

  const handleSuperAdminLogin = () => {
    setSuccessMsg('¡Bienvenido al Panel Master Control de TURNIA (SuperAdmin)!');
    setTimeout(() => {
      onLoginSuccess(businesses[0], 'superadmin');
      onClose();
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegistering) {
      if (!businessName || !businessPhone) {
        setErrorMsg('Por favor completa todos los campos obligatorios.');
        return;
      }

      const newBiz = db.addBusiness({
        name: businessName,
        category: businessCategory,
        phone: businessPhone,
        email: emailOrPhone || `contacto@${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      });

      setSuccessMsg(`¡Local registrado! Tienes 15 Días de Prueba 100% Gratis.`);
      setTimeout(() => {
        onLoginSuccess(newBiz, 'business');
        onClose();
      }, 600);
    } else {
      if (emailOrPhone.toLowerCase().includes('admin')) {
        handleSuperAdminLogin();
        return;
      }

      const res = db.login(emailOrPhone || selectedQuickBiz, password);
      if (res.success) {
        setSuccessMsg(`¡Acceso concedido a ${res.business.name}!`);
        setTimeout(() => {
          onLoginSuccess(res.business, 'business');
          onClose();
        }, 500);
      } else {
        setErrorMsg('Credenciales no válidas.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-dark-900 border border-dark-800 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-dark-950/80 border border-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <Gift className="w-3.5 h-3.5" />
            15 Días de Prueba 100% Gratis
          </div>
          <h3 className="font-display font-extrabold text-2xl text-slate-100">
            {isRegistering ? 'Empieza tus 15 Días Gratis' : 'Acceso al Panel de tu Negocio'}
          </h3>
          <p className="text-xs text-slate-400">
            {isRegistering 
              ? 'Prueba todas las funciones sin tarjeta de crédito. Cancela cuando quieras.'
              : 'Inicia sesión para gestionar tus horarios, precios y citas agendadas.'}
          </p>
        </div>

        {/* Acceso Especial SuperAdmin Dueño de Turnia */}
        {!isRegistering && (
          <button
            type="button"
            onClick={handleSuperAdminLogin}
            className="w-full p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 hover:bg-purple-900/40 text-purple-300 transition-all flex items-center justify-between group shadow-lg shadow-purple-500/5"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600/30 text-purple-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-100 block">Acceso Master • Dueño de TURNIA</span>
                <span className="text-[10px] text-purple-300/80">Gestionar todos los locales registrados y dar de baja</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>
        )}

        {/* Acceso Rápido Demo para probar */}
        {!isRegistering && (
          <div className="space-y-2 pt-1">
            <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              O accede como Dueño de un Local (Vista Aislada):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {businesses.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleQuickLogin(b.id)}
                  className="p-3 rounded-2xl bg-dark-950/80 border border-dark-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 transition-all text-left flex items-center justify-between group"
                >
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 block truncate">
                      {b.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.category}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Formulario Tradicional */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {isRegistering ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nombre del Negocio</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Barbería Vintage o Taller Central"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Rubro / Industria</label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Peluquería & Barbería">Peluquería & Barbería</option>
                    <option value="Taller Mecánico & Autos">Taller Mecánico & Autos</option>
                    <option value="Clínica Odontológica">Clínica Odontológica</option>
                    <option value="Salón de Belleza & Estética">Salón de Belleza & Estética</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">WhatsApp del Negocio</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 112 233"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email o Teléfono de tu Negocio</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="carlos@barberaking.es"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contraseña o PIN</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isRegistering ? 'Activar Mis 15 Días Gratis' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        {/* Toggle Login vs Registro */}
        <div className="text-center pt-2 border-t border-dark-800">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRegistering
              ? '¿Ya tienes una cuenta registrada? Inicia sesión aquí'
              : '¿Nuevo negocio? Regístrate y obtén 15 días gratis'}
          </button>
        </div>

      </div>
    </div>
  );
}
