import React from 'react';
import { Activity, Thermometer, Smile, Clock, AlertTriangle, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

// Mock data generator for history
const MOCK_HISTORY = [
  { date: 'Today, 10:30 AM', type: 'Vitals', note: 'Temperature 98.6°F, Mood: Happy', icon: Thermometer, color: 'text-green-500 bg-green-100' },
  { date: 'Yesterday, 2:15 PM', type: 'Incident', note: 'Small scraped knee on playground. Cleaned and bandaged.', icon: AlertTriangle, color: 'text-amber-500 bg-amber-100' },
  { date: 'Yesterday, 9:00 AM', type: 'Check-in', note: 'Dropped off by Father. Mood: Sleepy.', icon: Clock, color: 'text-blue-500 bg-blue-100' },
  { date: 'Oct 24, 11:30 AM', type: 'Meal', note: 'Ate 100% of lunch. Chicken and Rice.', icon: Calendar, color: 'text-purple-500 bg-purple-100' },
];

const HealthLogs = ({ student }) => {
  if (!student) return <div className="text-center p-4 text-slate-400">Select a student to view logs.</div>;

  return (
    <Card className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-purple-600" size={24} />
          Health & Activity Log
        </h3>
        <Badge color="bg-purple-100 text-purple-700">Last 7 Days</Badge>
      </div>

      <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
        {MOCK_HISTORY.map((log, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${log.color}`}>
              <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${log.color} bg-opacity-20`}>
                <log.icon size={20} className={log.color.split(' ')[0]} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{log.date}</span>
                <h4 className="font-bold text-slate-800 text-base">{log.type}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 inline-block">
                  {log.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <button className="text-purple-600 font-bold text-sm hover:underline">View Full History</button>
      </div>
    </Card>
  );
};

export default HealthLogs;