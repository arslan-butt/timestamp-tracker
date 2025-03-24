<template>
  <div v-if="activeTask" class="active-timer-card-gradient">
    <div
      class="flex flex-col md:flex-row items-center md:justify-between gap-3 sm:gap-4"
    >
      <!-- Task information -->
      <div class="flex items-start gap-3 w-full md:w-auto">
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-primary-700 mb-1 truncate">
            {{ activeTask.title }}
          </h3>
          <div
            class="flex flex-wrap items-center text-sm text-gray-600 gap-1 sm:gap-2"
          >
            <span class="font-medium text-primary-600 truncate">
              {{ getProjectName(activeTask.projectId) }}
            </span>
            <span class="text-gray-400 hidden sm:inline">•</span>
            <div class="flex items-center gap-1">
              <UIcon
                :name="
                  timerStore.isPaused
                    ? 'i-heroicons-pause-circle'
                    : 'i-heroicons-play-circle'
                "
                class="flex-shrink-0"
              />
              <span class="whitespace-nowrap">
                {{ timerStore.isPaused ? 'Paused at' : 'Started at' }}
                {{
                  timerStore.isPaused ? formattedPausedTime : formattedStartTime
                }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timer and controls -->
      <div
        class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
      >
        <div
          class="text-xl sm:text-2xl font-mono font-medium text-primary-800 bg-white py-1 sm:py-2 px-3 sm:px-4 rounded-lg shadow-inner w-full text-center sm:w-auto"
        >
          {{ activeTaskDuration }}
        </div>
        <div class="flex gap-2 w-full sm:w-auto">
          <!-- Conditional button based on paused state -->
          <UButton
            v-if="timerStore.isPaused"
            icon="i-heroicons-play"
            color="success"
            size="sm"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="resumeActiveTask"
          >
            <span class="sm:hidden">Resume</span>
            <span class="hidden sm:inline">Resume</span>
          </UButton>
          <UButton
            v-else
            block
            icon="i-heroicons-pause-solid"
            color="warning"
            size="sm"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="pauseActiveTask"
          >
            <span class="sm:hidden">Pause</span>
            <span class="hidden sm:inline">Pause</span>
          </UButton>
          <UButton
            block
            icon="i-heroicons-stop-solid"
            color="error"
            size="sm"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="stopActiveTask"
          >
            <span class="sm:hidden">Stop</span>
            <span class="hidden sm:inline">Stop</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from 'types/project';
const projectStore = useProjectStore();
const timerStore = useTimerStore();
const activeTask = computed(() => timerStore.activeTask);

const activeTaskDuration = computed(() => {
  if (!activeTask.value) return '00:00:00';

  return activeTask.value.duration;
});

const formattedStartTime = computed(() => {
  if (!timerStore.startTime) return '';

  const date = new Date(timerStore.startTime);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

const formattedPausedTime = computed(() => {
  if (!timerStore.pausedAt) return '';

  const date = new Date(timerStore.pausedAt);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
});

// Handle timer controls
const pauseActiveTask = () => {
  timerStore.pauseTimer();
};

const resumeActiveTask = () => {
  if (activeTask.value) {
    timerStore.startTimer(activeTask.value.id);
  }
};

const stopActiveTask = () => {
  timerStore.stopTimer();
};

// Get project name by ID
const getProjectName = (projectId: number | string) => {
  const project = projectStore.projects.find(
    (p: Project) => p.id === projectId
  );
  return project ? project.name : 'Unknown Project';
};
</script>
