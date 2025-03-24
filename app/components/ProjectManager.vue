<template>
  <UModal v-model:open="isOpen" title="Manage Projects">
    <template #body>
      <div class="space-y-6">
        <!-- New Project Form -->
        <UCard
          class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          <UForm class="space-y-4" :state="state" @submit="addProject">
            <div class="flex items-center gap-2">
              <UFormField label="New Project" class="flex-1">
                <UInput
                  v-model="state.name"
                  class="w-full"
                  placeholder="Enter project name"
                  :ui="{
                    base: 'shadow-sm',
                  }"
                />
              </UFormField>

              <UFormField label="Color">
                <USelectMenu
                  v-model="state.color"
                  :items="items"
                  class="w-full"
                >
                  <template #leading="{ modelValue, ui }">
                    <UChip
                      v-if="modelValue"
                      v-bind="modelValue.chip"
                      inset
                      standalone
                      :size="ui.itemLeadingChipSize()"
                      :class="ui.itemLeadingChip()"
                    />
                  </template>
                </USelectMenu>
              </UFormField>
            </div>

            <UButton
              type="submit"
              color="neutral"
              icon="i-heroicons-plus-circle"
              size="sm"
              block
              :disabled="!state.name.trim()"
            >
              Add Project
            </UButton>
          </UForm>
        </UCard>

        <!-- Projects List -->
        <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
          <TransitionGroup name="list">
            <div
              v-for="project in projects"
              :key="project.id"
              class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group shadow-sm"
            >
              <!-- Color indicator -->
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <UChip :color="project.color" class="opacity-50" />

                <!-- Project name (editable) -->
                <div class="flex-1 min-w-0">
                  <div
                    v-if="editingProjectId === project.id"
                    class="flex items-center gap-1"
                  >
                    <UInput
                      v-model="editProjectName"
                      size="sm"
                      autofocus
                      @blur="saveProjectEdit(project.id)"
                      @keyup.enter="saveProjectEdit(project.id)"
                      @keyup.esc="cancelEdit"
                    />
                  </div>
                  <div v-else class="flex items-center justify-between gap-2">
                    <div>
                      <div
                        class="font-medium truncate text-gray-900 dark:text-white"
                      >
                        {{ project.name }}
                      </div>
                      <div
                        class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"
                      >
                        <UIcon name="i-heroicons-calendar-days" />
                        {{ project.date }}
                        <span class="px-1">•</span>
                        <span
                          :class="{
                            'text-blue-500 dark:text-blue-400':
                              project.status === 'In Progress',
                            'text-green-500 dark:text-green-400':
                              project.status === 'Done',
                            'text-orange-500 dark:text-orange-400':
                              project.status === 'Overtime',
                          }"
                        >
                          {{ project.status }}
                        </span>

                        <UIcon
                          :name="
                            project.status === 'In Progress'
                              ? 'i-heroicons-clock'
                              : project.status === 'Done'
                              ? 'i-heroicons-check-circle'
                              : 'i-heroicons-exclamation-circle'
                          "
                        />
                      </div>
                    </div>
                    <UBadge size="xs" color="gray" variant="subtle">
                      {{ project.tasks?.length || 0 }} tasks
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div
                class="flex items-center gap-1 opacity-70 group-hover:opacity-100"
              >
                <UButton
                  icon="i-heroicons-pencil"
                  color="gray"
                  variant="ghost"
                  size="xs"
                  @click="startEdit(project)"
                />
                <UTooltip text="Delete project">
                  <UButton
                    icon="i-heroicons-trash"
                    color="red"
                    variant="ghost"
                    size="xs"
                    @click="confirmDelete(project)"
                  />
                </UTooltip>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Empty state -->
        <div
          v-if="!projects.length"
          class="text-center p-8 text-gray-500 dark:text-gray-400"
        >
          <UIcon name="i-heroicons-folder-open" class="w-6 h-6 mx-auto" />
          <p class="mt-2">No projects yet. Create your first project above.</p>
        </div>
      </div>
    </template>
  </UModal>

  <!-- Confirmation dialog -->
  <UModal v-model:open="showDeleteConfirm" size="xs">
    <template #content>
      <UAlert
        title="Delete Project!"
        :description="`Are you sure you want to delete '${projectToDelete?.name}'? This will remove all tasks associated with this project.`"
        color="error"
        variant="outline"
        :actions="[
          {
            label: 'Cancel',
            color: 'neutral',
            variant: 'subtle',
            onClick: () => {
              showDeleteConfirm = false;
            },
          },
          {
            label: 'Delete',
            color: 'error',
            variant: 'solid',
            onClick: () => {
              handleDelete();
            },
          },
        ]"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
const isOpen = defineModel('open', { type: Boolean, default: false });
const projectStore = useProjectStore();
const projects = computed(() => projectStore.projects);

// Editing state
const editingProjectId = ref<number | string | null>(null);
const editProjectName = ref('');
const showDeleteConfirm = ref(false);
const projectToDelete = ref<{ id: number | string; name: string } | null>(null);

// Color options for projects
const items = ref([
  {
    label: 'Blue',
    value: 'info',
    chip: {
      color: 'info' as const,
    },
  },
  {
    label: 'Red',
    value: 'error',
    chip: {
      color: 'error' as const,
    },
  },
  {
    label: 'Green',
    value: 'primary',
    chip: {
      color: 'primary' as const,
    },
  },
  {
    label: 'Yellow',
    value: 'warning',
    chip: {
      color: 'warning' as const,
    },
  },
  {
    label: 'Slate',
    value: 'neutral',
    chip: {
      color: 'neutral' as const,
    },
  },
]);

function getChip(value: string) {
  return items.value.find((item) => item.value === value)?.chip;
}
const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const state = reactive({
  name: '',
  date: getCurrentDate(),
  status: 'In Progress',
  color: items.value[0],
});

const resetState = () => {
  state.name = '';
  state.date = getCurrentDate();
  state.status = 'In Progress';
  state.color = items.value[0];
};

async function addProject() {
  if (state.name.trim()) {
    const project = {
      ...state,
      color: state.color?.value,
    };

    projectStore.addProject(project);
    resetState();
  }
}

// Inline editing
const startEdit = (project: any) => {
  editingProjectId.value = project.id;
  editProjectName.value = project.name;
};

const saveProjectEdit = (projectId: number | string) => {
  if (editProjectName.value.trim()) {
    const project = projectStore.projects.find((p) => p.id === projectId);
    if (project) {
      project.name = editProjectName.value.trim();
    }
  }
  cancelEdit();
};

const cancelEdit = () => {
  editingProjectId.value = null;
  editProjectName.value = '';
};

// Delete project with confirmation
const confirmDelete = (project: any) => {
  projectToDelete.value = {
    id: project.id,
    name: project.name,
  };
  showDeleteConfirm.value = true;
};

const handleDelete = () => {
  projectStore.deleteProject(projectToDelete.value!.id);
  showDeleteConfirm.value = false;
};
</script>

<style scoped></style>
