# 💈 TURNIA — Plataforma Multi-Tenant de Turnos por WhatsApp (Twilio)

> **Sistema SaaS para que múltiples peluquerías, barberías, consultorios y centros de estética atiendan y agenden turnos automáticamente a través de un único número central de WhatsApp en Twilio.**

---

## 🎯 ¿Cómo funciona el modelo de Número Central de Twilio?

1. **Un solo número de WhatsApp (Twilio):**
   - TURNIA opera con un único número oficial de WhatsApp (ej. `+1 415 523 8886` en Sandbox o un número propio verificado).
2. **Identificación del Comercio (Multi-Tenant):**
   - Cada peluquería o negocio recibe un enlace personalizado (`https://wa.me/NUMERO?text=Hola,%20quiero%20un%20turno%20en%20Barberia%20King`) y un código QR.
   - Cuando el cliente hace clic o escanea el QR, WhatsApp abre el chat enviando ese mensaje predeterminado.
   - El motor de TURNIA detecta el comercio, inicia la sesión de ese local y le presenta su catálogo de servicios, precios y horarios libres.
3. **Flujo de Agendamiento 100% Automatizado:**
   - Selección de Servicio ➔ Elección de Profesional ➔ Día y Horario libre ➔ Nombre del cliente ➔ Confirmación instantánea y guardado en la base de datos.
   - Consulta y cancelación de turnos con el comando `Mis turnos`.

---

## 🚀 Estructura del Proyecto

```text
turnia/
├── server/
│   ├── index.js                # Servidor Express & Webhook de Twilio (/api/whatsapp/webhook)
│   ├── botEngine.js            # Máquina de estados conversacional interactiva
│   └── db.js                   # Base de datos de comercios, servicios, staff y turnos
├── src/
│   ├── components/
│   │   ├── WhatsAppSimulator.jsx   # Emulador interactivo de chat móvil en tiempo real
│   │   ├── AppointmentsCalendar.jsx# Agenda visual de turnos agendados
│   │   ├── ServicesManager.jsx     # CRUD de servicios, duraciones y precios
│   │   ├── QrLinkGenerator.jsx     # Generador de enlaces wa.me y códigos QR
│   │   └── TwilioSettings.jsx      # Guía y probador de Webhook de Twilio
│   ├── App.jsx                 # Dashboard principal con métricas y navegación
│   └── index.css               # Estilos glassmorphism y patrón WhatsApp
├── package.json
└── vite.config.js
```

---

## 💻 Instalación y Ejecución

### 1. Instalar dependencias
```bash
cd turnia
npm install
```

### 2. Iniciar en Desarrollo
Para levantar el frontend interactivo con el simulador:
```bash
npm run dev
```
Abre en tu navegador `http://localhost:5174`.

Para levantar el servidor backend de Webhooks de Twilio:
```bash
npm run server
```
El servidor escuchará en `http://localhost:3001` con el endpoint de Webhook en `http://localhost:3001/api/whatsapp/webhook`.

---

## 🔑 Configuración en Twilio Console

1. Entra a [console.twilio.com](https://console.twilio.com).
2. Ve a **Messaging > Try it out > Send a WhatsApp message** (Sandbox) o a **WhatsApp Senders** (Producción).
3. En el campo **"When a message comes in"**, pega la URL de tu Webhook con método `HTTP POST`:
   `https://tu-dominio.com/api/whatsapp/webhook` (o tu URL de Ngrok en local).
