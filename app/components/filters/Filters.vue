<template>
  <div class="flex flex-col md:flex-row gap-4 mb-6">
    <!-- Filter selects - will grow equally -->
    <div v-for="filter in filters" :key="filter.name" class="flex-1 min-w-0">
      <USelectMenu
        v-model="filter.value"
        :items="filter.options"
        value-key="value"
        label-key="label"
        :placeholder="filter.placeholder"
        class="w-full"
        @update:model-value="updateFilter(filter.name, $event)"
      />
    </div>

    <!-- Reset button - same width as other elements -->
    <div class="">
      <UButton
        color="neutral"
        variant="soft"
        size="sm"
        icon="i-heroicons-x-mark"
        :class="{
          'opacity-50 cursor-not-allowed': !hasActiveFilters,
          'justify-center md:justify-start': true,
        }"
        class="w-full"
        :disabled="!hasActiveFilters"
        @click="resetFilters"
      >
        Reset Filters
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
type FilterValue = string | number | null;

interface FilterOption {
  label: string;
  value: FilterValue;
}

interface Filter {
  name: keyof FilterState;
  value: FilterValue;
  options: FilterOption[];
  placeholder: string;
}

interface FilterState {
  state: FilterValue;
  taskType: FilterValue;
  duration: FilterValue;
  [key: string]: FilterValue;
}

const filterStore = useFilterStore();

const filters = reactive<Filter[]>([
  {
    name: 'state',
    value: filterStore.currentFilters.state,
    options: filterStore.stateOptions,
    placeholder: 'By status',
  },
  {
    name: 'taskType',
    value: filterStore.currentFilters.taskType,
    options: filterStore.taskTypeOptions,
    placeholder: 'Task Type',
  },
  {
    name: 'duration',
    value: filterStore.currentFilters.duration,
    options: filterStore.durationOptions,
    placeholder: 'Duration ',
  },
]);

const hasActiveFilters = computed((): boolean => {
  return filters.some((filter: Filter) => filter.value !== 'all');
});

const updateFilter = (
  filterName: keyof FilterState,
  value: FilterValue
): void => {
  const filter = filters.find((f: Filter) => f.name === filterName);
  if (filter) {
    filter.value = value;
    filterStore.updateFilters({ [filterName]: value });
  }
};

const resetFilters = (): void => {
  if (hasActiveFilters.value) {
    filterStore.resetFilters();
    syncFiltersWithStore();
  }
};

const syncFiltersWithStore = (): void => {
  filters.forEach((filter: Filter) => {
    filter.value = filterStore.currentFilters[filter.name];
  });
};

onMounted(() => {
  syncFiltersWithStore();
});
</script>
