import React, { useState, useRef } from 'react';
import { Upload, Stamp, Move } from 'lucide-react';
import Button from '../../components/ui/Button';
import { addWatermark } from '../../utils/pdfUtils';
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

const PdfWatermark: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });
  
  // Position state (percentages 0-100)
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setPosition({ x: 50, y: 50 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ 
        x: Math.min(Math.max(0, x), 100), 
        y: Math.min(Math.max(0, y), 100) 
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleProcess = async () => {
    if (!file) return;
    setModalState({ isOpen: true, status: 'processing' });
    try {
      // Calculate absolute points if not centered (50,50)
      let options: any = { opacity, size: 50 };
      
      // If user moved it significantly from center, use custom coordinates
      if (Math.abs(position.x - 50) > 1 || Math.abs(position.y - 50) > 1) {
          options.x = (position.x / 100) * pdfDimensions.width;
          options.y = (position.y / 100) * pdfDimensions.height;
      }

      const pdfBytes = await addWatermark(file, text, options);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `watermarked-${file.name}`;
      
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
        error: 'Error adding watermark.' 
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
    <div className="max-w-5xl mx-auto space-y-8" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Adding Watermark...' : 'Watermark Added!'}
        message={modalState.status === 'processing' ? 'Applying watermark to all pages.' : 'Your watermarked PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Watermark PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Stamp text over your PDF documents.</p>
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
             {/* Preview Column */}
             <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative select-none">
                <PdfPreviewCarousel 
                    file={file} 
                    interactive={true}
                    onPageLoad={(dims) => setPdfDimensions(dims)}
                >
                    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
                        {/* Draggable Watermark */}
                        <div 
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none ${isDragging ? 'opacity-80' : ''}`}
                            style={{ 
                                left: `${position.x}%`, 
                                top: `${position.y}%`,
                                opacity: opacity 
                            }}
                            onMouseDown={handleMouseDown}
                        >
                            <span className={`text-4xl font-bold text-slate-600 whitespace-nowrap border-4 border-slate-600 p-4 block ${Math.abs(position.x - 50) < 1 && Math.abs(position.y - 50) < 1 ? '-rotate-45' : ''}`}>
                                {text || 'WATERMARK'}
                            </span>
                            {/* Drag Handle Indicator */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-brand-500 bg-white rounded-full p-1 shadow-sm opacity-0 hover:opacity-100 transition-opacity">
                                <Move size={16} />
                            </div>
                        </div>
                    </div>
                </PdfPreviewCarousel>
                <p className="text-xs text-slate-500 mt-2">Drag the watermark to position it</p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                 <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</span>
                 <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Watermark Text</label>
                    <input 
                      type="text" 
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                      placeholder="e.g. CONFIDENTIAL"
                    />
                 </div>
                 
                 <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-sm font-medium dark:text-slate-300">Opacity</label>
                      <span className="text-sm text-slate-500">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.1" 
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                    />
                 </div>

                 <Button onClick={handleProcess} className="w-full">
                    <Stamp className="w-4 h-4 mr-2" /> Apply Watermark
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfWatermark;