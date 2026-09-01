// Base de datos y capa de persistencia multirubro para TURNIA
// Compatible con Barberías, Talleres Mecánicos, Clínicas Odontológicas y Salones de Belleza

let businesses = [
  {
    id: "biz-1",
    name: "Barbería & Estilo King",
    slug: "barberia-king",
    keyword: "KING",
    category: "Peluquería & Barbería",
    ownerName: "Carlos Méndez",
    email: "carlos@barberaking.es",
    password: "password123",
    phone: "+34 612 345 678",
    address: "Calle Mayor 45, Madrid",
    googleCalendarId: "barberia.king.madrid@gmail.com",
    googleCalendarConnected: true,
    whatsappConnected: true,
    whatsappPhone: "+34 612 345 678",
    welcomeMessage: "¡Hola! Bienvenido a Barbería King 💈. ¿En qué te podemos ayudar?",
    workingDays: [1, 2, 3, 4, 5, 6], // Lun - Sáb
    openHour: 10,
    closeHour: 20,
    slotIntervalMin: 30,
    botActive: true,
    pricingPlan: "PRO",
    subscriptionStatus: "trial", // 'trial' | 'active' | 'expired'
    trialDaysLeft: 14,
    trialEndsAt: "16 Sep 2026",
    monthlyPrice: 39.00
  },
  {
    id: "biz-2",
    name: "Salón Glam Estética",
    slug: "salon-glam",
    keyword: "GLAM",
    category: "Peluquería & Estética",
    ownerName: "Elena Varela",
    email: "elena@salonglam.es",
    password: "password123",
    phone: "+34 699 112 233",
    address: "Rambla de Catalunya 88, Barcelona",
    googleCalendarId: "glam.barcelona.salon@gmail.com",
    googleCalendarConnected: true,
    whatsappConnected: true,
    whatsappPhone: "+34 699 112 233",
    welcomeMessage: "¡Hola! Bienvenida a Salón Glam ✨ ¿Quieres reservar tu cita?",
    workingDays: [2, 3, 4, 5, 6],
    openHour: 9,
    closeHour: 19,
    slotIntervalMin: 45,
    botActive: true,
    pricingPlan: "ESENCIAL",
    subscriptionStatus: "trial",
    trialDaysLeft: 11,
    trialEndsAt: "13 Sep 2026",
    monthlyPrice: 19.50
  },
  {
    id: "biz-3",
    name: "Taller Mecánico & Boxes AutoPro",
    slug: "taller-autopro",
    keyword: "AUTOPRO",
    category: "Taller Mecánico & Autos",
    ownerName: "Marcos Toledo",
    email: "marcos@autoproboxes.es",
    password: "password123",
    phone: "+34 655 443 322",
    address: "Polígono Industrial Sur, Nave 12, Valencia",
    googleCalendarId: "taller.autopro.valencia@gmail.com",
    googleCalendarConnected: true,
    whatsappConnected: true,
    whatsappPhone: "+34 655 443 322",
    welcomeMessage: "¡Hola! Te habla la recepción del Taller AutoPro 🚗🔧. ¿Necesitas agendar un service, revisión o presupuesto?",
    workingDays: [1, 2, 3, 4, 5], // Lun - Vie
    openHour: 8,
    closeHour: 18,
    slotIntervalMin: 60,
    botActive: true,
    pricingPlan: "PRO",
    subscriptionStatus: "trial",
    trialDaysLeft: 15,
    trialEndsAt: "17 Sep 2026",
    monthlyPrice: 39.00
  },
  {
    id: "biz-4",
    name: "Clínica Dental & Odontología Sonrisas",
    slug: "dental-sonrisas",
    keyword: "SONRISAS",
    category: "Clínica Odontológica",
    ownerName: "Dra. Sofía Navarro",
    email: "sofia@dentalsonrisas.es",
    password: "password123",
    phone: "+34 688 776 655",
    address: "Av. Diagonal 420, Barcelona",
    googleCalendarId: "clinica.dental.sonrisas@gmail.com",
    googleCalendarConnected: true,
    whatsappConnected: true,
    whatsappPhone: "+34 688 776 655",
    welcomeMessage: "¡Hola! Gracias por comunicarte con Clínica Dental Sonrisas 🦷✨. ¿Deseas agendar una consulta o tratamiento?",
    workingDays: [1, 2, 3, 4, 5, 6],
    openHour: 9,
    closeHour: 20,
    slotIntervalMin: 30,
    botActive: true,
    pricingPlan: "PRO",
    subscriptionStatus: "active",
    trialDaysLeft: 0,
    trialEndsAt: "Plan Activo",
    monthlyPrice: 39.00
  }
];

