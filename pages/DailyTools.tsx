import React from 'react';
import { Calculator, Lock, Binary, Percent } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const DailyTools: React.FC = () => {
  const tools = [
    { name: 'Age Calculator', description: 'Calculate precise age and upcoming birthdays.', icon: Calculator, path: '/tools/age-calculator' },
    { name: 'Password Generator', description: 'Create strong random passwords.', icon: Lock, path: '/tools/password-generator' },
    // Placeholders for future expansion
    { name: 'Percentage Calc', description: 'Simple percentage calculations.', icon: Percent, path: '/tools/daily' },
    { name: 'Base64 Converter', description: 'Encode and decode Base64 strings.', icon: Binary, path: '/tools/daily' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Daily Utilities</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Essential calculators and converters for everyday tasks.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default DailyTools;