import { db } from './db.js';

/**
 * Motor conversacional de WhatsApp para TURNIA (Multi-Tenant)
 * @param {string} userPhone - Número de teléfono del cliente (ej. whatsapp:+54911...)
 * @param {string} messageText - Texto enviado por el cliente
 * @param {string} profileName - Nombre de perfil de WhatsApp si está disponible
 * @returns {Promise<{ replyText: string, updatedSession: object }>}
 */
export async function processIncomingMessage(userPhone, messageText = '', profileName = '') {
  const text = (messageText || '').trim();
  const lowerText = text.toLowerCase();
  let session = db.getSession(userPhone);

  // Comando universal de reseteo
  if (['menu', 'inicio', 'cancelar', 'reiniciar', 'salir', '0', 'hola'].includes(lowerText) && session.step !== 'ENTER_NAME') {
    // Si escribió hola con un negocio detectado en el texto
    const detectedBiz = db.getBusinessByKeyword(text);
    if (detectedBiz) {
      session = db.updateSession(userPhone, {
        step: 'BIZ_MAIN_MENU',
        businessId: detectedBiz.id,
        draftAppointment: {}
      });
      return {
        replyText: buildBusinessWelcome(detectedBiz, profileName),
        updatedSession: session
      };
    }
  }

  // Comandos globales: Consulta de mis turnos
  if (lowerText === 'mis turnos' || lowerText === 'consultar turnos') {
    return handleCheckAppointments(userPhone);
  }

  // 1. Si no hay negocio asignado, intentar detectar en el texto
  if (!session.businessId) {
    const detectedBiz = db.getBusinessByKeyword(text);
    if (detectedBiz) {
      session = db.updateSession(userPhone, {
        step: 'BIZ_MAIN_MENU',
        businessId: detectedBiz.id,
        draftAppointment: {}
      });
      return {
        replyText: buildBusinessWelcome(detectedBiz, profileName),
        updatedSession: session
      };
    }

    // Si no detectó ningún negocio, mostrar el directorio de Turnia
    return handleSelectBusinessStep(userPhone, text, profileName);
  }

  // Negocio activo actual
  const currentBiz = db.getBusinessById(session.businessId);
  if (!currentBiz) {
    db.clearSession(userPhone);
    return handleSelectBusinessStep(userPhone, text, profileName);
  }

  // 2. Máquina de Estados por pasos conversacionales
  switch (session.step) {
    case 'SELECT_BUSINESS':
      return handleSelectBusinessStep(userPhone, text, profileName);

    case 'BIZ_MAIN_MENU':
      return handleBizMainMenu(userPhone, currentBiz, text);

    case 'SELECT_SERVICE':
      return handleSelectService(userPhone, currentBiz, text);

    case 'SELECT_STAFF':
      return handleSelectStaff(userPhone, currentBiz, text);

    case 'SELECT_DATE':
      return handleSelectDate(userPhone, currentBiz, text);

    case 'SELECT_TIME':
      return handleSelectTime(userPhone, currentBiz, text);

    case 'ENTER_NAME':
      return handleEnterName(userPhone, currentBiz, text);

    case 'CONFIRM_APPOINTMENT':
      return handleConfirmAppointment(userPhone, currentBiz, text);

    default:
      session = db.updateSession(userPhone, { step: 'BIZ_MAIN_MENU' });
      return {
        replyText: buildBusinessWelcome(currentBiz, profileName),
        updatedSession: session
      };
  }
}

// -------------------------------------------------------------
// MANEJADORES DE CADA PASO
// -------------------------------------------------------------

function buildBusinessWelcome(biz, profileName) {
  const greeting = profileName ? `¡Hola ${profileName}! 👋` : `¡Hola! 👋`;
  return `${greeting}\n` +
    `*${biz.name}* (${biz.category})\n` +
    `📍 ${biz.address}\n\n` +
    `¿En qué podemos ayudarte hoy? Responde con el número de opción:\n\n` +
    `*1️⃣ Agendar un nuevo turno*\n` +
    `*2️⃣ Ver mis turnos activos / Cancelar*\n` +
    `*3️⃣ Horarios y Ubicación*\n` +
    `*4️⃣ Cambiar de comercio/peluquería*\n\n` +
    `_(Escribe *1* para comenzar tu reserva)_`;
}

