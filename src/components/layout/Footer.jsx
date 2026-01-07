import React from 'react';
import { MapPin, MessageCircle, Calendar } from 'lucide-react';

const Footer = ({ setView }) => (
  <footer className="bg-purple-950 text-purple-200 py-16">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
      <div>
        <h3 className="text-3xl font-bold text-white mb-6">KiddoZ</h3>
        <p className="text-purple-200/80 leading-relaxed">We are a modern childcare ecosystem dedicated to making early education safer and smarter.</p>
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-6">Our Programs</h4>
        <ul className="space-y-4">
          <li><button onClick={() => setView('programs')} className="hover:text-white transition">Pre-School (3-5 Yrs)</button></li>
          <li><button onClick={() => setView('programs')} className="hover:text-white transition">Day Care (6mo-3 Yrs)</button></li>
          <li><button onClick={() => setView('programs')} className="hover:text-white transition">Nanny Service</button></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-6">Support</h4>
        <ul className="space-y-4">
          <li><span className="hover:text-white transition cursor-pointer">Help Center</span></li>
          <li><span className="hover:text-white transition cursor-pointer">Safety Protocols</span></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-white text-lg mb-6">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><MapPin size={20} className="mt-1" /><span>Room N0 529<br/>UIU playground, Madani Avenue</span></li>
          <li className="flex items-center gap-3"><MessageCircle size={20} /><span>hello@kiddoz.com</span></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-purple-900 flex flex-col md:flex-row justify-between items-center text-sm text-purple-400">
      <p>©  KiddoZ . Created by Team SYRAX .</p>
      <div className="flex gap-6 mt-4 md:mt-0"><span className="cursor-pointer">Privacy Policy</span><span className="cursor-pointer">Terms</span></div>
    </div>
  </footer>
);

export default Footer;