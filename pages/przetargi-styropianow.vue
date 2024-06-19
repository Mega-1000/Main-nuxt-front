<template>
  <div class="w-[70%] mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6 mt-12">
      <h2 class="text-2xl font-bold mb-4">Dodaj produkty</h2>
      <div v-for="(selection, index) in selections" :key="index" class="mb-4 flex items-center gap-2">
        <SelectInput
            label="Wybierz rodzaj styropianu"
            :options="styrofoamTypes"
            v-model="selection.value"
            v-if="styrofoamTypes.length !== 0"
            class="w-1/3"
        />

        <TextInput type="number" @input="selection.quantity = $event" label="Podaj ilość paczek" class="w-1/3" />

        <SubmitButton @click="showQuotes(selection)" v-if="selection.value" class="w-1/3">
          Pokaż aktualne ceny
        </SubmitButton>

        <button @click="deleteSelection(index)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <button @click="addSelection" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Dodaj inny produkt
      </button>
    </div>

    <div class="mt-6">
      <SubmitButton @click="showUserInfoModal = true" class="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        Zatwierdź
      </SubmitButton>
    </div>

    <div class="modal-backdrop" v-if="modalData">
      <div class="modal-content">
        <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full" style="background-color: rgba(0, 0, 0, 0.50)">
          <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
            <div class="relative bg-white rounded-lg shadow">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">
                  Wycena dostępnych firm dla tego styropianu
                </h3>

                <button type="button" @click="modalData = false" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5 space-y-4">
                <table class="w-full">
                  <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 font-semibold text-left">Nazwa</th>
                    <th class="py-2 px-4 font-semibold text-left">Producent</th>
                    <th class="py-2 px-4 font-semibold text-left">Cena jednostkowa netto</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in modalData" :key="item.id" class="border-b">
                    <td class="py-2 px-4">{{ item.name }}</td>
                    <td class="py-2 px-4">{{ item.manufacturer }}</td>
                    <td class="py-2 px-4">{{ item.price.net_purchase_price_basic_unit }} PLN</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" v-if="showUserInfoModal">
      <div class="modal-content">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">Powiedz nam trochę o sobie...</h2>
          <TextInput @input="userInfo.email = $event" label="Email" class="mb-4" />
          <TextInput @input="userInfo.phone = $event" label="Numer telefonu" class="mb-4" />
          <SubmitButton @click="confirmAuction" class="bg-green-500 text-white">
            Zatwierdź
          </SubmitButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SubmitButton from "../components/SubmitButton.vue";
import Swal from "sweetalert2";
const { $shopApi: shopApi } = useNuxtApp();

const styrofoamTypes = ref([]);
const selections = reactive([{ value: null, quantity: '' }]);
const modalData = ref(false);
const userInfo = ref({ email: '', phone: '' });
const showUserInfoModal = ref(false);

onMounted(async () => {
  const types = await shopApi.get('/auctions/get-styrofoam-types');
  styrofoamTypes.value = Array.from(types.data.map((styrofoam) => ({ label: styrofoam, value: styrofoam })));
});

const addSelection = () => {
  if (selections.length < 5) {
    selections.push({ value: null, quantity: '' });
  }
};

const saveAuction = async () => {
  try {
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: selection.quantity
    }));

    if (auctionData.length === 0) {
      alert('Please select at least one styrofoam type and quantity.');
      return;
    }

    showUserInfoModal.value = true;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('An error occurred while saving the auction. Please try again.');
  }
};

const confirmAuction = async () => {
  try {
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: selection.quantity
    }));

    await shopApi.post('/api/auctions/save', {auctionData, userInfo: userInfo.value});
    Swal.fire('Pomyślnie Zapisano przetarg. Odezwiemy siędo ciebie kiedy będziemy znać wyceny producentów', '', 'success')

    selections.length = 0;
    showUserInfoModal.value = false;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('An error occurred while saving the auction. Please try again.');
  }
};

const deleteSelection = (index) => {
  selections.splice(index, 1);
};


const updateSelection = (index, newValue) => {
  if (index === selections.length - 1 && selections.length < 5) {
    addSelection();
  }
};

const showQuotes = async (name) => {
  const {data: request} = await shopApi.get(`/auctions/get-quotes-by-styrofoarm-type/${name.value}`);
  console.log(name)
  modalData.value = request;
}
</script>
