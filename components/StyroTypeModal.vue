<template>
  <div>
    <HeadlessDialog as="div" :open="isOpen" @close="isOpen = false" class="relative z-50">
      <HeadlessDialogPanel class="fixed inset-0 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="p-6">
            <h2 class="text-lg font-medium mb-4">Wybierz rodzaj styropianu</h2>
            <input
                type="text"
                v-model="searchTerm"
                placeholder="Szukaj..."
                class="w-full p-2 border rounded-md mb-4"
            />
            <div class="max-h-[60vh] overflow-y-auto">
              <div v-for="(types, category) in filteredTypes" :key="category" class="mb-6">
                <h3 class="font-bold mb-2">{{ category }}</h3>
                <div class="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div
                      v-for="type in types"
                      :key="type"
                      class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      @click="handleSelect(type)"
                  >
                    <h4 class="text-lg font-semibold mb-2">{{ type }}</h4>
                    <p class="text-sm text-gray-600 mb-2">Kategoria: {{ category }}</p>
                    <p class="text-sm text-gray-600">
                      Zastosowanie: {{ getApplicationInfo(category) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeadlessDialogPanel>
    </HeadlessDialog>

    <button
        @click="isOpen = true"
        class="w-full px-4 py-2 text-left bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {{ selected || "Wybierz rodzaj styropianu" }}
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { Dialog as HeadlessDialog, DialogPanel as HeadlessDialogPanel } from '@headlessui/vue';

const styrofoamTypes = {
  'Fasada': ['EPS 70', 'EPS 80', 'EPS 100'],
  'Podłoga': ['EPS 100', 'EPS 150', 'EPS 200'],
  'Dach': ['EPS 100', 'EPS 150', 'EPS 200']
};

export default {
  components: {
    HeadlessDialog,
    HeadlessDialogPanel,
  },
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const selected = ref(props.modelValue);
    const searchTerm = ref('');

    const filteredTypes = computed(() => {
      return Object.entries(styrofoamTypes).reduce((acc, [category, types]) => {
        const filteredTypes = types.filter(type =>
            type.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            category.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
        if (filteredTypes.length > 0) {
          acc[category] = filteredTypes;
        }
        return acc;
      }, {});
    });

    const handleSelect = (type) => {
      selected.value = type;
      emit('update:modelValue', type);
      isOpen.value = false;
    };

    const getApplicationInfo = (category) => {
      switch (category) {
        case 'Fasada':
          return 'Izolacja ścian zewnętrznych';
        case 'Podłoga':
          return 'Izolacja podłóg i fundamentów';
        case 'Dach':
          return 'Izolacja dachów i stropodachów';
        default:
          return '';
      }
    };

    return {
      isOpen,
      selected,
      searchTerm,
      filteredTypes,
      handleSelect,
      getApplicationInfo,
    };
  },
};
</script>

