import React, { useEffect, useState } from 'react';
import { Routes,Route} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { allTools } from './data/tools';
import toolKeywords from './data/toolKeywords';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PdfTools from './pages/PdfTools';
import TextTools from './pages/TextTools';
import ImageTools from './pages/ImageTools';
import StudentTools from './pages/StudentTools';
import DailyTools from './pages/DailyTools'; 
import Legal from './pages/Legal';

// PDF Tool Implementations
import PdfMerge from './tools/pdf/PdfMerge';
import PdfSplit from './tools/pdf/PdfSplit';
import ImageToPdf from './tools/pdf/ImageToPdf';
import PdfToImage from './tools/pdf/PdfToImage';
import PdfCompress from './tools/pdf/PdfCompress';
import PdfDelete from './tools/pdf/PdfDelete';
import PdfRotate from './tools/pdf/PdfRotate';
import PdfEdit from './tools/pdf/PdfEdit';
import PdfWatermark from './tools/pdf/PdfWatermark';
import PdfPageNumbers from './tools/pdf/PdfPageNumbers';
import PdfCrop from './tools/pdf/PdfCrop';
import PdfTextExtract from './tools/pdf/PdfTextExtract';

// Text Tool Implementations
import WordCounter from './tools/text/WordCounter';
import CaseConverter from './tools/text/CaseConverter';

// Image Tool Implementations
import ImageResizer from './tools/image/ImageResizer';
import ImageConverter from './tools/image/ImageConverter';

// Student Tool Implementations
import ExamTimer from './tools/student/ExamTimer';
import RevisionPlanner from './tools/student/RevisionPlanner';
import AnswerLength from './tools/student/AnswerLength';
import McqGenerator from './tools/student/McqGenerator';
import NotesFormatter from './tools/student/NotesFormatter';

// Daily/Security Tools
import AgeCalculator from './tools/calculators/AgeCalculator';
import PasswordGenerator from './tools/security/PasswordGenerator';

import NotFound from './pages/NotFound';
import { useRecentTools } from './hooks/useRecentTools';

// Scroll to top on route change & Track Recent Tools
const RouteListener = () => {
  const { pathname, hash } = useLocation();
  const { addRecentTool } = useRecentTools();
  const currentTool = allTools.find((tool) => tool.path === pathname);
  const currentKeywords = toolKeywords[pathname] || currentTool?.keywords || '';
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : 'https://letterflow.online/';

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Track recent tool visit
    if (pathname.startsWith('/tools/')) {
        addRecentTool(pathname);
    }
  }, [pathname, hash]); // addRecentTool is stable, but we can exclude it or include it.
  
  return (
    <>
      {currentTool && (
        <Helmet>
          <title>{currentTool.name} | LetterFlow Toolbox</title>
          <meta name="description" content={currentTool.description} />
          <meta name="keywords" content={currentKeywords} />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content={`${currentTool.name} | ToolBox`} />
          <meta property="og:description" content={currentTool.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:image" content="https://letterflow.online/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${currentTool.name} | ToolBox`} />
          <meta name="twitter:description" content={currentTool.description} />
        </Helmet>
      )}
    </>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Default to light mode
    setDarkMode(false);
    document.documentElement.classList.remove('dark');
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col font-sans selection:bg-brand-500 selection:text-white ${darkMode ? 'dark bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
        <RouteListener />
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Category Pages */}
            <Route path="/tools/pdf" element={<PdfTools />} />
            <Route path="/tools/text" element={<TextTools />} />
            <Route path="/tools/image" element={<ImageTools />} />
            <Route path="/tools/student" element={<StudentTools />} />
            <Route path="/tools/daily" element={<DailyTools />} />

            {/* PDF Tools */}
            <Route path="/tools/pdf-merge" element={<PdfMerge />} />
            <Route path="/tools/pdf-split" element={<PdfSplit />} />
            <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
            <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
            <Route path="/tools/pdf-compress" element={<PdfCompress />} />
            <Route path="/tools/pdf-delete" element={<PdfDelete />} />
            <Route path="/tools/pdf-rotate" element={<PdfRotate />} />
            <Route path="/tools/pdf-edit" element={<PdfEdit />} />
            <Route path="/tools/pdf-watermark" element={<PdfWatermark />} />
            <Route path="/tools/pdf-page-numbers" element={<PdfPageNumbers />} />
            <Route path="/tools/pdf-crop" element={<PdfCrop />} />
            <Route path="/tools/pdf-extract-text" element={<PdfTextExtract />} />
            
            {/* Text Tools */}
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/case-converter" element={<CaseConverter />} />
            
            {/* Image Tools */}
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-converter" element={<ImageConverter />} />
            
            {/* Student Tools */}
            <Route path="/tools/exam-timer" element={<ExamTimer />} />
            <Route path="/tools/revision-planner" element={<RevisionPlanner />} />
            <Route path="/tools/answer-length" element={<AnswerLength />} />
            <Route path="/tools/mcq-generator" element={<McqGenerator />} />
            <Route path="/tools/notes-formatter" element={<NotesFormatter />} />
            
            {/* Daily Tools */}
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
