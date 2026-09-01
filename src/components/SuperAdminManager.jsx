import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  DollarSign, 
  Users, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle, 
  Plus, 
  Sparkles, 
  Search, 
  ArrowUpRight,
  RefreshCw,
  Gift,
  Lock
} from 'lucide-react';
import { db } from '../../server/db';

export function SuperAdminManager({ onSelectBusinessToInspect }) {
  const [businesses, setBusinesses] = useState(db.getBusinesses());
  const [stats, setStats] = useState(db.getPlatformStats());
  const [searchTerm, setSearchTerm] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const loadData = () => {
    setBusinesses([...db.getBusinesses()]);
    setStats(db.getPlatformStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    db.toggleBusinessSubscriptionStatus(id, nextStatus);
    loadData();
    setActionSuccessMsg(nextStatus === 'suspended' ? 'Local suspendido correctamente.' : 'Local reactivado con éxito.');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleExtendTrial = (id) => {
    db.extendTrialDays(id, 15);
    loadData();
    setActionSuccessMsg('Se han añadido +15 días de prueba gratuita al local.');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleDeleteBusiness = (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas dar de baja y eliminar definitivamente el local "${name}" de la plataforma Turnia?`)) {
      db.deleteBusiness(id);
      loadData();
      setActionSuccessMsg(`Local "${name}" eliminado de la plataforma.`);
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
                Panel Master Control • Dueño de TURNIA
              </h2>
              <p className="text-xs text-purple-300/80 font-medium">
                Acceso exclusivo para administradores de Turnia. Vista global y control de todos los clientes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar Métricas</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 1. KPIs GLOBALES DE LA PLATAFORMA TURNIA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MRR */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-emerald-500 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Facturación Mensual (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-black text-2xl text-emerald-400 font-mono">
            {stats.monthlyRecurringRevenue} € <span className="text-xs text-slate-400 font-normal">/mes</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Ingresos de clientes con plan mensual de pago activo
          </p>
        </div>

        {/* Total Locales Registrados */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-purple-500 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Clientes Registrados</span>
            <Building2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-display font-black text-2xl text-purple-400">
            {stats.totalTenants} locales
          </div>
          <p className="text-[10px] text-slate-400">
            Barberías, talleres y clínicas odontológicas
          </p>
        </div>

        {/* En Prueba Gratis */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>En Prueba de 15 Días</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-black text-2xl text-amber-400">
            {stats.trialTenantsCount} en prueba
          </div>
          <p className="text-[10px] text-slate-400">
            Potenciales conversiones a clientes de pago
          </p>
        </div>

        {/* Citas Totales Gestionadas */}
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-blue-500 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Citas Procesadas por el Bot</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-display font-black text-2xl text-blue-400">
            {stats.totalAppointmentsProcessed} citas
          </div>
          <p className="text-[10px] text-slate-400">
            Agendadas 100% en automático por WhatsApp
          </p>
        </div>

      </div>

      {/* 2. TABLA DE NEGOCIOS Y GESTIÓN DE CLIENTES */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Directorio de Negocios y Control de Bajas / Altas ({filteredBusinesses.length})
            </h3>
            <p className="text-xs text-slate-400">
              Administra las suscripciones, suspende accesos por impago o elimina comercios.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, rubro o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-dark-950 border border-dark-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/50 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Tabla Responsive */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-dark-950/80 text-slate-400 uppercase text-[10px] font-bold border-b border-dark-800">
              <tr>
                <th className="p-3">Comercio / Rubro</th>
                <th className="p-3">Propietario / Contacto</th>
                <th className="p-3">Plan / Precio</th>
                <th className="p-3">Estado Suscripción</th>
                <th className="p-3">WhatsApp / Bot</th>
                <th className="p-3 text-right">Acciones de Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60">
              {filteredBusinesses.map((biz) => {
                const isSuspended = biz.subscriptionStatus === 'suspended';
                const isActive = biz.subscriptionStatus === 'active';
                const isTrial = biz.subscriptionStatus === 'trial';

                return (
                  <tr key={biz.id} className="hover:bg-dark-950/40 transition-colors">
                    
                    {/* Comercio */}
                    <td className="p-3">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{biz.name}</span>
                        {isSuspended && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                            Suspendido
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{biz.category}</span>
                    </td>

                    {/* Propietario */}
                    <td className="p-3">
                      <div className="text-slate-200 font-semibold">{biz.ownerName || 'Propietario'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{biz.phone}</div>
                    </td>

                    {/* Plan */}
                    <td className="p-3">
                      <span className="font-bold text-slate-200">{biz.pricingPlan || 'ESENCIAL'}</span>
                      <div className="text-[11px] text-emerald-400 font-mono">{biz.monthlyPrice || 39} €/mes</div>
                    </td>

                    {/* Estado Suscripción */}
                    <td className="p-3">
                      {isActive && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Activo (Pagando)
                        </span>
                      )}
                      {isTrial && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Prueba ({biz.trialDaysLeft}d rest.)
                        </span>
                      )}
                      {isSuspended && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Acceso Cortado
                        </span>
                      )}
                    </td>

                    {/* Estado WhatsApp */}
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                        biz.whatsappConnected ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${biz.whatsappConnected ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                        {biz.whatsappConnected ? 'Bot Respondiendo' : 'Desconectado'}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Extender días de prueba */}
                        <button
                          onClick={() => handleExtendTrial(biz.id)}
                          title="Extender +15 días de prueba gratis"
                          className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+15d</span>
                        </button>

                        {/* Suspender / Reactivar */}
                        <button
                          onClick={() => handleToggleStatus(biz.id, biz.subscriptionStatus)}
                          title={isSuspended ? "Reactivar negocio" : "Suspender negocio por impago"}
                          className={`p-1.5 rounded-lg border transition-all ${
                            isSuspended
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {isSuspended ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                        </button>

                        {/* Eliminar / Dar de Baja */}
                        <button
                          onClick={() => handleDeleteBusiness(biz.id, biz.name)}
                          title="Eliminar definitivamente este negocio"
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
