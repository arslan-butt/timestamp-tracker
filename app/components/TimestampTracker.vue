<template>
  <div>
    <UCard class="max-w-4xl mx-auto">
      <template #header>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4"
        >
          <div class="flex items-center gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-clock"
                class="text-gray-500 dark:text-gray-400 flex-shrink-0"
              />
              <h1
                class="text-xl font-semibold dark:text-white whitespace-nowrap"
              >
                Timestamp
              </h1>
            </div>
            <ExportActions class="flex-shrink-0" />
          </div>

          <div class="flex items-center gap-2 flex-wrap justify-end">
            <UButton
              v-model="showManageProjectsModal"
              icon="i-heroicons-folder"
              color="neutral"
              variant="ghost"
              size="sm"
              class="whitespace-nowrap"
              @click="showManageProjectsModal = true"
            >
              <span class="hidden sm:inline">Manage Projects</span>
              <span class="sm:hidden">Projects</span>
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
      </template>

      <div class="body space-y-6">
        <Filters />
        <ActiveTaskTimer />

        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-1 dark:text-white">
            Timestamp History
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            View details for each task on the timestamps that have been
            recorded.
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
      </div>

      <template #footer>
        <div>
          <AddTimestamp />
          <ProjectManager v-model:open="showManageProjectsModal" />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const filterStore = useFilterStore();
const showManageProjectsModal = ref(false);

const refreshData = () => {
  console.log('Refreshing data');
};
</script>
