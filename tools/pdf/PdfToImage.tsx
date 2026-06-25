import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfToImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const handleConvert = async () => {
    if (!file) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    try {
      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;
      const zip = new JSZip();

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
        if (blob) {
          zip.file(`page-${i}.jpg`, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const fileName = `${file.name.replace('.pdf', '')}-images.zip`;

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
        error: 'Error converting PDF to Image. Please try again.' 
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
    <div className="max-w-3xl mx-auto space-y-8">
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Converting to Images...' : 'Images Ready!'}
        message={modalState.status === 'processing' ? 'Extracting high-quality images from your PDF.' : 'Your images are ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">PDF to Image</h1>
        <p className="text-slate-600 dark:text-slate-400">Convert PDF pages into high-quality JPG images.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!file ? (
          <FileUploader 
            accept=".pdf" 
            onFilesSelected={(files) => files.length > 0 && setFile(files[0])} 
            title="Upload PDF"
            description="Drag & drop PDF here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
              <span className="font-medium text-slate-700 dark:text-slate-200">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
            </div>
            <Button onClick={handleConvert} className="w-full">
              Convert to JPG
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToImage;