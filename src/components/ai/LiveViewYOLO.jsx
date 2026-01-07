import React from 'react';
import { ScanFace, Video } from 'lucide-react';
import Card from '../ui/Card';

const LiveViewYOLO = ({ student }) => {
  if (!student) return <div className="p-4 bg-slate-100 rounded text-center">Please select a child to view feed.</div>;

  return (
    <Card className="overflow-hidden p-0 border-0 bg-black relative group">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-[55%] left-[45%] w-[12%] h-[25%] border-2 border-green-500 rounded-lg animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
          <div className="absolute -top-7 left-0 bg-green-500 text-black text-[10px] font-bold px-2 py-1 rounded-t flex items-center gap-1">
            <ScanFace size={12} /> {student.name.split(' ')[0]} [{student.id}] (98%)
          </div>
        </div>
      </div>
      <div className="bg-slate-900 aspect-video relative flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1502086223501-6a381950392a?auto=format&fit=crop&q=80" alt="Live" className="w-full h-full object-cover opacity-90" />
        <div className="absolute top-6 left-6 flex gap-3 z-20">
          <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-2 animate-pulse">LIVE</div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-20">
          <div className="bg-black/70 p-3 rounded-xl border border-green-500/30">
            <p className="text-green-400 text-xs font-bold font-mono">YOLOv8 TRACKING: {student.id}</p>
          </div>
          <button className="bg-white/10 p-3 rounded-full backdrop-blur-md"><Video size={24} className="text-white" /></button>
        </div>
      </div>
    </Card>
  );
};

export default LiveViewYOLO;