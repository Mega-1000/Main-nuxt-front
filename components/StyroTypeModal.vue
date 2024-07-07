<template>
  <div>
    Wybierz rodzaj styropianu
    <button
        @click="isOpen = true"
        class="w-full px-4 py-2 text-left bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {{ selected || "Kliknij aby wybrać" }}
    </button>

    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium">Wybierz rodzaj styropianu</h2>
            <button @click="isOpen = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false,
      selected: this.modelValue,
      searchTerm: '',
      styrofoamTypes: {}
    };
  },
  mounted() {
    axios.get('https://admin.mega1000.pl/auctions/get-styrofoam-types').then(response => {
      this.styrofoamTypes = response.data;
    });
  },
  computed: {
    filteredTypes() {
      const searchTerm = this.searchTerm.toLowerCase();
      return Object.entries(this.styrofoamTypes).reduce((acc, [category, types]) => {
        const filteredTypes = types.filter(type =>
            type.toLowerCase().includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm)
        );
        if (filteredTypes.length > 0) {
          acc[category] = filteredTypes;
        }
        return acc;
      }, {});
    }
  },
  methods: {
    handleSelect(type) {
      this.selected = type;
      this.$emit('update:modelValue', type);
      this.isOpen = false;
    },
    getApplicationInfo(category) {
      switch (category) {
        case '100.styropiany elewacyjne':
          return 'Izolacja ścian zewnętrznych';
        case '10.styropiany':
          return 'Izolacja podłóg i fundamentów';
        case '10.styropiany wodoodporne':
          return 'Izolacja dachów i stropodachów';
        default:
          return '';
      }
    }
  }
};
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
