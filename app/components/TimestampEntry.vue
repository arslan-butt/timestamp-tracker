<template>
  <div
    class="border border-gray-200 rounded-lg overflow-hidden"
    :class="{ 'ring-1 ring-primary-300': hasActiveTask }"
  >
    <!-- Header section -->
    <div
      class="flex items-center justify-between p-4 bg-gray-50 border-b border-b-gray-200"
    >
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-calendar" class="text-gray-500" />
        <span class="font-medium">{{ project.date }}</span>
        <UBadge :color="getBadgeColor(project.status)" variant="soft" size="sm">
          {{ project.status }}
        </UBadge>
        <UBadge :color="project.color" variant="soft" size="sm">
          {{ project.name }}
        </UBadge>
      </div>
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-clock"
          class="text-gray-500"
          :class="{ 'animate-spin': hasActiveTask }"
        />

        <span class="font-medium">{{ project.duration }}</span>

        <UButton
          icon="i-heroicons-trash"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="deleteProject(project.id)"
        />

        <UButton
          :icon="
            expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
          "
          color="neutral"
          variant="ghost"
          size="xs"
          @click="expanded = !expanded"
        />
      </div>
    </div>

    <!-- Tasks section -->
    <div v-if="expanded" class="p-4 space-y-2">
      <h4 class="font-medium mb-2">Task(s)</h4>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="p-2 first:pt-0 border border-gray-200 rounded-lg bg-gray-50"
      >
        <div class="flex items-center justify-between">
          <p class="font-medium">{{ task.title }}</p>

          <div class="flex items-center gap-2">
            <span class="text-gray-600">{{ task.duration }}</span>

            <!-- Timer controls -->
            <div class="flex items-center gap-1">
              <UButton
                v-if="isActiveTask(task.id) && !timerStore.isPaused"
                icon="i-heroicons-pause-circle-solid"
                color="warning"
                variant="ghost"
                size="xs"
                @click="pauseTask"
              />
              <UButton
                v-else-if="isActiveTask(task.id) && timerStore.isPaused"
                icon="i-heroicons-play-circle-solid"
                color="success"
                variant="ghost"
                size="xs"
                @click="startTask(task.id)"
              />
              <UButton
                v-else
                icon="i-heroicons-play-circle-solid"
                color="neutral"
                variant="ghost"
                size="xs"
                :disabled="hasActiveTaskOtherThan(task.id)"
                @click="startTask(task.id)"
              />
              <UButton
                icon="i-heroicons-stop-circle-solid"
                color="error"
                variant="ghost"
                size="xs"
                :disabled="!isActiveTask(task.id)"
                @click="stopTask"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '@/types/project';
interface Props {
  project: Project;
}

const { project } = defineProps<Props>();

const expanded = ref(true);
const projectStore = useProjectStore();
const taskStore = useTaskStore();
const timerStore = useTimerStore();

const tasks = computed(() => taskStore.getTasksByProject(project.id));

// Check if this project has an active task
const hasActiveTask = computed(() => {
  if (!timerStore.activeTaskId) return false;

  const activeTask = taskStore.getTaskById(timerStore.activeTaskId);
  return activeTask && activeTask.projectId === project.id;
});

// Check if a specific task is active
const isActiveTask = (taskId: number) => {
  return timerStore.activeTaskId === taskId;
};

// Check if there's an active task that's not the one provided
const hasActiveTaskOtherThan = (taskId: number) => {
  return timerStore.activeTaskId !== null && timerStore.activeTaskId !== taskId;
};

const deleteProject = (projectId: number | string) => {
  // Check if project has an active task and stop it first
  const projectTasks = taskStore.getTasksByProject(projectId);
  const activeTaskInProject = projectTasks.find(
    (task) => task.id === timerStore.activeTaskId
  );

  if (activeTaskInProject) {
    timerStore.stopTimer();
  }

  projectStore.deleteProject(projectId);
};

const startTask = (taskId: number) => {
  timerStore.startTimer(taskId);
};

const pauseTask = () => {
  timerStore.pauseTimer();
};

const stopTask = () => {
  timerStore.stopTimer();
};

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'In Progress':
      return 'secondary';
    case 'Done':
      return 'success';
    case 'Overtime':
      return 'warning';
    default:
      return 'neutral';
  }
};
</script>
