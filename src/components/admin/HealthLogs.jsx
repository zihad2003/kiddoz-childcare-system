import React from 'react';
import { Activity } from 'lucide-react';
import Card from '../ui/Card';

const HealthLogs = ({ studentName, studentId }) => {
  return (
    <Card className="text-center py-20">
      <Activity size={64} className="mx-auto text-purple-300 mb-6" />
      <h2 className="text-3xl font-bold text-purple-900 mb-4">Health Data Analysis for {studentName}</h2>
      <p className="text-slate-500 max-w-lg mx-auto mb-8">
        This module aggregates data specifically for Student ID: <strong>{studentId}</strong>.
      </p>
    </Card>
  );
};

export default HealthLogs;