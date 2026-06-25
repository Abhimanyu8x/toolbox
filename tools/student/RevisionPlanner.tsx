import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Subject {
  name: string;
  difficulty: 'hard' | 'medium' | 'easy';
}

const RevisionPlanner: React.FC = () => {
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([{ name: '', difficulty: 'medium' }]);
  const [plan, setPlan] = useState<any[] | null>(null);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', difficulty: 'medium' }]);
  };

  const updateSubject = (index: number, field: keyof Subject, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setSubjects(newSubjects);
  };

  const generatePlan = () => {
    if (!examDate) return;
    const start = new Date();
    const end = new Date(examDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Simple allocation logic
    const validSubjects = subjects.filter(s => s.name);
    if (validSubjects.length === 0) return;

    const schedule = [];
    for(let i=0; i<Math.min(diffDays, 14); i++) { // Generate for next 2 weeks max for demo
       const day = new Date(start);
       day.setDate(day.getDate() + i + 1);
       // Rotate subjects
       const subject = validSubjects[i % validSubjects.length];
       schedule.push({
         date: day.toLocaleDateString(),
         subject: subject.name,
         focus: subject.difficulty === 'hard' ? 'Deep Dive & Practice' : 'Review Notes'
       });
    }
    setPlan(schedule);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Revision Planner</h1>
        <p className="text-slate-600 dark:text-slate-400">Create a structured study plan before your exams.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
         <div className="space-y-6">
            <div>
               <label className="block text-sm font-medium mb-1 dark:text-white">Exam Start Date</label>
               <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" />
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 dark:text-white">Subjects</label>
               {subjects.map((sub, idx) => (
                 <div key={idx} className="flex gap-2 mb-2">
                   <input 
                     placeholder="Subject Name" 
                     value={sub.name} 
                     onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                     className="flex-1 p-2 border rounded dark:bg-slate-700 dark:text-white"
                   />
                   <select 
                     value={sub.difficulty}
                     onChange={(e) => updateSubject(idx, 'difficulty', e.target.value as any)}
                     className="p-2 border rounded dark:bg-slate-700 dark:text-white"
                   >
                     <option value="easy">Easy</option>
                     <option value="medium">Medium</option>
                     <option value="hard">Hard</option>
                   </select>
                 </div>
               ))}
               <button onClick={addSubject} className="text-sm text-brand-600 font-medium hover:underline">+ Add Subject</button>
            </div>

            <Button onClick={generatePlan} className="w-full">Generate Schedule</Button>
         </div>
      </div>

      {plan && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
           <h3 className="text-xl font-bold mb-4 dark:text-white">Your Revision Schedule</h3>
           <div className="space-y-3">
             {plan.map((day, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border-l-4 border-brand-500">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-white">{day.date}</span>
                    <p className="text-sm text-slate-500">{day.subject}</p>
                  </div>
                  <span className="text-xs bg-white dark:bg-slate-600 px-2 py-1 rounded border border-slate-200 dark:border-slate-500">
                    {day.focus}
                  </span>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default RevisionPlanner;