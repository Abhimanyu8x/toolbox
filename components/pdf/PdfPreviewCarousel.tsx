import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PdfPreviewCarouselProps {
  file: File;
  className?: string;
  imageStyle?: React.CSSProperties;
  children?: React.ReactNode;
  interactive?: boolean;
  onPageLoad?: (dimensions: { width: number; height: number }) => void;
}

const PdfPreviewCarousel: React.FC<PdfPreviewCarouselProps> = ({ 
  file, 
  className, 
  imageStyle, 
  children, 
  interactive = false,
  onPageLoad 
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const pdfRef = useRef<any>(null);

  // Load PDF
  useEffect(() => {
    const loadPdf = async () => {
      if (!file) return;
      setLoading(true);
      try {
        if (window.pdfjsLib) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
          pdfRef.current = pdf;
          setNumPages(pdf.numPages);
          setPageNumber(1);
          renderPage(1);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    };
    loadPdf();
  }, [file]);

  // Render Page
  const renderPage = async (pageNum: number) => {
    if (!pdfRef.current) return;
    setLoading(true);
    try {
      const page = await pdfRef.current.getPage(pageNum);
      
      // Get original dimensions
      const viewportOriginal = page.getViewport({ scale: 1 });
      if (onPageLoad) {
        onPageLoad({ width: viewportOriginal.width, height: viewportOriginal.height });
      }

      const viewport = page.getViewport({ scale: 0.8 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;
      
      canvas.toBlob((blob) => {
        if (blob) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(blob));
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error rendering page:", error);
      setLoading(false);
    }
  };

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      renderPage(newPage);
    }
  };

  return (
    <div className={`flex flex-col items-center w-full ${className || ''}`}>
      <div className="relative bg-slate-100 dark:bg-slate-900 rounded-xl p-4 min-h-[300px] flex items-center justify-center w-full overflow-hidden select-none">
        {loading ? (
          <div className="flex flex-col items-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span>Loading preview...</span>
          </div>
        ) : previewUrl ? (
          <div className="relative shadow-lg border border-slate-200 rounded overflow-hidden transition-all duration-300">
             <div style={imageStyle} className="relative transition-transform duration-500 ease-in-out">
                <img src={previewUrl} alt={`Page ${pageNumber}`} className="max-w-full max-h-[400px] object-contain block" draggable={false} />
                {/* Overlay Content */}
                <div className={`absolute inset-0 ${interactive ? '' : 'pointer-events-none'}`}>
                    {children}
                </div>
             </div>
          </div>
        ) : (
           <p className="text-slate-400">Preview not available</p>
        )}
      </div>

      {/* Controls */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1 || loading}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[80px] text-center">
            Page {pageNumber} of {numPages}
          </span>

          <button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= numPages || loading}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfPreviewCarousel;
