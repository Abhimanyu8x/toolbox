import { 
  FileText, Files, Scissors, Image as ImageIcon, Minimize, Trash2, RotateCw, 
  Edit, Stamp, Hash, Crop, Type, CaseSensitive, GraduationCap, Calendar, 
  Ruler, ListChecks, FileEdit, Calculator, Lock, Zap, RefreshCw
} from 'lucide-react';

export interface Tool {
  name: string;
  path: string;
  description: string;

  seoTitle: string;
  seoDescription: string;
  cononical: string;
  
  category: 'PDF' | 'Text' | 'Image' | 'Student' | 'Daily';
  icon: any;
  color: string;
  keywords: string;
}

export const allTools: Tool[] = [
  // PDF Tools
  { 
    name: 'Merge PDF', 
    path: '/tools/pdf-merge', 
    description: 'Combine multiple PDFs into one unified document.', 
    seoTitle:'Merge Pdf Online free -fast & secure | LetterFlow' ,
    seoDescription:'Merge PDF files online for free without uploading to a server. Fast, secure and privacy-focused PDF merger.',
    cononical:'https://letterflow.online/tools/pdf-merge',
    category: 'PDF', 
    icon: Files, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'merge pdf, combine pdf, pdf merger, merge pdf files, pdf combine, online pdf merge'
  },
  { 
    name: 'Split PDF', 
    path: '/tools/pdf-split', 
    description: 'Extract pages from your PDF documents.', 
    seoTitle:'Online Split pdf - Letterflow',
    seoDescription:'Compress PDF online while maintaining quality. Reduce PDF file size instantly for free.',
    cononical:'https://letterflow.online/tools/pdf-compress',
    category: 'PDF', 
    icon: Scissors, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'split pdf, pdf splitter, extract pdf pages, split pdf pages, page range pdf'
  },
  { 
    name: 'Image to PDF', 
    path: '/tools/image-to-pdf', 
    description: 'Convert JPG, PNG images to a PDF document.', 
    category: 'PDF', 
    icon: ImageIcon, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'image to pdf, jpg to pdf, png to pdf, convert images to pdf, photo to pdf'
  },
  { 
    name: 'PDF to Image', 
    path: '/tools/pdf-to-image', 
    description: 'Convert PDF pages to high-quality images.', 
    seoTitle:'Free pdf to image converter Online |LetterFlow.',
  
    category: 'PDF', 
    icon: FileText, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'pdf to image, pdf to jpg, pdf to png, export pdf pages to images, convert pdf to images'
  },
  { 
    name: 'Compress PDF', 
    path: '/tools/pdf-compress', 
    description: 'Reduce file size while maintaining quality.',
    seoTitle: 'Compress PDF Online Free - Reduce PDF Size | LetterFlow',
    seoDescription:'Compress PDF files online without losing quality. Reduce PDF file size quickly with our secure browser-based PDF compressor.',
    canonical:'https://letterflow.online/tools/pdf-compress',
    category: 'PDF', 
    icon: Minimize, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'online pdf compressor,pdf size compress online,compress pdf, pdf compressor, reduce pdf size, optimize pdf, shrink pdf'
  },
  { 
    name: 'Delete Pages', 
    path: '/tools/pdf-delete', 
    description: 'Remove specific pages from your PDF.', 
    category: 'PDF', 
    icon: Trash2, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'delete pdf pages, remove pdf pages, pdf page deletion, delete pages from pdf'
  },
  { 
    name: 'Rotate PDF', 
    path: '/tools/pdf-rotate', 
    description: 'Rotate PDF pages permanently.', 
    category: 'PDF', 
    icon: RotateCw, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'rotate pdf, pdf rotation, rotate pdf pages, change pdf orientation'
  },
  { 
    name: 'Edit PDF', 
    path: '/tools/pdf-edit', 
    description: 'Add text, shapes, and annotations to PDFs.', 
    category: 'PDF', 
    icon: Edit, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'edit pdf, annotate pdf, add text to pdf, pdf editor, pdf annotation'
  },
  { 
    name: 'Watermark PDF', 
    path: '/tools/pdf-watermark', 
    description: 'Add text or image watermarks to your PDF.', 
    seoTitle: "Add Watermark to PDF Online Free | LetterFlow",
    seoDescription:"Add text or image watermarks to PDF files online for free. Protect your documents with custom watermarks securely in your browser.",
    canonical:"https://letterflow.online/tools/pdf-watermark",
    category: 'PDF', 
    icon: Stamp, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'online watermark add, watermark pdf, add watermark to pdf, pdf watermark tool, stamp pdf'
  },
  { 
    name: 'Page Numbers', 
    path: '/tools/pdf-page-numbers', 
    description: 'Add page numbers to your PDF document.', 
    seoTitle: "Add Page Numbers to PDF Online | LetterFlow",
    seoDescription:"Insert page numbers into PDF documents online for free. Customize page numbering style, position, and format instantly.",
    canonical:"https://letterflow.online/tools/pdf-page-numbers",
    category: 'PDF', 
    icon: Hash, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'add page numbers to pdf, pdf page numbering, number pages in pdf, page numbering pdf'
  },
  { 
    name: 'Extract Text', 
    path: '/tools/pdf-extract-text', 
    description: 'Extract text content from PDF documents.',
    seoTitle: "Extract Text from PDF Online Free | LetterFlow",
    seoDescription:"Extract editable text from PDF documents instantly. Copy text from PDF files online with a fast, secure, and privacy-friendly tool.",
    canonical:"https://letterflow.online/tools/pdf-extract-text",
    category: 'PDF', 
    icon: FileText, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'extract text from pdf, pdf text extraction, pdf to text, text from pdf'
  },
  { 
    name: 'Crop PDF', 
    path: '/tools/pdf-crop', 
    description: 'Crop PDF pages to remove margins.', 
    seoTitle: "Add Watermark to PDF Online Free | LetterFlow",
    seoDescription:"Add text or image watermarks to PDF files online for free. Protect your documents with custom watermarks securely in your browser.",
    canonical:"https://letterflow.online/tools/pdf-watermark",
    category: 'PDF', 
    icon: Crop, 
    color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    keywords: 'crop pdf, trim pdf margins, pdf crop tool, crop pdf pages'
  },

  // Text Tools
  { 
    name: 'Word Counter', 
    path: '/tools/word-counter', 
    description: 'Count words, characters, and reading time.', 
    category: 'Text', 
    icon: Type, 
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    keywords: 'word counter, count words online, character counter, text statistics, word count tool'
  },
  { 
    name: 'Case Converter', 
    path: '/tools/case-converter', 
    description: 'Convert text between different cases.', 
    category: 'Text', 
    icon: CaseSensitive, 
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    keywords: 'case converter, uppercase lowercase, text case converter, change text case'
  },

  // Image Tools
  { 
    name: 'Image Resizer', 
    path: '/tools/image-resizer', 
    description: 'Resize images to specific dimensions.', 
    category: 'Image', 
    icon: ImageIcon, 
    color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    keywords: 'image resizer, resize image, change image dimensions, scale photo'
  },
  { 
    name: 'Image Converter', 
    path: '/tools/image-converter', 
    description: 'Convert images between formats (JPG, PNG, WEBP).', 
    category: 'Image', 
    icon: RefreshCw, 
    color: 'text-green-500 bg-green-50 dark:bg-green-900/20',
    keywords: 'image converter, convert images, jpg to png, png to jpg, webp converter'
  },

  // Student Tools
  { 
    name: 'Exam Timer', 
    path: '/tools/exam-timer', 
    description: 'Manage your exam time effectively.', 
    category: 'Student', 
    icon: GraduationCap, 
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    keywords: 'exam timer, study timer, test timer, online timer, exam countdown'
  },
  { 
    name: 'Revision Planner', 
    path: '/tools/revision-planner', 
    description: 'Plan and track your study revision.', 
    category: 'Student', 
    icon: Calendar, 
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    keywords: 'revision planner, study planner, revision schedule, study plan'
  },
  { 
    name: 'Answer Length', 
    path: '/tools/answer-length', 
    description: 'Check if your answer meets length requirements.', 
    category: 'Student', 
    icon: Ruler, 
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    keywords: 'answer length checker, text length checker, essay length, writing length'
  },
  { 
    name: 'MCQ Generator', 
    path: '/tools/mcq-generator', 
    description: 'Generate multiple choice questions from text.', 
    category: 'Student', 
    icon: ListChecks, 
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    keywords: 'mcq generator, multiple choice questions, question generator, quiz maker'
  },
  { 
    name: 'Notes Formatter', 
    path: '/tools/notes-formatter', 
    description: 'Format and beautify your study notes.', 
    category: 'Student', 
    icon: FileEdit, 
    color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20',
    keywords: 'notes formatter, format notes, study notes formatting, note organizer'
  },

  // Daily Tools
  { 
    name: 'Age Calculator', 
    path: '/tools/age-calculator', 
    description: 'Calculate precise age from date of birth.', 
    category: 'Daily', 
    icon: Calculator, 
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    keywords: 'age calculator, calculate age, age from dob, birthdate calculator'
  },
  { 
    name: 'Password Generator', 
    path: '/tools/password-generator', 
    description: 'Generate strong, secure passwords instantly.', 
    category: 'Daily', 
    icon: Lock, 
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    keywords: 'password generator, strong password generator, secure password, random password'
  },
];

export const toolKeywords: Record<string, string> = allTools.reduce((acc, tool) => {
  acc[tool.path] = tool.keywords;
  return acc;
}, {} as Record<string, string>);
