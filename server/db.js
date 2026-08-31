// Base de datos y capa de persistencia en memoria/archivo para TURNIA

let businesses = [
  {
    id: "biz-1",
    name: "Barbería & Estilo King",
    slug: "barberia-king",
    keyword: "KING",
    category: "Peluquería & Barbería",
    phone: "+5491144445555",
    address: "Av. Corrientes 1420, CABA",
    welcomeMessage: "¡Bienvenido a Barbería & Estilo King! 💈 Reserva tu turno de forma rápida y sencilla.",
    workingDays: [1, 2, 3, 4, 5, 6], // Lun - Sáb
    openHour: 10,
    closeHour: 20,
    slotIntervalMin: 30
  },
  {
    id: "biz-2",
    name: "Salón Estética & Belleza Glam",
    slug: "salon-glam",
    keyword: "GLAM",
    category: "Estética & Peluquería Femenina",
    phone: "+5491177778888",
    address: "Calle Santa Fe 2310, CABA",
    welcomeMessage: "¡Hola! Bienvenida/o a Salón Glam ✨ Elige tu servicio y reserva tu momento especial.",
    workingDays: [2, 3, 4, 5, 6], // Mar - Sáb
    openHour: 9,
    closeHour: 19,
    slotIntervalMin: 45
  },
  {
    id: "biz-3",
    name: "Consultorio Odontológico San Lucas",
    slug: "dental-sanlucas",
    keyword: "LUCAS",
    category: "Salud & Consultorio Dental",
    phone: "+5491122223333",
    address: "Av. Rivadavia 4500, CABA",
    welcomeMessage: "Consultorio San Lucas 🦷. Agenda tu consulta o control odontológico.",
    workingDays: [1, 2, 3, 4, 5], // Lun - Vie
    openHour: 9,
    closeHour: 18,
    slotIntervalMin: 30
  }
];

let services = [
  // Servicios de Barbería King
  { id: "srv-1", businessId: "biz-1", name: "Corte de Cabello Clásico", durationMin: 30, price: 8000, description: "Corte tijera/máquina con lavado y peinado" },
  { id: "srv-2", businessId: "biz-1", name: "Corte + Perfilado de Barba", durationMin: 45, price: 12000, description: "Corte completo y arreglo de barba con toalla caliente" },
  { id: "srv-3", businessId: "biz-1", name: "Perfilado & Afeitado de Barba", durationMin: 25, price: 6000, description: "Toalla caliente, navaja y bálsamo hidratante" },
  { id: "srv-4", businessId: "biz-1", name: "Coloración / Claritos / Platinado", durationMin: 60, price: 18000, description: "Decoloración profesional y matizado" },

  // Servicios de Salón Glam
  { id: "srv-5", businessId: "biz-2", name: "Corte & Brushing", durationMin: 45, price: 11000, description: "Lavado nutritivo, corte personalizado y peinado" },
  { id: "srv-6", businessId: "biz-2", name: "Nutrición & Baño de Crema", durationMin: 40, price: 9500, description: "Tratamiento intensivo de hidratación" },
  { id: "srv-7", businessId: "biz-2", name: "Coloración Completa / Balayage", durationMin: 90, price: 28000, description: "Técnica balayage o tinte de raíz a puntas" },
  { id: "srv-8", businessId: "biz-2", name: "Manicuría Semipermanente", durationMin: 45, price: 8500, description: "Esmaltado en gel con diseños a elección" },

  // Servicios de San Lucas
  { id: "srv-9", businessId: "biz-3", name: "Consulta de Diagnóstico & Control", durationMin: 30, price: 10000, description: "Revisión general y plan de tratamiento" },
  { id: "srv-10", businessId: "biz-3", name: "Limpieza Dental con Ultrasonido", durationMin: 45, price: 18000, description: "Eliminación de sarro y pulido dental" },
  { id: "srv-11", businessId: "biz-3", name: "Blanqueamiento Dental LED", durationMin: 60, price: 45000, description: "Sesión completa de aclaramiento dental" }
];

