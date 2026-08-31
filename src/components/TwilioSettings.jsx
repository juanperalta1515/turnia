import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  Globe, 
  Terminal, 
  ShieldCheck, 
  ExternalLink, 
  Smartphone, 
  Sparkles,
  Info,
  Server,
  Play
} from 'lucide-react';

export function TwilioSettings() {
  const [accountSid, setAccountSid] = useState('ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [authToken, setAuthToken] = useState('••••••••••••••••••••••••••••••••');
  const [whatsappSender, setWhatsappSender] = useState('whatsapp:+14155238886');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [testLoading, setTestLoading] = useState(false);

  // URL del Webhook de producción o ngrok local
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://api.turnia.app';
  const webhookUrl = `${currentOrigin}/api/whatsapp/webhook`;

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTestWebhook = async () => {
    setTestLoading(true);
    setTestStatus(null);

    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          From: 'whatsapp:+5491199998888',
          Body: 'Hola, quiero un turno en Barbería King',
          ProfileName: 'Test Twilio'
        })
      });

      const text = await res.text();
      setTestStatus({
        ok: res.ok,
        status: res.status,
        responseSample: text.substring(0, 300)
      });
    } catch (err) {
      setTestStatus({
        ok: false,
        status: 'Error',
        responseSample: err.message
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
          <Key className="w-6 h-6 text-emerald-400" />
          Configuración de Cuenta Twilio & Webhook
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Conecta tu número central de WhatsApp a través de la consola de Twilio para recibir y responder mensajes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Credenciales y Webhook (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Panel Webhook URL */}
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border-l-4 border-l-emerald-500">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              1. URL del Webhook para Twilio Console
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copia esta URL y pégala en tu consola de Twilio en <strong>Messaging &gt; Senders &gt; WhatsApp senders</strong> (o en <strong>Sandbox Settings</strong>) en el campo <i>"WHEN A MESSAGE COMES IN"</i> (Método <code>HTTP POST</code>):
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 select-all w-full focus:outline-none"
              />
              <button
                onClick={copyWebhookUrl}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedUrl ? '¡Copiado!' : 'Copiar URL'}
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleTestWebhook}
                disabled={testLoading}
                className="px-3 py-1.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                {testLoading ? 'Probando Webhook...' : 'Probar Webhook en Vivo'}
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                Method: HTTP POST (TwiML / XML)
              </span>
            </div>

            {testStatus && (
              <div className={`p-3 rounded-xl border text-xs font-mono mt-2 space-y-1 ${
                testStatus.ok 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Resultado del Test Webhook:</span>
                  <span>HTTP {testStatus.status}</span>
                </div>
                <pre className="text-[10px] overflow-x-auto p-2 bg-dark-950 rounded mt-1 text-slate-300">
                  {testStatus.responseSample}
                </pre>
              </div>
            )}
          </div>

          {/* Panel Credenciales */}
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-dark-800 pb-3">
              <Key className="w-4 h-4 text-blue-400" />
              2. Credenciales de la Cuenta de Twilio
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Account SID (Twilio Console)</label>
                <input
                  type="text"
                  value={accountSid}
                  onChange={(e) => setAccountSid(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Auth Token Secreto</label>
                <input
                  type="password"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Twilio WhatsApp Sender Number</label>
                <input
                  type="text"
                  value={whatsappSender}
                  onChange={(e) => setWhatsappSender(e.target.value)}
                  placeholder="whatsapp:+14155238886"
                  className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              * Estas credenciales se colocan en tus variables de entorno (<code className="text-slate-300 font-mono">.env</code> en el servidor).
            </p>
          </div>

        </div>

        {/* Columna Derecha: Guía de Pasos en Twilio Console (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Guía de Conexión en Twilio
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400">Paso 1: Entrar a Twilio Console</span>
                <p className="text-[11px] text-slate-400">
                  Inicia sesión en <a href="https://console.twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">console.twilio.com <ExternalLink className="w-2.5 h-2.5" /></a> y obtén tu <strong>Account SID</strong> y <strong>Auth Token</strong> del panel principal.
                </p>
              </div>

              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400">Paso 2: Modo Sandbox (Para Pruebas)</span>
                <p className="text-[11px] text-slate-400">
                  Ve a <i>Messaging &gt; Try it out &gt; Send a WhatsApp message</i>. Conecta tu teléfono enviando el código de activación (ej: <code>join &lt;palabra&gt;</code>) al número <code>+1 415 523 8886</code>.
                </p>
              </div>

              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400">Paso 3: Pegar Webhook URL</span>
                <p className="text-[11px] text-slate-400">
                  En la pestaña <strong>Sandbox Settings</strong> de Twilio, pega la URL del Webhook de arriba en el campo <i>"WHEN A MESSAGE COMES IN"</i>.
                </p>
              </div>

              <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400">Paso 4: Producción (Número Propio)</span>
                <p className="text-[11px] text-slate-400">
                  Solicitas un <strong>WhatsApp Business Profile</strong> en Twilio y Meta para tener tu propio número oficial (ej: <i>+54 9 11 ...</i>) con el nombre visible <strong>TURNIA</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