function handleSelectBusinessStep(userPhone, text, profileName) {
  const businesses = db.getBusinesses();
  const num = parseInt(text);

  if (!isNaN(num) && num >= 1 && num <= businesses.length) {
    const selectedBiz = businesses[num - 1];
    const session = db.updateSession(userPhone, {
      step: 'BIZ_MAIN_MENU',
      businessId: selectedBiz.id,
      draftAppointment: {}
    });
    return {
      replyText: buildBusinessWelcome(selectedBiz, profileName),
      updatedSession: session
    };
  }

  // Lista de comercios
  let reply = `🤖 *¡Bienvenido a TURNIA!* Asistente de turnos por WhatsApp.\n\n` +
    `Por favor, selecciona el comercio donde deseas tu turno enviando el número:\n\n`;

  businesses.forEach((b, idx) => {
    reply += `*${idx + 1}️⃣ ${b.name}* (${b.category})\n`;
  });

  reply += `\n_Responde con el número de tu opción (ej. 1)_`;

  const session = db.updateSession(userPhone, { step: 'SELECT_BUSINESS' });
  return { replyText: reply, updatedSession: session };
}

function handleBizMainMenu(userPhone, biz, text) {
  const option = text.trim();

  if (option === '1' || option.toLowerCase().includes('agendar') || option.toLowerCase().includes('turno')) {
    // Iniciar flujo de agendamiento -> Mostrar servicios
    const services = db.getServices(biz.id);
    let reply = `📋 *Servicios disponibles en ${biz.name}:*\n\n`;

    services.forEach((srv, idx) => {
      reply += `*${idx + 1}️⃣ ${srv.name}*\n` +
        `   ⏱️ ${srv.durationMin} min | 💲$${srv.price.toLocaleString('es-AR')}\n` +
        `   _${srv.description}_\n\n`;
    });

    reply += `_Envía el número del servicio que deseas agendar (ej. 1)._`;

    const session = db.updateSession(userPhone, { step: 'SELECT_SERVICE' });
    return { replyText: reply, updatedSession: session };
  }

  if (option === '2' || option.toLowerCase().includes('mis turnos')) {
    return handleCheckAppointments(userPhone, biz);
  }

  if (option === '3' || option.toLowerCase().includes('ubicacion') || option.toLowerCase().includes('horarios')) {
    const openDays = "Lunes a Sábado";
    return {
      replyText: `📍 *Información de ${biz.name}:*\n\n` +
        `🏢 *Dirección:* ${biz.address}\n` +
        `🕒 *Horario:* ${openDays} de ${biz.openHour}:00 a ${biz.closeHour}:00 hs\n` +
        `📞 *Teléfono:* ${biz.phone}\n\n` +
        `_Escribe *1* para agendar un turno o *0* para volver al menú._`,
      updatedSession: db.getSession(userPhone)
    };
  }

  if (option === '4' || option.toLowerCase().includes('cambiar')) {
    db.clearSession(userPhone);
    return handleSelectBusinessStep(userPhone, '', '');
  }

  return {
    replyText: `⚠️ Opción no reconocida. Por favor responde:\n*1* para agendar turno\n*2* para ver tus turnos\n*3* para horarios y ubicación\n*4* para cambiar de local`,
    updatedSession: db.getSession(userPhone)
  };
}

