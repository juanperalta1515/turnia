import { db } from './db.js';

/**
 * Motor conversacional de TURNIA - Marca Blanca (La recepcionista invisible)
 * El cliente no sabe que habla con Turnia; la barbería o peluquería le responde como siempre.
 */
export async function processIncomingMessage(userPhone, messageText = '', profileName = '') {
  const text = (messageText || '').trim();
  const lowerText = text.toLowerCase();
  let session = db.getSession(userPhone);

  // 1. Identificar el comercio (por defecto Barbería King o detectado en el texto)
  const detectedBiz = db.getBusinessByKeyword(text) || db.getBusinessById(session.businessId || 'biz-1');
  const currentBiz = detectedBiz || db.getBusinesses()[0];

  // Si el dueño pausó el bot para intervenir manualmente
  if (!currentBiz.botActive) {
    return {
      replyText: `[Modo Manual Activo: El barbero te responderá personalmente en unos instantes...]`,
      updatedSession: session
    };
  }

  // Comandos de consulta de citas
  if (lowerText === 'mis citas' || lowerText === 'mis turnos' || lowerText === 'consultar') {
    return handleCheckAppointments(userPhone, currentBiz);
  }

  // Reiniciar
  if (['cancelar', 'reiniciar', 'inicio', 'menu', '0'].includes(lowerText)) {
    db.clearSession(userPhone);
    session = db.updateSession(userPhone, { step: 'READY', businessId: currentBiz.id, draftAppointment: {} });
    return {
      replyText: `¡Hola! 👋 Te habla la agenda de *${currentBiz.name}*.\n\n¿En qué te puedo ayudar hoy? Escribe qué servicio buscas (ej. *corte*, *corte y barba*) o escribe *1* para ver todos los servicios.`,
      updatedSession: session
    };
  }

  // 2. PARSER DE LENGUAJE NATURAL (Ejemplo Diapositiva 5)
  // Detecta peticiones como: "Hola, ¿queda hueco mañana por la tarde para corte y barba?"
  const isAskingSlot = lowerText.includes('hueco') || lowerText.includes('turno') || lowerText.includes('cita') || lowerText.includes('hora') || lowerText.includes('mañana') || lowerText.includes('hoy') || lowerText.includes('tarde') || lowerText.includes('corte');

  if (session.step === 'START' || session.step === 'READY') {
    // Deducir servicio solicitado
    const services = db.getServices(currentBiz.id);
    let matchedService = services.find(s => lowerText.includes(s.name.toLowerCase()));
    
    if (!matchedService) {
      if (lowerText.includes('corte') && lowerText.includes('barba')) {
        matchedService = services.find(s => s.name.toLowerCase().includes('barba') && s.name.toLowerCase().includes('corte'));
      } else if (lowerText.includes('barba')) {
        matchedService = services.find(s => s.name.toLowerCase().includes('barba'));
      } else if (lowerText.includes('corte') || lowerText.includes('pelo')) {
        matchedService = services.find(s => s.name.toLowerCase().includes('corte'));
      }
    }

    if (!matchedService) {
      matchedService = services[0]; // Corte por defecto
    }

    // Deducir día (mañana o hoy)
    const dates = db.getAvailableDates(currentBiz.id);
    let targetDate = dates[0]; // Hoy o próximo día
    if (lowerText.includes('mañana') && dates.length > 1) {
      targetDate = dates.find(d => d.isTomorrow) || dates[1];
    }

    // Obtener huecos reales de Google Calendar
    const slots = db.getAvailableSlots(currentBiz.id, targetDate.dateStr, matchedService.id);
    const topSlots = slots.slice(0, 3);

    if (topSlots.length > 0) {
      const slotsFormatted = topSlots.map((s, i) => `*${s}*`).join('   ');
      
      const sessionUpdated = db.updateSession(userPhone, {
        step: 'AWAITING_TIME_CHOICE',
        businessId: currentBiz.id,
        availableSlotsTemp: topSlots,
        draftAppointment: {
          businessId: currentBiz.id,
          serviceId: matchedService.id,
          serviceName: matchedService.name,
          price: matchedService.price,
          durationMin: matchedService.durationMin,
          date: targetDate.dateStr,
          dateLabel: targetDate.isToday ? 'hoy' : targetDate.isTomorrow ? 'mañana' : targetDate.label,
          clientName: profileName || 'Cliente'
        }
      });

      const dayWord = targetDate.isToday ? 'hoy' : targetDate.isTomorrow ? 'mañana' : `el ${targetDate.shortDay}`;
      return {
        replyText: `¡Hola! 👋 Te puedo ofrecer ${dayWord} para *${matchedService.name}*:\n\n👉  ${slotsFormatted}\n\n¿Cuál de estos te va mejor? Escribe la hora que prefieras (ej. *${topSlots[0]}*).`,
        updatedSession: sessionUpdated
      };
    }
  }

  // 3. SELECCIÓN DE HORA / CONFIRMACIÓN INMEDIATA
  if (session.step === 'AWAITING_TIME_CHOICE') {
    const draft = session.draftAppointment || {};
    const slots = session.availableSlotsTemp || ['16:30', '18:00', '19:15'];
    
    // Buscar si el texto contiene alguna hora (ej. "18:00", "18", "a las 18:00 me va bien", "1")
    let chosenTime = slots.find(s => text.includes(s) || text.includes(s.split(':')[0]));
    
    const num = parseInt(text);
    if (!chosenTime && !isNaN(num) && num >= 1 && num <= slots.length) {
      chosenTime = slots[num - 1];
    }

    if (!chosenTime) {
      // Si escribió una hora libre directa
      const allSlots = db.getAvailableSlots(currentBiz.id, draft.date);
      chosenTime = allSlots.find(s => text.includes(s));
    }

    if (chosenTime) {
      // Si no tenemos el nombre aún
      if (!draft.clientName || draft.clientName === 'Cliente') {
        const sessionUpdated = db.updateSession(userPhone, {
          step: 'AWAITING_NAME',
          draftAppointment: { ...draft, time: chosenTime }
        });
        return {
          replyText: `Genial, a las *${chosenTime} hs*. ¿A nombre de quién dejamos la reserva?`,
          updatedSession: sessionUpdated
        };
      }

      // Crear el turno directamente y bloquear en Google Calendar
      const created = db.createAppointment({
        businessId: currentBiz.id,
        clientName: draft.clientName,
        clientPhone: userPhone,
        serviceId: draft.serviceId,
        serviceName: draft.serviceName,
        price: draft.price,
        staffId: draft.staffId || 'stf-3',
        staffName: draft.staffName || 'Primer barbero libre',
        date: draft.date,
        time: chosenTime
      });

      db.clearSession(userPhone);

      return {
        replyText: `Perfecto, te reservo ${draft.dateLabel || 'para esa fecha'} a las *${chosenTime} hs*.\n` +
          `✂️ *${draft.serviceName}* — *${draft.price} €*\n` +
          `📍 *${currentBiz.address}*\n` +
          `📅 _(Bloqueado automáticamente en Google Calendar)_\n\n` +
          `Te escribo 24h antes para confirmar 👌`,
        updatedSession: { step: 'COMPLETED' }
      };
    }
  }

  // 4. INGRESO DE NOMBRE
  if (session.step === 'AWAITING_NAME') {
    const clientName = text.trim();
    const draft = session.draftAppointment || {};

    const created = db.createAppointment({
      businessId: currentBiz.id,
      clientName: clientName,
      clientPhone: userPhone,
      serviceId: draft.serviceId,
      serviceName: draft.serviceName,
      price: draft.price,
      staffId: draft.staffId || 'stf-3',
      staffName: draft.staffName || 'Primer barbero libre',
      date: draft.date,
      time: draft.time
    });

    db.clearSession(userPhone);

    return {
      replyText: `¡Listo ${clientName}! Queda reservado ${draft.dateLabel || 'tu turno'} a las *${draft.time} hs*.\n` +
        `✂️ *${draft.serviceName}* — *${draft.price} €*\n` +
        `📍 *${currentBiz.address}*\n` +
        `📅 _(Añadido a Google Calendar)_\n\n` +
        `Te escribo 24h antes para confirmar 👌`,
      updatedSession: { step: 'COMPLETED' }
    };
  }

  // 5. FLUJO ESTRUCTURADO (Si el usuario prefiere números y menús)
  return handleStructuredMenu(userPhone, currentBiz, text, profileName);
}

function handleStructuredMenu(userPhone, biz, text, profileName) {
  const services = db.getServices(biz.id);
  const num = parseInt(text);

  if (!isNaN(num) && num >= 1 && num <= services.length) {
    const selectedSrv = services[num - 1];
    const dates = db.getAvailableDates(biz.id);
    const slots = db.getAvailableSlots(biz.id, dates[0].dateStr, selectedSrv.id);
    const topSlots = slots.slice(0, 3);

    const sessionUpdated = db.updateSession(userPhone, {
      step: 'AWAITING_TIME_CHOICE',
      businessId: biz.id,
      availableSlotsTemp: topSlots,
      draftAppointment: {
        businessId: biz.id,
        serviceId: selectedSrv.id,
        serviceName: selectedSrv.name,
        price: selectedSrv.price,
        date: dates[0].dateStr,
        dateLabel: dates[0].label,
        clientName: profileName || 'Cliente'
      }
    });

    return {
      replyText: `Elegiste *${selectedSrv.name}* (${selectedSrv.price} €).\n\n` +
        `Tenemos disponibles los siguientes huecos:\n` +
        topSlots.map((s, i) => `*${i + 1}️⃣ ${s} hs*`).join('\n') +
        `\n\n_Escribe el número o la hora deseada (ej. ${topSlots[0]})._`,
      updatedSession: sessionUpdated
    };
  }

  // Menú por defecto
  let reply = `¡Hola! Te habla la agenda de *${biz.name}* 💈\n\n` +
    `Dime qué servicio buscas o responde con el número:\n\n`;

  services.forEach((srv, i) => {
    reply += `*${i + 1}️⃣ ${srv.name}* — ${srv.price} € (${srv.durationMin} min)\n`;
  });

  reply += `\n_O escribe por ejemplo: "Hola, ¿queda hueco mañana para corte?"_`;

  const session = db.updateSession(userPhone, { step: 'READY', businessId: biz.id });
  return { replyText: reply, updatedSession: session };
}

function handleCheckAppointments(userPhone, biz) {
  const list = db.getAppointmentsByPhone(userPhone).filter(a => a.status === 'Confirmado');

  if (list.length === 0) {
    return {
      replyText: `No tienes citas activas registradas en *${biz.name}*.\n\nEscribe *"Hola"* o el servicio que buscas para agendar una cita.`,
      updatedSession: db.getSession(userPhone)
    };
  }

  let reply = `📋 *Tus Citas en ${biz.name}:*\n\n`;
  list.forEach((a, idx) => {
    reply += `*${idx + 1}.* ✂️ *${a.serviceName}*\n` +
      `   📅 Fecha: ${a.date} a las *${a.time} hs*\n` +
      `   🔖 Código de cita: \`${a.id}\`\n\n`;
  });

  reply += `Si necesitas cancelar, escribe *CANCELAR ${list[0].id}* o avísanos por este chat.`;

  return { replyText: reply, updatedSession: db.getSession(userPhone) };
}
