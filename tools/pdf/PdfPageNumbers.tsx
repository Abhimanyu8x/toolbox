import React, { useState, useEffect } from 'react';
import { Upload, Hash, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import { addPageNumbers } from '../../utils/pdfUtils';
import saveAs from 'file-saver';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfPageNumbers: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-right'>('bottom-center');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPreviewUrl(null);

      // Generate Preview
      try {
        if (window.pdfjsLib) {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 0.8 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          canvas.toBlob((blob) => {
            if (blob) setPreviewUrl(URL.createObjectURL(blob));
          });
        }
      } catch (err) {
        console.error("Error generating preview", err);
      }
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setModalState({ isOpen: true, status: 'processing' });
    try {
      const pdfBytes = await addPageNumbers(file, position);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `numbered-${file.name}`;
      
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
        error: 'Error adding page numbers.' 
      });
    }
  };

  const closeModal = () => {
    if (modalState.downloadUrl) {
      URL.revokeObjectURL(modalState.downloadUrl);
    }
    setModalState({ isOpen: false, status: 'processing' });
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right': return { bottom: '20px', right: '20px' };
      case 'top-right': return { top: '20px', right: '20px' };
      case 'bottom-center': default: return { bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Adding Page Numbers...' : 'Numbers Added!'}
        message={modalState.status === 'processing' ? 'Processing your document.' : 'Your numbered PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Page Numbers</h1>
        <p className="text-slate-600 dark:text-slate-400">Add page numbers to your PDF document.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Preview */}
             <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative">
               <h3 className="text-sm font-medium text-slate-500 mb-3 absolute top-4">Preview</h3>
               {previewUrl ? (
                <div className="relative shadow-lg border border-slate-200 rounded overflow-hidden">
                   <img src={previewUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                   {/* Number Simulation */}
                   <div 
                      className="absolute bg-white/80 text-black px-2 py-0.5 text-xs rounded border border-slate-300 font-mono pointer-events-none"
                      style={getPositionStyles()}
                   >
                     1
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <FileText className="w-12 h-12 mb-2 opacity-50" />
                  <span>Loading preview...</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                 <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</span>
                 <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Position</label>
                    <select 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value as any)}
                      className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="top-right">Top Right</option>
                    </select>
                 </div>

                 <Button onClick={handleProcess} className="w-full">
                    <Hash className="w-4 h-4 mr-2" /> Add Page Numbers
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPageNumbers;