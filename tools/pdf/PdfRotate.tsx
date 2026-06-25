import React, { useState } from 'react';
import { Upload, RotateCw, RotateCcw, Save, RefreshCcw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { rotatePdf } from '../../utils/pdfUtils';
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

const PdfRotate: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setRotation(0);
    }
  };

  const handleRotate = (degrees: number) => {
    setRotation(prev => (prev + degrees) % 360);
  };

  const handleSave = async () => {
    if (!file) return;
    setModalState({ isOpen: true, status: 'processing' });
    try {
      const pdfBytes = await rotatePdf(file, rotation);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `rotated-${file.name}`;
      
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
        error: 'Error rotating PDF.' 
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
    <div className="max-w-4xl mx-auto space-y-8">
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Rotating PDF...' : 'Rotation Complete!'}
        message={modalState.status === 'processing' ? 'Applying rotation to all pages.' : 'Your rotated PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Rotate PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Permanently rotate all pages in your PDF document.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
        {!file ? (
          <div className="h-full flex flex-col items-center justify-center">
            <FileUploader 
              accept=".pdf" 
              onFilesSelected={handleFileChange} 
              title="Upload PDF to Rotate"
              description="Drag & drop PDF here or click to browse"
              icon={<Upload size={48} />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             
             {/* Preview Area */}
             <PdfPreviewCarousel 
                file={file} 
                imageStyle={{ transform: `rotate(${rotation}deg)` }}
             />

             {/* Controls Area */}
             <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">{file.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Current Rotation: <span className="font-mono font-medium text-brand-600">{rotation}°</span>
                  </p>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => handleRotate(-90)}
                     className="flex-1 flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-brand-500 transition-all group"
                   >
                     <RotateCcw className="w-8 h-8 text-slate-500 group-hover:text-brand-500 mb-2" />
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Left (90°)</span>
                   </button>

                   <button 
                     onClick={() => handleRotate(90)}
                     className="flex-1 flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-brand-500 transition-all group"
                   >
                     <RotateCw className="w-8 h-8 text-slate-500 group-hover:text-brand-500 mb-2" />
                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Right (90°)</span>
                   </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                   <Button onClick={handleSave} className="w-full h-12 text-lg">
                     <Save className="w-5 h-5 mr-2" /> Save Rotated PDF
                   </Button>
                   <Button variant="outline" onClick={() => { setFile(null); setRotation(0); }} className="w-full">
                     <RefreshCcw className="w-4 h-4 mr-2" /> Start Over
                   </Button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfRotate;