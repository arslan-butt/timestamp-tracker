<template>
  <UModal
    :open="isOpen"
    title="Download Project Data"
    @update:open="isOpen = $event"
  >
    <template #body>
      <div class="space-y-4 p-2">
        <p class="text-sm text-gray-600">
          Download data for {{ filteredProjects.length }} filtered projects with
          the following filters:
        </p>
        <ExportFilterCard />

        <UFormField label="Format">
          <URadioGroup v-model="downloadFormat" value="csv" label="CSV" />
          <URadioGroup v-model="downloadFormat" value="json" label="JSON" />
          <URadioGroup v-model="downloadFormat" value="excel" label="Excel" />
        </UFormField>

        <UFormField label="Include">
          <UCheckbox
            v-model="includeTaskDetails"
            label="Include Task Details"
            color="neutral"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton color="neutral" variant="soft" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton
          color="neutral"
          icon="i-heroicons-arrow-down-tray"
          @click="handleDownload"
        >
          Download
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = defineModel('open', { type: Boolean, default: false });

const filterStore = useFilterStore();
const filteredProjects = computed(() => filterStore.filteredProjects);

const emit = defineEmits(['download']);

const downloadFormat = ref('csv');
const includeTaskDetails = ref(true);

const handleDownload = () => {
  emit('download', downloadFormat.value, false, includeTaskDetails.value);
};
</script>
