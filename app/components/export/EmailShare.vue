<template>
  <UModal
    :open="isOpen"
    title="Share Project Data"
    @update:open="isOpen = $event"
  >
    <template #body>
      <div class="space-y-4 p-2">
        <p class="text-sm text-gray-600">
          Share data for {{ filteredProjects.length }} filtered projects with
          the following filters:
        </p>
        <ExportFilterCard />

        <UForm
          :schema="schema"
          :state="state"
          class="flex w-full max-w-[40rem] flex-col gap-3"
          @submit="sendEmail"
        >
          <UFormField label="Email" name="email" required>
            <UInput
              v-model="state.email"
              autocomplete="email"
              placeholder="john.doe@gmail.com"
              type="email"
              icon="i-heroicons-envelope"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Message (optional)" name="message">
            <UTextarea
              v-model="state.message"
              placeholder="Add a message"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Include">
            <UCheckbox
              v-model="state.includeTaskDetailsInShare"
              label="Include Task Details"
              color="neutral"
            />
          </UFormField>

          <div class="flex justify-between w-full">
            <UButton color="neutral" variant="ghost" @click="isOpen = false">
              Cancel
            </UButton>
            <UButton
              :loading="loading"
              :disabled="!isResendEnabled"
              color="neutral"
              icon="i-heroicons-paper-airplane"
              type="submit"
            >
              Send
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import * as z from 'zod';
import { generateEmailContent } from '@/utils/exportUtils';

// Two-way binding for open state
const isOpen = defineModel('open', { type: Boolean, default: false });

// Get stores and config directly
const filterStore = useFilterStore();
const taskStore = useTaskStore();
const toast = useToast();
const config = useRuntimeConfig();
const isResendEnabled = computed(() => config.public.resend);

// Get filtered projects and filters directly from store
const filteredProjects = computed(() => filterStore.filteredProjects);
const currentFilters = computed(() => filterStore.currentFilters);

// Form schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  message: z.string().optional(),
  includeTaskDetailsInShare: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: '',
  message: '',
  includeTaskDetailsInShare: true,
});

const loading = ref(false);

// Function to prepare data for export
const prepareDataForExport = (includeDetails = true) => {
  // Get projects with their associated tasks
  const projects = filteredProjects.value.map((project) => {
    const projectTasks = taskStore.getTasksByProject(project.id);
    return {
      ...project,
      tasks: projectTasks,
    };
  });

  return projects;
};

async function sendEmail(event: FormSubmitEvent<Schema>) {
  loading.value = true;

  const projectsWithTasks = prepareDataForExport(
    event.data.includeTaskDetailsInShare
  );

  const emailContent = generateEmailContent(
    projectsWithTasks,
    currentFilters.value,
    event.data.message
  );

  try {
    const response = await $fetch('/api/emails/send', {
      method: 'POST',
      body: {
        to: [event.data.email],
        subject: `Project Report - ${new Date().toLocaleDateString()}`,
        html: emailContent,
      },
    });

    if (response?.statusCode === 200) {
      // Display success toast
      toast.add({
        title: 'Email sent successfully',
        description: `Data has been shared with ${event.data.email}`,
        icon: 'i-heroicons-paper-airplane',
        color: 'success',
        duration: 5000,
      });

      // Reset form state
      state.email = '';
      state.message = '';
      state.includeTaskDetailsInShare = true;

      isOpen.value = false;
    } else {
      toast.add({
        title: 'Email not sent',
        description: `Error: ${
          response?.message || 'An unexpected error occurred.'
        }`,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
      });
    }
  } catch (error) {
    toast.add({
      title: 'Email not sent',
      description: `Error: ${
        error?.message || 'An unexpected error occurred.'
      }`,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'error',
    });
  } finally {
    loading.value = false;
  }
}
</script>
