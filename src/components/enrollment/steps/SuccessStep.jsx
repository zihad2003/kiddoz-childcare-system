import React from 'react';
import { CheckCircle, Calendar } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

const SuccessStep = ({ planName, onGoDashboard }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-lg text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-100 shadow-xl">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-slate-900">Welcome to KiddoZ!</h2>
                <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                    Your enrollment in <strong>{planName || "our program"}</strong> is confirmed.
                </p>

                <div className="bg-purple-50 p-6 rounded-2xl mb-8 text-left border border-purple-100">
                    <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
                        <Calendar size={20} /> First Day Schedule
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-800">
                        <li>• Drop-off: <strong>8:00 AM - 8:30 AM</strong></li>
                        <li>• Bring: Change of clothes, Water bottle</li>
                        <li>• Location: Main Entrance (Zone A)</li>
                    </ul>
                </div>

                <Button onClick={onGoDashboard} size="lg" className="w-full">
                    Go to Parent Dashboard
                </Button>
            </Card>
        </div>
    );
};

export default SuccessStep;
