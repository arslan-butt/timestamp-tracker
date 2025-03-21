<template>
  <UModal v-model:open="open" title="Add New Timestamp" description="">
    <div
      class="border border-dashed border-gray-300 rounded-lg p-4 my-6 hover:bg-gray-50"
    >
      <UButton
        block
        color="neutral"
        icon="i-heroicons-plus-circle"
        variant="ghost"
        class="hover:bg-gray-50"
      >
        Add New Timestamp
      </UButton>
    </div>
    <template #body>
      <div class="space-y-6">
        <UCard class="bg-neutral-50 border-neutral-100">
          <UForm class="space-y-4" :state="state">
            <div class="flex flex-wrap items-start gap-3">
              <UFormField label="Date" class="flex-1 min-w-48">
                <UInput
                  v-model="state.date"
                  type="date"
                  placeholder="Select a date"
                  :ui="{
                    base: 'shadow-sm',
                    icon: { trailing: { pointer: '' } },
                  }"
                />
              </UFormField>

              <UFormField label="Project" class="flex-1 min-w-48">
                <USelectMenu
                  v-model="state.project"
                  :items="projects"
                  value-key="id"
                  label-key="name"
                  placeholder="Select a project"
                  class="w-48"
                  :ui="{
                    base: 'shadow-sm',
                  }"
                >
                  <template #item-leading="{ item, index }">
                    <UChip
                      v-if="item?.color"
                      :color="item.color"
                      inset
                      standalone
                    />
                  </template>
                </USelectMenu>
              </UFormField>
            </div>

            <!-- Status Selection -->
            <UFormField label="Status">
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="option in statusOptions"
                  :key="option.value"
                  :color="
                    state.status === option.value
                      ? getStatusColor(option.value)
                      : 'gray'
                  "
                  :variant="state.status === option.value ? 'solid' : 'soft'"
                  size="xs"
                  class="flex items-center gap-1"
                  @click="state.status = option.value"
                >
                  <UIcon :name="getStatusIcon(option.value)" class="w-4 h-4" />
                  {{ option.label }}
                </UButton>
              </div>
            </UFormField>
          </UForm>
        </UCard>

        <!-- Tasks Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-gray-700 flex items-center gap-1">
              <UIcon name="i-heroicons-clipboard-document-list" />
              Tasks
            </h4>
            <UButton
              color="neutral"
              variant="soft"
              size="sm"
              icon="i-heroicons-plus-circle"
              @click="addTask"
            >
              Add Task
            </UButton>
          </div>

          <div class="space-y-2 max-h-80 overflow-y-auto">
            <UCard
              v-for="(task, index) in state.tasks"
              :key="index"
              class="hover:shadow-md transition-all duration-200"
              variant="subtle"
            >
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <UInput
                    v-model="task.title"
                    placeholder="Task description"
                    :ui="{
                      base: 'shadow-sm',
                      icon: {
                        leading: { pointer: '' },
                      },
                    }"
                    :icon="'i-heroicons-clipboard-document'"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <UInput
                    v-model="task.duration"
                    placeholder="00:00"
                    type="time"
                    class="flex-1"
                    :ui="{
                      base: 'shadow-sm',
                      icon: {
                        leading: { pointer: '' },
                      },
                    }"
                  />
                  <UTooltip text="Remove task">
                    <UButton
                      color="error"
                      variant="ghost"
                      size="sm"
                      icon="i-heroicons-trash"
                      class="opacity-70 group-hover:opacity-100"
                      @click="removeTask(index)"
                    />
                  </UTooltip>
                </div>
              </div>
            </UCard>
          </div>

          <!-- Empty state -->
          <UCard
            v-if="!state.tasks.length"
            variant="subtle"
            class="text-center text-gray-500 bg-gray-50"
            :ui="{ base: 'p-8' }"
          >
            <template #default>
              <UIcon name="i-heroicons-clipboard" class="mb-2 mx-auto" />
              <p>No tasks added yet. Add your first task above.</p>
            </template>
          </UCard>
        </div>

        <!-- Time Summary Card -->
        <!-- <UCard v-if="state.tasks.length > 0" class="bg-gray-50 border-gray-200">
          <div class="flex items-center justify-between text-sm">
            <div class="font-medium text-gray-700">Total Duration</div>
            <div class="font-mono">{{ totalDuration }}</div>
          </div>
        </UCard> -->
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="close"
        >
          Cancel
        </UButton>
        <UButton
          label="Save Timestamp"
          color="neutral"
          icon="i-heroicons-check"
          :disabled="!isFormValid"
          @click="saveTimestamp"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task';

const open = ref(false);

defineShortcuts({
  o: () => (open.value = !open.value),
});

const projectStore = useProjectStore();
const taskStore = useTaskStore();

const statusOptions = [
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Done', value: 'Done' },
  { label: 'Overtime', value: 'Overtime' },
];

const createDefaultState = () => ({
  date: new Date().toISOString().split('T')[0],
  project: '',
  status: 'In Progress',
  tasks: [{ title: '', duration: '00:00' }],
});

const state = ref(createDefaultState());

const projects = computed(() => projectStore.projects);

const isFormValid = computed(() => {
  return (
    state.value.project &&
    state.value.tasks.length > 0 &&
    state.value.tasks.every(
      (task: Task) => task.title.trim() && task.duration.trim()
    )
  );
});

const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress':
      return 'info';
    case 'Done':
      return 'success';
    case 'Overtime':
      return 'warning';
    default:
      return 'primary';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'In Progress':
      return 'i-heroicons-clock';
    case 'Done':
      return 'i-heroicons-check-circle';
    case 'Overtime':
      return 'i-heroicons-exclamation-circle';
    default:
      return 'i-heroicons-question-mark-circle';
  }
};

const addTask = () => {
  state.value.tasks.push({ title: '', duration: '00:00:00' });
};

const removeTask = (index) => {
  state.value.tasks.splice(index, 1);
};

const resetForm = () => {
  state.value = createDefaultState();
};

const close = () => {
  isOpen.value = false;
  resetForm();
};

const saveTimestamp = () => {
  if (!isFormValid.value) return;

  const { project, tasks, status } = state.value;

  // Add each task to the selected project
  tasks.forEach((task: Task) => {
    taskStore.addTask({
      title: task.title,
      duration: task.duration + ':00',
      status: status,
      projectId: project,
      type: 'development',
    });
  });

  close();
};
</script>

<style scoped></style>
