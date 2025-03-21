<template>
  <div
    v-if="activeTask"
    class="mb-6 p-5 bg-gradient-to-r from-primary-50 to-primary-200 border border-primary-200 rounded-lg shadow-sm"
  >
    <div
      class="flex flex-col md:flex-row items-center md:justify-between gap-4"
    >
      <!-- Task information -->
      <div class="flex items-start gap-3">
        <div>
          <h3 class="font-semibold text-primary-700 mb-1">
            {{ activeTask.title }}
          </h3>
          <div class="flex items-center text-sm text-gray-600 gap-2">
            <span class="font-medium text-primary-600">
              {{ getProjectName(activeTask.projectId) }}
            </span>
            <span class="text-gray-400">•</span>
            <div class="flex items-center gap-1">
              <UIcon
                :name="
                  timerStore.isPaused
                    ? 'i-heroicons-pause-circle'
                    : 'i-heroicons-play-circle'
                "
              />
              <span v-if="timerStore.isPaused">
                Paused at {{ formattedPausedTime }}
              </span>
              <span v-else> Started at {{ formattedStartTime }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Timer and controls -->
      <div class="flex items-center gap-4">
        <div
          class="text-2xl font-mono font-medium text-primary-800 bg-white py-2 px-4 rounded-lg shadow-inner"
        >
          {{ activeTaskDuration }}
        </div>
        <div class="flex gap-2">
          <!-- Conditional button based on paused state -->
          <UButton
            v-if="timerStore.isPaused"
            icon="i-heroicons-play"
            color="success"
            size="md"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="resumeActiveTask"
          >
            Resume
          </UButton>
          <UButton
            v-else
            icon="i-heroicons-pause-solid"
            color="warning"
            size="md"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="pauseActiveTask"
          >
            Pause
          </UButton>
          <UButton
            icon="i-heroicons-stop-solid"
            color="error"
            size="md"
            variant="soft"
            class="shadow-sm hover:shadow transition-all duration-200"
            @click="stopActiveTask"
          >
            Stop
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
