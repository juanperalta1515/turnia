import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  Building2, 
  UserCheck, 
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { db } from '../../server/db';

export function ServicesManager() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBizId, setSelectedBizId] = useState('biz-1');
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Modal para nuevo servicio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('30');
  const [newServiceDescription, setNewServiceDescription] = useState('');

  const loadData = () => {
    const bizList = db.getBusinesses();
    setBusinesses(bizList);
    if (bizList.length > 0 && !selectedBizId) {
      setSelectedBizId(bizList[0].id);
    }
    setServices(db.getServices(selectedBizId));
    setStaff(db.getStaff(selectedBizId));
  };

  useEffect(() => {
    loadData();
  }, [selectedBizId]);

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;

    db.addService({
      businessId: selectedBizId,
      name: newServiceName,
      price: parseFloat(newServicePrice) || 0,
      durationMin: parseInt(newServiceDuration) || 30,
      description: newServiceDescription || 'Servicio profesional'
    });

    setNewServiceName('');
    setNewServicePrice('');
    setNewServiceDescription('');
    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteService = (id) => {
    if (window.confirm("¿Eliminar este servicio del catálogo de WhatsApp?")) {
      db.deleteService(id);
      loadData();
    }
  };

  const currentBiz = businesses.find(b => b.id === selectedBizId) || businesses[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Scissors className="w-6 h-6 text-emerald-400" />
            Servicios & Profesionales del Comercio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Los servicios que cargues aquí aparecerán automáticamente en el menú interactivo de WhatsApp de Turnia.
          </p>
        </div>

        {/* Selector de Comercio */}
        <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 self-start md:self-auto shadow-sm">
          <Building2 className="w-4 h-4 text-blue-400" />
          <select
            value={selectedBizId}
            onChange={(e) => setSelectedBizId(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id} className="bg-dark-900 text-slate-300">{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Catálogo de Servicios y Profesionales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda & Centro: Lista de Servicios (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Menú de Servicios ({services.length})
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/10 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Servicio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="glass-panel rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display font-bold text-sm text-slate-100">
                      {srv.name}
                    </h4>
                    <button
                      onClick={() => handleDeleteService(srv.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dark-800/80 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {srv.durationMin} min
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">
                    ${srv.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Profesionales / Staff */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            Equipo / Profesionales ({staff.length})
          </h3>

          <div className="glass-panel rounded-2xl p-4 space-y-3 shadow-lg">
            {staff.map((st) => (
              <div
                key={st.id}
                className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl space-y-1"
              >
                <h4 className="font-bold text-xs text-slate-200">{st.name}</h4>
                <p className="text-[10px] text-slate-400">{st.specialty}</p>
              </div>
            ))}
          </div>

          {/* Info Card */}
          <div className="glass-panel border-blue-500/20 bg-blue-950/20 rounded-2xl p-4 space-y-2 text-xs text-blue-300">
            <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
              💡 Automatización en WhatsApp
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-300">
              Cuando el cliente elige un servicio, el bot calculará los turnos disponibles en base a la duración y la disponibilidad de los profesionales asignados.
            </p>
          </div>
        </div>

      </div>

      {/* Modal para Agregar Servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel bg-dark-900 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-dark-700">
            
            <div className="flex items-center justify-between border-b border-dark-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-400" />
                Nuevo Servicio para {currentBiz.name}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Nombre del Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Corte Fade + Lavado"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Precio ($ ARS)</label>
                  <input
                    type="number"
                    required
                    placeholder="8000"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Duración (minutos)</label>
                  <select
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min (1 h)</option>
                    <option value="90">90 min (1.5 h)</option>
                    <option value="120">120 min (2 h)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Descripción breve</label>
                <textarea
                  rows="2"
                  placeholder="Detalles que verá el cliente en WhatsApp..."
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-dark-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/10"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
