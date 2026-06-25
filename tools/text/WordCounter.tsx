import React, { useState, useEffect } from 'react';
import { AlignLeft, Clock, Type, Mic, PenTool, Trash2, Copy, Check } from 'lucide-react';
import { countWords, countChars, countSentences, countParagraphs, calculateReadingTime, getLetterFrequency } from '../../utils/textUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Button from '../../components/ui/Button';

const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    charsNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    handwritingTime: 0,
  });
  const [frequency, setFrequency] = useState<{name: string, count: number}[]>([]);

  useEffect(() => {
    const words = countWords(text);
    setStats({
      words,
      chars: countChars(text, true),
      charsNoSpace: countChars(text, false),
      sentences: countSentences(text),
      paragraphs: countParagraphs(text),
      readingTime: calculateReadingTime(text),
      speakingTime: Math.ceil(words / 130), // Avg speaking speed 130 wpm
      handwritingTime: Math.ceil(words / 20), // Avg handwriting speed 20 wpm
    });
    setFrequency(getLetterFrequency(text));
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the text?')) {
      setText('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-300 transition-colors">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl mb-1">
            <Type size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.words}</p>
          <p className="text-sm font-medium text-slate-500">Words</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-300 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-1">
            <AlignLeft size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.chars}</p>
          <p className="text-sm font-medium text-slate-500">Characters</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-300 transition-colors">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl mb-1">
            <Clock size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.readingTime} <span className="text-sm font-normal text-slate-400">min</span></p>
          <p className="text-sm font-medium text-slate-500">Reading Time</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-300 transition-colors">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl mb-1">
            <Mic size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.speakingTime} <span className="text-sm font-normal text-slate-400">min</span></p>
          <p className="text-sm font-medium text-slate-500">Speaking Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Text Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <textarea
              className="w-full h-[500px] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:outline-none resize-none shadow-sm text-lg leading-relaxed transition-all"
              placeholder="Type or paste your text here to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            
            {/* Floating Actions */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <button 
                onClick={handleCopy}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                title="Copy Text"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
              <button 
                onClick={handleClear}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Clear Text"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
           <div className="flex justify-between items-center px-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
             <div className="flex space-x-6">
               <span className="font-medium">Sentences: <span className="text-slate-900 dark:text-white">{stats.sentences}</span></span>
               <span className="font-medium">Paragraphs: <span className="text-slate-900 dark:text-white">{stats.paragraphs}</span></span>
             </div>
             <div className="text-xs text-slate-400">
               Auto-updates as you type
             </div>
           </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Detailed Metrics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               <AlignLeft size={20} className="text-brand-500" />
               Details
             </h3>
             <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
               <li className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                 <span>Characters (no spaces)</span> 
                 <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{stats.charsNoSpace}</span>
               </li>
               <li className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                 <span>Avg. Word Length</span> 
                 <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{stats.words > 0 ? (stats.charsNoSpace / stats.words).toFixed(1) : 0}</span>
               </li>
               <li className="flex justify-between items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                 <span className="flex items-center gap-2"><PenTool size={14} /> Handwriting Time</span> 
                 <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">~{stats.handwritingTime} min</span>
               </li>
             </ul>
          </div>

          {/* Frequency Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Letter Frequency</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequency}>
                  <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                  <YAxis tick={{fontSize: 10}} width={30} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {frequency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;