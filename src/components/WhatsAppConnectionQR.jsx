import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Check, 
  Clock, 
  Layers,
  Wrench,
  HeartPulse,
  Scissors
} from 'lucide-react';
import { db } from '../../server/db';

export function WhatsAppConnectionQR({ currentBusiness, userRole = 'business' }) {
  const [businesses, setBusinesses] = useState(db.getBusinesses());
  const [selectedBizId, setSelectedBizId] = useState(currentBusiness?.id || 'biz-1');
  const [isScanning, setIsScanning] = useState(false);
  const [qrCounter, setQrCounter] = useState(45);
  const [connectedNumber, setConnectedNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (currentBusiness?.id && userRole === 'business') {
      setSelectedBizId(currentBusiness.id);
    }
    setBusinesses(db.getBusinesses());
    const target = (userRole === 'business' && currentBusiness?.id) ? currentBusiness : (db.getBusinessById(selectedBizId) || db.getBusinesses()[0]);
    if (target) {
      setConnectedNumber(target.whatsappPhone || target.phone);
    }
  }, [selectedBizId, currentBusiness?.id]);

  const currentBiz = businesses.find(b => b.id === selectedBizId) || currentBusiness || businesses[0] || {};

  // Contador de expiración del código QR
  useEffect(() => {
    if (!currentBiz?.whatsappConnected) {
      const timer = setInterval(() => {
        setQrCounter((prev) => (prev > 1 ? prev - 1 : 45));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentBiz?.whatsappConnected]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setStatusMessage('Validando autenticación con WhatsApp Web Protocol...');
    setTimeout(() => {
      db.updateWhatsAppStatus(selectedBizId, true, currentBiz.phone);
      setBusinesses([...db.getBusinesses()]);
      setIsScanning(false);
      setStatusMessage('¡Dispositivo vinculado con éxito! El bot de Turnia está activo.');
    }, 1500);
  };

  const handleDisconnect = () => {
    db.updateWhatsAppStatus(selectedBizId, false);
    setBusinesses([...db.getBusinesses()]);
    setStatusMessage('Sesión cerrada. Escanea el código QR para reconectar.');
  };

  const getIndustryIcon = (category = '') => {
    if (category.includes('Taller') || category.includes('Autos')) return Wrench;
    if (category.includes('Odont') || category.includes('Dental') || category.includes('Salud')) return HeartPulse;
    return Scissors;
  };

  const IndustryIcon = getIndustryIcon(currentBiz.category);

  // URL dinámica del QR simulado
  const qrString = `turnia-instance://${selectedBizId}?phone=${encodeURIComponent(currentBiz.phone)}&ts=${Date.now()}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrString)}&color=055c4b&bgcolor=ffffff`;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-emerald-400" />
              Conexión WhatsApp del Negocio (Sin Twilio)
            </h2>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
              currentBiz.whatsappConnected 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {currentBiz.whatsappConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {currentBiz.whatsappConnected ? 'Instancia Conectada' : 'Esperando Escaneo'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cada comercio escanea su propio código QR para que el bot responda las citas desde su número de toda la vida.
          </p>
        </div>

        {/* Selector de Comercio visible solo para SuperAdmin */}
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

      {/* Tarjeta Principal de Conexión */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Instrucciones y Estado */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border border-emerald-500/20">
            <div className="flex items-center justify-between border-b border-dark-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <IndustryIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-100">{currentBiz.name}</h3>
                  <span className="text-[11px] text-slate-400">{currentBiz.category} • {currentBiz.phone}</span>
                </div>
              </div>

              {currentBiz.whatsappConnected && (
                <button
                  onClick={handleDisconnect}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold transition-all"
                >
                  Desvincular WhatsApp
                </button>
              )}
            </div>

            {/* Pasos para el dueño del negocio */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Pasos para vincular tu WhatsApp en 30 segundos:
              </h4>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 bg-dark-950/70 border border-dark-800 rounded-xl flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="text-xs text-slate-300">
                    Abre <strong>WhatsApp</strong> o <strong>WhatsApp Business</strong> en el teléfono móvil de tu local.
                  </div>
                </div>

                <div className="p-3 bg-dark-950/70 border border-dark-800 rounded-xl flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="text-xs text-slate-300">
                    Toca en <strong>Menú (⋮)</strong> o <strong>Ajustes</strong> y selecciona <strong>Dispositivos vinculados</strong>.
                  </div>
                </div>

                <div className="p-3 bg-dark-950/70 border border-dark-800 rounded-xl flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="text-xs text-slate-300">
                    Presiona <strong>"Vincular un dispositivo"</strong> y apunta la cámara de tu móvil hacia el código QR de la derecha.
                  </div>
                </div>
              </div>
            </div>

            {/* Ventajas de la Marca Blanca */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                <strong>100% Invisible para tus clientes:</strong> Los clientes siguen escribiéndole al número de siempre de tu negocio. El bot responde al instante y agenda en tu Google Calendar sin coste por mensaje de Twilio.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Código QR Interactivo */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-6 text-center space-y-4 shadow-2xl flex flex-col items-center justify-center">
            
            {currentBiz.whatsappConnected ? (
              <div className="py-8 space-y-4 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-slate-100">WhatsApp Conectado</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Número vinculado: <strong className="text-emerald-400 font-mono">{currentBiz.phone}</strong>
                  </p>
                </div>
                <div className="p-3 bg-dark-950/80 border border-dark-800 rounded-xl text-xs text-slate-300 max-w-xs text-center">
                  El bot de Turnia está escuchando mensajes y gestionando citas automáticamente para este local.
                </div>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col items-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl inline-block relative group">
                  <img
                    src={qrImageUrl}
                    alt="WhatsApp QR Code"
                    className="w-56 h-56 rounded-lg object-contain"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-dark-950/80 rounded-2xl flex flex-col items-center justify-center p-4">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                      <span className="text-xs text-slate-200 font-bold text-center">
                        Sincronizando sesión...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between w-full max-w-xs text-xs text-slate-400 px-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Actualización en: <strong className="text-slate-200 font-mono">{qrCounter}s</strong>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Instancia: {currentBiz.slug}
                  </span>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="w-full max-w-xs py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Simular Escaneo de QR</span>
                </button>
              </div>
            )}

            {statusMessage && (
              <div className="p-2.5 rounded-xl bg-dark-950/90 border border-dark-800 text-[11px] text-emerald-300 w-full text-center">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
