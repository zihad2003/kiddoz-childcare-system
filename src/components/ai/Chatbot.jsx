import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Activity } from 'lucide-react';

const Chatbot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('general'); // 'general' or 'health'
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm the KiddoZ Assistant. I can help with enrollment or provide health insights." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = ""; // Runtime key
      let systemPrompt = mode === 'health' 
        ? `You are a Health Analysis AI for KiddoZ. Tone: Professional. If user asks about a specific child ID, pretend to look up their specific vitals (Temp, Mood, Meal) from the database context provided in the previous turn.`
        : "You are the friendly AI assistant for KiddoZ. Answer questions about Pre-School, Day Care, and Nanny services. Tone: Warm, helpful.";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        }
      );
      
      const data = await response.json();
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection glitch. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm offline momentarily." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl w-80 md:w-96 overflow-hidden border border-purple-100 flex flex-col h-[600px] animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">KiddoZ Support</h3>
                <div className="flex items-center gap-2 text-xs text-purple-200 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Online
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition">
                <X size={16} />
              </button>
            </div>
            <div className="flex bg-black/20 p-1 rounded-xl mt-4">
              <button onClick={() => setMode('general')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${mode === 'general' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-100 hover:bg-white/10'}`}>
                <MessageCircle size={14} /> Assistant
              </button>
              <button onClick={() => setMode('health')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${mode === 'health' ? 'bg-white text-purple-700 shadow-sm' : 'text-purple-100 hover:bg-white/10'}`}>
                <Activity size={14} /> Health Data
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none shadow-md' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-purple-600" size={16} />
                  <span className="text-xs text-slate-500">Analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={mode === 'health' ? "Check temp, meals..." : "Ask anything..."} className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            <button onClick={handleSend} disabled={isLoading} className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition shadow-lg">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white p-4 md:px-6 md:py-4 rounded-full shadow-2xl transition-all transform hover:scale-105 flex items-center gap-3 border-4 border-white/20">
          <MessageCircle size={28} />
          <span className="font-bold hidden md:block">Chat & Health</span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;