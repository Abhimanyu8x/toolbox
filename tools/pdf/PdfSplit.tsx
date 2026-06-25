import React, { useState, useEffect } from 'react';
import { Upload, Scissors, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';
import { splitPdf } from '../../utils/pdfUtils';
import JSZip from 'jszip';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfSplit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  // Clean up preview URL
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
      setRange('');

      // Generate Preview
      try {
        if (window.pdfjsLib) {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
          setTotalPages(pdf.numPages);
          
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

  const handleSplit = async () => {
    if (!file || !range) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pdfBytesArray = await splitPdf(file, range);
      
      let downloadUrl = '';
      let fileName = '';

      if (pdfBytesArray.length === 1) {
        // Download single file
        const blob = new Blob([pdfBytesArray[0]], { type: 'application/pdf' });
        downloadUrl = URL.createObjectURL(blob);
        fileName = `split-${file.name}`;
      } else if (pdfBytesArray.length > 1) {
        // Zip multiple files
        const zip = new JSZip();
        pdfBytesArray.forEach((bytes, i) => {
          zip.file(`split-${i + 1}-${file.name}`, bytes);
        });
        const content = await zip.generateAsync({ type: 'blob' });
        downloadUrl = URL.createObjectURL(content);
        fileName = 'split-files.zip';
      }

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
        error: 'Error splitting PDF. Please check your page ranges.' 
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
        title={modalState.status === 'processing' ? 'Splitting PDF...' : 'PDF Split Successfully!'}
        message={modalState.status === 'processing' ? 'Extracting pages based on your selection.' : 'Your split files are ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Split PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Extract pages from your PDF documents.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!file ? (
          <FileUploader 
            accept=".pdf" 
            onFilesSelected={handleFileChange} 
            title="Upload PDF to Split"
            description="Drag & drop PDF here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Preview Column */}
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-sm font-medium text-slate-500 mb-3">Document Preview (Page 1)</h3>
              {previewUrl ? (
                <div className="shadow-lg border border-slate-200 rounded overflow-hidden">
                   <img src={previewUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <FileText className="w-12 h-12 mb-2 opacity-50" />
                  <span>Loading preview...</span>
                </div>
              )}
            </div>

            {/* Controls Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-200 block truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-slate-500">{totalPages} Pages detected</span>
                </div>
                <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Page Ranges</label>
                <input
                  type="text"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="e.g. 1-5, 8, 11-13"
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Enter page numbers or ranges separated by commas (e.g. 1, 3-5). 
                  Valid pages: 1 to {totalPages}.
                </p>
              </div>

              <Button onClick={handleSplit} className="w-full">
                <Scissors className="w-4 h-4 mr-2" /> Split PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSplit;