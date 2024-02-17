<script setup>
import SubmitButton from "../components/SubmitButton.vue";
const { $shopApi: shopApi } = useNuxtApp();

const styrofoamTypes = ref([]);
const selections = ref([{ value: null }]);
const modalData = ref(false);

onMounted(async () => {
  const types = await shopApi.get('/auctions/get-styrofoam-types');
  styrofoamTypes.value = Array.from(types.data.map((styrofoam) => ({ label: styrofoam, value: styrofoam })));
});

const addSelection = () => {
  if (selections.value.length < 5) {
    selections.value.push({ value: null });
  }
};

const updateSelection = (index, newValue) => {
  selections.value[index].value = newValue;
  if (index === selections.value.length - 1 && selections.value.length < 5) {
    addSelection();
  }
};

const showQuotes = async (name) => {
  const {data: request} = await shopApi.get(`/auctions/get-quotes-by-styrofoarm-type/${name.value}`);

  modalData.value = request;
}
</script>

<template>
  <div class="w-[70%] mx-auto">
    <div v-for="(selection, index) in selections" :key="index" class="flex justify-between mt-4">
      <SelectInput
          label="Wybierz rodzaj styropianu"
          :options="styrofoamTypes"
          v-model="selection.value"
          @change="updateSelection(index, $event)"
          v-if="styrofoamTypes.length !== 0"
          :class="{'w-[85%]': selection.value, 'w-full': !selection.value}"
      />

      <SubmitButton @click="showQuotes(selection)" v-if="selection.value">
        Pokaż ceny
      </SubmitButton>
    </div>
    <br>
    <br>
    <SubmitButton>
      Zapisz przetarg
    </SubmitButton>

    <div class="modal-backdrop" v-if="modalData"> <!-- Replace v-if condition with your actual condition for showing the modal -->
      <div class="modal-content">
        <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style="background-color: rgba(0, 0, 0, 0.50)">
          <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow">
              <!-- Modal header -->
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">
                  Wycena dostępnych firm dla tego styropianu
                </h3>

                <button type="button" @click="modalData = false" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <!-- Modal body -->
              <div class="p-4 md:p-5 space-y-4">
                <table>
                  <thead>
                  <tr>
                    <th>Nazwa</th>
                    <th>Producent</th>
                    <th>Cena jednostkowa netto</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in modalData" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>{{ item.manufacturer }}</td>
                    <td>{{ item.price.net_purchase_price_basic_unit }} PLN</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
