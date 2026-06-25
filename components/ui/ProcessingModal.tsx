import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, Download, X, AlertCircle } from 'lucide-react';
import Button from './Button';

interface ProcessingModalProps {
  isOpen: boolean;
  status: 'processing' | 'success' | 'error';
  title?: string;
  message?: string;
  progress?: number;
  downloadUrl?: string;
  fileName?: string;
  onDownload?: () => void;
  onClose: () => void;
  error?: string;
}

const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  status,
  title = 'Processing...',
  message = 'Please wait while we process your file.',
  progress = 0,
  downloadUrl,
  fileName = 'document.pdf',
  onDownload,
  onClose,
  error
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isOpen && status === 'processing') {
      setAnimatedProgress(0);
      const interval = setInterval(() => {
        setAnimatedProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
      return () => clearInterval(interval);
    } else if (status === 'success') {
      setAnimatedProgress(100);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slide-up border border-slate-200 dark:border-slate-700">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          {/* Icon State */}
          <div className="flex justify-center">
            {status === 'processing' && (
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-700"></div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-brand-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-brand-600 font-bold text-sm">
                  {Math.round(animatedProgress)}%
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 animate-bounce">
                <CheckCircle size={40} />
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertCircle size={40} />
              </div>
            )}
          </div>

          {/* Text Content */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {status === 'success' ? 'Ready to Download!' : status === 'error' ? 'Something went wrong' : title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {status === 'error' ? error : message}
            </p>
          </div>

          {/* Progress Bar (Processing only) */}
          {status === 'processing' && (
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${animatedProgress}%` }}
              ></div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            {status === 'success' && (
              <Button 
                onClick={() => {
                  if (onDownload) onDownload();
                  if (downloadUrl) {
                     const link = document.createElement('a');
                     link.href = downloadUrl;
                     link.download = fileName;
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                  }
                }} 
                className="w-full py-3 text-lg shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download File
              </Button>
            )}
            {status === 'error' && (
              <Button onClick={onClose} variant="secondary" className="w-full">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;