let staff = [
  // Barbería King
  { id: "stf-1", businessId: "biz-1", name: "Franco (Barbero Senior)", specialty: "Cortes modernos y degradados" },
  { id: "stf-2", businessId: "biz-1", name: "Mateo (Especialista en Barba)", specialty: "Perfilado y toalla caliente" },
  { id: "stf-3", businessId: "biz-1", name: "Cualquiera disponible", specialty: "Primer turno libre" },

  // Salón Glam
  { id: "stf-4", businessId: "biz-2", name: "Sofía (Estilista)", specialty: "Cortes y Brushing" },
  { id: "stf-5", businessId: "biz-2", name: "Camila (Colorista & Uñas)", specialty: "Balayage y Semipermanente" },
  { id: "stf-6", businessId: "biz-2", name: "Cualquiera disponible", specialty: "Primer turno libre" },

  // San Lucas
  { id: "stf-7", businessId: "biz-3", name: "Dra. Lucía Mendoza", specialty: "Odontología General" },
  { id: "stf-8", businessId: "biz-3", name: "Dr. Esteban Gómez", specialty: "Estética y Blanqueamiento" }
];

// Turnos precargados y agendados dinámicamente
let appointments = [
  {
    id: "apt-101",
    businessId: "biz-1",
    businessName: "Barbería & Estilo King",
    clientName: "Lucas Benítez",
    clientPhone: "+5491155551111",
    serviceId: "srv-1",
    serviceName: "Corte de Cabello Clásico",
    price: 8000,
    staffId: "stf-1",
    staffName: "Franco (Barbero Senior)",
    date: getFutureDateString(0), // Hoy
    time: "11:00",
    status: "Confirmado",
    createdAt: new Date().toISOString()
  },
  {
    id: "apt-102",
    businessId: "biz-1",
    businessName: "Barbería & Estilo King",
    clientName: "Julián Albarracín",
    clientPhone: "+5491166662222",
    serviceId: "srv-2",
    serviceName: "Corte + Perfilado de Barba",
    price: 12000,
    staffId: "stf-2",
    staffName: "Mateo (Especialista en Barba)",
    date: getFutureDateString(0), // Hoy
    time: "15:30",
    status: "Confirmado",
    createdAt: new Date().toISOString()
  },
  {
    id: "apt-103",
    businessId: "biz-2",
    businessName: "Salón Estética & Belleza Glam",
    clientName: "Mariana Costa",
    clientPhone: "+5491133334444",
    serviceId: "srv-8",
    serviceName: "Manicuría Semipermanente",
    price: 8500,
    staffId: "stf-5",
    staffName: "Camila (Colorista & Uñas)",
    date: getFutureDateString(1), // Mañana
    time: "14:00",
    status: "Confirmado",
    createdAt: new Date().toISOString()
  }
];

// Mapeo de conversaciones activas por número de teléfono
// userPhone -> { step, businessId, draftAppointment: {...}, lastInteraction }
const conversations = new Map();

