import React, { useState, useRef } from 'react';
import { Upload, Type, FileText, MousePointer2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { modifyPdf, PdfModification } from '../../utils/pdfUtils';
import saveAs from 'file-saver';
import PdfPreviewCarousel from '../../components/pdf/PdfPreviewCarousel';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfEdit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });
  
  // Position state (percentages 0-100 relative to page)
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setTextInput('');
      setPosition({ x: 10, y: 10 });
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  const handleProcess = async () => {
    if (!file || !textInput) return;
    setModalState({ isOpen: true, status: 'processing' });
    try {
      // Convert percentage to points
      const x = (position.x / 100) * pdfDimensions.width;
      const y = (position.y / 100) * pdfDimensions.height;

      const mods: PdfModification[] = [{
        type: 'text',
        content: textInput,
        x: x,
        y: y,
        size: 12,
        pageIndex: 0 // Currently only editing first page for simplicity, could be extended to current page from carousel
      }];

      const pdfBytes = await modifyPdf(file, mods);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `edited-${file.name}`;
      
      setModalState({ 
        isOpen: true, 
        status: 'success', 
        downloadUrl,
        fileName
      });
    } catch (error) {
      console.error(error);
      setModalState({ 
        isOpen: true, 
        status: 'error', 
        error: 'Error editing PDF.' 
      });
    }
  };

  const closeModal = () => {
    if (modalState.downloadUrl) {
      URL.revokeObjectURL(modalState.downloadUrl);
    }
    setModalState({ isOpen: false, status: 'processing' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Editing PDF...' : 'PDF Edited!'}
        message={modalState.status === 'processing' ? 'Adding your text annotations.' : 'Your edited PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Edit PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Add text annotations to your PDF document.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!file ? (
          <FileUploader 
            accept=".pdf" 
            onFilesSelected={handleFileChange} 
            title="Upload PDF to Edit"
            description="Drag & drop PDF here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Preview Column */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative select-none">
               <PdfPreviewCarousel 
                  file={file} 
                  interactive={true}
                  onPageLoad={(dims) => setPdfDimensions(dims)}
               >
                  <div 
                    ref={containerRef} 
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onClick={handlePreviewClick}
                  >
                     {/* Text Indicator */}
                     {textInput && (
                       <div 
                         className="absolute bg-yellow-200/80 border border-yellow-500 text-black text-xs px-2 py-1 rounded shadow-sm transform -translate-y-1/2"
                         style={{ left: `${position.x}%`, top: `${position.y}%` }}
                       >
                         {textInput}
                       </div>
                     )}
                     
                     {/* Click Target Indicator */}
                     <div 
                        className="absolute w-4 h-4 border-2 border-brand-500 rounded-full -ml-2 -mt-2 pointer-events-none"
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                     />
                  </div>
               </PdfPreviewCarousel>
               <p className="text-xs text-slate-500 mt-2">Click anywhere on the page to position text</p>
            </div>

            {/* Controls Column */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                 <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</span>
                 <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Add Text Annotation</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={textInput}
                         onChange={(e) => setTextInput(e.target.value)}
                         placeholder="Enter text here..."
                         className="flex-1 p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                       />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                    <div>X: {Math.round(position.x)}%</div>
                    <div>Y: {Math.round(position.y)}%</div>
                 </div>
                 
                 <Button onClick={handleProcess} disabled={!textInput} className="w-full">
                    <Type className="w-4 h-4 mr-2" /> Add Text & Download
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfEdit;