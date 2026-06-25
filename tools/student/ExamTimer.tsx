import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Bell } from 'lucide-react';
import Button from '../../components/ui/Button';

const ExamTimer: React.FC = () => {
  const [duration, setDuration] = useState(60); // minutes
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      // Play sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Free alert sound
      audio.play().catch(e => console.log('Audio play failed', e));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
       <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Exam Timer</h1>
        <p className="text-slate-600 dark:text-slate-400">Simulate exam conditions with this precise timer.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-12">
        <div className={`text-7xl font-mono font-bold tracking-wider mb-8 ${timeLeft < 300 && isActive ? 'text-red-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
          {formatTime(timeLeft)}
        </div>

        {isFinished && (
           <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
             <Bell className="w-6 h-6 mr-2" /> Time's Up! Pencils down.
           </div>
        )}

        <div className="flex justify-center space-x-6 mb-8">
          <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 shadow-lg transition-transform hover:scale-105"
          >
            <RefreshCw size={28} />
          </button>
        </div>

        <div className="space-y-4 max-w-xs mx-auto">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Set Duration (minutes)</label>
          <div className="flex gap-2">
             <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))} 
              className="flex-1 p-2 border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              disabled={isActive}
            />
            <Button onClick={resetTimer} disabled={isActive} variant="secondary">Set</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTimer;