import type { Project } from '@/types/project';
import type { Task } from '~~/types/task';

export const useProjectStore = defineStore('projectStore', () => {
  const { sumDurations } = useTimeUtils();
  const taskStore = useTaskStore();

  // Projects collection
  const projects = ref<Project[]>([
    {
      id: 1,
      name: 'Project 1',
      date: 'Dec 30, 2024',
      status: 'In Progress',
      color: 'error',
    },
    {
      id: 2,
      name: 'Astronot Project',
      date: 'Jan 15, 2025',
      status: 'Done',
      color: 'primary',
    },
    {
      id: 3,
      name: 'Gpt Project',
      date: 'Feb 10, 2025',
      status: 'Overtime',
      color: 'success',
    },
  ]);

  // Generate a unique ID for new projects
  const generateUniqueId = () => {
    return Date.now();
  };

  const projectsWithDurations = computed(() => {
    return projects.value.map((project: Project) => {
      // Get all tasks for this project
      const projectTasks = taskStore.getTasksByProject(project.id);

      // Calculate total duration in seconds
      const duration = sumDurations(
        projectTasks.map((task: Task) => task.duration)
      );
      const [h, m, s] = duration.split(':').map(Number);
      const totalSeconds = h * 3600 + m * 60 + s;

      return {
        ...project,
        duration,
        totalSeconds,
      };
    });
  });

  // Add a new project
  const addProject = (project: Omit<Project, 'id'>) => {
    const id = generateUniqueId();

    const newProject: Project = {
      ...project,
      id,
    };

    // Apply default color if not provided
    if (!newProject.color) {
      newProject.color = 'primary';
    }

    projects.value.push(newProject);
    return newProject.id;
  };

  // Delete a project and all its tasks
  const deleteProject = (projectId: number | string) => {
    // Delete all tasks associated with this project
    taskStore.deleteTasksByProject(projectId);

    // Remove the project
    projects.value = projects.value.filter(
      (project: Project) => project.id !== projectId
    );
  };

  // Get a project by ID
  const getProjectById = (projectId: number | string) => {
    return projects.value.find((project: Project) => project.id === projectId);
  };

  // Update a project
  const updateProject = (
    projectId: number | string,
    updates: Partial<Omit<Project, 'id'>>
  ) => {
    const index = projects.value.findIndex(
      (project: Project) => project.id === projectId
    );
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates };
    }
  };

  return {
    // State
    projects,

    // Getters
    projectsWithDurations,

    // Actions
    addProject,
    deleteProject,
    getProjectById,
    updateProject,
  };
});
