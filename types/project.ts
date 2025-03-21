// types/project.ts
export interface Project {
  id: number | string;
  name: string;
  date: string;
  status: 'In Progress' | 'Done' | 'Overtime';
  color?: string;
  duration?: string;
}
