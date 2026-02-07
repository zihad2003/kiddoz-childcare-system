import React from 'react';
import { MessageSquare } from 'lucide-react';

const FloatingChat = () => {
    return (
        <button
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-primary to-primary-magenta rounded-full flex items-center justify-center text-white shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all animate-bounce group"
            aria-label="Chat with AI"
        >
            <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>
    );
};

export default FloatingChat;
