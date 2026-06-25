import React, { useState } from 'react';
import { Upload, FileText, Copy, Download, Table, AlignLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import saveAs from 'file-saver';
import FileUploader from '../../components/ui/FileUploader';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  fontName: string;
  hasEOL: boolean;
}

const PdfTextExtract: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<'layout' | 'flow'>('layout');

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setExtractedText('');
      setProgress(0);
    }
  };

  const extractPageTextLayout = (items: TextItem[]) => {
    // Sort items by Y (descending) then X (ascending)
    // Tolerance for Y allows grouping items on the "same line" even if slightly misaligned
    const yTolerance = 5;
    
    const sortedItems = [...items].sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) > yTolerance) return yDiff;
      return a.transform[4] - b.transform[4];
    });

    let text = '';
    let lastY = -1000;
    let lastX = -1000;

    for (const item of sortedItems) {
      const x = item.transform[4];
      const y = item.transform[5];
      const str = item.str;

      // Check for new line
      if (lastY !== -1000 && Math.abs(y - lastY) > yTolerance) {
        text += '\n';
        lastX = -1000; // Reset X for new line
      } 
      // Check for spacing on same line
      else if (lastX !== -1000) {
        const gap = x - lastX;
        // If gap is significant, add spaces to simulate column/layout
        if (gap > 5) {
           // Estimate number of spaces based on gap width (assuming approx 4px per space char)
           // This helps align columns visually
           const spaces = Math.max(1, Math.round(gap / 4));
           text += ' '.repeat(Math.min(spaces, 20)); // Cap spaces to prevent huge gaps
        }
      }

      text += str;
      lastX = x + item.width;
      lastY = y;
    }
    return text;
  };

  const extractPageTextFlow = (items: TextItem[]) => {
    return items.map(item => item.str).join(' ');
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setExtractedText('');

    try {
      if (window.pdfjsLib) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const totalPages = pdf.numPages;
        let fullText = '';

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          let pageText = '';
          if (mode === 'layout') {
            pageText = extractPageTextLayout(textContent.items as TextItem[]);
          } else {
            pageText = extractPageTextFlow(textContent.items as TextItem[]);
          }

          fullText += `--- Page ${i} ---\n${pageText}\n\n`;
          
          setProgress(Math.round((i / totalPages) * 100));
        }

        setExtractedText(fullText);
      } else {
        alert('PDF Library not loaded. Please try again later.');
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      alert('Error extracting text from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    alert('Text copied to clipboard!');
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${file?.name.replace('.pdf', '')}-extracted.txt`);
  };

  const handleDownloadCsv = () => {
    // Simple CSV conversion: treat multiple spaces as comma delimiter
    // This is a heuristic and might need adjustment for complex data
    const csvContent = extractedText.split('\n').map(line => {
       // Replace sequences of 2+ spaces with a comma
       const cells = line.trim().split(/\s{2,}/);
       // Escape quotes if needed
       return cells.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${file?.name.replace('.pdf', '')}-extracted.csv`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Extract Text from PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Convert PDF documents to editable text, preserving layout and tables.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!file ? (
          <FileUploader 
            accept=".pdf" 
            onFilesSelected={handleFileChange} 
            title="Upload PDF"
            description="Drag & drop PDF here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex justify-between items-center">
               <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</span>
               <button onClick={() => { setFile(null); setExtractedText(''); }} className="text-sm text-red-500 hover:underline">Change File</button>
            </div>

            {!extractedText && (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                   <button 
                     onClick={() => setMode('layout')}
                     className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${mode === 'layout' ? 'bg-white dark:bg-slate-700 shadow text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}
                   >
                     <Table size={16} /> Layout / Tables
                   </button>
                   <button 
                     onClick={() => setMode('flow')}
                     className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${mode === 'flow' ? 'bg-white dark:bg-slate-700 shadow text-brand-600 dark:text-brand-400' : 'text-slate-500'}`}
                   >
                     <AlignLeft size={16} /> Raw Text
                   </button>
                </div>

                <Button onClick={handleExtract} isLoading={isProcessing} className="w-full md:w-auto px-8">
                  <FileText className="w-4 h-4 mr-2" /> 
                  {isProcessing ? `Extracting... ${progress}%` : 'Start Extraction'}
                </Button>
                
                <p className="text-xs text-slate-500 max-w-md text-center">
                  "Layout" mode attempts to preserve visual structure (rows, columns, tables). 
                  "Raw Text" extracts text in a continuous stream.
                </p>
              </div>
            )}

            {extractedText && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-medium text-slate-900 dark:text-white">Extracted Content</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadTxt}>
                      <Download className="w-4 h-4 mr-2" /> Save .txt
                    </Button>
                    {mode === 'layout' && (
                        <Button variant="primary" size="sm" onClick={handleDownloadCsv}>
                        <Table className="w-4 h-4 mr-2" /> Save .csv
                        </Button>
                    )}
                  </div>
                </div>
                <div className="relative">
                    <textarea 
                    className="w-full h-[500px] p-4 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none whitespace-pre overflow-auto"
                    value={extractedText}
                    readOnly
                    />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfTextExtract;
