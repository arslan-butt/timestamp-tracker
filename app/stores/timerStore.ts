export const useTimerStore = defineStore('timerStore', () => {
  const taskStore = useTaskStore();
  const { durationToSeconds, formatDuration } = useTimeUtils();

  // State
  const activeTaskId = ref<number | null>(null);
  const timerInterval = ref<number | null>(null);
  const startTime = ref<number | null>(null);
  const pausedAt = ref<number | null>(null);
  const accumulatedTime = ref<number>(0); // Track time accumulated during pauses
  const isPaused = ref<boolean>(false);
  const currentTimestamp = ref(Date.now());

  // Computed
  const activeTask = computed(() => {
    if (activeTaskId.value === null) return null;
    return taskStore.getTaskById(activeTaskId.value);
  });

  const elapsedTime = computed(() => {
    if (!activeTask.value) return '00:00:00';

    const task = activeTask.value;
    const baseSeconds = durationToSeconds(task.duration);

    // If timer is paused, return the saved duration
    if (isPaused.value) {
      return task.duration;
    }

    // Calculate additional time since timer started/resumed
    let additionalSeconds = 0;
    if (startTime.value && !isPaused.value) {
      additionalSeconds = Math.floor(
        (currentTimestamp.value - startTime.value) / 1000
      );
    }

    return formatDuration(baseSeconds);
  });

  // Actions
  const startTimer = (taskId: number) => {
    const task = taskStore.getTaskById(taskId);
    if (!task) return;

    // If we're resuming the same task that was paused
    if (taskId === activeTaskId.value && isPaused.value) {
      // Calculate how long we were paused
      const now = Date.now();
      isPaused.value = false;

      // Adjust the startTime to account for the pause duration
      if (pausedAt.value) {
        const pauseDuration = now - pausedAt.value;
        startTime.value = now;
        accumulatedTime.value += pauseDuration; // Add pause time to accumulated time
      } else {
        startTime.value = now;
      }

      pausedAt.value = null;
    }
    // If we're starting a new task
    else {
      // Stop any current timer
      if (activeTaskId.value !== null) {
        stopTimer();
      }

      // Set the new active task
      activeTaskId.value = taskId;
      isPaused.value = false;
      startTime.value = Date.now();
      pausedAt.value = null;
      accumulatedTime.value = 0; // Reset accumulated time for new task

      // Update task status
      taskStore.updateTask(taskId, {
        isActive: true,
        isPaused: false,
      });
    }

    // Start interval to update UI
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }

    timerInterval.value = window.setInterval(() => {
      updateTimerDisplay();

      // Update task duration in real-time while running
      if (activeTaskId.value !== null && !isPaused.value) {
        const additionalSeconds = Math.floor(
          (Date.now() - startTime.value) / 1000
        );
        const task = activeTask.value;
        if (task) {
          const baseSeconds = durationToSeconds(task.duration);
          taskStore.updateTaskDuration(
            activeTaskId.value,
            baseSeconds + additionalSeconds
          );
        }
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (activeTaskId.value === null || !startTime.value) return;

    const task = activeTask.value;
    if (!task) return;

    // Calculate elapsed time since last start/resume
    const currentTime = Date.now();
    const additionalSeconds = Math.floor(
      (currentTime - startTime.value) / 1000
    );
    const currentSeconds = durationToSeconds(task.duration);

    // Update the task duration
    taskStore.updateTaskDuration(
      activeTaskId.value,
      currentSeconds + additionalSeconds
    );

    // Update task state
    // Keep it active, just paused
    taskStore.updateTask(activeTaskId.value, {
      isActive: true,
      isPaused: true,
    });

    // Update timer state
    // Remember when we paused
    isPaused.value = true;
    pausedAt.value = currentTime;

    // Clear interval
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  };

  const stopTimer = () => {
    // First pause to update the duration
    if (!isPaused.value && activeTaskId.value !== null) {
      pauseTimer();
    }

    // Then clean up completely
    if (activeTaskId.value !== null) {
      taskStore.updateTask(activeTaskId.value, {
        isActive: false,
        isPaused: false,
      });
    }

    // Reset timer state
    activeTaskId.value = null;
    isPaused.value = false;
    startTime.value = null;
    pausedAt.value = null;
    accumulatedTime.value = 0;

    // Clear interval if it's still running
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  };

  // Update the UI without changing the actual task duration
  const updateTimerDisplay = () => {
    currentTimestamp.value = Date.now();
  };

  return {
    // State
    activeTaskId,
    isPaused,
    timerInterval,
    startTime,
    pausedAt,

    // Getters
    activeTask,
    elapsedTime,

    // Actions
    startTimer,
    pauseTimer,
    stopTimer,
  };
});
