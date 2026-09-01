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
  PlayCircle,
  Wrench,
  HeartPulse
} from 'lucide-react';
import { processIncomingMessage } from '../../server/botEngine';
import { db } from '../../server/db';

export function WhatsAppSimulator({ onAppointmentBooked }) {
  const [businesses, setBusinesses] = useState(db.getBusinesses());
  const [selectedBizId, setSelectedBizId] = useState('biz-1');
  const currentBiz = businesses.find(b => b.id === selectedBizId) || businesses[0];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ step: 'START', businessId: 'biz-1' });
  const [userPhone, setUserPhone] = useState('+34 654 987 321');
  const [clientName, setClientName] = useState('David Morales');
  const [isBotActive, setIsBotActive] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setBusinesses(db.getBusinesses());
    handleResetChat(selectedBizId);
  }, [selectedBizId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleResetChat = (bizId = selectedBizId) => {
    const biz = db.getBusinessById(bizId) || db.getBusinesses()[0];
    db.clearSession(userPhone);
    db.updateSession(userPhone, { step: 'READY', businessId: biz.id, draftAppointment: {} });
    setSessionInfo({ step: 'READY', businessId: biz.id });
    setIsBotActive(biz.botActive);

    const initialGreeting = biz.category.includes('Taller')
      ? `¡Hola! 👋 Te habla la agenda automática de *${biz.name}* 🚗🔧.\n\n¿En qué podemos ayudarte? Puedes pedir turno para *Service de aceite*, *Frenos*, *Diagnóstico* o *Pre-ITV*.`
      : biz.category.includes('Dental') || biz.category.includes('Odont')
      ? `¡Hola! 👋 Te habla la recepción de *${biz.name}* 🦷✨.\n\n¿En qué te ayudamos hoy? Escribe qué tratamiento buscas (ej. *Limpieza*, *Consulta general*, *Ortodoncia*).`
      : `¡Hola! 👋 Te habla la agenda de *${biz.name}* 💈.\n\n¿En qué te puedo ayudar hoy? Escribe qué servicio buscas (ej. *corte*, *corte y barba*) o si prefieres turno para hoy o mañana.`;

    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text: initialGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

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

        if (updatedSession?.step === 'COMPLETED' || replyText.includes('reservo') || replyText.includes('Google Calendar') || replyText.includes('agendado')) {
          if (onAppointmentBooked) onAppointmentBooked();
        }
      }, 400);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleToggleBot = () => {
    const nextStatus = db.toggleBotStatus(selectedBizId);
    setIsBotActive(nextStatus);
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

  const getIndustryIcon = (category = '') => {
    if (category.includes('Taller') || category.includes('Autos')) return Wrench;
    if (category.includes('Dental') || category.includes('Odont')) return HeartPulse;
    return Scissors;
  };

  const IndustryIcon = getIndustryIcon(currentBiz.category);

  // Sugerencias rápidas adaptadas a cada rubro
  const getIndustryPrompts = () => {
    if (currentBiz.category.includes('Taller')) {
      return [
        "Hola, ¿queda hueco mañana para service de aceite y filtros?",
        "Quiero hacer un diagnóstico computarizado hoy por la tarde",
        "¿Cuánto cuesta la revisión pre-itv?",
        "10:00",
        "Gustavo Herrera"
      ];
    }
    if (currentBiz.category.includes('Dental') || currentBiz.category.includes('Odont')) {
      return [
        "Hola, quiero pedir turno para una limpieza dental mañana",
        "¿Tienen turno para consulta y diagnóstico esta semana?",
        "¿Cuánto sale el blanqueamiento led?",
        "16:00",
        "Laura Benítez"
      ];
    }
    return [
      "Hola, ¿queda hueco mañana por la tarde para corte y barba?",
      "Quiero cortarme el pelo hoy",
      "¿Cuáles son los precios?",
      "18:00",
      "David Morales"
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* Header con Selector de Rubro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" />
            Simulador de WhatsApp (Multirubro)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prueba cómo interactúa el cliente con la recepcionista virtual en diferentes industrias.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 shadow-sm">
          <Building2 className="w-4 h-4 text-blue-400" />
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Teléfono WhatsApp Marca Blanca */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-[#0c1317] border-4 border-dark-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col h-[700px] relative">
            
            {/* Header WhatsApp de la Barbería/Taller/Clínica (Marca Blanca) */}
            <div className="bg-[#202c33] p-3.5 px-4 flex items-center justify-between border-b border-dark-800/80 z-10 shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold shadow-md">
                    <IndustryIcon className="w-5 h-5" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#202c33] rounded-full"></div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5 truncate max-w-[180px]">
                    {currentBiz.name}
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    en línea • Recepcionista Turnia
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <button 
                  onClick={() => handleResetChat(selectedBizId)}
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
                🔒 Número del negocio ({currentBiz.phone}). Sin Twilio.
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
                          : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-dark-800/50'
                      }`}
                    >
                      <div className="space-y-1">
                        {formatWhatsAppText(msg.text)}
                      </div>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400/80">
                        <span>{msg.time}</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#202c33] rounded-2xl rounded-tl-none p-3 text-xs text-slate-400 border border-dark-800/50 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-75"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-150"></span>
                    <span className="text-[10px] text-slate-400 ml-1">Escribiendo...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sugerencias Rápidas */}
            <div className="bg-[#111b21] p-2 border-t border-dark-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
              {getIndustryPrompts().map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] border border-dark-800 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400" />
                </button>
              ))}
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

        {/* Columna Derecha: Panel de Control del Profesional */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Switch de Intervención Humana (Handover) */}
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4 shadow-xl border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between border-b border-dark-800 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-100 flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                Estado del Bot en {currentBiz.name}
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
                {isBotActive ? 'Bot Contesta Solo' : 'Pausado (Manual)'}
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isBotActive ? (
                <span>🟢 <strong>Turnia responde automáticamente:</strong> Lee huecos libres en Google Calendar y agenda citas 24/7 sin interrumpirte mientras trabajas.</span>
              ) : (
                <span>🔴 <strong>Turnia está en pausa:</strong> Puedes escribir manualmente al cliente desde tu WhatsApp. Turnia no intervendrá hasta que vuelvas a activarlo.</span>
              )}
            </p>
          </div>

          {/* Tarjeta de Adaptabilidad por Industria */}
          <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-3.5 shadow-xl">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Adaptabilidad Multirubro en Turnia:
            </h4>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
                <Scissors className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Barberías y Peluquerías:</strong>
                  <p className="text-[11px] text-slate-400">Cortes, degradados, barba, tintes y huecos cada 30-45 min.</p>
                </div>
              </div>

              <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
                <Wrench className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Talleres Mecánicos y Boxes:</strong>
                  <p className="text-[11px] text-slate-400">Services de aceite, frenos, scanner y asignación de boxes por hora.</p>
                </div>
              </div>

              <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-800/80 flex items-start gap-2.5">
                <HeartPulse className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-100">Clínicas Odontológicas y Dentistas:</strong>
                  <p className="text-[11px] text-slate-400">Consultas, limpiezas de sarro, blanqueamientos y citas para ortodoncia.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