function handleSelectService(userPhone, biz, text) {
  const services = db.getServices(biz.id);
  const num = parseInt(text);

  if (isNaN(num) || num < 1 || num > services.length) {
    return {
      replyText: `⚠️ Por favor envía un número válido del *1* al *${services.length}* correspondiente al servicio.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  const selectedService = services[num - 1];
  const staffList = db.getStaff(biz.id);

  let reply = `✅ Seleccionaste: *${selectedService.name}* ($${selectedService.price.toLocaleString('es-AR')})\n\n` +
    `👤 *¿Con qué profesional deseas atenderte?*\n\n`;

  staffList.forEach((st, idx) => {
    reply += `*${idx + 1}️⃣ ${st.name}*\n   _${st.specialty}_\n`;
  });

  reply += `\n_Envía el número de tu preferencia (ej. 1)_`;

  const session = db.updateSession(userPhone, {
    step: 'SELECT_STAFF',
    draftAppointment: {
      businessId: biz.id,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      durationMin: selectedService.durationMin
    }
  });

  return { replyText: reply, updatedSession: session };
}

function handleSelectStaff(userPhone, biz, text) {
  const staffList = db.getStaff(biz.id);
  const num = parseInt(text);

  if (isNaN(num) || num < 1 || num > staffList.length) {
    return {
      replyText: `⚠️ Por favor responde con un número del *1* al *${staffList.length}*.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  const selectedStaff = staffList[num - 1];
  const availableDates = db.getAvailableDates(biz.id);

  let reply = `👤 Profesional: *${selectedStaff.name}*\n\n` +
    `📅 *Selecciona el día para tu turno:*\n\n`;

  availableDates.forEach((d, idx) => {
    const tag = d.isToday ? ' (HOY)' : d.isTomorrow ? ' (MAÑANA)' : '';
    reply += `*${idx + 1}️⃣ ${d.label}${tag}*\n`;
  });

  reply += `\n_Envía el número del día que prefieras (ej. 1)_`;

  const currentDraft = db.getSession(userPhone).draftAppointment || {};
  const session = db.updateSession(userPhone, {
    step: 'SELECT_DATE',
    draftAppointment: {
      ...currentDraft,
      staffId: selectedStaff.id,
      staffName: selectedStaff.name
    }
  });

  return { replyText: reply, updatedSession: session };
}

function handleSelectDate(userPhone, biz, text) {
  const availableDates = db.getAvailableDates(biz.id);
  const num = parseInt(text);

  if (isNaN(num) || num < 1 || num > availableDates.length) {
    return {
      replyText: `⚠️ Opción inválida. Elige un número del *1* al *${availableDates.length}*.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  const selectedDate = availableDates[num - 1];
  const currentDraft = db.getSession(userPhone).draftAppointment || {};

  // Calcular horarios disponibles para esa fecha
  const slots = db.getAvailableSlots(biz.id, selectedDate.dateStr, currentDraft.serviceId, currentDraft.staffId);

  if (slots.length === 0) {
    return {
      replyText: `😔 Lo sentimos, no quedan horarios libres para el día *${selectedDate.label}*. Por favor elige otra fecha enviando otro número o escribe *0* para reiniciar.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  let reply = `📅 Día: *${selectedDate.label}*\n\n` +
    `🕒 *Horarios disponibles:*\n\n`;

  slots.forEach((s, idx) => {
    reply += `*${idx + 1}️⃣ ${s} hs*\n`;
  });

  reply += `\n_Envía el número del horario deseado (ej. 1)_`;

  const session = db.updateSession(userPhone, {
    step: 'SELECT_TIME',
    availableSlotsTemp: slots,
    draftAppointment: {
      ...currentDraft,
      date: selectedDate.dateStr,
      dateLabel: selectedDate.label
    }
  });

  return { replyText: reply, updatedSession: session };
}

function handleSelectTime(userPhone, biz, text) {
  const session = db.getSession(userPhone);
  const slots = session.availableSlotsTemp || [];
  const num = parseInt(text);

  if (isNaN(num) || num < 1 || num > slots.length) {
    return {
      replyText: `⚠️ Por favor envía el número de uno de los horarios mostrados (1 a ${slots.length}).`,
      updatedSession: session
    };
  }

  const selectedTime = slots[num - 1];
  const currentDraft = session.draftAppointment || {};

  const reply = `🕒 Horario: *${selectedTime} hs*\n\n` +
    `✍️ *Por favor, escribe tu Nombre y Apellido para registrar la reserva:*`;

  const updated = db.updateSession(userPhone, {
    step: 'ENTER_NAME',
    draftAppointment: {
      ...currentDraft,
      time: selectedTime
    }
  });

  return { replyText: reply, updatedSession: updated };
}

function handleEnterName(userPhone, biz, text) {
  const clientName = text.trim();

  if (clientName.length < 2) {
    return {
      replyText: `⚠️ Por favor ingresa un nombre válido para la reserva.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  const session = db.getSession(userPhone);
  const draft = {
    ...session.draftAppointment,
    clientName,
    clientPhone: userPhone
  };

  let reply = `📋 *Resumen de tu Turno en ${biz.name}:*\n` +
    `────────────────────────\n` +
    `👤 *Cliente:* ${draft.clientName}\n` +
    `✂️ *Servicio:* ${draft.serviceName}\n` +
    `💈 *Profesional:* ${draft.staffName}\n` +
    `📅 *Fecha:* ${draft.dateLabel || draft.date}\n` +
    `🕒 *Hora:* ${draft.time} hs\n` +
    `💲 *Total:* $${draft.price.toLocaleString('es-AR')}\n` +
    `📍 *Dirección:* ${biz.address}\n` +
    `────────────────────────\n\n` +
    `¿Confirmas tu turno?\n` +
    `*1️⃣ Sí, confirmar turno ✅*\n` +
    `*2️⃣ Cancelar y reiniciar ❌*`;

  const updated = db.updateSession(userPhone, {
    step: 'CONFIRM_APPOINTMENT',
    draftAppointment: draft
  });

  return { replyText: reply, updatedSession: updated };
}

function handleConfirmAppointment(userPhone, biz, text) {
  const option = text.trim();
  const session = db.getSession(userPhone);
  const draft = session.draftAppointment;

  if (option === '1' || option.toLowerCase().includes('si') || option.toLowerCase().includes('confirmar')) {
    // Crear el turno formalmente en la base de datos
    const created = db.createAppointment({
      businessId: biz.id,
      clientName: draft.clientName,
      clientPhone: userPhone,
      serviceId: draft.serviceId,
      serviceName: draft.serviceName,
      price: draft.price,
      staffId: draft.staffId,
      staffName: draft.staffName,
      date: draft.date,
      time: draft.time
    });

    db.clearSession(userPhone);

    const reply = `🎉 *¡TURNO CONFIRMADO CON ÉXITO!* 🎉\n\n` +
      `🔖 *Código de Reserva:* \`${created.id}\`\n` +
      `🏢 *Comercio:* ${biz.name}\n` +
      `👤 *Cliente:* ${created.clientName}\n` +
      `✂️ *Servicio:* ${created.serviceName}\n` +
      `💈 *Profesional:* ${created.staffName}\n` +
      `📅 *Fecha:* ${draft.dateLabel || created.date}\n` +
      `🕒 *Horario:* ${created.time} hs\n` +
      `📍 *Ubicación:* ${biz.address}\n\n` +
      `Te esperamos puntual. Si necesitas cancelar o reprogramar, solo escribe *"Mis turnos"* en este chat.\n\n` +
      `_¡Gracias por reservar con TURNIA!_ ✨`;

    return { replyText: reply, updatedSession: { step: 'COMPLETED' } };
  }

  if (option === '2' || option.toLowerCase().includes('no') || option.toLowerCase().includes('cancelar')) {
    db.clearSession(userPhone);
    return {
      replyText: `❌ Reserva cancelada. Escribe *Hola* cuando quieras agendar nuevamente.`,
      updatedSession: { step: 'CANCELLED' }
    };
  }

  return {
    replyText: `⚠️ Responde *1* para confirmar el turno o *2* para cancelar.`,
    updatedSession: session
  };
}

function handleCheckAppointments(userPhone, currentBiz = null) {
  const list = db.getAppointmentsByPhone(userPhone).filter(a => a.status === 'Confirmado');

  if (list.length === 0) {
    return {
      replyText: `ℹ️ No tienes turnos activos registrados a tu nombre.\n\n` +
        `_Escribe *1* o el nombre del comercio para agendar tu primer turno._`,
      updatedSession: db.getSession(userPhone)
    };
  }

  let reply = `📋 *Tus Turnos Activos:* \n\n`;
  list.forEach((a, idx) => {
    reply += `*${idx + 1}.* ✂️ *${a.serviceName}* en *${a.businessName}*\n` +
      `   📅 ${a.date} a las ${a.time} hs con ${a.staffName}\n` +
      `   🔖 Código: \`${a.id}\`\n\n`;
  });

  reply += `Si deseas cancelar alguno de tus turnos, envía: *CANCELAR [Código]* (ej: \`CANCELAR ${list[0].id}\`).\n` +
    `_O escribe *0* para volver al menú._`;

  return {
    replyText: reply,
    updatedSession: db.getSession(userPhone)
  };
}
