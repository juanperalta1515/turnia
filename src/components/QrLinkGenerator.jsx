import React, { useState } from 'react';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Building2, 
  Smartphone, 
  Instagram, 
  MapPin, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { db } from '../../server/db';

export function QrLinkGenerator({ onOpenSimulator }) {
  const [businesses, setBusinesses] = useState(db.getBusinesses());
  const [selectedBizId, setSelectedBizId] = useState(businesses[0]?.id || 'biz-1');
  const currentBiz = businesses.find(b => b.id === selectedBizId) || businesses[0];
  const [businessPhone, setBusinessPhone] = useState(currentBiz.phone || '34600112233');
  const [copiedLink, setCopiedLink] = useState(false);

  // Mensaje predeterminado inteligente para que el bot detecte el comercio al instante
  const presetMessage = `Hola, quiero un turno en ${currentBiz.name}`;
  const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(presetMessage)}`;

  // Generador de QR usando la API gratuita de QR Server
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(whatsappUrl)}&color=055c4b&bgcolor=ffffff`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(whatsappUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
          <QrCode className="w-6 h-6 text-emerald-400" />
          Generador de Enlaces & Código QR de WhatsApp
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cada comercio suscrito a TURNIA recibe un enlace directo y código QR para que sus clientes agenden turnos automáticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Configuración del Enlace */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
            
            <h3 className="font-display font-bold text-sm text-slate-200 border-b border-dark-800 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Selecciona el Comercio
            </h3>

            {/* Selector de Comercio */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBizId(b.id)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    selectedBizId === b.id
                      ? 'bg-emerald-600/15 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/5'
                      : 'bg-dark-950/60 border-dark-800 text-slate-400 hover:bg-dark-800/60'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-100">{b.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{b.category}</span>
                </button>
              ))}
            </div>

            {/* Número de WhatsApp del Negocio */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Número de WhatsApp de la Barbería / Negocio
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="34600112233"
                  className="bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500/50 flex-1"
                />
                <span className="text-[11px] text-emerald-400/90 flex items-center px-2 bg-dark-950/60 border border-dark-800 rounded-xl">
                  WhatsApp Oficial
                </span>
              </div>
            </div>

            {/* Enlace generado */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-300">
                Enlace Directo de Agendamiento (WhatsApp Link)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={whatsappUrl}
                  className="bg-dark-950/90 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-400 select-all w-full focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3.5 py-2.5 bg-dark-900 hover:bg-dark-800 border border-dark-800 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Mensaje precargado que enviará el cliente */}
            <div className="p-3 bg-dark-950/60 border border-dark-800 rounded-xl text-xs text-slate-300 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Mensaje automático al abrir el chat:</span>
              <p className="font-mono text-emerald-300">"{presetMessage}"</p>
            </div>

          </div>

          {/* Dónde usar este enlace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="glass-panel rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-xs">
                <Instagram className="w-4 h-4" />
                Instagram Bio & Historias
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                El comercio pega este link en su perfil de Instagram para que sus seguidores agenden turnos 24/7 sin esperar respuesta humana.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <MapPin className="w-4 h-4" />
                Google Maps & Local Físico
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Colocan el link en su ficha de Google Maps o imprimen el código QR en la entrada de su peluquería o mostrador.
              </p>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Tarjeta con Código QR listo para descargar */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="glass-panel bg-dark-900 border border-dark-700 rounded-3xl p-6 md:p-8 w-full max-w-sm text-center space-y-5 shadow-2xl">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Código QR de Turnos
              </span>
              <h3 className="font-display font-extrabold text-lg text-slate-100 mt-2">
                {currentBiz.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Escanea para agendar un turno al instante
              </p>
            </div>

            {/* Imagen del QR */}
            <div className="bg-white p-4 rounded-2xl shadow-xl inline-block border-4 border-emerald-500/20">
              <img 
                src={qrImageUrl} 
                alt={`QR WhatsApp ${currentBiz.name}`}
                className="w-48 h-48 mx-auto"
              />
            </div>

            <div className="space-y-2 pt-2">
              <a
                href={qrImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={`QR_Turnia_${currentBiz.slug}.png`}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Descargar QR para Imprimir
              </a>

              <button
                onClick={onOpenSimulator}
                className="w-full py-2 px-4 bg-dark-950 hover:bg-dark-800 border border-dark-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Probar este flujo en el Simulador</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
