import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Clock, 
  DollarSign, 
  Building2, 
  Sparkles,
  Check,
  X,
  Edit2,
  Calendar,
  Save,
  Wrench,
  HeartPulse,
  Sliders,
  Settings
} from 'lucide-react';
import { db } from '../../server/db';

export function ServicesManager({ currentBusiness, userRole = 'business' }) {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBizId, setSelectedBizId] = useState(currentBusiness?.id || 'biz-1');
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  
  // Configuración de Horarios del negocio
  const [openHour, setOpenHour] = useState(9);
  const [closeHour, setCloseHour] = useState(20);
  const [slotIntervalMin, setSlotIntervalMin] = useState(30);
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5, 6]);
  const [scheduleSaved, setScheduleSaved] = useState(false);

  // Modal / Formulario para servicio
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30');
  const [serviceDescription, setServiceDescription] = useState('');

  const daysList = [
    { day: 1, name: 'Lun' },
    { day: 2, name: 'Mar' },
    { day: 3, name: 'Mié' },
    { day: 4, name: 'Jue' },
    { day: 5, name: 'Vie' },
    { day: 6, name: 'Sáb' },
    { day: 0, name: 'Dom' },
  ];

  const loadData = () => {
    const bizList = db.getBusinesses();
    setBusinesses(bizList);
    const targetId = (userRole === 'business' && currentBusiness?.id) ? currentBusiness.id : selectedBizId;
    const currentBiz = bizList.find(b => b.id === targetId) || bizList[0];
    if (currentBiz) {
      setOpenHour(currentBiz.openHour || 9);
      setCloseHour(currentBiz.closeHour || 20);
      setSlotIntervalMin(currentBiz.slotIntervalMin || 30);
      setWorkingDays(currentBiz.workingDays || [1, 2, 3, 4, 5, 6]);
    }
    setServices(db.getServices(targetId));
    setStaff(db.getStaff(targetId));
  };

  useEffect(() => {
    if (currentBusiness?.id && userRole === 'business') {
      setSelectedBizId(currentBusiness.id);
    }
    loadData();
  }, [selectedBizId, currentBusiness?.id]);

  const currentBiz = businesses.find(b => b.id === selectedBizId) || currentBusiness || businesses[0] || {};

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    db.updateBusinessSchedule(selectedBizId, {
      openHour,
      closeHour,
      slotIntervalMin,
      workingDays
    });
    setScheduleSaved(true);
    setTimeout(() => setScheduleSaved(false), 2500);
  };

  const toggleWorkingDay = (dayIndex) => {
    if (workingDays.includes(dayIndex)) {
      if (workingDays.length > 1) {
        setWorkingDays(workingDays.filter(d => d !== dayIndex));
      }
    } else {
      setWorkingDays([...workingDays, dayIndex].sort());
    }
  };

  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServicePrice('');
    setServiceDuration('30');
    setServiceDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv) => {
    setEditingServiceId(srv.id);
    setServiceName(srv.name);
    setServicePrice(srv.price.toString());
    setServiceDuration(srv.durationMin.toString());
    setServiceDescription(srv.description || '');
    setIsModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) return;

    if (editingServiceId) {
      db.updateService(editingServiceId, {
        name: serviceName,
        price: parseFloat(servicePrice) || 0,
        durationMin: parseInt(serviceDuration) || 30,
        description: serviceDescription
      });
    } else {
      db.addService({
        businessId: selectedBizId,
        name: serviceName,
        price: parseFloat(servicePrice) || 0,
        durationMin: parseInt(serviceDuration) || 30,
        description: serviceDescription
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteService = (id) => {
    if (window.confirm("¿Eliminar este servicio del catálogo del bot de WhatsApp?")) {
      db.deleteService(id);
      loadData();
    }
  };

  const getIndustryIcon = (category = '') => {
    if (category.includes('Taller') || category.includes('Autos')) return Wrench;
    if (category.includes('Dental') || category.includes('Odont')) return HeartPulse;
    return Scissors;
  };

  const IndustryIcon = getIndustryIcon(currentBiz.category);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" />
            Horarios, Servicios & Precios
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configura los horarios de atención y el catálogo de precios que el bot de WhatsApp ofrecerá a tus clientes.
          </p>
        </div>

        {/* Selector de Comercio visible SOLO para SuperAdmin */}
        {userRole === 'superadmin' ? (
          <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 self-start md:self-auto shadow-sm">
            <Building2 className="w-4 h-4 text-purple-400" />
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id} className="bg-dark-900 text-slate-300">
                  {b.name} ({b.category})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3.5 py-2 self-start md:self-auto shadow-sm text-xs font-bold text-emerald-300">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{currentBiz.name}</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 1: CONFIGURACIÓN DE HORARIOS Y TURNOS */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border border-emerald-500/20">
        <div className="flex items-center justify-between border-b border-dark-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-slate-100">
              Horario de Atención y Duración de Turnos ({currentBiz.name})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Los huecos libres se calculan en base a esta regla
          </span>
        </div>

        <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* Hora Apertura */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Hora de Apertura</label>
            <select
              value={openHour}
              onChange={(e) => setOpenHour(Number(e.target.value))}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              {[7, 8, 9, 10, 11, 12].map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}:00 hs</option>
              ))}
            </select>
          </div>

          {/* Hora Cierre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Hora de Cierre</label>
            <select
              value={closeHour}
              onChange={(e) => setCloseHour(Number(e.target.value))}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              {[17, 18, 19, 20, 21, 22, 23].map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}:00 hs</option>
              ))}
            </select>
          </div>

          {/* Intervalo entre turnos */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Intervalo de Citas</label>
            <select
              value={slotIntervalMin}
              onChange={(e) => setSlotIntervalMin(Number(e.target.value))}
              className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value={15}>Cada 15 minutos</option>
              <option value={30}>Cada 30 minutos (Recomendado)</option>
              <option value={45}>Cada 45 minutos</option>
              <option value={60}>Cada 1 hora (Talleres / Diagnóstico)</option>
            </select>
          </div>

          {/* Botón Guardar */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Horarios</span>
            </button>
          </div>

          {/* Días de Atención */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Días Laborables con Atención Automática:
            </label>
            <div className="flex flex-wrap gap-2">
              {daysList.map(({ day, name }) => {
                const isSelected = workingDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleWorkingDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-dark-950 text-slate-400 border-dark-800 hover:bg-dark-800'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

        </form>

        {scheduleSaved && (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>¡Horarios y frecuencia de turnos actualizados con éxito en el bot!</span>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: CATÁLOGO DE SERVICIOS Y PRECIOS */}
      <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dark-800 pb-3">
          <div className="flex items-center gap-2">
            <IndustryIcon className="w-5 h-5 text-blue-400" />
            <h3 className="font-display font-bold text-sm text-slate-100">
              Catálogo de Servicios y Precios ({services.length})
            </h3>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Nuevo Servicio</span>
          </button>
        </div>

        {/* Lista de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-4 rounded-xl bg-dark-950/70 border border-dark-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 group shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                    {srv.name}
                  </h4>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono shrink-0">
                    {srv.price} €
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {srv.description || "Servicio estándar"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-dark-800 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {srv.durationMin} minutos
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(srv)}
                    className="p-1.5 rounded-lg bg-dark-900 hover:bg-dark-800 text-slate-300 hover:text-white transition-all"
                    title="Editar servicio"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="p-1.5 rounded-lg bg-dark-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                    title="Eliminar servicio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL PARA AÑADIR / EDITAR SERVICIO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-dark-800 pb-3">
              <h3 className="font-display font-bold text-base text-slate-100">
                {editingServiceId ? 'Editar Servicio' : 'Nuevo Servicio para WhatsApp'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nombre del Servicio</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Service de Aceite y Filtros"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Precio (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    placeholder="25"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Duración (minutos)</label>
                  <select
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Descripción para el cliente</label>
                <textarea
                  rows="2"
                  placeholder="Detalles de lo que incluye el servicio..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500/50 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-950 hover:bg-dark-800 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {editingServiceId ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
