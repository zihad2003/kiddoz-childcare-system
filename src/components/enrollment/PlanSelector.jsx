import React from 'react';
import { Check } from 'lucide-react';

const PlanSelector = ({ plan, onSelect }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-xl flex flex-col relative ${plan.popular ? 'border-4 border-purple-400 transform md:-translate-y-4' : 'border border-slate-100'}`}>
    {plan.popular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
    <div className="flex items-baseline mb-6">
      <span className="text-4xl font-black text-slate-900">{plan.price}</span>
      <span className="text-slate-500 ml-1">{plan.period}</span>
    </div>
    <ul className="space-y-4 mb-8 flex-1">
      {plan.features.map((feat, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
          <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
          {feat}
        </li>
      ))}
    </ul>
    <button 
      onClick={() => onSelect(plan)}
      className={`w-full py-4 rounded-xl font-bold text-white transition shadow-md ${plan.btnColor}`}
    >
      Enroll Now
    </button>
  </div>
);

export default PlanSelector;