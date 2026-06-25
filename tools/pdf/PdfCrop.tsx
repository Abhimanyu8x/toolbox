import React, { useState, useRef } from 'react';
import { Upload, Crop, MousePointer2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { cropPdf } from '../../utils/pdfUtils';
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

const PdfCrop: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });
  
  // Crop state
  const [mode, setMode] = useState<'margin' | 'manual'>('manual');
  const [margin, setMargin] = useState(20);
  
  // Manual crop state (percentages 0-100)
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [boxStart, setBoxStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  
  // PDF Dimensions
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      // Reset crop box to default
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, handle: string | null = null) => {
    if (mode !== 'manual') return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setBoxStart({ ...cropBox });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100; // Note: Y is inverted in PDF coords usually, but here we work in DOM coords (top-left 0,0)

    let newBox = { ...boxStart };

    if (activeHandle === 'move') {
      newBox.x = Math.min(Math.max(0, boxStart.x + deltaX), 100 - boxStart.width);
      newBox.y = Math.min(Math.max(0, boxStart.y + deltaY), 100 - boxStart.height);
    } else if (activeHandle === 'se') {
      newBox.width = Math.min(Math.max(5, boxStart.width + deltaX), 100 - boxStart.x);
      newBox.height = Math.min(Math.max(5, boxStart.height + deltaY), 100 - boxStart.y);
    } else if (activeHandle === 'sw') {
      newBox.x = Math.min(Math.max(0, boxStart.x + deltaX), boxStart.x + boxStart.width - 5);
      newBox.width = boxStart.width + (boxStart.x - newBox.x);
      newBox.height = Math.min(Math.max(5, boxStart.height + deltaY), 100 - boxStart.y);
    } else if (activeHandle === 'nw') {
      newBox.x = Math.min(Math.max(0, boxStart.x + deltaX), boxStart.x + boxStart.width - 5);
      newBox.width = boxStart.width + (boxStart.x - newBox.x);
      newBox.y = Math.min(Math.max(0, boxStart.y + deltaY), boxStart.y + boxStart.height - 5);
      newBox.height = boxStart.height + (boxStart.y - newBox.y);
    } else if (activeHandle === 'ne') {
      newBox.width = Math.min(Math.max(5, boxStart.width + deltaX), 100 - boxStart.x);
      newBox.y = Math.min(Math.max(0, boxStart.y + deltaY), boxStart.y + boxStart.height - 5);
      newBox.height = boxStart.height + (boxStart.y - newBox.y);
    }

    setCropBox(newBox);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setModalState({ isOpen: true, status: 'processing' });
    try {
      let cropParams;
      if (mode === 'margin') {
        cropParams = margin;
      } else {
        // Convert percentage to points
        // PDF coordinates: origin is bottom-left usually.
        // But pdf-lib setCropBox(x, y, width, height) uses x,y from bottom-left?
        // Wait, setCropBox(x, y, width, height).
        // If I draw a box from top-left (DOM), I need to convert Y.
        // DOM Y=0 is PDF Y=Height.
        // DOM Box Y (top) -> PDF Y = Height - (DOM_Y + DOM_Height) ? No.
        // PDF Y (bottom of box) = Height - (DOM_Y + DOM_Height) * Height_Points / 100
        
        const x = (cropBox.x / 100) * pdfDimensions.width;
        const w = (cropBox.width / 100) * pdfDimensions.width;
        const h = (cropBox.height / 100) * pdfDimensions.height;
        
        // DOM Top Y is cropBox.y
        // DOM Bottom Y is cropBox.y + cropBox.height
        // In PDF (bottom-left origin), the bottom of the box is at:
        // PageHeight - (DOM_Bottom_Y_Percent * PageHeight)
        const y = pdfDimensions.height - ((cropBox.y + cropBox.height) / 100) * pdfDimensions.height;
        
        cropParams = { x, y, width: w, height: h };
      }

      const pdfBytes = await cropPdf(file, cropParams);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const fileName = `cropped-${file.name}`;
      
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
        error: 'Error cropping PDF.' 
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
    <div className="max-w-6xl mx-auto space-y-8" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Cropping PDF...' : 'Crop Complete!'}
        message={modalState.status === 'processing' ? 'Applying crop area to all pages.' : 'Your cropped PDF is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Crop PDF</h1>
        <p className="text-slate-600 dark:text-slate-400">Trim margins or select a custom area to crop.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!file ? (
          <FileUploader 
            accept=".pdf" 
            onFilesSelected={handleFileChange} 
            title="Upload PDF to Crop"
            description="Drag & drop PDF here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview Column */}
            <div className="lg:col-span-2 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex flex-col items-center justify-center min-h-[500px] relative select-none">
                <PdfPreviewCarousel 
                  file={file} 
                  interactive={mode === 'manual'}
                  onPageLoad={(dims) => setPdfDimensions(dims)}
                >
                  <div ref={containerRef} className="absolute inset-0 w-full h-full">
                    {mode === 'manual' ? (
                      <>
                        {/* Darken outside area */}
                        <div className="absolute inset-0 bg-black/50">
                          {/* Cutout for crop box */}
                          <div 
                            style={{ 
                              left: `${cropBox.x}%`, 
                              top: `${cropBox.y}%`, 
                              width: `${cropBox.width}%`, 
                              height: `${cropBox.height}%` 
                            }}
                            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                          />
                        </div>

                        {/* Crop Box */}
                        <div 
                          style={{ 
                            left: `${cropBox.x}%`, 
                            top: `${cropBox.y}%`, 
                            width: `${cropBox.width}%`, 
                            height: `${cropBox.height}%` 
                          }}
                          className="absolute border-2 border-brand-500 cursor-move"
                          onMouseDown={(e) => handleMouseDown(e, 'move')}
                        >
                          {/* Handles */}
                          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-brand-500 cursor-nw-resize" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-brand-500 cursor-ne-resize" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-brand-500 cursor-sw-resize" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-brand-500 cursor-se-resize" onMouseDown={(e) => handleMouseDown(e, 'se')} />
                          
                          {/* Grid lines */}
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                             <div className="border-r border-brand-300 col-span-1 h-full"></div>
                             <div className="border-r border-brand-300 col-span-1 h-full"></div>
                             <div className="absolute inset-0 grid grid-rows-3">
                                <div className="border-b border-brand-300 row-span-1 w-full"></div>
                                <div className="border-b border-brand-300 row-span-1 w-full"></div>
                             </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Margin visualizer
                      <div 
                          className="absolute inset-0 border-red-500 pointer-events-none bg-red-500/10"
                          style={{ 
                          borderWidth: `${Math.min(margin, 50)}px` 
                          }}
                      />
                    )}
                  </div>
                </PdfPreviewCarousel>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                 <span className="font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{file.name}</span>
                 <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
              </div>
              
              <div className="space-y-6">
                 {/* Mode Selection */}
                 <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <button 
                      onClick={() => setMode('manual')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-white dark:bg-slate-700 shadow text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      <MousePointer2 size={16} className="inline mr-2" />
                      Manual Crop
                    </button>
                    <button 
                      onClick={() => setMode('margin')}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'margin' ? 'bg-white dark:bg-slate-700 shadow text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                    >
                      <Crop size={16} className="inline mr-2" />
                      Auto Margin
                    </button>
                 </div>

                 {mode === 'margin' ? (
                   <div>
                      <label className="block text-sm font-medium mb-1 dark:text-slate-300">Margin Crop (Points)</label>
                      <input 
                        type="number" 
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        This will crop {margin} points from all sides of every page.
                      </p>
                   </div>
                 ) : (
                   <div className="space-y-2">
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                       Drag the box on the preview to select the area you want to keep.
                     </p>
                     <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div>X: {Math.round(cropBox.x)}%</div>
                        <div>Y: {Math.round(cropBox.y)}%</div>
                        <div>W: {Math.round(cropBox.width)}%</div>
                        <div>H: {Math.round(cropBox.height)}%</div>
                     </div>
                   </div>
                 )}

                 <Button onClick={handleProcess} className="w-full">
                    <Crop className="w-4 h-4 mr-2" /> Crop PDF
                 </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfCrop;