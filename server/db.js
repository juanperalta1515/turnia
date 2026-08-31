// Base de datos y capa de persistencia con Google Calendar y Recordatorios para TURNIA

let businesses = [
  {
    id: "biz-1",
    name: "Barbería & Estilo King",
    slug: "barberia-king",
    keyword: "KING",
    category: "Peluquería & Barbería",
    phone: "+34 612 345 678",
    address: "Calle Mayor 45, Madrid",
    googleCalendarId: "barberia.king.madrid@gmail.com",
    googleCalendarConnected: true,
    welcomeMessage: "¡Hola! Bienvenido a Barbería King 💈. ¿En qué te podemos ayudar?",
    workingDays: [1, 2, 3, 4, 5, 6], // Lun - Sáb
    openHour: 10,
    closeHour: 20,
    slotIntervalMin: 30,
    botActive: true, // Modo intervención humana
    pricingPlan: "PRO"
  },
  {
    id: "biz-2",
    name: "Salón Glam Estética",
    slug: "salon-glam",
    keyword: "GLAM",
    category: "Peluquería & Estética",
    phone: "+34 699 112 233",
    address: "Rambla de Catalunya 88, Barcelona",
    googleCalendarId: "glam.barcelona.salon@gmail.com",
    googleCalendarConnected: true,
    welcomeMessage: "¡Hola! Bienvenida a Salón Glam ✨ ¿Quieres reservar tu cita?",
    workingDays: [2, 3, 4, 5, 6],
    openHour: 9,
    closeHour: 19,
    slotIntervalMin: 45,
    botActive: true,
    pricingPlan: "ESENCIAL"
  }
];

let services = [
  // Servicios de Barbería King (con precios en Euros según el modelo del negocio)
  { id: "srv-1", businessId: "biz-1", name: "Corte de Pelo", durationMin: 30, price: 16, description: "Corte clásico o degradado con lavado y peinado" },
  { id: "srv-2", businessId: "biz-1", name: "Corte + Barba", durationMin: 45, price: 24, description: "Corte completo y arreglo de barba con toalla caliente" },
  { id: "srv-3", businessId: "biz-1", name: "Arreglo de Barba", durationMin: 25, price: 12, description: "Perfilado, toalla caliente y bálsamo hidratante" },
  { id: "srv-4", businessId: "biz-1", name: "Coloración / Mechas", durationMin: 60, price: 35, description: "Matizado, mechas o cambio de color" },

  // Servicios de Salón Glam
  { id: "srv-5", businessId: "biz-2", name: "Corte & Brushing", durationMin: 45, price: 28, description: "Lavado hidratante, corte y peinado" },
  { id: "srv-6", businessId: "biz-2", name: "Tratamiento de Keratina", durationMin: 60, price: 65, description: "Nutrición y alisado profesional" },
  { id: "srv-7", businessId: "biz-2", name: "Manicura Semipermanente", durationMin: 45, price: 22, description: "Esmaltado en gel y cuidado de cutículas" }
];

let staff = [
  { id: "stf-1", businessId: "biz-1", name: "Carlos (Barbero)", specialty: "Cortes modernos y fade" },
  { id: "stf-2", businessId: "biz-1", name: "Javier (Especialista en Barba)", specialty: "Afeitado clásico y navaja" },
  { id: "stf-3", businessId: "biz-1", name: "Primer barbero libre", specialty: "Mayor disponibilidad de huecos" },

  { id: "stf-4", businessId: "biz-2", name: "Lucía (Estilista)", specialty: "Cortes y Peinados" },
  { id: "stf-5", businessId: "biz-2", name: "Elena (Color & Uñas)", specialty: "Mechas y Manicura" }
];

