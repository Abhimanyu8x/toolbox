import React, { useState } from 'react';
import { FileInput, Download, AlertCircle } from 'lucide-react';
import ToolLayout from '../../components/ui/ToolLayout';
import FileUploader from '../../components/ui/FileUploader';
import Button from '../../components/ui/Button';
import ProcessingModal from '../../components/ui/ProcessingModal';

const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(0.9);
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'processing' | 'success' | 'error';
    downloadUrl?: string;
    fileName?: string;
    error?: string;
  }>({ isOpen: false, status: 'processing' });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const convertImage = () => {
    if (!file) return;
    setModalState({ isOpen: true, status: 'processing' });

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // If converting to JPEG, fill background with white (handling transparent PNGs)
          if (format === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          
          const mimeType = `image/${format}`;
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const fileNameNoExt = file.name.split('.').slice(0, -1).join('.');
              
              setModalState({
                  isOpen: true,
                  status: 'success',
                  downloadUrl: url,
                  fileName: `${fileNameNoExt}.${format}`
              });
            } else {
              setModalState({ isOpen: true, status: 'error', error: 'Conversion failed' });
            }
          }, mimeType, quality);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
    <ToolLayout
      title="Image Converter"
      description="Convert images to PNG, JPG, or WEBP format instantly."
      relatedTools={[{ name: 'Image Resizer', path: '/tools/image-resizer' }]}
    >
      <ProcessingModal 
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.status === 'processing' ? 'Converting Image...' : 'Conversion Complete!'}
        message={modalState.status === 'processing' ? 'Changing image format.' : 'Your converted image is ready for download.'}
        downloadUrl={modalState.downloadUrl}
        fileName={modalState.fileName}
        onClose={closeModal}
        error={modalState.error}
      />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          
          {!file ? (
            <FileUploader 
              accept="image/*" 
              onFilesSelected={handleFilesSelected} 
              title="Upload Image"
              description="Supports JPG, PNG, WEBP, GIF"
              icon={<FileInput size={48} />}
            />
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Preview */}
                <div className="w-full md:w-1/2 bg-slate-100 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                  <img src={previewUrl ?? ''} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded shadow-sm" />
                </div>

                {/* Controls */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                    <p className="text-sm text-slate-500">Original Size: {(file.size / 1024).toFixed(1)} KB</p>
                    <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Change File</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Target Format</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['png', 'jpeg', 'webp'].map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                              format === fmt 
                                ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/30 dark:border-brand-500 dark:text-brand-400' 
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300'
                            }`}
                          >
                            {fmt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {format !== 'png' && (
                       <div>
                         <div className="flex justify-between mb-1">
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quality</label>
                           <span className="text-sm text-slate-500">{Math.round(quality * 100)}%</span>
                         </div>
                         <input 
                           type="range" 
                           min="0.1" 
                           max="1" 
                           step="0.05" 
                           value={quality}
                           onChange={(e) => setQuality(parseFloat(e.target.value))}
                           className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-brand-600"
                         />
                       </div>
                    )}

                    <Button onClick={convertImage} className="w-full">
                      <Download className="w-4 h-4 mr-2" /> Convert & Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default ImageConverter;