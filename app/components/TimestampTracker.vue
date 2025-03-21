<template>
  <div>
    <!-- Header  -->

    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-clock" class="text-gray-500" />
        <h1 class="text-xl font-semibold">Timestamp</h1>

        <ExportActions />
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-model="showManageProjectsModal"
          icon="i-heroicons-folder"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="showManageProjectsModal = true"
        >
          Manage Projects
        </UButton>

        <UButton
          icon="i-heroicons-arrow-path"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Refresh"
          @click="refreshData"
        />

        <UButton
          icon="i-heroicons-cog-6-tooth"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Settings"
        />
      </div>
    </div>

    <!-- Filters -->
    <Filters />
    <!-- Active Timer Display -->
    <ActiveTaskTimer />

    <!-- Timestamp History -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-1">Timestamp History</h2>
      <p class="text-sm text-gray-500 mb-4">
        View details for each task on the timestamps that have been recorded.
      </p>

      <!-- Timestamp entries -->
      <div class="space-y-4">
        <TimestampEntry
          v-for="project in filterStore.filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>

    <!-- Add New Timestamp -->
    <AddTimestamp />
    <!-- <div
      class="border border-dashed border-gray-300 rounded-lg p-4 my-6 hover:bg-gray-50 hover:"
    >
      <UButton
        block
        color="neutral"
        icon="i-heroicons-plus-circle"
        variant="ghost"
        @click="showAddTimestampModal = true"
      >
        Add New Timestamp
      </UButton>
    </div> -->

    <!-- Add Timestamp Modal -->
    <!-- <AddTimestamp v-model:open="showAddTimestampModal" /> -->
    <!--  ProjectManager Modal -->
    <ProjectManager v-model:open="showManageProjectsModal" />
  </div>
</template>

<script setup lang="ts">
import type { Project } from '@types/project';

const projectStore = useProjectStore();
const filterStore = useFilterStore();
const { sumDurations } = useTimeUtils();

const showAddTimestampModal = ref(false);
const showManageProjectsModal = ref(false);

const refreshData = () => {
  // Refresh logic - could reload data or just force UI update
  // For now, just update project durations
  projectStore.projects.forEach((project: Project) => {
    if (project.tasks && project.tasks.length > 0) {
      const durations = project.tasks.map(
        (task: Task) => task.duration || '00:00:00'
      );
      project.duration = sumDurations(durations) || '00:00:00';
    }
  });
};
</script>
