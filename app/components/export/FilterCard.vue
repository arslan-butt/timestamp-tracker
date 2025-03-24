<template>
  <UCard class="bg-gray-50 dark:bg-gray-800">
    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-funnel" class="text-gray-500" />
        <span class="font-medium">Current Filters:</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <!-- Column 1: Status -->
        <div
          class="flex flex-col items-center gap-1 p-2 border dark:border-gray-700 rounded-lg shadow-sm"
        >
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-flag" class="text-gray-400" />
            <span class="text-gray-600 font-medium">Status</span>
          </div>
          <UBadge color="neutral" size="sm" class="mt-1">
            {{ getStatusLabel(currentFilters.state) }}
          </UBadge>
        </div>

        <!-- Column 2: Task Type -->
        <div
          class="flex flex-col items-center gap-1 p-2 border dark:border-gray-700 rounded-lg shadow-sm"
        >
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-tag" class="text-gray-400" />
            <span class="text-gray-600 font-medium">Task Type</span>
          </div>
          <UBadge color="neutral" size="sm" class="mt-1">
            {{ getTaskTypeLabel(currentFilters.taskType) }}
          </UBadge>
        </div>

        <!-- Column 3: Duration -->
        <div
          class="flex flex-col items-center gap-1 p-2 border dark:border-gray-700 rounded-lg shadow-sm"
        >
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="text-gray-400" />
            <span class="text-gray-600 font-medium">Duration</span>
          </div>
          <UBadge color="neutral" size="sm" class="mt-1">
            {{ getDurationLabel(currentFilters.duration) }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const filterStore = useFilterStore();
const currentFilters = computed(() => filterStore.currentFilters);

const getStatusLabel = (status: string): string => {
  if (status === 'all') return 'All Statuses';
  return status;
};

const getTaskTypeLabel = (type: string): string => {
  if (type === 'all') return 'All Types';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getDurationLabel = (duration: string): string => {
  if (duration === 'all') return 'All Durations';
  return `Up to ${duration} hours`;
};
</script>
