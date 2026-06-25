import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import Button from '../../components/ui/Button';
import ProcessingModal from '../../components/ui/ProcessingModal';
import FileUploader from '../../components/ui/FileUploader';

const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFile(f);
      const objectUrl = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = objectUrl;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setWidth(val);
    if (aspectRatio && image) {
      setHeight(Math.round(val * (image.height / image.width)));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setHeight(val);
    if (aspectRatio && image) {
      setWidth(Math.round(val * (image.width / image.height)));
    }
  };

  const handleDownload = () => {
    if (!image || !canvasRef.current) return;
    
    setModalState({ isOpen: true, status: 'processing' });

    // Simulate processing delay for better UX
    setTimeout(() => {
        try {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(image, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setModalState({
                            isOpen: true,
                            status: 'success',
                            downloadUrl: url,
                            fileName: `resized-${file?.name}`
                        });
                    } else {
                        throw new Error("Failed to generate image");
                    }
                }, (file?.type as any) || 'image/jpeg');
            }
        } catch (e) {
            setModalState({ isOpen: true, status: 'error', error: 'Failed to resize image' });
        }
    }, 1500);
  };

  const closeModal = () => {
    if (modalState.downloadUrl) {
        URL.revokeObjectURL(modalState.downloadUrl);
    }
    setModalState({ isOpen: false, status: 'processing' });
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Resizing Image...' : 'Image Resized!'}
        message={modalState.status === 'processing' ? 'Adjusting dimensions while maintaining quality.' : 'Your resized image is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Image Resizer</h1>
        <p className="text-slate-600 dark:text-slate-400">Resize images by pixel dimensions or percentage.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {!image ? (
          <FileUploader 
            accept="image/*" 
            onFilesSelected={handleFile} 
            title="Upload Image to Resize"
            description="Drag & drop image here or click to browse"
            icon={<Upload size={48} />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-lg p-4 overflow-hidden">
               <img src={previewUrl ?? ''} alt="preview" className="max-w-full max-h-96 object-contain" />
               <p className="text-xs text-slate-500 mt-2">Original: {image.width} x {image.height}</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Width (px)</label>
                  <input type="number" value={width} onChange={handleWidthChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (px)</label>
                  <input type="number" value={height} onChange={handleHeightChange} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="ratio" checked={aspectRatio} onChange={(e) => setAspectRatio(e.target.checked)} className="mr-2 text-brand-500 focus:ring-brand-500 rounded" />
                  <label htmlFor="ratio" className="text-sm text-slate-700 dark:text-slate-300">Lock Aspect Ratio</label>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" /> Download Resized Image
                </Button>
                <button onClick={() => { setImage(null); setFile(null); }} className="w-full mt-2 text-sm text-slate-500 hover:text-red-500">
                  Cancel / Upload New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer;