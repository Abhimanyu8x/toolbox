import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import { Copy, RefreshCw, Check, History, Trash2 } from 'lucide-react';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [easyToSay, setEasyToSay] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generatePassword = () => {
    let charset = '';
    
    if (easyToSay) {
      // Easy to say: avoid numbers and symbols, focus on letters
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else {
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    }

    if (excludeAmbiguous) {
      // Remove I, l, 1, O, 0
      charset = charset.replace(/[Il1O0]/g, '');
    }

    if (charset === '') {
        // Fallback if nothing selected
        charset = 'abcdefghijklmnopqrstuvwxyz'; 
    }

    const getSecureRandomInt = (max: number) => {
      if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        const range = 0xffffffff - (0xffffffff % max);
        let rand = window.crypto.getRandomValues(array)[0];
        while (rand >= range) {
          rand = window.crypto.getRandomValues(array)[0];
        }
        return rand % max;
      }
      return Math.floor(Math.random() * max);
    };

    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(getSecureRandomInt(n));
    }
    setPassword(retVal);
    setCopied(false);
    
    // Add to history
    setHistory(prev => {
        const newHistory = [retVal, ...prev];
        return newHistory.slice(0, 5); // Keep last 5
    });
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, easyToSay]);

  const copyToClipboard = (text: string = password) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length > 8) score++;
    if (length > 12) score++;
    if (includeUppercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;
    if (easyToSay) score--; // Penalty for reduced charset

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrength();

  return (
    <ToolLayout
      title="Password Generator"
      description="Create strong, secure passwords instantly to protect your accounts."
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
                {/* Output Display */}
                <div className="relative mb-8">
                <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-xl break-all font-mono text-2xl text-slate-800 dark:text-slate-200 min-h-[5rem] flex items-center justify-center text-center border-2 border-transparent focus-within:border-brand-500 transition-colors">
                    {password}
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-2">
                    <button 
                    onClick={generatePassword} 
                    className="p-2 text-slate-400 hover:text-brand-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
                    title="Regenerate"
                    >
                    <RefreshCw size={20} />
                    </button>
                    <button 
                    onClick={() => copyToClipboard()} 
                    className="p-2 text-slate-400 hover:text-green-500 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
                    title="Copy"
                    >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                        <label className="text-slate-700 dark:text-slate-300 font-medium">Password Length: {length}</label>
                        <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${strength.color}`}>{strength.label}</span>
                        </div>
                        <input 
                        type="range" 
                        min="8" 
                        max="50" 
                        value={length} 
                        onChange={(e) => setLength(parseInt(e.target.value))} 
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Uppercase (A-Z)', state: includeUppercase, setter: setIncludeUppercase, disabled: easyToSay },
                            { label: 'Lowercase (a-z)', state: includeLowercase, setter: setIncludeLowercase, disabled: easyToSay },
                            { label: 'Numbers (0-9)', state: includeNumbers, setter: setIncludeNumbers, disabled: easyToSay },
                            { label: 'Symbols (!@#)', state: includeSymbols, setter: setIncludeSymbols, disabled: easyToSay },
                            { label: 'Exclude Ambiguous (I, 1, O, 0)', state: excludeAmbiguous, setter: setExcludeAmbiguous },
                            { label: 'Easy to Say (No numbers/symbols)', state: easyToSay, setter: setEasyToSay },
                        ].map((opt, idx) => (
                            <label key={idx} className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${opt.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input 
                                type="checkbox" 
                                checked={opt.state} 
                                onChange={(e) => !opt.disabled && opt.setter(e.target.checked)}
                                disabled={opt.disabled}
                                className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-500 dark:bg-slate-700"
                            />
                            <span className="text-slate-700 dark:text-slate-300">{opt.label}</span>
                            </label>
                        ))}
                    </div>

                    <Button onClick={generatePassword} className="w-full py-3 text-lg shadow-brand-500/20">Generate New Password</Button>
                </div>
            </div>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <History size={20} className="text-brand-500" />
                        History
                    </h3>
                    <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 size={12} /> Clear
                    </button>
                </div>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-8">No history yet</p>
                    ) : (
                        history.map((pass, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 transition-colors">
                                <span className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate max-w-[180px]">{pass}</span>
                                <button 
                                    onClick={() => copyToClipboard(pass)}
                                    className="text-slate-400 hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Copy"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </div>
    </ToolLayout>
  );
};

export default PasswordGenerator;