let services = [
  // 💈 1. Barbería King
  { id: "srv-1", businessId: "biz-1", name: "Corte de Pelo", durationMin: 30, price: 16, description: "Corte clásico o degradado con lavado y peinado" },
  { id: "srv-2", businessId: "biz-1", name: "Corte + Barba", durationMin: 45, price: 24, description: "Corte completo y arreglo de barba con toalla caliente" },
  { id: "srv-3", businessId: "biz-1", name: "Arreglo de Barba", durationMin: 25, price: 12, description: "Perfilado, toalla caliente y bálsamo hidratante" },
  { id: "srv-4", businessId: "biz-1", name: "Coloración / Mechas", durationMin: 60, price: 35, description: "Matizado, mechas o cambio de color" },

  // ✨ 2. Salón Glam
  { id: "srv-5", businessId: "biz-2", name: "Corte & Brushing", durationMin: 45, price: 28, description: "Lavado hidratante, corte y peinado" },
  { id: "srv-6", businessId: "biz-2", name: "Tratamiento de Keratina", durationMin: 60, price: 65, description: "Nutrición y alisado profesional" },
  { id: "srv-7", businessId: "biz-2", name: "Manicura Semipermanente", durationMin: 45, price: 22, description: "Esmaltado en gel y cuidado de cutículas" },

  // 🚗 3. Taller Mecánico AutoPro
  { id: "srv-8", businessId: "biz-3", name: "Service de Aceite y Filtros", durationMin: 60, price: 85, description: "Cambio de aceite sintético, filtro de aceite, aire y revisión de 25 puntos" },
  { id: "srv-9", businessId: "biz-3", name: "Diagnóstico Computarizado / Scanner", durationMin: 45, price: 40, description: "Escaneo OBD-II de averías, reseteo de testigos de motor y check general" },
  { id: "srv-10", businessId: "biz-3", name: "Revisión Pre-ITV Completa", durationMin: 60, price: 50, description: "Revisión de luces, emisiones, frenos, amortiguadores y holguras" },
  { id: "srv-11", businessId: "biz-3", name: "Cambio de Pastillas de Freno", durationMin: 60, price: 75, description: "Pastillas delanteras o traseras + líquido de frenos" },
  { id: "srv-12", businessId: "biz-3", name: "Alineación y Balanceo 4 Ruedas", durationMin: 45, price: 45, description: "Alineación láser del tren delantero y balanceo de neumáticos" },

  // 🦷 4. Clínica Odontológica Sonrisas
  { id: "srv-13", businessId: "biz-4", name: "Consulta & Diagnóstico General", durationMin: 30, price: 30, description: "Evaluación dental completa + radiografía panorámica digital" },
  { id: "srv-14", businessId: "biz-4", name: "Limpieza Dental con Ultrasonido", durationMin: 45, price: 55, description: "Profilaxis profunda, eliminación de sarro y pulido dental" },
  { id: "srv-15", businessId: "biz-4", name: "Blanqueamiento Dental LED", durationMin: 60, price: 150, description: "Sesión clínica de blanqueamiento con luz fría y gel peroxídico" },
  { id: "srv-16", businessId: "biz-4", name: "Empaste / Obturación Estética", durationMin: 45, price: 60, description: "Eliminación de caries y reconstrucción con composite de alta estética" },
  { id: "srv-17", businessId: "biz-4", name: "Valoración de Ortodoncia / Invisalign", durationMin: 30, price: 40, description: "Estudio digital 3D para alineadores invisibles o brackets" }
];

