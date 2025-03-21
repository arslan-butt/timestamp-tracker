<template>
  <div>
    <UDropdownMenu
      :items="actionItems"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        icon="i-heroicons-share"
        color="neutral"
        variant="ghost"
        size="sm"
      />
    </UDropdownMenu>

    <ExportFileDownload
      v-model:open="showDownloadModal"
      @download="downloadData"
    />

    <ExportEmailShare v-model:open="emailShareModal" />
  </div>
</template>

<script setup lang="ts">
import type { Project } from '@/types/project';

import {
  projectsToCSV,
  projectsToJSON,
  generateExportFilename,
} from '@/utils/exportUtils';

const filterStore = useFilterStore();
const taskStore = useTaskStore();
const toast = useToast();

// State for modals
const showDownloadModal = ref(false);
const emailShareModal = ref(false);

// Get filtered projects directly from store
const filteredProjects = computed(() => filterStore.filteredProjects);

// Action items for dropdown
const actionItems = ref([
  {
    label: 'Download Data',
    icon: 'i-heroicons-arrow-down-tray',
    onSelect: () => (showDownloadModal.value = true),
  },
  {
    label: 'Share via Email',
    icon: 'i-heroicons-envelope',
    onSelect: () => (emailShareModal.value = true),
  },
  {
    label: 'Quick Export (CSV)',
    icon: 'i-heroicons-document-text',
    onSelect: () => downloadData('csv', true),
  },
]);

// Function to prepare data for export based on filters
const prepareDataForExport = (includeDetails = true) => {
  // Get projects with their associated tasks
  const projects = filteredProjects.value.map((project: Project) => {
    const projectTasks = taskStore.getTasksByProject(project.id);
    return {
      ...project,
      tasks: projectTasks,
    };
  });

  return projects;
};

// Download the data
const downloadData = (
  format = 'csv',
  quickExport = false,
  includeDetails = true
) => {
  // Get projects with their tasks
  const projectsWithTasks = prepareDataForExport(includeDetails);

  let exportData;
  let mimeType;
  let fileExtension;

  // Generate the export data in the appropriate format
  switch (format) {
    case 'csv':
      exportData = projectsToCSV(projectsWithTasks, includeDetails);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    case 'json':
      exportData = projectsToJSON(projectsWithTasks, includeDetails);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
    case 'excel':
      exportData = projectsToCSV(projectsWithTasks, includeDetails);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    default:
      exportData = projectsToCSV(projectsWithTasks, includeDetails);
      mimeType = 'text/csv';
      fileExtension = 'csv';
  }

  // Create a filename with date stamp
  const filename = generateExportFilename('projects_export', fileExtension);

  // Create and trigger download
  const blob = new Blob([exportData], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (!quickExport) {
    showDownloadModal.value = false;
  }

  // Show success notification
  toast.add({
    title: 'Export Successful',
    description: `Your data has been exported as ${format.toUpperCase()}`,
    icon: 'i-heroicons-check-circle',
    color: 'success',
  });
};
</script>
