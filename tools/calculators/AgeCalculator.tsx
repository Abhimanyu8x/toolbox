import React, { useState } from 'react';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';
import { Calendar, Clock, Star, PartyPopper } from 'lucide-react';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const getZodiacSign = (day: number, month: number) => {
    const zodiacSigns = [
      'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini',
      'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'
    ];
    const lastDay = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
    return (day > lastDay[month]) ? zodiacSigns[month + 1] : zodiacSigns[month];
  };

  const calculateAge = () => {
    if (!birthDate) return;

    const start = new Date(birthDate);
    const end = new Date(targetDate);
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Days until next birthday
    const nextBirthday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (end > nextBirthday) {
       nextBirthday.setFullYear(end.getFullYear() + 1);
    }
    const diffTime = Math.abs(nextBirthday.getTime() - end.getTime());
    const daysUntilBirthday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Total stats
    const totalDiff = Math.abs(end.getTime() - start.getTime());
    const totalWeeks = Math.floor(totalDiff / (1000 * 60 * 60 * 24 * 7));
    const totalHours = Math.floor(totalDiff / (1000 * 60 * 60));
    
    // Zodiac
    const zodiac = getZodiacSign(start.getDate(), start.getMonth());

    // Next birthday day of week
    const nextBdayDay = nextBirthday.toLocaleDateString('en-US', { weekday: 'long' });

    setResult({ years, months, days, daysUntilBirthday, totalWeeks, totalHours, zodiac, nextBdayDay });
  };

  return (
    <ToolLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days, plus interesting facts about your life."
      relatedTools={[{ name: 'Exam Timer', path: '/tools/exam-timer' }]}
    >
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Enter Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age at Date</label>
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
                />
              </div>
              <Button onClick={calculateAge} className="w-full py-3 text-lg shadow-brand-500/20">Calculate Age</Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="md:col-span-2">
          {result ? (
            <div className="space-y-6 animate-fade-in">
               {/* Main Age Card */}
               <div className="bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-black/10 rounded-full blur-3xl"></div>
                  
                  <p className="text-brand-100 font-medium uppercase tracking-wide text-sm mb-2">You are exactly</p>
                  <div className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    {result.years} <span className="text-2xl md:text-3xl font-normal opacity-80">Years</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-brand-50 font-medium text-lg">
                     <span>{result.months} Months</span>
                     <span className="w-1.5 h-1.5 bg-brand-300 rounded-full my-auto"></span>
                     <span>{result.days} Days old</span>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Calendar size={20} /></div>
                      <span className="text-sm text-slate-500 font-medium">Total Weeks</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.totalWeeks.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Clock size={20} /></div>
                      <span className="text-sm text-slate-500 font-medium">Total Hours</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.totalHours.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Star size={20} /></div>
                      <span className="text-sm text-slate-500 font-medium">Zodiac Sign</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{result.zodiac}</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-brand-300 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg"><PartyPopper size={20} /></div>
                      <span className="text-sm text-slate-500 font-medium">Next Birthday</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{result.daysUntilBirthday} Days</p>
                    <p className="text-xs text-slate-400">on a {result.nextBdayDay}</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <Calendar size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Enter your birth date to see detailed stats about your life.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default AgeCalculator;