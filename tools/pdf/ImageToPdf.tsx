import React, { useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';
import { imagesToPdf } from '../../utils/pdfUtils';

const ImageToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const handleFileChange = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const pdfBytes = await imagesToPdf(files);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setModalState({ 
        isOpen: true, 
        status: 'success', 
        downloadUrl: url 
      });
    } catch (error) {
      console.error(error);
      setModalState({ 
        isOpen: true, 
        status: 'error', 
        error: 'Failed to convert images to PDF.' 
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
        title={modalState.status === 'processing' ? 'Converting Images...' : 'PDF Ready!'}
        message={modalState.status === 'processing' ? 'Combining your images into a high-quality PDF.' : 'Your image PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName="images.pdf"
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Image to PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Convert JPG and PNG images to a single PDF document.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
         <div className="mb-6">
            <FileUploader 
              accept="image/jpeg, image/png" 
              multiple 
              onFilesSelected={handleFileChange}
              title="Upload Images (JPG, PNG)"
              description="Drag & drop images here or click to browse"
              icon={<ImageIcon size={48} />}
            />
         </div>

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {files.map((file, i) => (
                  <div key={i} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">{file.name}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pt-4">
                 <Button onClick={handleConvert}>Convert to PDF</Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ImageToPdf;