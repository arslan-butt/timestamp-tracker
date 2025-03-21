/**
 * Sums an array of durations in HH:MM:SS format
 * @param durations Array of strings in HH:MM:SS format
 * @returns Total duration in HH:MM:SS format
 */
const sumDurations = (durations: string[]): string => {
  let totalSeconds = durations.reduce((sum, time) => {
    const [h, m, s] = time.split(':').map(Number);
    return sum + h * 3600 + m * 60 + s;
  }, 0);

  return formatDuration(totalSeconds);
};

/**
 * Formats seconds to HH:MM:SS format
 * @param seconds Total seconds to format
 * @returns Formatted time string in HH:MM:SS format
 */
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}:${secs}`;
};

/**
 * Converts a HH:MM:SS string to seconds
 * @param duration Duration string in HH:MM:SS format
 * @returns Total seconds
 */
const durationToSeconds = (duration: string): number => {
  const [h, m, s] = duration.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

/**
 * Creates a timer that updates a ref value
 * @param initialDuration Initial duration in HH:MM:SS format
 * @returns Object with timer controls and current duration
 */
const useTimer = (initialDuration: string = '00:00:00') => {
  const duration = ref(initialDuration);
  const isRunning = ref(false);
  const startTime = ref<number | null>(null);
  const timerInterval = ref<number | null>(null);
  // Changed from const to let so it can be updated
  let initialSeconds = durationToSeconds(initialDuration);
  const elapsedSeconds = ref(initialSeconds);

  const start = () => {
    if (isRunning.value) return;

    isRunning.value = true;
    startTime.value = Date.now();

    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }

    timerInterval.value = window.setInterval(() => {
      if (startTime.value) {
        const currentElapsed = Math.floor(
          (Date.now() - startTime.value) / 1000
        );
        elapsedSeconds.value = initialSeconds + currentElapsed;
        duration.value = formatDuration(elapsedSeconds.value);
      }
    }, 1000);
  };

  const pause = () => {
    if (!isRunning.value) return;

    isRunning.value = false;
    initialSeconds = elapsedSeconds.value;
    startTime.value = null;

    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  };

  const stop = () => {
    pause();
    elapsedSeconds.value = 0;
    duration.value = '00:00:00';
  };

  const reset = () => {
    stop();
    elapsedSeconds.value = initialSeconds;
    duration.value = initialDuration;
  };

  return {
    duration,
    isRunning,
    elapsedSeconds,
    start,
    pause,
    stop,
    reset,
  };
};

export function useTimeUtils() {
  return {
    sumDurations,
    formatDuration,
    durationToSeconds,
    useTimer,
  };
}
