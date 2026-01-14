import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../ui/Button';

const PlanSelectionStep = ({ PLANS, selectedPlan, onSelect, onNext }) => {
    return (
        <div className="animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Care Plan</h1>
                <p className="text-slate-500 text-lg">Flexible options designed for your family's needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {PLANS.map((plan) => (
                    <div
                        key={plan.id}
                        onClick={() => onSelect(plan)}
                        className={`cursor-pointer relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${selectedPlan?.id === plan.id ? 'border-purple-500 shadow-purple-200 ring-4 ring-purple-500/10' : 'border-transparent shadow-xl'}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline mb-6">
                            <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                            <span className="text-slate-400 font-medium ml-1">{plan.period}</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(plan);
                                onNext();
                            }}
                            variant={selectedPlan?.id === plan.id ? 'primary' : (plan.popular ? 'primary' : 'outline')}
                            className="w-full"
                            icon={ArrowRight}
                        >
                            {selectedPlan?.id === plan.id ? 'Continue' : 'Select Plan'}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanSelectionStep;
