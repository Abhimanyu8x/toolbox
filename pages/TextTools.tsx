import React from 'react';
import { Type, AlignJustify, List, CaseSensitive, FileSearch, Trash, Clock } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const TextTools: React.FC = () => {
  const tools = [
    { name: 'Word Counter', description: 'Count words, chars, and sentences.', icon: Type, path: '/tools/word-counter' },
    { name: 'Case Converter', description: 'Convert text to Uppercase, Lowercase, etc.', icon: CaseSensitive, path: '/tools/case-converter' },
    { name: 'Text to List', description: 'Convert paragraph text into list items.', icon: List, path: '/tools/text-to-list' },
    { name: 'Duplicate Remover', description: 'Remove duplicate lines from text.', icon: Trash, path: '/tools/duplicate-remover' },
    { name: 'Find & Replace', description: 'Search and replace text occurrences.', icon: FileSearch, path: '/tools/find-replace' },
    { name: 'Reading Time', description: 'Estimate reading time for speeches.', icon: Clock, path: '/tools/reading-time' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Text Tools</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Analyze, format, and manipulate text content instantly.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default TextTools;