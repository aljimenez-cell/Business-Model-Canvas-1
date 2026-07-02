/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, BusinessModelCanvas, CanvasBlockId } from '../types';
import { BUSINESS_EXAMPLES } from '../data/examples';
import { Send, Sparkles, HelpCircle, ArrowRight, Play, FileInput, RotateCcw } from 'lucide-react';

interface AIConsultantProps {
  canvas: BusinessModelCanvas;
  onUpdateCanvas: (updated: BusinessModelCanvas) => void;
  onLoadExample: (example: BusinessModelCanvas) => void;
  onResetCanvas: () => void;
  onOpenReport: () => void;
  onOpenExport: () => void;
}

export default function AIConsultant({
  canvas,
  onUpdateCanvas,
  onLoadExample,
  onResetCanvas,
  onOpenReport,
  onOpenExport,
}: AIConsultantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `👋 ¡Bienvenido, Emprendedor! Soy tu **Consultor de Negocios de Élite** y **Diseñador UX/UI**. 

Estoy listo para ayudarte a crear, moldear y validar un **Business Model Canvas (BMC)** de clase mundial. Esta herramienta sintetiza tu estrategia en 9 bloques estratégicos para prever riesgos antes de gastar recursos.

Para comenzar, por favor indícame **el nombre de tu proyecto** o una **breve descripción** de tu idea de negocio. 

¿Cómo prefieres que trabajemos hoy? 👇`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🚀 Guiame paso a paso (Opción A)',
        '✍️ Ya tengo datos sueltos (Opción B)',
        '💡 Cargar el SaaS de IA de ejemplo'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'welcome' | 'setup' | 'co-creating' | 'done'>('welcome');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle client-side submission to Gemini API
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message to state
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Detect state changes or examples
    if (textToSend.includes('SaaS de IA de ejemplo') || textToSend.toLowerCase().includes('saas')) {
      onLoadExample(BUSINESS_EXAMPLES[0].canvas);
      setCurrentStep('co-creating');
    }

    try {
      // Build previous messages context payload (excluding suggestions to save token size)
      const cleanedHistory = messages.slice(-10).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/consultant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvas,
          messages: cleanedHistory,
          prompt: textToSend
        })
      });

      if (!res.ok) {
        throw new Error('No se pudo conectar con el consultor. Verifica tu conexión o clave de API.');
      }

      const data = await res.json();

      // Process any automatic canvas updates returned by the AI
      if (data.updatedBlocks && Object.keys(data.updatedBlocks).length > 0) {
        const updatedCanvas = { ...canvas };
        let updatedCount = 0;

        Object.keys(data.updatedBlocks).forEach(key => {
          const blockId = key as CanvasBlockId;
          const strings = data.updatedBlocks[blockId] as string[];
          if (Array.isArray(strings)) {
            // Merge or set items
            const newItems = strings.map((str, idx) => ({
              id: `ai-${blockId}-${Date.now()}-${idx}`,
              text: str,
              isAiEnriched: true
            }));
            updatedCanvas[blockId] = newItems;
            updatedCount++;
          }
        });

        if (updatedCount > 0) {
          onUpdateCanvas(updatedCanvas);
        }
      }

      // Process Project Name or description if parsed
      if (currentStep === 'welcome') {
        setCurrentStep('co-creating');
      }

      // Add AI reply
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Entendido. Cuéntame más para ir organizándolo en el lienzo.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || []
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `❌ **Error de Conexión:** No he podido procesar tu solicitud. Asegúrate de configurar la clave secreta \`GEMINI_API_KEY\` en el panel lateral de AI Studio si aún no lo has hecho.\n\n_Detalles: ${err.message}_`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    // If it is a direct action suggestion, parse it or send it as prompt
    let cleanPrompt = suggestionText;
    if (suggestionText.includes('SaaS de IA')) {
      onLoadExample(BUSINESS_EXAMPLES[0].canvas);
      cleanPrompt = "He cargado el SaaS de IA de ejemplo, RestoMind AI. Analicemos su propuesta de valor.";
    } else if (suggestionText.includes('Cafetería')) {
      onLoadExample(BUSINESS_EXAMPLES[1].canvas);
      cleanPrompt = "He cargado el ejemplo de la Cafetería de Especialidad Ecológica.";
    }
    handleSendMessage(cleanPrompt);
  };

  // Quick helper to render basic markdown in chat bubbles securely
  const renderMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      let content = line;
      
      // Handle blockquotes
      const isQuote = content.startsWith('>');
      if (isQuote) {
        content = content.substring(1).trim();
      }

      // Parse Bold texts (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const elements = parts.length > 0 ? parts : content;

      if (isQuote) {
        return (
          <blockquote key={lineIdx} className="border-l-4 border-indigo-500 bg-slate-50 p-2 my-2 text-slate-600 rounded-r-lg italic text-xs">
            {elements}
          </blockquote>
        );
      }

      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-700 py-0.5">
            {elements}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={line.trim() === '' ? 'h-3' : 'mb-2 leading-relaxed text-slate-700'}>
          {elements}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" id="ai-consultant-sidebar">
      {/* Consultant Header (High Density Elite design) */}
      <header className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0" id="consultant-sidebar-header">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">💎</span>
            <h1 className="font-black text-lg tracking-tight text-slate-900">
              CANVAS PRO <span className="text-indigo-600">ELITE</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">Consultor de Negocios de Vanguardia</p>
        </div>

        {/* Action button */}
        <button
          onClick={onResetCanvas}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-all border border-slate-200 bg-white shadow-sm"
          title="Reiniciar Canvas"
          id="btn-reset-sidebar"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Dynamic Step Tracker */}
      <div className="bg-slate-100/50 border-b border-slate-200 px-5 py-2 flex items-center justify-between text-[11px] font-bold text-slate-500 shrink-0" id="step-tracker">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          Fase: 
          <span className="text-indigo-600 uppercase font-black tracking-wide">
            {currentStep === 'welcome' ? 'Semilla' : currentStep === 'co-creating' ? 'Co-creación' : 'Diagnóstico'}
          </span>
        </span>
        <button
          onClick={() => handleSendMessage('Quiero generar el reporte de viabilidad y salud ahora.')}
          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 font-bold underline text-[10px]"
          id="btn-generate-report-quick"
        >
          Análisis de Salud ✨
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-slate-50/40" id="chat-messages-container">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[88%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            id={`chat-bubble-${msg.id}`}
          >
            <span className="text-[9px] font-bold tracking-wider text-slate-400 mb-1 uppercase px-1">
              {msg.sender === 'user' ? 'Tú' : 'Consultor Pro'} • {msg.timestamp}
            </span>
            <div
              className={`p-4 rounded-2xl text-xs shadow-sm transition-all border ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none border-slate-700'
                  : 'bg-white text-slate-800 rounded-tl-none border-slate-200/80 chat-bubble'
              }`}
            >
              <div className="prose prose-sm break-words select-text">
                {renderMarkdownText(msg.text)}
              </div>

              {/* Suggestions inside bubble if AI sent them */}
              {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-150 flex flex-col gap-1.5" id="bubble-suggestions">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(sug)}
                      className="w-full text-left p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/80 text-indigo-700 text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                      id={`sug-btn-${i}`}
                    >
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col max-w-[70%] mr-auto items-start" id="chat-typing-indicator">
            <span className="text-[9px] text-slate-400 mb-1 font-bold tracking-wider uppercase px-1">Analizando...</span>
            <div className="p-3 bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset industry models drawer */}
      <div className="p-3 bg-slate-100/60 border-t border-slate-200 flex flex-wrap items-center gap-1.5 shrink-0" id="presets-panel">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide mr-1">💡 Ejemplos:</span>
        <button
          onClick={() => {
            onLoadExample(BUSINESS_EXAMPLES[0].canvas);
            handleSendMessage("He cargado el SaaS predictivo para Restaurantes. ¿Qué opinas de su modelo?");
          }}
          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200 transition-all active:scale-95 flex items-center gap-1 shadow-sm"
          id="btn-saas-preset"
        >
          <Play className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" /> SaaS IA
        </button>
        <button
          onClick={() => {
            onLoadExample(BUSINESS_EXAMPLES[1].canvas);
            handleSendMessage("He cargado la Cafetería Ecológica. Revisemos sus fuentes de ingresos.");
          }}
          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200 transition-all active:scale-95 flex items-center gap-1 shadow-sm"
          id="btn-coffee-preset"
        >
          <Play className="w-2.5 h-2.5 text-indigo-600 fill-indigo-600" /> Cafetería Orgánica
        </button>
      </div>

      {/* Input Tray */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0" id="chat-input-section">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Escribe tu idea de negocio..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
            disabled={isTyping}
            className="flex-grow text-xs border border-slate-250 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
            id="chat-input-field"
          />
          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={isTyping || !inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition-all shadow-md shrink-0 active:scale-95 flex items-center justify-center"
            id="btn-send-message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[9px] text-slate-400 text-center mt-2 font-bold uppercase tracking-wider">
          🔥 TIP: Usa el modo paso a paso o haz clic en los ejemplos
        </p>
      </div>
    </div>
  );
}
