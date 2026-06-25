import React, { useState } from 'react';
import { FileText, X, ArrowDown, Files, Eye, GripVertical } from 'lucide-react';
import Button from '../../components/ui/Button';
import ToolLayout from '../../components/ui/ToolLayout';
import FileUploader from '../../components/ui/FileUploader';
import ProcessingModal from '../../components/ui/ProcessingModal';
import { mergePdfs } from '../../utils/pdfUtils';

const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === files.length - 1)) return;
    const newFiles = [...files];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newFiles[index], newFiles[swapIndex]] = [newFiles[swapIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handlePreview = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = fileURL;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    try {
      // Simulate a small delay for better UX (so the user sees the processing state)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mergedPdfBytes = await mergePdfs(files);
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
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
        error: 'Failed to merge PDFs. Please ensure all files are valid.' 
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
    <ToolLayout
      title="Merge PDF Files"
      description="Combine multiple PDF files into one single document securely in seconds."
      relatedTools={[
        { name: 'Split PDF', path: '/tools/pdf-split' },
        { name: 'Compress PDF', path: '/tools/pdf-compress' },
        { name: 'Image to PDF', path: '/tools/image-to-pdf' }
      ]}
      instructions={[
        "Upload the PDF files you want to merge.",
        "Reorder the files by dragging or using the arrow buttons.",
        "Click 'Merge PDFs' to combine them into a single file.",
        "Download your merged PDF document."
      ]}
      faqs={[
        { question: "Is it secure?", answer: "Yes, 100%. Files are processed in your browser and never uploaded to any server." },
        { question: "How many files can I merge?", answer: "There is no strict limit, but merging too many large files depends on your device's memory." }
      ]}
    >
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Merging PDFs...' : 'PDFs Merged!'}
        message={modalState.status === 'processing' ? 'We are combining your files into a single document.' : 'Your merged document is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName="merged-document.pdf"
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 max-w-4xl mx-auto">
        {files.length === 0 ? (
          <FileUploader 
            accept=".pdf" 
            multiple 
            onFilesSelected={handleFilesSelected}
            title="Drop PDF files here"
            description="Combine multiple PDFs into one. 100% Free & Secure."
            icon={<Files size={48} />}
          />
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{files.length} Files Selected</h3>
               <label className="cursor-pointer text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline">
                 + Add more files
                 <input type="file" accept=".pdf" multiple onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))} className="hidden" />
               </label>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 group hover:border-brand-300 transition-colors">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                      <GripVertical size={20} />
                    </div>
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold font-mono">{index + 1}</span>
                    <FileText className="h-8 w-8 text-red-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handlePreview(file)} className="p-2 text-slate-400 hover:text-brand-500 hover:bg-white rounded-lg transition-all hidden sm:block" title="Preview PDF">
                      <Eye className="h-4 w-4" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block"></div>
                    <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-2 text-slate-400 hover:text-brand-500 hover:bg-white rounded-lg disabled:opacity-30 transition-all">
                      <ArrowDown className="h-4 w-4 rotate-180" />
                    </button>
                    <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-2 text-slate-400 hover:text-brand-500 hover:bg-white rounded-lg disabled:opacity-30 transition-all">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button onClick={() => removeFile(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 flex justify-center space-x-4 border-t border-slate-100 dark:border-slate-700">
               <Button variant="outline" onClick={() => setFiles([])}>Clear All</Button>
               <Button onClick={handleMerge} disabled={files.length < 2} className="px-8 text-lg shadow-lg shadow-brand-500/20">
                 Merge PDF Files
               </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default PdfMerge;