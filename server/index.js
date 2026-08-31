import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import { processIncomingMessage } from './botEngine.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// 1. WEBHOOK OFICIAL DE TWILIO (WHATSAPP INBOUND)
// -------------------------------------------------------------
/**
 * Twilio llama a este endpoint cuando cualquier usuario envía un mensaje
 * al número central de WhatsApp.
 */
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const userPhone = req.body.From || req.body.from || 'whatsapp:+5491100000000';
    const messageText = req.body.Body || req.body.body || '';
    const profileName = req.body.ProfileName || req.body.profileName || '';

    console.log(`[Twilio Webhook Inbound] From: ${userPhone} | Text: "${messageText}"`);

    // Procesar a través del motor conversacional de TURNIA
    const { replyText } = await processIncomingMessage(userPhone, messageText, profileName);

    // Responder con TwiML (XML que Twilio interpreta para enviar la respuesta por WhatsApp)
    res.set('Content-Type', 'text/xml');
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(replyText)}</Message>
</Response>`;

    return res.status(200).send(twimlResponse);
  } catch (error) {
    console.error('[Twilio Webhook Error]', error);
    res.set('Content-Type', 'text/xml');
    return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>Lo sentimos, ocurrió un error momentáneo. Por favor escribe *Hola* para reintentar.</Message></Response>`);
  }
});

// Helper para escapar caracteres especiales en TwiML XML
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// -------------------------------------------------------------
// 2. SIMULADOR EN VIVO (Para probar en el navegador sin Twilio)
// -------------------------------------------------------------
app.post('/api/bot/chat-simulate', async (req, res) => {
  try {
    const { userPhone = 'whatsapp:+5491198765432', messageText = '', profileName = 'Usuario Demo' } = req.body;
    const { replyText, updatedSession } = await processIncomingMessage(userPhone, messageText, profileName);

    return res.json({
      success: true,
      replyText,
      session: updatedSession
    });
  } catch (error) {
    console.error('[Simulate Error]', error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/bot/reset-session', (req, res) => {
  const { userPhone = 'whatsapp:+5491198765432' } = req.body;
  db.clearSession(userPhone);
  return res.json({ success: true, message: "Sesión reiniciada" });
});

// -------------------------------------------------------------
// 3. API REST PARA EL DASHBOARD DE NEGOCIOS
// -------------------------------------------------------------

// Listar comercios / Negocios
app.get('/api/businesses', (req, res) => {
  res.json(db.getBusinesses());
});

app.post('/api/businesses', (req, res) => {
  const newBiz = db.addBusiness(req.body);
  res.status(201).json(newBiz);
});

// Servicios
app.get('/api/services', (req, res) => {
  const { businessId } = req.query;
  res.json(db.getServices(businessId));
});

app.post('/api/services', (req, res) => {
  const srv = db.addService(req.body);
  res.status(201).json(srv);
});

app.delete('/api/services/:id', (req, res) => {
  db.deleteService(req.params.id);
  res.json({ success: true });
});

// Staff / Profesionales
app.get('/api/staff', (req, res) => {
  const { businessId } = req.query;
  res.json(db.getStaff(businessId));
});

// Turnos agendados
app.get('/api/appointments', (req, res) => {
  const { businessId } = req.query;
  res.json(db.getAppointments(businessId));
});

app.post('/api/appointments/:id/cancel', (req, res) => {
  const cancelled = db.cancelAppointment(req.params.id);
  if (cancelled) {
    res.json({ success: true, appointment: cancelled });
  } else {
    res.status(404).json({ error: "Turno no encontrado" });
  }
});

// Estadísticas para el Dashboard
app.get('/api/stats', (req, res) => {
  const appointments = db.getAppointments();
  const todayStr = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(a => a.date === todayStr && a.status === 'Confirmado');
  const totalRevenue = appointments
    .filter(a => a.status === 'Confirmado')
    .reduce((acc, curr) => acc + (curr.price || 0), 0);

  res.json({
    totalAppointments: appointments.length,
    confirmedAppointments: appointments.filter(a => a.status === 'Confirmado').length,
    todayAppointments: todayAppointments.length,
    totalRevenue,
    totalBusinesses: db.getBusinesses().length
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor TURNIA y Webhook Twilio activo en http://localhost:${PORT}`);
  console.log(`🔗 Webhook Twilio endpoint: http://localhost:${PORT}/api/whatsapp/webhook`);
});
