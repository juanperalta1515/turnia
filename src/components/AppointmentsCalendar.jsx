import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Scissors, 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Building2, 
  Phone,
  CalendarCheck
} from 'lucide-react';
import { db } from '../../server/db';

export function AppointmentsCalendar({ refreshKey }) {
  const [appointments, setAppointments] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // Intentar API o fallback a db
      try {
        const [resApt, resBiz] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/businesses')
        ]);
        if (resApt.ok && resBiz.ok) {
          const aptData = await resApt.json();
          const bizData = await resBiz.json();
          setAppointments(aptData);
          setBusinesses(bizData);
          setLoading(false);
          return;
        }
      } catch (e) {}

      // Fallback local
      setAppointments(db.getAppointments());
      setBusinesses(db.getBusinesses());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleCancelAppointment = async (id) => {
    if (window.confirm("¿Seguro que deseas cancelar este turno?")) {
      try {
        await fetch(`/api/appointments/${id}/cancel`, { method: 'POST' });
      } catch (e) {}
      db.cancelAppointment(id);
      loadData();
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchBiz = selectedBiz === 'All' || a.businessId === selectedBiz;
    const matchStatus = selectedStatus === 'All' || a.status === selectedStatus;
    const matchSearch = searchTerm === '' ||
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.clientPhone.includes(searchTerm) ||
      a.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchBiz && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" />
            Agenda de Turnos (WhatsApp Inbound)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Turnos agendados automáticamente por los clientes a través del número central de WhatsApp.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all self-start md:self-auto shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Agenda
        </button>
      </div>

      {/* Filtros */}
      <div className="glass-panel rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Búsqueda */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono, servicio o local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-950/80 border border-dark-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Filtro Comercio */}
          <div className="flex items-center gap-2 bg-dark-950/60 border border-dark-800 rounded-xl px-3 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-dark-900">Todos los Comercios</option>
              {businesses.map(b => (
                <option key={b.id} value={b.id} className="bg-dark-900">{b.name}</option>
              ))}
            </select>
          </div>

          {/* Filtro Estado */}
          <div className="flex items-center gap-2 bg-dark-950/60 border border-dark-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer w-full"
            >
              <option value="All" className="bg-dark-900">Todos los Estados</option>
              <option value="Confirmado" className="bg-dark-900">Confirmados</option>
              <option value="Cancelado" className="bg-dark-900">Cancelados</option>
            </select>
          </div>

        </div>
      </div>

      {/* Tabla de Turnos */}
      {filteredAppointments.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-sm text-slate-300">No se encontraron turnos</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Puedes agendar un nuevo turno de prueba desde el <strong>Simulador de WhatsApp</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => {
            const isConfirmed = apt.status === 'Confirmado';
            return (
              <div
                key={apt.id}
                className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg relative overflow-hidden"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: Comercio y Estado */}
                  <div className="flex items-start justify-between gap-2 border-b border-dark-800/80 pb-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15">
                        {apt.businessName}
                      </span>
                      <h4 className="font-display font-bold text-base text-slate-100 mt-1.5 flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-emerald-400" />
                        {apt.serviceName}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                      isConfirmed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isConfirmed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {apt.status}
                    </span>
                  </div>

                  {/* Datos del Cliente y Profesional */}
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-200">{apt.clientName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{apt.clientPhone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-slate-500">Atiende:</span>
                      <span className="text-slate-300 font-medium">{apt.staffName}</span>
                    </div>
                  </div>

                  {/* Fecha, Hora y Precio */}
                  <div className="bg-dark-950/60 border border-dark-800 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-semibold">{apt.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-emerald-400 font-mono">{apt.time} hs</span>
                    </div>

                    <div className="col-span-2 pt-1 border-t border-dark-800 flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-mono">ID: {apt.id}</span>
                      <span className="font-bold text-amber-400">
                        ${apt.price ? apt.price.toLocaleString('es-AR') : 'Consultar'}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Acciones */}
                {isConfirmed && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-colors"
                    >
                      Cancelar Turno
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
