export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  university: string;
  author: { name: string; university: string } | string;
  image: string | null;
  views: number;
  downloads: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  pages: number;
}

export interface Reclamo {
  _id: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
}

export const CATEGORIES = [
  'Todos',
  'Ingeniería de Software',
  'Desarrollo Móvil',
  'Ciencia de Datos',
  'Educación Digital',
  'Tecnología en Salud',
  'Blockchain',
  'Inteligencia Artificial',
  'Internet de las Cosas',
  'Otro',
] as const;