function getFutureDateString(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// Turnos agendados con integración directa a Google Calendar
let appointments = [
  {
    id: "apt-101",
    businessId: "biz-1",
    businessName: "Barbería & Estilo King",
    clientName: "David Morales",
    clientPhone: "+34 654 987 321",
    serviceId: "srv-2",
    serviceName: "Corte + Barba",
    price: 24,
    staffId: "stf-1",
    staffName: "Carlos (Barbero)",
    date: getFutureDateString(0), // Hoy
    time: "18:00",
    status: "Confirmado",
    googleCalendarEventId: "gcal-evt-882910",
    googleCalendarSynced: true,
    googleCalendarLink: "https://calendar.google.com",
    reminders: {
      sent24h: true,
      sent2h: false,
      scheduled2hTime: "16:00"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "apt-102",
    businessId: "biz-1",
    businessName: "Barbería & Estilo King",
    clientName: "Marc Valls",
    clientPhone: "+34 611 223 344",
    serviceId: "srv-1",
    serviceName: "Corte de Pelo",
    price: 16,
    staffId: "stf-2",
    staffName: "Javier (Especialista en Barba)",
    date: getFutureDateString(1), // Mañana
    time: "16:30",
    status: "Confirmado",
    googleCalendarEventId: "gcal-evt-882911",
    googleCalendarSynced: true,
    googleCalendarLink: "https://calendar.google.com",
    reminders: {
      sent24h: false,
      sent2h: false,
      scheduled24hTime: "Mañana 10:00"
    },
    createdAt: new Date().toISOString()
  }
];

// Mapeo de conversaciones activas por teléfono
const conversations = new Map();

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
      clean.includes(b.name.toLowerCase()) ||
      clean.includes('barberia') ||
      clean.includes('peluqueria')
    );
  },
  toggleBotStatus: (businessId) => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      biz.botActive = !biz.botActive;
      return biz.botActive;
    }
    return true;
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

  // Disponibilidad de Huecos (Sincronizado con Google Calendar)
  getAvailableDates: (businessId) => {
    const biz = businesses.find(b => b.id === businessId) || businesses[0];
    const availableDates = [];
    let count = 0;
    let dayOffset = 0;

    while (count < 4 && dayOffset < 10) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      const dayOfWeek = d.getDay();
      
      if (biz.workingDays.includes(dayOfWeek)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const label = `${dayNames[dayOfWeek]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;
        
        availableDates.push({
          dateStr,
          label,
          shortDay: dayNames[dayOfWeek],
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
      a.status === 'Confirmado'
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

      // Si es hoy, filtrar horas pasadas
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      if (dateStr === todayStr) {
        const currentMin = now.getHours() * 60 + now.getMinutes();
        if (m <= currentMin + 30) continue;
      }

      if (!bookedTimes.has(timeStr)) {
        slots.push(timeStr);
      }
    }

    return slots;
  },

  // Turnos & Google Calendar Integration
  getAppointments: (businessId) => {
    if (!businessId) return appointments;
    return appointments.filter(a => a.businessId === businessId);
  },
  getAppointmentsByPhone: (phone) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    return appointments.filter(a => a.clientPhone.replace(/[^0-9+]/g, '') === cleanPhone);
  },
  createAppointment: (data) => {
    const biz = businesses.find(b => b.id === data.businessId) || businesses[0];
    
    // Generar evento en Google Calendar
    const googleEventId = `gcal-evt-${Date.now().toString().slice(-6)}`;
    const googleCalendarLink = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(`${data.serviceName} - ${data.clientName}`)}&dates=${data.date.replace(/-/g,'')}T${data.time.replace(':','')}00Z&details=${encodeURIComponent(`Turno agendado por WhatsApp Turnia\nCliente: ${data.clientName}\nTeléfono: ${data.clientPhone}\nServicio: ${data.serviceName} (${data.price} €)`)}&location=${encodeURIComponent(biz.address)}`;

    const newApt = {
      id: `apt-${Date.now().toString().slice(-5)}`,
      businessId: biz.id,
      businessName: biz.name,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      serviceId: data.serviceId,
      serviceName: data.serviceName,
      price: data.price,
      staffId: data.staffId || "stf-3",
      staffName: data.staffName || "Primer barbero libre",
      date: data.date,
      time: data.time,
      status: "Confirmado",
      googleCalendarEventId: googleEventId,
      googleCalendarSynced: true,
      googleCalendarLink,
      reminders: {
        sent24h: false,
        sent2h: false,
        scheduled24hTime: `24h antes (${data.date})`,
        scheduled2hTime: `2h antes (${data.time})`
      },
      createdAt: new Date().toISOString()
    };

    appointments.unshift(newApt);
    return newApt;
  },
  cancelAppointment: (id) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      apt.status = "Cancelado";
      apt.googleCalendarSynced = false;
      return apt;
    }
    return null;
  },

  // Recordatorios simulados
  triggerReminder: (appointmentId, type) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (apt) {
      if (type === '24h') apt.reminders.sent24h = true;
      if (type === '2h') apt.reminders.sent2h = true;
      return apt;
    }
    return null;
  },

  // Sesiones de conversación
  getSession: (userPhone) => {
    return conversations.get(userPhone) || {
      step: 'START',
      businessId: 'biz-1', // Por defecto la barbería
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
