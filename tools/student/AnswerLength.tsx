import React, { useState } from 'react';
import { PenTool, CheckCircle, AlertTriangle } from 'lucide-react';
import ToolLayout from '../../components/ui/ToolLayout';

const AnswerLength: React.FC = () => {
  const [text, setText] = useState('');
  const [limitType, setLimitType] = useState<'words' | 'chars'>('words');
  const [limit, setLimit] = useState(500);

  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  
  const currentCount = limitType === 'words' ? words : chars;
  const percentage = Math.min((currentCount / limit) * 100, 100);
  const isOverLimit = currentCount > limit;
  const isNearLimit = percentage > 90 && !isOverLimit;

  return (
    <ToolLayout
      title="Answer Length Checker"
      description="Ensure your essays and answers meet the required length constraints."
      relatedTools={[{ name: 'Word Counter', path: '/tools/word-counter' }]}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Limit Type</label>
               <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                 <button 
                   onClick={() => setLimitType('words')}
                   className={`flex-1 py-2 text-sm font-medium ${limitType === 'words' ? 'bg-brand-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                 >
                   Words
                 </button>
                 <button 
                   onClick={() => setLimitType('chars')}
                   className={`flex-1 py-2 text-sm font-medium ${limitType === 'chars' ? 'bg-brand-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                 >
                   Characters
                 </button>
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Limit</label>
               <input 
                 type="number" 
                 value={limit} 
                 onChange={(e) => setLimit(Number(e.target.value))} 
                 className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
               />
            </div>
            <div className="flex flex-col justify-end">
               <div className={`p-2 rounded-lg border flex items-center justify-center gap-2 ${
                  isOverLimit 
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' 
                    : isNearLimit 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/20 dark:border-yellow-800'
                    : 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800'
               }`}>
                  {isOverLimit ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                  <span className="font-bold">{currentCount} / {limit}</span>
               </div>
            </div>
          </div>

          <div className="relative mb-2">
             <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    isOverLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
             </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your answer or essay here..."
            className="w-full h-96 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </ToolLayout>
  );
};

export default AnswerLength;