
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Activity, Lock, Users, ChevronLeft, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For login redirect
import api from '../../services/api';

// --- Quick Replies Constants ---
const GENERAL_QUICK_REPLIES = [
  "What are your operating hours?",
  "How much does it cost?",
  "How do I enroll my child?",
  "What food do you serve?",
  "Tell me about safety measures"
];

const HEALTH_QUICK_REPLIES = [
  "How was their day?",
  "Did they eat lunch?",
  "Any health concerns?",
  "What activities did they do?",
  "Show recent milestones"
];

const Chatbot = ({ user }) => {
  const navigate = useNavigate();
  // --- State ---
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'health'

  // Data State
  const [myChildren, setMyChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(false);

  // Chat State
  const [messages, setMessages] = useState({
    general: [{ role: 'assistant', text: "Hi! I'm the KiddoZ Assistant. 🏫 I can answer questions about our center, services, and enrollment. How can I help?" }],
    health: [] // Will depend on child selection
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, activeTab, selectedChild]);

  // Fetch children when entering Health Tab
  useEffect(() => {
    if (activeTab === 'health' && user && myChildren.length === 0) {
      const fetchChildren = async () => {
        setLoadingChildren(true);
        try {
          // Attempt to fetch parents students. Assuming api.getParentStudents() uses logged in user's token.
          // If user is admin/superadmin, they might not have 'my students', so handle gracefully.
          let students = [];
          if (user.role === 'parent') {
            students = await api.getParentStudents();
          } else {
            // For demo/admin, maybe fetch all students or mock? 
            // Let's stick to strict logic: only parents see this feature properly.
            // Or allow admin to see distinct 'Admin Health AI' (out of scope for now, assume Parent focus)
          }
          setMyChildren(students || []);
        } catch (err) {
          console.error("Failed to fetch children for AI context", err);
        } finally {
          setLoadingChildren(false);
        }
      };
      fetchChildren();
    }
  }, [activeTab, user]);

  // --- Handlers ---
  const handleTabSwitch = (tab) => {
    if (tab === 'health' && !user) {
      // Allow switching to show the "Login Required" state
    }
    setActiveTab(tab);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    // Initialize chat for this child if empty
    if (messages.health.length === 0) {
      setMessages(prev => ({
        ...prev,
        health: [{
          role: 'assistant',
          text: `Hi ${user?.name || 'Parent'}! I'm ready to analyze health data for ${child.name}. 🏥 What would you like to know?`,
          relatedQuestions: HEALTH_QUICK_REPLIES
        }]
      }));
    }
  };

  const handleSendMessage = async (textOveride = null) => {
    const textToSend = textOveride || input;
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg = { role: 'user', text: textToSend };
    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg]
    }));
    setInput('');
    setIsTyping(true);

    // 2. Prepare Payload
    const payload = {
      message: textToSend,
      mode: activeTab,
      childId: activeTab === 'health' ? selectedChild?.id : null
    };

    try {
      // 3. API Call
      const response = await api.post('/ai/chat', payload); // Using api service wrapper

      // 4. Add Bot Response
      // Parse related questions if AI provides them? For now hardcode or separate logic.
      // We'll stick to a standard text response.
      const botMsg = {
        role: 'assistant',
        text: response.text
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], botMsg]
      }));

    } catch (err) {
      console.error("Chat API Error:", err);
      const errorText = err.response?.data?.message || err.message || "I'm having trouble connecting to the server. Please check if the backend is running.";
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { role: 'assistant', text: `❌ ${errorText}` }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // --- Render Helpers ---

  // Health Data: Access Control/States
  const renderHealthContent = () => {
    if (!user) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <Lock className="text-slate-400" size={32} />
          </div>
          <h3 className="font-bold text-slate-700">Login Required</h3>
          <p className="text-sm text-slate-500">
            Please log in as a parent to verify your identity and access your child's private health data.
          </p>
          <button
            onClick={() => { setIsOpen(false); navigate('/login'); }}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition"
          >
            Log In Now
          </button>
        </div>
      );
    }

    if (loadingChildren) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      );
    }

    if (myChildren.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Users className="text-green-600" size={32} />
          </div>
          <h3 className="font-bold text-slate-700">No Enrollment Found</h3>
          <p className="text-sm text-slate-500">
            We couldn't find any children enrolled under your account. Enroll a child to unlock AI Health Insights.
          </p>
          <button
            onClick={() => { setIsOpen(false); navigate('/enroll'); }}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-green-700 transition"
          >
            Enroll Now
          </button>
        </div>
      );
    }

    if (!selectedChild) {
      return (
        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
          <p className="text-center text-sm text-slate-500 mb-4">Select a child to view health insights</p>
          <div className="space-y-3">
            {myChildren.map(child => (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-green-400 hover:shadow-md transition text-left group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-lg group-hover:bg-green-600 group-hover:text-white transition">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{child.name}</h4>
                  <p className="text-xs text-slate-500">{child.age} yrs • {child.plan || 'Standard Care'}</p>
                </div>
                <ShieldCheck className="ml-auto text-green-400 opacity-0 group-hover:opacity-100 transition" size={20} />
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Health Chat Interface
    return renderChatInterface(messages.health, HEALTH_QUICK_REPLIES, 'health');
  };

  const renderChatInterface = (msgs, quickReplies, contextMode) => {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Child Header for Health Mode */}
        {contextMode === 'health' && selectedChild && (
          <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-green-100">
            <button onClick={() => setSelectedChild(null)} className="hover:bg-white/50 p-1 rounded-full text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-green-800 uppercase tracking-wider flex items-center gap-1">
              <Heart size={12} className="fill-green-600 text-green-600" />
              Analyzing: {selectedChild.name}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shrink-0 ${contextMode === 'health' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                  {contextMode === 'health' ? <Activity size={14} /> : <MessageCircle size={14} />}
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                  ? (contextMode === 'health' ? 'bg-green-600 text-white rounded-br-none' : 'bg-purple-600 text-white rounded-br-none')
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start ml-10">
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm">
                <Loader2 className={`animate-spin ${contextMode === 'health' ? 'text-green-500' : 'text-purple-500'}`} size={16} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies (Only if not typing and last msg is from bot) */}
        {!isTyping && msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant' && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar mask-gradient-right">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qr)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition ${contextMode === 'health'
                  ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                  : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                  }`}
              >
                {qr}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={contextMode === 'health' ? "Ask about health, meals..." : "Type your question..."}
            className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition"
            style={{
              '--tw-ring-color': contextMode === 'health' ? '#4ade80' : '#c084fc' // dynamic coloring
            }}
          />
          <button
            data-testid="send-button"
            onClick={() => handleSendMessage()}
            disabled={isTyping || !input.trim()}
            className={`p-2.5 rounded-full text-white shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${contextMode === 'health' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    );
  };

  // --- Main Button Logic ---
  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      >
        <span className="absolute -top-10 right-0 bg-white text-slate-800 text-xs font-bold py-1 px-3 rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask AI about KiddoZ! 👋
        </span>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white p-4 rounded-full shadow-2xl transition-all transform group-hover:scale-110 flex items-center justify-center border-4 border-white/20">
          <MessageCircle size={28} />
        </div>
        {/* Simple Notification Badge */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
      </div>
    );
  }

  // --- Main Window Logic ---
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-in slide-in-from-bottom-10 fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-[350px] md:w-[400px] overflow-hidden border border-slate-200 flex flex-col h-[600px] relative">

        {/* Header */}
        <div className={`p-5 text-white transition-colors duration-300 ${activeTab === 'health' ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-purple-700 to-indigo-600'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                KiddoZ AI {activeTab === 'health' && <span className="text-green-200 text-xs px-2 py-0.5 bg-white/20 rounded-full">Secure</span>}
              </h3>
              <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                {activeTab === 'health' ? 'Health Analysis Active' : 'General Assistant Online'}
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition">
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl">
            <button
              onClick={() => handleTabSwitch('general')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'general'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              <MessageCircle size={14} /> General Info
            </button>

            <button
              onClick={() => handleTabSwitch('health')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${activeTab === 'health'
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              {/* Lock Icon Logic */}
              {!user ? <Lock size={12} className="opacity-70" /> : <Activity size={14} />}
              Health Data AI
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
          {activeTab === 'general' ? renderChatInterface(messages.general, GENERAL_QUICK_REPLIES, 'general') : renderHealthContent()}
        </div>

        {/* Footer Credit */}
        <div className="bg-slate-50 py-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
          Powered by KiddoZ AI Engine
        </div>

      </div>
    </div>
  );
};

export default Chatbot;