let staff = [
  { id: "stf-1", businessId: "biz-1", name: "Carlos (Barbero)", specialty: "Cortes modernos y fade" },
  { id: "stf-2", businessId: "biz-1", name: "Javier (Especialista en Barba)", specialty: "Afeitado clásico y navaja" },
  { id: "stf-3", businessId: "biz-1", name: "Primer barbero libre", specialty: "Mayor disponibilidad de huecos" },

  { id: "stf-4", businessId: "biz-2", name: "Lucía (Estilista)", specialty: "Cortes y Peinados" },
  { id: "stf-5", businessId: "biz-2", name: "Elena (Color & Uñas)", specialty: "Mechas y Manicura" },

  { id: "stf-6", businessId: "biz-3", name: "Marcos (Mecánico Jefe)", specialty: "Motores, Inyección y Diagnosis" },
  { id: "stf-7", businessId: "biz-3", name: "Roberto (Especialista en Frenos y Suspensión)", specialty: "Mecánica rápida y revisiones" },
  { id: "stf-8", businessId: "biz-3", name: "Box Disponible", specialty: "Turno asignado automáticamente" },

  { id: "stf-9", businessId: "biz-4", name: "Dra. Sofía Navarro", specialty: "Odontología General y Estética" },
  { id: "stf-10", businessId: "biz-4", name: "Dr. Alejandro Ruiz", specialty: "Ortodoncia e Implantología" },
  { id: "stf-11", businessId: "biz-4", name: "Gabinete Disponible", specialty: "Primer especialista libre" }
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
    businessId: "biz-3",
    businessName: "Taller Mecánico & Boxes AutoPro",
    clientName: "Gustavo Herrera (Seat León 4589-KTL)",
    clientPhone: "+34 622 334 455",
    serviceId: "srv-8",
    serviceName: "Service de Aceite y Filtros",
    price: 85,
    staffId: "stf-6",
    staffName: "Marcos (Mecánico Jefe)",
    date: getFutureDateString(1), // Mañana
    time: "10:00",
    status: "Confirmado",
    googleCalendarEventId: "gcal-evt-882912",
    googleCalendarSynced: true,
    googleCalendarLink: "https://calendar.google.com",
    reminders: {
      sent24h: false,
      sent2h: false,
      scheduled24hTime: "Mañana 08:00"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: "apt-103",
    businessId: "biz-4",
    businessName: "Clínica Dental & Odontología Sonrisas",
    clientName: "Laura Benítez",
    clientPhone: "+34 677 889 900",
    serviceId: "srv-14",
    serviceName: "Limpieza Dental con Ultrasonido",
    price: 55,
    staffId: "stf-9",
    staffName: "Dra. Sofía Navarro",
    date: getFutureDateString(1), // Mañana
    time: "16:00",
    status: "Confirmado",
    googleCalendarEventId: "gcal-evt-882913",
    googleCalendarSynced: true,
    googleCalendarLink: "https://calendar.google.com",
    reminders: {
      sent24h: false,
      sent2h: false,
      scheduled24hTime: "Mañana 14:00"
    },
    createdAt: new Date().toISOString()
  }
];

// Mapeo de conversaciones activas por teléfono
const conversations = new Map();

