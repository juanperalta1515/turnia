import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  User, 
  Smartphone, 
  ShieldCheck, 
  CheckCheck, 
  ChevronRight, 
  Building2, 
  Clock, 
  Calendar,
  PhoneCall,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';
import { processIncomingMessage } from '../../server/botEngine';

export function WhatsAppSimulator({ onAppointmentBooked }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "¡Hola! 👋 Soy el asistente virtual de *TURNIA*.\n\nEscribe *Hola* para ver los comercios o selecciona uno de los accesos directos abajo para comenzar a agendar tu turno.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ step: 'START', businessId: null });
  const [userPhone, setUserPhone] = useState('+54 9 11 9876-5432');
  const [clientName, setClientName] = useState('Mariano López');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      // Llamar a la API del simulador o al motor localmente
      let replyText = '';
      let updatedSession = {};

      try {
        const response = await fetch('/api/bot/chat-simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userPhone,
            messageText: text.trim(),
            profileName: clientName
          })
        });
        if (response.ok) {
          const data = await response.json();
          replyText = data.replyText;
          updatedSession = data.session;
        } else {
          throw new Error('Fallback to local engine');
        }
      } catch (err) {
        // Fallback al motor local importado
        const result = await processIncomingMessage(userPhone, text.trim(), clientName);
        replyText = result.replyText;
        updatedSession = result.updatedSession;
      }

      // Pequeño delay de tipeo para realismo de WhatsApp
      setTimeout(() => {
        const botMsg = {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setSessionInfo(updatedSession || {});
        setLoading(false);

        // Si se completó un turno, notificar al dashboard general
        if (updatedSession?.step === 'COMPLETED' || replyText.includes('TURNO CONFIRMADO')) {
          if (onAppointmentBooked) onAppointmentBooked();
        }
      }, 500);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleResetChat = async () => {
    try {
      await fetch('/api/bot/reset-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPhone })
      });
    } catch (e) {}

    setSessionInfo({ step: 'START', businessId: null });
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: "🔄 *Sesión reiniciada.*\n\nEscribe *Hola* para ver el directorio o elige una peluquería/comercio:",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Formateador de texto estilo WhatsApp (*bold*, _italic_, `code`)
  const formatWhatsAppText = (rawText) => {
    return rawText.split('\n').map((line, lineIdx) => {
      let formatted = line;

      // *bold*
      const parts = [];
      const boldRegex = /\*([^*]+)\*/g;
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(formatted)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatted.substring(lastIndex, match.index));
        }
        parts.push(<strong key={`b-${lineIdx}-${match.index}`} className="font-bold text-white">{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < formatted.length) {
        parts.push(formatted.substring(lastIndex));
      }

      return (
        <span key={lineIdx} className="block min-h-[1.2em]">
          {parts.length > 0 ? parts : line}
        </span>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Columna Izquierda: Teléfono Mockup WhatsApp */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-md bg-[#0c1317] border-4 border-dark-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[680px] relative">
          
          {/* Header Superior del Teléfono */}
          <div className="bg-[#202c33] p-3.5 px-4 flex items-center justify-between border-b border-dark-800/80 z-10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#202c33] rounded-full"></div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  TURNIA Bot Central
                  <ShieldCheck className="w-4 h-4 text-emerald-400" title="Número Oficial Verificado" />
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  En línea • Twilio WhatsApp
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <button 
                onClick={handleResetChat}
                title="Reiniciar chat"
                className="p-1.5 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensajes con Wallpaper WhatsApp */}
          <div className="flex-1 wa-chat-pattern p-4 overflow-y-auto space-y-3 flex flex-col">
            
            {/* Aviso de cifrado / Multi-Tenant */}
            <div className="mx-auto my-1 px-3 py-1.5 bg-[#182229] border border-dark-800/80 rounded-lg text-[10px] text-amber-300/80 text-center max-w-xs shadow-sm">
              🔒 Mensajes procesados por la plataforma multi-tenant de TURNIA vía Twilio.
            </div>

            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md relative ${
                      isUser
                        ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                        : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-dark-800/60'
                    }`}
                  >
                    <div>{formatWhatsAppText(msg.text)}</div>
                    
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400 float-right ml-2">
                      <span>{msg.time}</span>
                      {isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#202c33] text-slate-400 rounded-2xl rounded-tl-none p-3 px-4 text-xs flex items-center gap-2 border border-dark-800/60">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="text-[11px] text-slate-400 ml-1">Escribiendo...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chips de Respuestas Rápidas */}
          <div className="bg-[#111b21] p-2 px-3 border-t border-dark-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">Rápido:</span>
            <button
              onClick={() => sendMessage("Hola, quiero un turno en Barbería King")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-emerald-900/40 border border-dark-800 hover:border-emerald-500/30 text-emerald-400 rounded-full shrink-0 transition-colors"
            >
              💈 Barbería King
            </button>
            <button
              onClick={() => sendMessage("Hola, quiero un turno en Salón Glam")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-purple-900/40 border border-dark-800 hover:border-purple-500/30 text-purple-400 rounded-full shrink-0 transition-colors"
            >
              ✨ Salón Glam
            </button>
            <button
              onClick={() => sendMessage("1")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-blue-900/40 border border-dark-800 hover:border-blue-500/30 text-blue-400 rounded-full shrink-0 transition-colors"
            >
              1️⃣ Opción 1
            </button>
            <button
              onClick={() => sendMessage("2")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-blue-900/40 border border-dark-800 hover:border-blue-500/30 text-blue-400 rounded-full shrink-0 transition-colors"
            >
              2️⃣ Opción 2
            </button>
            <button
              onClick={() => sendMessage("Mis turnos")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-amber-900/40 border border-dark-800 hover:border-amber-500/30 text-amber-400 rounded-full shrink-0 transition-colors"
            >
              📋 Mis Turnos
            </button>
          </div>

          {/* Input de Mensaje estilo WhatsApp */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="bg-[#202c33] p-2.5 px-3 flex items-center gap-2 border-t border-dark-800"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe un mensaje aquí..."
              className="flex-1 bg-[#2a3942] border-none rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Columna Derecha: Inspector de Sesión & Guía Interactiva */}
      <div className="lg:col-span-5 space-y-5">
        
        {/* Panel de Estado de Sesión en Tiempo Real */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Inspector del Motor Conversacional
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live State
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-dark-950/60 p-2.5 rounded-xl border border-dark-800">
              <span className="text-slate-400">Paso Actual del Bot:</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                {sessionInfo.step || 'START'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-dark-950/60 p-2.5 rounded-xl border border-dark-800">
              <span className="text-slate-400">Comercio Activo:</span>
              <span className="font-semibold text-slate-200">
                {sessionInfo.businessId ? sessionInfo.businessId : 'Sin seleccionar'}
              </span>
            </div>

            <div className="flex justify-between items-center bg-dark-950/60 p-2.5 rounded-xl border border-dark-800">
              <span className="text-slate-400">Teléfono Simulado:</span>
              <input
                type="text"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="bg-dark-900 border border-dark-800 rounded px-2 py-0.5 text-xs text-slate-300 w-36 font-mono text-right"
              />
            </div>
          </div>
        </div>

        {/* Guía Rápida de Pruebas */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-3 shadow-xl">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Flujos para Probar en el Simulador:
          </h4>

          <ul className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2 p-2.5 bg-dark-950/40 rounded-xl border border-dark-800/80">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[11px]">1</span>
              <div>
                <strong className="text-slate-100">Agendar Turno en Peluquería:</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Haz clic en el chip <i>"💈 Barbería King"</i> ➔ Envía <strong>1</strong> (Servicio) ➔ Envía <strong>1</strong> (Profesional) ➔ Elige día y hora ➔ Ingresa tu nombre ➔ Envía <strong>1</strong> para confirmar.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2 p-2.5 bg-dark-950/40 rounded-xl border border-dark-800/80">
              <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[11px]">2</span>
              <div>
                <strong className="text-slate-100">Consultar y Cancelar Turno:</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Escribe <i>"Mis turnos"</i> para ver tus reservas y su código identificador.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-2 p-2.5 bg-dark-950/40 rounded-xl border border-dark-800/80">
              <span className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold shrink-0 mt-0.5 text-[11px]">3</span>
              <div>
                <strong className="text-slate-100">Cambio de Comercio (Multi-Tenant):</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Escribe <i>"Menu"</i> o <i>"Cambiar"</i> para elegir otro negocio como <i>Salón Glam</i> o <i>San Lucas</i>.
                </p>
              </div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
