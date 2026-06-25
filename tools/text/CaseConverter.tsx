import React, { useState } from 'react';
import { AlignCenter, Copy, Check } from 'lucide-react';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';

const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'alternating' | 'inverse') => {
    let result = '';
    switch (type) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'alternating':
        result = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'inverse':
        result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
    }
    setText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => setText('');

  return (
    <ToolLayout
      title="Case Converter"
      description="Easily convert text between Uppercase, Lowercase, Title Case, and more."
      relatedTools={[{ name: 'Word Counter', path: '/tools/word-counter' }]}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" onClick={() => convertCase('upper')}>UPPERCASE</Button>
            <Button variant="outline" onClick={() => convertCase('lower')}>lowercase</Button>
            <Button variant="outline" onClick={() => convertCase('title')}>Title Case</Button>
            <Button variant="outline" onClick={() => convertCase('sentence')}>Sentence case</Button>
            <Button variant="outline" onClick={() => convertCase('alternating')}>aLtErNaTiNg</Button>
            <Button variant="outline" onClick={() => convertCase('inverse')}>InVeRsE</Button>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-y"
            />
            <div className="absolute top-2 right-2 flex gap-2">
               <button 
                  onClick={copyToClipboard} 
                  className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                  title="Copy Text"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
               </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
             <span>Character count: {text.length}</span>
             <div className="space-x-4">
                <Button variant="secondary" onClick={clearText} className="px-4 py-2 text-sm">Clear Text</Button>
                <Button onClick={copyToClipboard} className="px-4 py-2 text-sm">Copy Result</Button>
             </div>
          </div>

        </div>
      </div>
    </ToolLayout>
  );
};

export default CaseConverter;