# 🚀 TURNIA — Plataforma SaaS de Agendamiento Automático por WhatsApp & Google Calendar

<div align="center">

![Turnia Banner](https://img.shields.io/badge/TURNIA-SaaS%20WhatsApp%20Platform-059669?style=for-the-badge&logo=whatsapp&logoColor=white)
![Multi-Tenant](https://img.shields.io/badge/Architecture-Multi--Tenant%20Isolated-7c3aed?style=for-the-badge)
![Free Trial](https://img.shields.io/badge/Trial-15%20Días%20Gratis-amber?style=for-the-badge)
![Google Calendar](https://img.shields.io/badge/Google%20Calendar-Auto--Sync-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)

**"Tu agenda de WhatsApp responde sola."**
*La recepcionista inteligente para Barberías, Talleres Mecánicos, Clínicas Dentales y Centros de Estética.*

</div>

---

## 🌟 Descripción General

**TURNIA** es una solución SaaS integral diseñada para automatizar la atención de clientes y el agendamiento de citas a través de **WhatsApp** sin necesidad de intermediarios costosos como Twilio. 

Los clientes escriben directamente al número de WhatsApp habitual del negocio y el bot inteligente responde en segundos con respuestas predeterminadas, consulta la disponibilidad real, agenda el turno en **Google Calendar** y envía recordatorios automáticos (24h y 2h antes) para reducir las ausencias (*no-shows*) hasta en un 70%.

---

## ✨ Funcionalidades Principales

### 1. 📲 Conexión WhatsApp Directa vía QR (Sin Twilio)
- **Cero Costes por Mensaje:** Conexión nativa mediante escaneo de código QR (estilo WhatsApp Web) por cada comercio.
- **Número Propio:** El negocio utiliza su número de WhatsApp de toda la vida. Los clientes nunca se enteran de que un software de terceros gestiona las citas.
- **Detección Automática de Sesión:** Manejo de reconexiones automáticas e indicadores de estado en tiempo real.

### 2. 📅 Sincronización Automática con Google Calendar
- **Bloqueo Instantáneo:** Cada turno confirmado en WhatsApp crea automáticamente un evento en el Google Calendar del comercio.
- **Datos Detallados:** Incluye nombre del cliente, número de teléfono, servicio solicitado, precio y profesional asignado.
- **Guía de Integración Paso a Paso:** Asistente interactivo de 5 minutos para conectar cuentas de Google Calendar.

### 3. ⏰ Sistema de Recordatorios Anti-Ausencias (-70% No-Shows)
- **Recordatorio 24 Horas Antes:** Mensaje automático de confirmación con detalles del turno.
- **Recordatorio 2 Horas Antes:** Aviso de última hora con opción rápida de confirmación o cancelación.
- **Liberación de Huecos:** Si un cliente cancela desde el recordatorio, el horario se libera automáticamente en el calendario para otro cliente.

### 4. 💈 Multirubro (Barberías, Talleres, Clínicas y Estética)
- **Barberías & Peluquerías:** Cortes fade, barba, peinados y tintes con selección de barbero.
- **Talleres Mecánicos & Boxes:** Cambio de aceite, revisión pre-ITV, diagnosis y frenos.
- **Clínicas Odontológicas:** Limpieza dental, revisión general, blanqueamiento y brackets.
- **Centros de Estética:** Manicura, tratamientos faciales, depilación láser y masajes.

### 5. ⚙️ Gestor de Horarios, Días Laborables y Precios
- **Días de Atención Personalizables:** Selección de días laborables activos (ej. Lunes a Sábado).
- **Horario de Apertura y Cierre:** Rango horario continuo o configurable.
- **Frecuencia / Intervalos de Citas:** Bloques de 15, 30, 45 o 60 minutos.
- **Catálogo de Servicios CRUD:** Alta, edición y eliminación de servicios con precios y duraciones.

### 6. 🎁 Periodo de Prueba de 15 Días 100% Gratis + Suscripción Mensual
- **Onboarding sin Fricción:** 15 días completos de prueba sin necesidad de ingresar tarjeta de crédito.
- **Planes Claros:**
  - **Plan Esencial:** 19,50 € / mes (50% dto. lanzamiento) / 39 € estándar.
  - **Plan Pro:** 39,50 € / mes (50% dto. lanzamiento) / 79 € estándar.
- **Pasarela de Activación:** Contador de días restantes en el Dashboard y botón de cobro mensual con 1 clic.

### 7. 🔒 Aislamiento de Datos Multi-Tenant (Seguridad y Privacidad)
- **Privacidad Total:** Cada cliente accede únicamente a los datos, precios, citas y métricas de **su propio negocio**.
- **Ocultamiento de Competencia:** Los selectores y listas de otros comercios están completamente bloqueados para usuarios regulares.
- **Métricas Aisladas:** Cada negocio visualiza únicamente sus citas de hoy, facturación y estado de su bot.

### 8. 👑 Panel Master Control para los Dueños de TURNIA (SuperAdmin)
- **Vista Global de la Plataforma:**
  - **MRR (Ingresos Recurrentes Mensuales):** Facturación total en tiempo real.
  - **Total de Locales Registrados:** Barberías, talleres y clínicas activas.
  - **Control de Pruebas Gratuitas:** Monitoreo de clientes en periodo de 15 días.
  - **Volumen Total de Citas:** Métricas de rendimiento de los bots.
- **Gestión de Clientes y Bajas:**
  - 🛑 **Suspender Negocio:** Desactiva el acceso y el bot si el cliente no paga.
  - ▶️ **Reactivar Negocio:** Restaura el servicio inmediatamente tras el pago.
  - ➕ **Extender Días de Prueba:** Asigna +15 días extra a clientes potenciales.
  - 🗑️ **Dar de Baja Definitiva:** Elimina un negocio y todos sus registros de la plataforma.

---

## 🏗️ Arquitectura del Proyecto

```text
turnia/
├── server/
│   ├── index.js                     # Servidor Express, endpoints REST y Webhooks
│   ├── botEngine.js                 # Motor conversacional y lógica de turnos
│   └── db.js                        # Base de datos multi-tenant, suscripciones y auth
├── src/
│   ├── components/
│   │   ├── SleekLanding.jsx         # Landing page comercial pública (turnia.es)
│   │   ├── BusinessAuthModal.jsx    # Modal de Login, Registro y Acceso SuperAdmin
│   │   ├── SuperAdminManager.jsx    # Panel Master Control exclusivo de la plataforma
│   │   ├── WhatsAppConnectionQR.jsx # Vinculación de WhatsApp del local vía QR
│   │   ├── GoogleCalendarView.jsx   # Guía e integración con Google Calendar
│   │   ├── ServicesManager.jsx      # Configuración de horarios, días y precios
│   │   ├── WhatsAppSimulator.jsx    # Simulador interactivo de chat en vivo
│   │   ├── AppointmentsCalendar.jsx # Agenda visual de turnos confirmados
│   │   ├── RemindersManager.jsx     # Gestor de recordatorios (24h y 2h antes)
│   │   ├── QrLinkGenerator.jsx      # Generador de links wa.me y QR de local
│   │   └── OnboardingWizard.jsx     # Asistente de alta de comercios en 5 minutos
│   ├── App.jsx                      # Orquestador principal (Landing vs Dashboard)
│   ├── index.css                    # Sistema de diseño, glassmorphism y animaciones
│   └── main.jsx                     # Punto de entrada de React
├── package.json
└── vite.config.js
```

---

## 🚀 Puesta en Marcha (Instalación Local)

### 1. Clonar el repositorio e instalar dependencias
```bash
cd turnia
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```
La aplicación se abrirá en `http://localhost:5173` o `http://localhost:5174`.

### 3. Compilar para Producción
```bash
npm run build
```

---

## 🔑 Roles y Acceso a la Plataforma

| Rol | Cómo Acceder | Privilegios y Vistas |
| :--- | :--- | :--- |
| **Público / Visitante** | Entrar a la URL raíz (`/`) | Visualiza la Landing Page comercial con oferta de 15 días gratis, comparativa de beneficios y precios. |
| **Dueño de Local** *(Barbería, Taller, Clínica)* | Botón *"Acceso Locales"* o Login con sus credenciales | Vista 100% aislada de su negocio. Configura horarios, días laborables, precios, escanea su QR de WhatsApp y ve sus citas. |
| **Dueño de TURNIA** *(SuperAdmin Master)* | Botón *"Acceso Master Turnia"* o credencial `admin@turnia.es` | Control global de la plataforma: Métricas de MRR, listado de todos los comercios, suspensión de accesos por impago, extensiones de prueba y bajas definitivas. |

---

## 📄 Licencia

Desarrollado como solución propietaria para **TURNIA**. Todos los derechos reservados.
