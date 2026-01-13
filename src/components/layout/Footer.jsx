import React from 'react';
import { MapPin, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-purple-950 text-purple-200 py-16 font-sans">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">K</div>
          <h3 className="text-3xl font-bold text-white leading-none">KiddoZ</h3>
        </div>
        <p className="text-purple-200/80 leading-relaxed mb-6">We are a modern childcare ecosystem dedicated to making early education safer and smarter through the power of AI.</p>
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white text-xs">FB</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white text-xs">IN</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer">
            <span className="font-bold text-white text-xs">TW</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Our Programs</h4>
        <ul className="space-y-4">
          <li><Link to="/programs" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Pre-School (3-5 Yrs)</Link></li>
          <li><Link to="/programs" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Day Care (6mo-3 Yrs)</Link></li>
          <li><Link to="/programs" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Nanny Service</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Support</h4>
        <ul className="space-y-4">
          <li><Link to="/info/help" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Help Center</Link></li>
          <li><Link to="/info/safety" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Safety Protocols</Link></li>
          <li><Link to="/login" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Parent Login</Link></li>
          <li><Link to="/admin" onClick={() => window.scrollTo(0, 0)} className="hover:text-amber-400 transition text-left block">Admin Portal</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <MapPin size={24} className="mt-1 text-amber-400 shrink-0" />
            <span className="opacity-90 text-sm">Room No 529<br />UIU Playground, Madani Avenue<br />Dhaka, Bangladesh</span>
          </li>
          <li className="flex items-center gap-3">
            <MessageCircle size={20} className="text-amber-400 shrink-0" />
            <a href="mailto:hello@kiddoz.com" className="hover:text-white transition text-sm">hello@kiddoz.com</a>
          </li>
          <li className="flex items-center gap-3">
            <Calendar size={20} className="text-amber-400 shrink-0" />
            <span className="opacity-90 text-sm">Mon - Fri: 8:00 AM - 6:00 PM</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-purple-900 flex flex-col md:flex-row justify-between items-center text-sm text-purple-400">
      <p>© {new Date().getFullYear()} KiddoZ Inc. All rights reserved.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <Link to="/info/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">Privacy Policy</Link>
        <Link to="/info/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition">Terms & Conditions</Link>
      </div>
    </div>
  </footer>
);

export default Footer;