import type { Task } from '@/types/task';

export const useTaskStore = defineStore('taskStore', () => {
  const { formatDuration } = useTimeUtils();

  // Tasks collection
  const tasks = ref<Task[]>([
    // Project 1 tasks
    {
      id: 1,
      projectId: 1,
      title: 'Create UI for Dashboard',
      duration: '02:00:00',
      status: 'In Progress',
      type: 'design',
      isActive: false,
    },
    {
      id: 2,
      projectId: 1,
      title: 'Fix Login Bug',
      duration: '01:30:00',
      status: 'Done',
      type: 'development',
      isActive: false,
    },
    {
      id: 3,
      projectId: 1,
      title: 'Improve API Performance',
      duration: '01:00:40',
      status: 'Overtime',
      type: 'development',
      isActive: false,
    },

    // Project 2 tasks
    {
      id: 4,
      projectId: 2,
      title: 'Design Landing Page',
      duration: '02:00:00',
      status: 'In Progress',
      type: 'design',
      isActive: false,
    },
    {
      id: 5,
      projectId: 2,
      title: 'Implement Payment Gateway',
      duration: '03:20:10',
      status: 'Done',
      type: 'implementation',
      isActive: false,
    },

    // Project 3 tasks
    {
      id: 6,
      projectId: 3,
      title: 'Prepare Monthly Report',
      duration: '02:30:00',
      status: 'Done',
      type: 'implementation',
      isActive: false,
    },
    {
      id: 7,
      projectId: 3,
      title: 'Optimize Database Queries',
      duration: '03:45:30',
      status: 'Overtime',
      type: 'development',
      isActive: false,
    },
  ]);

  // Generate a unique ID for new tasks
  const generateUniqueId = () => {
    // Find the highest existing ID and increment by 1
    const maxId = Math.max(0, ...tasks.value.map((task: Task) => task.id));
    return maxId + 1;
  };

  // Get tasks by project ID
  const getTasksByProject = (projectId: number | string) => {
    return tasks.value.filter((task: Task) => task.projectId === projectId);
  };

  // Get tasks by status
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.value.filter((task: Task) => task.status === status);
  };

  // Get tasks by type
  const getTasksByType = (type: string) => {
    return tasks.value.filter((task: Task) => task.type === type);
  };

  // Add a new task
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: generateUniqueId(),
      ...task,
      isActive: false,
    };

    tasks.value.push(newTask);
    return newTask.id;
  };

  // Delete a task
  const deleteTask = (taskId: number) => {
    tasks.value = tasks.value.filter((task: Task) => task.id !== taskId);
  };

  // Delete all tasks for a project
  const deleteTasksByProject = (projectId: number | string) => {
    tasks.value = tasks.value.filter(
      (task: Task) => task.projectId !== projectId
    );
  };

  // Update a task
  const updateTask = (taskId: number, updates: Partial<Omit<Task, 'id'>>) => {
    const index = tasks.value.findIndex((task: Task) => task.id === taskId);
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates };
    }
  };

  // Update task duration
  const updateTaskDuration = (taskId: number, durationInSeconds: number) => {
    const task = tasks.value.find((t: Task) => t.id === taskId);
    if (task) {
      task.duration = formatDuration(durationInSeconds);
    }
  };

  // Get task by ID
  const getTaskById = (taskId: number) => {
    return tasks.value.find((task: Task) => task.id === taskId);
  };

  return {
    // State
    tasks,

    // Getters
    getTasksByProject,
    getTasksByStatus,
    getTasksByType,
    getTaskById,

    // Actions
    addTask,
    deleteTask,
    deleteTasksByProject,
    updateTask,
    updateTaskDuration,
  };
});
