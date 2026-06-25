import React from 'react';
import { Image, Maximize, Crop, UserSquare, FileInput } from 'lucide-react';
import ToolCard from '../components/ToolCard';

const ImageTools: React.FC = () => {
  const tools = [
    { name: 'Image Resizer', description: 'Resize images to specific dimensions.', icon: Maximize, path: '/tools/image-resizer' },
    { name: 'Image Compressor', description: 'Reduce image file size.', icon: Image, path: '/tools/image-compressor' },
    { name: 'Image Cropper', description: 'Crop images to remove unwanted areas.', icon: Crop, path: '/tools/image-cropper' },
    { name: 'Passport Photo', description: 'Create passport size photos.', icon: UserSquare, path: '/tools/passport-photo' },
    { name: 'Format Converter', description: 'Convert between JPG, PNG, WEBP.', icon: FileInput, path: '/tools/image-converter' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Image Tools</h1>
        <p className="text-slate-600 dark:text-slate-400">Edit, resize, and convert images directly in your browser.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default ImageTools;