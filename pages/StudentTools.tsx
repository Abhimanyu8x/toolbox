import React from 'react';
import { Timer, Calendar, BookOpen, PenTool, CheckSquare, BrainCircuit } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const StudentTools: React.FC = () => {
  const tools = [
    { name: 'Exam Timer', description: 'Countdown timer with alerts for practice.', icon: Timer, path: '/tools/exam-timer' },
    { name: 'Revision Planner', description: 'Generate a study schedule.', icon: Calendar, path: '/tools/revision-planner' },
    { name: 'Answer Length', description: 'Check word limits for essays.', icon: PenTool, path: '/tools/answer-length' },
    { name: 'MCQ Generator', description: 'Create quizzes from your notes.', icon: CheckSquare, path: '/tools/mcq-generator' },
    { name: 'Notes Formatter', description: 'Clean up messy text from slides.', icon: BookOpen, path: '/tools/notes-formatter' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Student Tools</h1>
        <p className="text-slate-600 dark:text-slate-400">Boost your productivity with tools designed for studying.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default StudentTools;