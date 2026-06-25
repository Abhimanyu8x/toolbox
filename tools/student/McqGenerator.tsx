import React, { useState } from 'react';
import { CheckSquare, BrainCircuit, RefreshCw, AlertTriangle } from 'lucide-react';
import ToolLayout from '../../components/ui/ToolLayout';
import Button from '../../components/ui/Button';

interface Question {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const McqGenerator: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback generation (Client-side Cloze) if AI fails or key missing
  const generateManualCloze = () => {
    if (!sourceText.trim()) return;
    const sentences = sourceText.match(/[^.!?]+[.!?]+/g) || [sourceText];
    const newQuestions: Question[] = [];

    sentences.slice(0, 5).forEach(sentence => {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        // Pick a random word to blank out (simple heuristic: > 4 chars)
        const candidates = words.map((w, i) => ({w, i})).filter(item => item.w.length > 4);
        if (candidates.length > 0) {
          const target = candidates[Math.floor(Math.random() * candidates.length)];
          const blankedSentence = words.map((w, i) => i === target.i ? '_______' : w).join(' ');
          
          // Generate dummy options
          const options = [target.w, 'incorrect', 'option', 'filler'].sort(() => Math.random() - 0.5);
          
          newQuestions.push({
            question: blankedSentence,
            options: options,
            correctAnswerIndex: options.indexOf(target.w)
          });
        }
      }
    });
    setQuestions(newQuestions);
  };

  const generateWithAI = async () => {
    if (!sourceText.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      // Avoid using any client-side API keys for security reasons.
      generateManualCloze();
      setError("AI generation is disabled in the browser for security. Questions were generated locally.");
    } catch (err: any) {
      console.warn("Local generation failed.", err);
      setError("Question generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout
      title="MCQ Generator"
      description="Turn your notes into a quiz instantly using AI."
      relatedTools={[{ name: 'Exam Timer', path: '/tools/exam-timer' }]}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
           <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Paste your study notes here:</label>
           <textarea
             value={sourceText}
             onChange={(e) => setSourceText(e.target.value)}
             placeholder="Paste text to generate questions from..."
             className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none resize-none mb-4"
           />
           
           <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{sourceText.length} characters</span>
              <Button onClick={generateWithAI} isLoading={isGenerating} disabled={!sourceText}>
                 <BrainCircuit className="w-4 h-4 mr-2" /> Generate Quiz
              </Button>
           </div>

           {error && (
             <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm rounded-lg flex items-center">
               <AlertTriangle size={16} className="mr-2" /> {error}
             </div>
           )}
        </div>

        {/* Results */}
        {questions.length > 0 && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generated Quiz</h2>
               <Button variant="outline" onClick={() => setQuestions([])} className="text-sm">
                 <RefreshCw className="w-4 h-4 mr-2" /> Clear
               </Button>
             </div>

             <div className="grid gap-6">
               {questions.map((q, idx) => (
                 <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-lg mb-4 text-slate-900 dark:text-white">
                      {idx + 1}. {q.question}
                    </h3>
                    <div className="space-y-2">
                       {q.options.map((opt, optIdx) => (
                         <div 
                           key={optIdx} 
                           className={`p-3 rounded-lg border flex items-center ${
                             optIdx === q.correctAnswerIndex 
                               ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                               : 'border-slate-200 dark:border-slate-700'
                           }`}
                         >
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-sm font-medium ${
                               optIdx === q.correctAnswerIndex ? 'bg-green-500 text-white border-green-500' : 'text-slate-500 border-slate-300'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className={optIdx === q.correctAnswerIndex ? 'font-medium text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}>
                              {opt}
                            </span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
};

export default McqGenerator;