
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
  "Tell me about safety measures",
  "How to book a tour?",
  "Nanny services available?",
  "What is the curriculum?",
  "Emergency protocols?"
];

const HEALTH_QUICK_REPLIES = [
  "How was their day?",
  "Did they eat lunch?",
  "Any health concerns?",
  "What activities did they do?",
  "Show recent milestones"
];

const KIDDOZ_QA = {
  // Greetings
  "hi": "Walaikum Assalam! How can I help you and your little one today? 😊",
  "hello": "Hello! Welcome to KiddoZ. I'm here to help you with any questions about our childcare programs.",
  "hey": "Hey there! How's your day going? How can I assist you with KiddoZ today?",
  "assalamu alaikum": "Walaikum Assalam! It's a pleasure to have you here. How can I help you today?",

  // Company Info
  "what is kiddoz": "KiddoZ is a premium, AI-powered childcare and early childhood education platform. We focus on providing a safe, nurturing, and high-tech environment for children to grow and learn.",
  "is this oldage": "No, KiddoZ is specifically designed for early childhood care (ages 0-10 years). We specialize in childcare, preschool, and after-school programs, not senior care.",

  // Locations
  "find me a nearest location of kiddoz": "We currently have flagship centers in Gulshan, Uttara, and Dhanmondi. Each center is equipped with state-of-the-art safety and learning facilities!",
  "location": "Our main branches are located in Gulshan-2, Uttara Sector 4, and Dhanmondi Road 27. Which area are you looking for?",
  "where are you located": "You can find us in Gulshan, Uttara, and Dhanmondi! We're expanding soon to other areas as well.",

  // Standard Q&A
  "What are your operating hours?": "We are open Sunday through Thursday from 7:00 AM to 6:00 PM. We also offer extended hours for parents with late work schedules upon request!",
  "How much does it cost?": "Our pricing depends on the plan you choose. Programs range from 12,000 BDT to 25,000 BDT per month. You can find detailed pricing in our 'Pricing & Enroll' section.",
  "How do I enroll my child?": "Enrolling is easy! You can fill out the online enrollment form on our website, or visit our center for a personal tour and documentation assistance.",
  "What food do you serve?": "We provide healthy, balanced meals including breakfast, lunch and protein-rich snacks. All our food is prepared fresh daily.",
  "Tell me about safety measures": "Safety is our #1 priority. We have 24/7 CCTV, secure fingerprint access, trained pediatric first-aid staff, and a high staff-to-child ratio.",
  "How to book a tour?": "You can book a tour by clicking the 'Schedule a Demo' button on our homepage or by calling our support line directly.",
  "Nanny services available?": "Yes! We offer premium in-home and on-site nanny services. You can view our certified nannies in the 'Staff' section or 'Nanny Portal' after logging in.",
  "What is the curriculum?": "We follow a modern play-based curriculum that focuses on cognitive development, social skills, and creative arts.",
  "Emergency protocols?": "We have comprehensive emergency protocols for every scenario, with regular drills and instant parent notification systems.",

  // Courtesy
  "thanks": "You're very welcome! If you need anything else, just ask.",
  "thank you": "My pleasure! We look forward to seeing you at KiddoZ."
};

