import React, { useState } from 'react';
import { BookOpen, Copy, ArrowRight, Wand2 } from 'lucide-react';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';

const NotesFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const formatNotes = (mode: 'cleanup' | 'bullets' | 'sentence' | 'summary') => {
    let result = input;

    if (mode === 'cleanup') {
       // Remove extra whitespace, fix multiple newlines
       result = result.replace(/\s+/g, ' ').trim();
    } else if (mode === 'bullets') {
       // Convert lines to bullets
       result = result.split('\n').filter(line => line.trim()).map(line => `• ${line.trim()}`).join('\n');
    } else if (mode === 'sentence') {
       // Fix sentence case
       result = result.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    } else if (mode === 'summary') {
       // Basic cleanup plus line breaks
       result = result.replace(/([.!?])\s*/g, '$1\n\n');
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolLayout
      title="Notes Formatter"
      description="Clean up messy lecture notes, copied text, or slides into readable formats."
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <label className="font-semibold text-slate-700 dark:text-slate-300">Messy Notes</label>
             <button onClick={() => setInput('')} className="text-xs text-red-500 hover:underline">Clear</button>
           </div>
           <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="w-full h-[500px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
             placeholder="Paste messy text here..."
           />
        </div>

        {/* Output */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <label className="font-semibold text-slate-700 dark:text-slate-300">Formatted Result</label>
             <button onClick={copyToClipboard} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
               <Copy size={12} /> Copy
             </button>
           </div>
           <div className="relative">
              <textarea
                value={output}
                readOnly
                className="w-full h-[500px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                placeholder="Formatted text will appear here..."
              />
              
              {/* Actions Overlay */}
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                 <Button variant="secondary" onClick={() => formatNotes('cleanup')} className="text-xs">
                   <Wand2 size={14} className="mr-1" /> Remove Extra Spaces
                 </Button>
                 <Button variant="secondary" onClick={() => formatNotes('bullets')} className="text-xs">
                   <ArrowRight size={14} className="mr-1" /> Convert to List
                 </Button>
                 <Button variant="secondary" onClick={() => formatNotes('sentence')} className="text-xs">
                   <ArrowRight size={14} className="mr-1" /> Fix Capitalization
                 </Button>
                 <Button variant="secondary" onClick={() => formatNotes('summary')} className="text-xs">
                   <ArrowRight size={14} className="mr-1" /> Break Lines
                 </Button>
              </div>
           </div>
        </div>

      </div>
    </ToolLayout>
  );
};

export default NotesFormatter;