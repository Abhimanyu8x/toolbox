import React, { useState } from 'react';
import { Upload, ArrowUpFromLine } from 'lucide-react';
import Button from '../../components/ui/Button';
import { compressPdfMock } from '../../utils/pdfUtils';
import saveAs from 'file-saver';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

const PdfCompress: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const handleCompress = async () => {
    if (!file) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    // Simulate processing time for UX
    setTimeout(async () => {
      try {
        const compressedBytes = await compressPdfMock(file);
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });
        const downloadUrl = URL.createObjectURL(blob);
        const fileName = `optimized-${file.name}`;
        
        setModalState({ 
            isOpen: true, 
            status: 'success', 
            downloadUrl,
            fileName
        });
      } catch (e) {
        setModalState({ 
            isOpen: true, 
            status: 'error', 
            error: 'Error optimizing PDF' 
        });
      }
    }, 1500);
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
        title={modalState.status === 'processing' ? 'Compressing PDF...' : 'PDF Optimized!'}
        message={modalState.status === 'processing' ? 'Reducing file size while maintaining quality.' : 'Your optimized PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Compress PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Optimize your PDF file size locally.</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
        {!file ? (
            <FileUploader 
              accept=".pdf" 
              onFilesSelected={(files) => files.length > 0 && setFile(files[0])} 
              title="Select PDF to Compress"
              description="Drag & drop PDF here or click to browse"
              icon={<Upload size={48} />}
            />
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
               <span className="font-semibold text-slate-800 dark:text-white">{file.name}</span>
               <span className="text-sm text-slate-500 ml-2">({(file.size/1024/1024).toFixed(2)} MB)</span>
            </div>
            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
              Note: Client-side compression is limited. For maximum compression, server-side tools are typically required, but we optimize document structure here.
            </p>
            <Button onClick={handleCompress} className="w-full">
               <ArrowUpFromLine className="w-4 h-4 mr-2" /> Optimize PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfCompress;