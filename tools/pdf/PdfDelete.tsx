import React, { useState, useEffect } from 'react';
import { Upload, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { deletePagesFromPdf } from '../../utils/pdfUtils';
import saveAs from 'file-saver';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

// Declare global pdfjsLib from CDN
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfDelete: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  // Clean up object URLs when component unmounts or thumbnails change
  useEffect(() => {
    return () => {
      thumbnails.forEach(url => URL.revokeObjectURL(url));
    };
  }, [thumbnails]);

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setThumbnails([]);
      setSelectedPages(new Set());
      setIsLoading(true);

      try {
        if (!window.pdfjsLib) throw new Error("PDF.js not loaded");

        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
        const totalPages = pdf.numPages;
        const newThumbnails: string[] = [];

        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          // Render a small thumbnail
          const viewport = page.getViewport({ scale: 0.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport: viewport }).promise;
          
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.7));
          if (blob) {
            newThumbnails.push(URL.createObjectURL(blob));
          }
        }
        setThumbnails(newThumbnails);
      } catch (error) {
        console.error("Error generating thumbnails:", error);
        alert("Could not load PDF pages. Please try another file.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePageSelection = (index: number) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedPages(newSelected);
  };

  const handleDelete = async () => {
    if (!file || selectedPages.size === 0) return;
    
    if (selectedPages.size === thumbnails.length) {
      alert("You cannot delete all pages!");
      return;
    }

    setModalState({ isOpen: true, status: 'processing' });

    try {
      const pdfBytes = await deletePagesFromPdf(file, Array.from(selectedPages));
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
        error: 'Error processing PDF.' 
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
        title={modalState.status === 'processing' ? 'Deleting Pages...' : 'Pages Deleted!'}
        message={modalState.status === 'processing' ? 'Removing selected pages from your document.' : 'Your updated PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Delete PDF Pages</h1>
        <p className="text-slate-600 dark:text-slate-400">Click on pages to select them for removal.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
        {!file ? (
          <div className="h-full flex flex-col items-center justify-center">
            <FileUploader 
              accept=".pdf" 
              onFilesSelected={handleFileChange} 
              title="Upload PDF to Edit"
              description="Drag & drop PDF here or click to browse"
              icon={<Upload size={48} />}
            />
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-red-600 dark:text-red-400">
                     <Trash2 size={20} />
                   </div>
                   <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{file.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{thumbnails.length} Total Pages • {selectedPages.size} Selected to Delete</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <Button variant="outline" onClick={() => { setFile(null); setThumbnails([]); setSelectedPages(new Set()); }}>
                     Cancel
                   </Button>
                   <Button onClick={handleDelete} variant="danger" disabled={selectedPages.size === 0}>
                     Delete {selectedPages.size} Pages
                   </Button>
                </div>
             </div>

             {isLoading ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                 <p className="text-slate-500">Loading pages...</p>
               </div>
             ) : (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {thumbnails.map((src, index) => {
                   const isSelected = selectedPages.has(index);
                   return (
                     <div 
                       key={index} 
                       onClick={() => togglePageSelection(index)}
                       className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                         isSelected 
                           ? 'border-red-500 ring-2 ring-red-200 opacity-75' 
                           : 'border-slate-200 dark:border-slate-600 hover:border-brand-400'
                       }`}
                     >
                        <img src={src} alt={`Page ${index + 1}`} className="w-full h-auto object-cover" />
                        
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">
                          {index + 1}
                        </div>

                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
                             <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                               <Trash2 size={24} />
                             </div>
                          </div>
                        )}
                        
                        {!isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors" />
                        )}
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfDelete;