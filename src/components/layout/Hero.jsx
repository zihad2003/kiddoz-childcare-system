import React from 'react';
import Badge from '../ui/Badge';

const Hero = ({ setView }) => (
  <div className="relative overflow-hidden bg-purple-900 text-white pt-28 pb-40">
    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80')] bg-cover bg-center" />
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-900/80 to-slate-50" />
    <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
      <Badge color="bg-white/10 text-purple-200 border border-purple-400/30 mb-8 backdrop-blur-md">Next Generation Childcare</Badge>
      <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">Safe. Smart. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-purple-300 animate-gradient-x">Connected.</span></h1>
      <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">KiddoZ is the complete ecosystem for modern families. From AI-powered health tracking to real-time YOLOv8 monitoring.</p>
      <div className="flex flex-col sm:flex-row gap-5 justify-center">
        <button onClick={() => setView('tour')} className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold px-10 py-5 rounded-full text-lg transition transform hover:-translate-y-1 hover:shadow-2xl">Book a Tour</button>
        <button onClick={() => setView('enroll')} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold px-10 py-5 rounded-full text-lg transition">See Pricing</button>
      </div>
    </div>
  </div>
);

export default Hero;