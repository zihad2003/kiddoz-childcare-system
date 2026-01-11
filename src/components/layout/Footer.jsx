import React from 'react';
import { MapPin, MessageCircle, Calendar } from 'lucide-react';

const Footer = ({ setView }) => (
  <footer className="bg-purple-950 text-purple-200 py-16 font-sans">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
      <div>
        <h3 className="text-3xl font-bold text-white mb-6">KiddoZ</h3>
        <p className="text-purple-200/80 leading-relaxed mb-6">We are a modern childcare ecosystem dedicated to making early education safer and smarter through the power of AI.</p>
        <div className="flex gap-4">
          {/* Social Placeholders */}
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white">fb</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white">in</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white">tw</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Our Programs</h4>
        <ul className="space-y-4">
          <li><button onClick={() => { console.log('Programs clicked'); setView('programs'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Pre-School (3-5 Yrs)</button></li>
          <li><button onClick={() => { setView('programs'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Day Care (6mo-3 Yrs)</button></li>
          <li><button onClick={() => { setView('programs'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Nanny Service</button></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Support</h4>
        <ul className="space-y-4">
          <li><button onClick={() => { setView('info-help'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Help Center</button></li>
          <li><button onClick={() => { setView('info-safety'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Safety Protocols</button></li>
          <li><button onClick={() => { setView('login'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Parent Login</button></li>
          <li><button onClick={() => { setView('admin'); window.scrollTo(0, 0); }} className="hover:text-amber-400 transition text-left">Admin Portal</button></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <MapPin size={24} className="mt-1 text-amber-400 shrink-0" />
            <span className="opacity-90">Room No 529<br />UIU Playground, Madani Avenue<br />Dhaka, Bangladesh</span>
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle size={20} className="text-amber-400 shrink-0" />
            <a href="mailto:hello@kiddoz.com" className="hover:text-white transition">hello@kiddoz.com</a>
          </li>
          <li className="flex items-center gap-3">
            <Calendar size={20} className="text-amber-400 shrink-0" />
            <span className="opacity-90">Mon - Fri: 8:00 AM - 6:00 PM</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-purple-900 flex flex-col md:flex-row justify-between items-center text-sm text-purple-400">
      <p>© {new Date().getFullYear()} KiddoZ Inc. All rights reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <button onClick={() => { setView('info-privacy'); window.scrollTo(0, 0); }} className="hover:text-white transition">Privacy Policy</button>
        <button onClick={() => { setView('info-terms'); window.scrollTo(0, 0); }} className="hover:text-white transition">Terms & Conditions</button>
      </div>
    </div>
  </footer>
);

export default Footer;