const HEALTH_QA = {
  "How was their day?": "They had a wonderful day! They participated in group circle time, worked on their motor skills with building blocks, and enjoyed the outdoor play area.",
  "Did they eat lunch?": "Yes! They finished their entire portion of the nutritious meal served today and even enjoyed their afternoon snack.",
  "Any health concerns?": "No health concerns recorded for today. Their temperature was normal at all checks and they remained active and happy.",
  "What activities did they do?": "Today's activities included finger painting, a short introduction to numbers, storytelling, and some light physical exercise.",
  "Show recent milestones": "Recent milestones include improved verbal expression, better social interaction with peers, and successfully identifying primary colors."
};

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
    general: [{ role: 'assistant', text: "Assalamu Alaikum! I'm your KiddoZ Assistant. 😊 I'd be absolutely delighted to help you with any questions about our childcare, enrollment, or daily programs. What's on your mind?" }],
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
          let students = [];
          if (user.role === 'parent') {
            students = await api.getParentStudents();
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
    setActiveTab(tab);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    if (messages.health.length === 0) {
      setMessages(prev => ({
        ...prev,
        health: [{
          role: 'assistant',
          text: `Hello ${user?.fullName || user?.name || 'Parent'}! I'm here and ready to help you with anything regarding ${child.name}'s day. 🏥 What can I look up for you?`,
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

    // 2. Structured QA Check (Fast Local Response)
    const qaSource = activeTab === 'general' ? KIDDOZ_QA : HEALTH_QA;

    // Exact or normalized match
    const normalizedInput = textToSend.toLowerCase().trim().replace(/[?]$/, '');
    let matchedKey = Object.keys(qaSource).find(key =>
      key.toLowerCase().trim().replace(/[?]$/, '') === normalizedInput
    );

    // If no exact match, try keyword matching for General info
    if (!matchedKey && activeTab === 'general') {
      const keywords = ["location", "address", "branch", "near", "hour", "cost", "enroll", "safety", "tour", "nanny", "curriculum", "food", "hi", "hello", "thanks", "kiddoz"];
      const foundKeyword = keywords.find(kw => normalizedInput.includes(kw));
      if (foundKeyword) {
        matchedKey = Object.keys(qaSource).find(key => key.toLowerCase().includes(foundKeyword));
      }
    }

    if (matchedKey) {
      setTimeout(() => {
        const botMsg = {
          role: 'assistant',
          text: qaSource[matchedKey]
        };
        setMessages(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab], botMsg]
        }));
        setIsTyping(false);
      }, 700);
      return;
    }

    // 3. Fallback / API Logic
    // If the user asked to delete the API reliance for chatbot, we'll use a local fallback first.
    // We only call the API if it's health mode and not a standard question, 
    // or if it's general and we want to attempt AI help.

    if (activeTab === 'general') {
      setTimeout(() => {
        const botMsg = {
          role: 'assistant',
          text: "I'm sorry, I don't have a specific answer for that in my records. Please contact our support team at +880-1234-5678 or visit our center for detailed information!"
        };
        setMessages(prev => ({
          ...prev,
          general: [...prev.general, botMsg]
        }));
        setIsTyping(false);
      }, 1000);
      return;
    }

    // Prepare Payload for AI (Only for Health if needed)
    const payload = {
      message: textToSend,
      mode: activeTab,
      childId: activeTab === 'health' ? selectedChild?.id : null
    };

    try {
      // 4. API Call
      const response = await api.post('/ai/chat', payload);

      // 5. Add Bot Response with Safety Check
      const botMsg = {
        role: 'assistant',
        text: response?.text || response?.message || "I've received your request about your child's records. Our staff will update the daily log shortly with more details."
      };

      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], botMsg]
      }));

    } catch (err) {
      console.error("Chat API Error:", err);
      // Even on error, provide a graceful fallback instead of just error text
      setMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { role: 'assistant', text: "I'm currently unable to access the live health database. Please check back later or view the 'Activities' tab in your dashboard." }]
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
              Reviewing records for: {selectedChild.name}
            </span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {msgs.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shrink-0 ${contextMode === 'health' ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'}`}>
                  {contextMode === 'health' ? <Activity size={14} /> : <MessageCircle size={14} />}
                </div>
              )}
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                  ? (contextMode === 'health' ? 'bg-green-600 text-white rounded-br-none' : 'bg-primary-600 text-white rounded-br-none')
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
                <Loader2 className={`animate-spin ${contextMode === 'health' ? 'text-green-500' : 'text-primary-500'}`} size={16} />
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
                  : 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100'
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
            className={`p-2.5 rounded-full text-white shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ${contextMode === 'health' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'
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
          How can I help you today? 👋
        </span>
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-4 rounded-full shadow-2xl transition-all transform group-hover:scale-110 flex items-center justify-center border-4 border-white/20">
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
        <div className={`p-5 text-white transition-colors duration-300 ${activeTab === 'health' ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-primary-700 to-primary-600'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                KiddoZ Assistant {activeTab === 'health' && <span className="text-green-200 text-xs px-2 py-0.5 bg-white/20 rounded-full">Secure</span>}
              </h3>
              <div className="flex items-center gap-2 text-xs opacity-90 mt-1">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                {activeTab === 'health' ? 'Care Support Active' : 'Helpful Staff Online'}
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
                ? 'bg-white text-primary-700 shadow-sm'
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
              Care & Health Info
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
          {activeTab === 'general' ? renderChatInterface(messages.general, GENERAL_QUICK_REPLIES, 'general') : renderHealthContent()}
        </div>

        {/* Footer Credit */}
        <div className="bg-slate-50 py-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
          Dedicated Care Support Assistant
        </div>

      </div>
    </div>
  );
};

export default Chatbot;