function getFutureDateString(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const db = {
  // Negocios
  getBusinesses: () => businesses,
  getBusinessById: (id) => businesses.find(b => b.id === id),
  getBusinessBySlug: (slug) => businesses.find(b => b.slug.toLowerCase() === slug.toLowerCase()),
  getBusinessByKeyword: (text) => {
    if (!text) return null;
    const clean = text.toLowerCase().trim();
    return businesses.find(b => 
      clean.includes(b.slug.toLowerCase()) || 
      clean.includes(b.keyword.toLowerCase()) || 
      clean.includes(b.name.toLowerCase())
    );
  },
  addBusiness: (bizData) => {
    const newBiz = {
      id: `biz-${Date.now()}`,
      slug: bizData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      keyword: bizData.name.split(' ')[0].toUpperCase(),
      workingDays: [1, 2, 3, 4, 5, 6],
      openHour: 10,
      closeHour: 20,
      slotIntervalMin: 30,
      ...bizData
    };
    businesses.push(newBiz);
    return newBiz;
  },

  // Servicios
  getServices: (businessId) => {
    if (!businessId) return services;
    return services.filter(s => s.businessId === businessId);
  },
  getServiceById: (id) => services.find(s => s.id === id),
  addService: (data) => {
    const newSrv = { id: `srv-${Date.now()}`, ...data };
    services.push(newSrv);
    return newSrv;
  },
  deleteService: (id) => {
    services = services.filter(s => s.id !== id);
    return true;
  },

  // Staff
  getStaff: (businessId) => {
    if (!businessId) return staff;
    return staff.filter(st => st.businessId === businessId);
  },
  getStaffById: (id) => staff.find(st => st.id === id),
  addStaff: (data) => {
    const newSt = { id: `stf-${Date.now()}`, ...data };
    staff.push(newSt);
    return newSt;
  },

  // Horarios Disponibles (Cálculo dinámico inteligente)
  getAvailableDates: (businessId) => {
    const biz = businesses.find(b => b.id === businessId) || businesses[0];
    const availableDates = [];
    let count = 0;
    let dayOffset = 0;

    while (count < 5 && dayOffset < 14) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Lun...
      
      if (biz.workingDays.includes(dayOfWeek)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const label = `${dayNames[dayOfWeek]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;
        
        availableDates.push({
          dateStr,
          label,
          isToday: dayOffset === 0,
          isTomorrow: dayOffset === 1
        });
        count++;
      }
      dayOffset++;
    }
    return availableDates;
  },

  getAvailableSlots: (businessId, dateStr, serviceId, staffId) => {
    const biz = businesses.find(b => b.id === businessId) || businesses[0];
    const existing = appointments.filter(a => 
      a.businessId === businessId && 
      a.date === dateStr && 
      a.status === 'Confirmado' &&
      (!staffId || a.staffId === staffId)
    );

    const bookedTimes = new Set(existing.map(a => a.time));
    const slots = [];

    const interval = biz.slotIntervalMin || 30;
    const startMin = biz.openHour * 60;
    const endMin = biz.closeHour * 60;

    for (let m = startMin; m < endMin; m += interval) {
      const hh = Math.floor(m / 60).toString().padStart(2, '0');
      const mm = (m % 60).toString().padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      // Si es hoy, filtrar horas que ya pasaron
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      if (dateStr === todayStr) {
        const currentMin = now.getHours() * 60 + now.getMinutes();
        if (m <= currentMin + 30) continue; // Al menos 30 min de margen
      }

      if (!bookedTimes.has(timeStr)) {
        slots.push(timeStr);
      }
    }

    return slots;
  },

  // Turnos
  getAppointments: (businessId) => {
    if (!businessId) return appointments;
    return appointments.filter(a => a.businessId === businessId);
  },
  getAppointmentsByPhone: (phone) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    return appointments.filter(a => a.clientPhone.replace(/[^0-9+]/g, '') === cleanPhone);
  },
  createAppointment: (data) => {
    const biz = businesses.find(b => b.id === data.businessId);
    const newApt = {
      id: `apt-${Date.now().toString().slice(-6)}`,
      businessId: data.businessId,
      businessName: biz ? biz.name : "Turnia Business",
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      price: data.price,
      staffId: data.staffId,
      staffName: data.staffName,
      date: data.date,
      time: data.time,
      status: "Confirmado",
      createdAt: new Date().toISOString()
    };
    appointments.unshift(newApt);
    return newApt;
  },
  cancelAppointment: (id) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      apt.status = "Cancelado";
      return apt;
    }
    return null;
  },

  // Sesiones de conversación
  getSession: (userPhone) => {
    return conversations.get(userPhone) || {
      step: 'START',
      businessId: null,
      draftAppointment: {},
      lastInteraction: Date.now()
    };
  },
  updateSession: (userPhone, data) => {
    const current = conversations.get(userPhone) || {};
    const updated = {
      ...current,
      ...data,
      lastInteraction: Date.now()
    };
    conversations.set(userPhone, updated);
    return updated;
  },
  clearSession: (userPhone) => {
    conversations.delete(userPhone);
  }
};