export const db = {
  // Autenticación de Negocios
  login: (emailOrPhone, password = "") => {
    const clean = (emailOrPhone || "").toLowerCase().trim();
    const found = businesses.find(b => 
      b.email.toLowerCase() === clean || 
      b.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '') ||
      b.slug === clean ||
      b.id === clean
    );

    if (found) {
      return { success: true, business: found };
    }
    // Si no se encuentra pero se envía demo, retorna el primero
    return { success: true, business: businesses[0] };
  },

  activateSubscription: (businessId, plan = "PRO") => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      biz.subscriptionStatus = "active";
      biz.trialDaysLeft = 30;
      biz.pricingPlan = plan;
      biz.trialEndsAt = "Plan Mensual Activo";
      return biz;
    }
    return null;
  },

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
      (clean.includes('taller') || clean.includes('mecanico') || clean.includes('auto') || clean.includes('coche')) && b.id === 'biz-3' ||
      (clean.includes('dental') || clean.includes('dentista') || clean.includes('diente') || clean.includes('muela') || clean.includes('sonrisa') || clean.includes('odontolog')) && b.id === 'biz-4' ||
      (clean.includes('barberia') || clean.includes('barbero') || clean.includes('fade') || clean.includes('pelo')) && b.id === 'biz-1'
    );
  },
  toggleBotStatus: (businessId) => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      biz.botActive = !biz.botActive;
      return biz.botActive;
    }
    return false;
  },
  updateBusiness: (id, data) => {
    const idx = businesses.findIndex(b => b.id === id);
    if (idx !== -1) {
      businesses[idx] = { ...businesses[idx], ...data };
      return businesses[idx];
    }
    return null;
  },
  updateBusinessSchedule: (businessId, scheduleData) => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      if (scheduleData.openHour !== undefined) biz.openHour = Number(scheduleData.openHour);
      if (scheduleData.closeHour !== undefined) biz.closeHour = Number(scheduleData.closeHour);
      if (scheduleData.slotIntervalMin !== undefined) biz.slotIntervalMin = Number(scheduleData.slotIntervalMin);
      if (scheduleData.workingDays !== undefined) biz.workingDays = scheduleData.workingDays;
      return biz;
    }
    return null;
  },
  updateWhatsAppStatus: (businessId, connected, phone = null) => {
    const biz = businesses.find(b => b.id === businessId);
    if (biz) {
      biz.whatsappConnected = connected;
      if (phone) biz.whatsappPhone = phone;
      return biz;
    }
    return null;
  },
  addBusiness: (data) => {
    const newBiz = {
      id: `biz-${Date.now().toString().slice(-4)}`,
      name: data.name || "Nuevo Local",
      slug: (data.name || "local").toLowerCase().replace(/[^a-z0-9]/g, '-'),
      keyword: (data.keyword || data.name || "LOCAL").toUpperCase().slice(0, 8),
      category: data.category || "Peluquería & Barbería",
      ownerName: data.ownerName || "Propietario",
      email: data.email || `contacto@${(data.name || "local").toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      password: data.password || "password123",
      phone: data.phone || "+34 600 000 000",
      address: data.address || "Dirección del local",
      googleCalendarId: data.googleCalendarId || `${(data.name || "local").toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      googleCalendarConnected: Boolean(data.googleCalendarConnected),
      whatsappConnected: false,
      whatsappPhone: data.phone || "+34 600 000 000",
      welcomeMessage: `¡Hola! Bienvenido a ${data.name}. ¿En qué te podemos ayudar?`,
      slotIntervalMin: data.slotIntervalMin || 30,
      botActive: true,
      pricingPlan: "ESENCIAL",
      subscriptionStatus: "trial",
      trialDaysLeft: 15,
      trialEndsAt: "15 Días de Prueba Gratis",
      monthlyPrice: 19.50
    };
    businesses.push(newBiz);
    return newBiz;
  },

  // Gestión SuperAdmin de Negocios
  deleteBusiness: (id) => {
    businesses = businesses.filter(b => b.id !== id);
    services = services.filter(s => s.businessId !== id);
    staff = staff.filter(st => st.businessId !== id);
    appointments = appointments.filter(a => a.businessId !== id);
    return true;
  },
  toggleBusinessSubscriptionStatus: (id, newStatus) => {
    const biz = businesses.find(b => b.id === id);
    if (biz) {
      biz.subscriptionStatus = newStatus;
      if (newStatus === 'suspended') {
        biz.botActive = false;
        biz.whatsappConnected = false;
      }
      return biz;
    }
    return null;
  },
  extendTrialDays: (id, extraDays = 15) => {
    const biz = businesses.find(b => b.id === id);
    if (biz) {
      biz.trialDaysLeft = (biz.trialDaysLeft || 0) + extraDays;
      biz.subscriptionStatus = 'trial';
      return biz;
    }
    return null;
  },
  getPlatformStats: () => {
    const activeTenants = businesses.filter(b => b.subscriptionStatus === 'active');
    const trialTenants = businesses.filter(b => b.subscriptionStatus === 'trial');
    const suspendedTenants = businesses.filter(b => b.subscriptionStatus === 'suspended');
    const mrr = activeTenants.reduce((acc, curr) => acc + (curr.monthlyPrice || 39), 0);

    return {
      totalTenants: businesses.length,
      activeTenantsCount: activeTenants.length,
      trialTenantsCount: trialTenants.length,
      suspendedTenantsCount: suspendedTenants.length,
      monthlyRecurringRevenue: mrr,
      totalAppointmentsProcessed: appointments.length
    };
  },

  // Servicios
  getServices: (businessId) => {
    if (!businessId) return services;
    return services.filter(s => s.businessId === businessId);
  },
  addService: (data) => {
    const newService = {
      id: `srv-${Date.now().toString().slice(-4)}`,
      businessId: data.businessId,
      name: data.name,
      durationMin: Number(data.durationMin) || 30,
      price: Number(data.price) || 15,
      description: data.description || ""
    };
    services.push(newService);
    return newService;
  },
  updateService: (id, data) => {
    const idx = services.findIndex(s => s.id === id);
    if (idx !== -1) {
      services[idx] = {
        ...services[idx],
        ...data,
        price: data.price !== undefined ? Number(data.price) : services[idx].price,
        durationMin: data.durationMin !== undefined ? Number(data.durationMin) : services[idx].durationMin
      };
      return services[idx];
    }
    return null;
  },
  deleteService: (id) => {
    services = services.filter(s => s.id !== id);
    return true;
  },

  // Staff
  getStaff: (businessId) => {
    if (!businessId) return staff;
    return staff.filter(s => s.businessId === businessId);
  },
  addStaff: (data) => {
    const newStaff = {
      id: `stf-${Date.now().toString().slice(-4)}`,
      businessId: data.businessId,
      name: data.name,
      specialty: data.specialty || "General"
    };
    staff.push(newStaff);
    return newStaff;
  },

  // Disponibilidad de fechas y horas
  getAvailableDates: (businessId) => {
    const biz = businesses.find(b => b.id === businessId) || businesses[0];
    const availableDates = [];
    const today = new Date();
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    let dayOffset = 0;
    while (availableDates.length < 5 && dayOffset < 14) {
      const d = new Date();
      d.setDate(today.getDate() + dayOffset);
      const dayIndex = d.getDay();

      if (biz.workingDays.includes(dayIndex)) {
        const dateStr = d.toISOString().split('T')[0];
        const isToday = dayOffset === 0;
        const isTomorrow = dayOffset === 1;

        let label = `${daysOfWeek[dayIndex]} ${d.getDate()} ${months[d.getMonth()]}`;
        if (isToday) label = `Hoy (${label})`;
        else if (isTomorrow) label = `Mañana (${label})`;

        availableDates.push({
          dateStr,
          label,
          shortDay: daysOfWeek[dayIndex],
          isToday,
          isTomorrow
        });
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
      staffId: data.staffId || "stf-1",
      staffName: data.staffName || "Especialista disponible",
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

  // Recordatorios
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
      businessId: 'biz-1',
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
