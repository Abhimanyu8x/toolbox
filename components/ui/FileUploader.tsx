import React, { useState, useRef } from 'react';
import { Upload, File as FileIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per file

const FileUploader: React.FC<FileUploaderProps> = ({ 
  accept, 
  multiple = false, 
  onFilesSelected,
  title = "Upload Files",
  description = "Drag & drop files here or click to browse",
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const sanitizeAcceptPatterns = () => {
    return accept
      .split(',')
      .map((pattern) => pattern.trim().toLowerCase())
      .filter(Boolean);
  };

  const isFileAccepted = (file: File, patterns: string[]) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return false;
    }

    if (patterns.length === 0) {
      return true;
    }

    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

    return patterns.some((pattern) => {
      if (pattern === '*/*') return true;
      if (pattern.endsWith('/*')) {
        const baseType = pattern.split('/')[0];
        return fileType.startsWith(`${baseType}/`);
      }
      if (pattern.startsWith('.')) {
        return fileExtension === pattern.slice(1);
      }
      return fileType === pattern;
    });
  };

  const handleFiles = (files: File[]) => {
    const patterns = sanitizeAcceptPatterns();
    const acceptedFiles = files.filter((file) => isFileAccepted(file, patterns));

    if (acceptedFiles.length === 0) {
      setError('Selected files do not match the allowed type or exceed size limits.');
      return;
    }

    setError(null);
    onFilesSelected(multiple ? acceptedFiles : [acceptedFiles[0]]);
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed p-10 md:p-16 text-center ${
        isDragging 
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10 scale-[1.01]' 
          : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-800'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        ref={inputRef}
        type="file" 
        accept={accept} 
        multiple={multiple} 
        onChange={handleInputChange} 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
          {icon || <Upload size={32} />}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {description}
          </p>
        </div>
        <div className="pt-2">
           <Button variant="primary" className="pointer-events-none">
             Select Files
           </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;