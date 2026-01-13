import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, Star, Award, Zap } from 'lucide-react';

const SkillBar = ({ label, percentage, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span className="text-sm font-bold text-slate-500">{percentage}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const ProgressCharts = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><TrendingUp size={20} /></div>
          <h3 className="font-bold text-lg text-slate-800">Core Skills Progress</h3>
        </div>

        <SkillBar label="Social Interaction" percentage={85} color="bg-blue-500" />
        <SkillBar label="Motor Skills" percentage={70} color="bg-purple-500" />
        <SkillBar label="Language" percentage={92} color="bg-emerald-500" />
        <SkillBar label="Creative Arts" percentage={65} color="bg-amber-500" />

        <div className="mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">Based on weekly teacher assessments.</p>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6 bg-gradient-to-br from-violet-600 to-purple-700 text-white border-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">Next Milestone</h3>
              <p className="text-purple-200 text-sm">Approaching fast!</p>
            </div>
            <Award className="text-amber-300" size={32} />
          </div>
          <div className="mb-4">
            <h2 className="text-3xl font-bold">Vocabulary 500+</h2>
            <p className="text-sm text-purple-200 mt-1">Expected: Nov 15</p>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2">
            <div className="h-2 rounded-full bg-amber-400 w-3/4"></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Star className="text-amber-400" size={18} /> Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs"><Check /></div>
              <span className="text-sm font-medium text-slate-600">Shared toys without prompting</span>
            </div>
            <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs"><Zap /></div>
              <span className="text-sm font-medium text-slate-600">Completed puzzle independently</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Check = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default ProgressCharts;