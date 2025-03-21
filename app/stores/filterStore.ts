// Interfaces
import type { Project } from '@/types/project';

interface FilterOption {
  label: string;
  value: string | number;
}

// Default filter options
const DEFAULT_STATE_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Overtime', value: 'Overtime' },
];

const DEFAULT_TASK_TYPE_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Design', value: 'design' },
  { label: 'Development', value: 'development' },
  { label: 'Implementation', value: 'implementation' },
];

const DEFAULT_DURATION_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '5 Hours', value: 5 },
  { label: '10 Hours', value: 10 },
  { label: '20 Hours', value: 20 },
  { label: '30 Hours', value: 30 },
  { label: '40 Hours', value: 40 },
];

export const useFilterStore = defineStore('filterStore', () => {
  // Current filter values
  const currentFilters = ref({
    state: 'all',
    taskType: 'all',
    duration: 'all',
  });

  // Filter options
  const stateOptions = ref<FilterOption[]>(DEFAULT_STATE_OPTIONS);
  const taskTypeOptions = ref<FilterOption[]>(DEFAULT_TASK_TYPE_OPTIONS);
  const durationOptions = ref<FilterOption[]>(DEFAULT_DURATION_OPTIONS);

  // Update filter values
  const updateFilters = (filters: {
    state?: string;
    taskType?: string;
    duration?: string | number;
  }) => {
    const filterKeys = ['state', 'taskType', 'duration'] as const;

    filterKeys.forEach((key) => {
      const filterValue = filters[key];
      const options = {
        state: stateOptions.value,
        taskType: taskTypeOptions.value,
        duration: durationOptions.value,
      }[key];

      if (
        filterValue !== undefined &&
        options.some((opt) => opt.value === filterValue)
      ) {
        currentFilters.value[key] = filterValue;
      }
    });
  };

  // Reset filters to default values
  const resetFilters = () => {
    currentFilters.value = {
      state: 'all',
      taskType: 'all',
      duration: 'all',
    };
  };

  // Get filtered projects
  const filteredProjects = computed(() => {
    const projectStore = useProjectStore();
    let projects = projectStore.projectsWithDurations;

    // Filter by state
    if (currentFilters.value.state !== 'all') {
      projects = projects.filter(
        (project: Project) => project.status === currentFilters.value.state
      );
    }

    // Filter by task type
    // if (currentFilters.value.taskType !== 'all') {
    //   projects = projects.filter((project: Project) =>
    //     project.tasks.some(
    //       (task) => task.type === currentFilters.value.taskType
    //     )
    //   );
    // }

    // Filter by duration
    if (currentFilters.value.duration !== 'all') {
      const maxSeconds = Number(currentFilters.value.duration) * 3600; // Convert hours to seconds
      projects = projects.filter((project: Project) => {
        return project.totalSeconds <= maxSeconds;
      });
    }

    return projects;
  });

  return {
    // Current filter values
    currentFilters,

    // Filter options
    stateOptions,
    taskTypeOptions,
    durationOptions,

    // Actions
    updateFilters,
    resetFilters,

    // Getters
    filteredProjects,
  };
});
