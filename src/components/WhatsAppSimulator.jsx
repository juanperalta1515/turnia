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
  Scissors,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { processIncomingMessage } from '../../server/botEngine';
import { db } from '../../server/db';

export function WhatsAppSimulator({ onAppointmentBooked }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'user',
      text: "Hola, ¿queda hueco mañana por la tarde para corte y barba?",
      time: "18:42"
    },
    {
      id: 'msg-2',
      sender: 'bot',
      text: "¡Hola! 👋 Te puedo ofrecer mañana:\n\n👉  *16:30*   *18:00*   *19:15*\n\n¿Cuál de estos te va mejor?",
      time: "18:42"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ step: 'AWAITING_TIME_CHOICE', businessId: 'biz-1' });
  const [userPhone, setUserPhone] = useState('+34 654 987 321');
  const [clientName, setClientName] = useState('David Morales');
  const [isBotActive, setIsBotActive] = useState(true);

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
          throw new Error('Local fallback');
        }
      } catch (err) {
        const result = await processIncomingMessage(userPhone, text.trim(), clientName);
        replyText = result.replyText;
        updatedSession = result.updatedSession;
      }

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

        if (updatedSession?.step === 'COMPLETED' || replyText.includes('reservo') || replyText.includes('Google Calendar')) {
          if (onAppointmentBooked) onAppointmentBooked();
        }
      }, 500);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleToggleBot = () => {
    const nextStatus = db.toggleBotStatus('biz-1');
    setIsBotActive(nextStatus);
  };

  const handleResetChat = () => {
    db.clearSession(userPhone);
    setSessionInfo({ step: 'START', businessId: 'biz-1' });
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: "¡Hola! 👋 Te habla la agenda de *Barbería & Estilo King*.\n\n¿En qué te podemos ayudar? Escribe qué servicio buscas o si quieres agendar para hoy o mañana.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const formatWhatsAppText = (rawText) => {
    return rawText.split('\n').map((line, lineIdx) => {
      let formatted = line;
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
      
      {/* Columna Izquierda: Teléfono WhatsApp Marca Blanca */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-md bg-[#0c1317] border-4 border-dark-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[700px] relative">
          
          {/* Header WhatsApp de la Barbería (Marca Blanca) */}
          <div className="bg-[#202c33] p-3.5 px-4 flex items-center justify-between border-b border-dark-800/80 z-10 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
                  <Scissors className="w-5 h-5" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#202c33] rounded-full"></div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  Tu Barbería
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </h3>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  en línea • Recepcionista Turnia
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <button 
                onClick={handleResetChat}
                title="Reiniciar chat"
                className="p-1.5 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 wa-chat-pattern p-4 overflow-y-auto space-y-3 flex flex-col">
            <div className="mx-auto my-1 px-3 py-1 bg-[#182229] border border-dark-800 rounded-lg text-[10px] text-slate-400 text-center max-w-xs shadow-sm">
              🔒 El cliente escribe como siempre. No sabe que Turnia contesta por ti.
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

          {/* Chips de Respuestas Rápidas (Diapositiva 5 del PDF) */}
          <div className="bg-[#111b21] p-2 px-3 border-t border-dark-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider shrink-0 mr-1">Probar:</span>
            <button
              onClick={() => sendMessage("Hola, ¿queda hueco mañana por la tarde para corte y barba?")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-emerald-900/40 border border-dark-800 hover:border-emerald-500/30 text-emerald-400 rounded-full shrink-0 transition-colors"
            >
              1. Preguntar por hueco
            </button>
            <button
              onClick={() => sendMessage("Las 18:00 me va bien")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-blue-900/40 border border-dark-800 hover:border-blue-500/30 text-blue-400 rounded-full shrink-0 transition-colors"
            >
              2. Elegir 18:00 hs
            </button>
            <button
              onClick={() => sendMessage("David Morales")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-purple-900/40 border border-dark-800 hover:border-purple-500/30 text-purple-400 rounded-full shrink-0 transition-colors"
            >
              3. Enviar nombre
            </button>
            <button
              onClick={() => sendMessage("Mis citas")}
              className="px-2.5 py-1 bg-dark-900 hover:bg-amber-900/40 border border-dark-800 hover:border-amber-500/30 text-amber-400 rounded-full shrink-0 transition-colors"
            >
              Mis citas
            </button>
          </div>

          {/* Input de Mensaje */}
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

      {/* Columna Derecha: Panel de Control del Barbero (Handover & Calendar Sync) */}
      <div className="lg:col-span-5 space-y-5">
        
        {/* Switch de Intervención Humana (Handover) */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between border-b border-dark-800 pb-3">
            <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Estado de la Recepcionista Turnia
            </h3>
            <button
              onClick={handleToggleBot}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                isBotActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isBotActive ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
              {isBotActive ? 'Bot Contesta Solo' : 'Pausado (Hablas tú)'}
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isBotActive ? (
              <span>🟢 <strong>Turnia responde automáticamente:</strong> Lee huecos libres en Google Calendar y agenda citas 24/7 sin interrumpirte mientras cortas.</span>
            ) : (
              <span>🔴 <strong>Turnia está en pausa:</strong> Puedes escribir manualmente al cliente desde tu móvil. Turnia no intervendrá hasta que vuelvas a activarlo.</span>
            )}
          </p>
        </div>

        {/* Flujo de 5 Pasos de la Presentación */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-3.5 shadow-xl">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Lo que el cliente experimenta (Diapositiva 5):
          </h4>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-2.5 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
              <div>
                <strong className="text-slate-100">Pregunta por un hueco:</strong>
                <p className="text-[11px] text-slate-400">Como siempre, en lenguaje de toda la vida.</p>
              </div>
            </div>

            <div className="p-2.5 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
              <div>
                <strong className="text-slate-100">Turnia mira tu Google Calendar:</strong>
                <p className="text-[11px] text-slate-400">Y le ofrece tres huecos reales que existen.</p>
              </div>
            </div>

            <div className="p-2.5 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[11px]">3</span>
              <div>
                <strong className="text-slate-100">Elige uno y queda bloqueado:</strong>
                <p className="text-[11px] text-slate-400">Aparece automático en tu Google Calendar.</p>
              </div>
            </div>

            <div className="p-2.5 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold shrink-0 text-[11px]">4</span>
              <div>
                <strong className="text-slate-100">Recordatorio 24h y 2h antes:</strong>
                <p className="text-[11px] text-slate-400">Los no-shows bajan del 10% al 3-5%.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
