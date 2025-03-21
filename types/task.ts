export interface Task {
  id: number;
  projectId: number | string;
  title: string;
  duration: string; // Format: HH:MM:SS
  status: 'In Progress' | 'Done' | 'Overtime';
  type?: string; // For filtering by task type (design, development, etc.)
  isActive?: boolean;
  isPaused?: boolean;
  startTime?: number;
}
