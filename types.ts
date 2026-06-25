import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: 'pdf' | 'text' | 'image' | 'student';
}

export interface NavItem {
  label: string;
  path: string;
}

export type CompressionLevel = 'low' | 'medium' | 'high';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}