import React from 'react';
import { FileText, Files, Image as ImageIcon, Scissors, RotateCw, Trash2, ArrowUpFromLine, Edit, Stamp, Hash, Crop } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const PdfTools: React.FC = () => {
  const tools = [
    { name: 'Merge PDF', description: 'Combine multiple PDF files into one document.', icon: Files, path: '/tools/pdf-merge' },
    { name: 'Split PDF', description: 'Separate specific pages or ranges from a PDF.', icon: Scissors, path: '/tools/pdf-split' },
    { name: 'Edit PDF', description: 'Add text annotations to your PDF document.', icon: Edit, path: '/tools/pdf-edit' },
    { name: 'Image to PDF', description: 'Convert JPG, PNG images into PDF format.', icon: ImageIcon, path: '/tools/image-to-pdf' },
    { name: 'PDF to Image', description: 'Convert PDF pages to JPG or PNG images.', icon: FileText, path: '/tools/pdf-to-image' },
    { name: 'Compress PDF', description: 'Optimize PDF files to reduce file size.', icon: ArrowUpFromLine, path: '/tools/pdf-compress' },
    { name: 'Rotate PDF', description: 'Rotate PDF pages permanently.', icon: RotateCw, path: '/tools/pdf-rotate' },
    { name: 'Watermark', description: 'Stamp text over your PDF pages.', icon: Stamp, path: '/tools/pdf-watermark' },
    { name: 'Page Numbers', description: 'Add page numbers to PDF.', icon: Hash, path: '/tools/pdf-page-numbers' },
    { name: 'Extract Text', description: 'Extract text content from PDF.', icon: FileText, path: '/tools/pdf-extract-text' },
    { name: 'Crop PDF', description: 'Crop margins of PDF documents.', icon: Crop, path: '/tools/pdf-crop' },
    { name: 'Delete Pages', description: 'Remove unwanted pages from your PDF.', icon: Trash2, path: '/tools/pdf-delete' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">PDF Tools</h1>
        <p className="text-slate-600 dark:text-slate-400">
          A complete collection of tools to handle your PDF files. Fast, private, and free.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
      <div className="mt-12 bg-slate-100 dark:bg-slate-800 p-4 text-center rounded text-xs text-slate-400">
        AdSense Placeholder
      </div>
    </div>
  );
};

export default PdfTools;