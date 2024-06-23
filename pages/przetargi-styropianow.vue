<template>
  <div class="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6 mt-12">
      <h2 class="text-xl md:text-2xl font-bold mb-4">Masz jakieś pytania? Jesteśmy do twojej dyspozycji! <em> 576 205 389 </em></h2>
      <div ref="parent" class="space-y-4">
        <div v-for="(selection, index) in selections" :key="index" class="flex flex-col sm:flex-row items-center gap-2">
          <SelectInput
              label="Wybierz rodzaj styropianu"
              :options="styrofoamTypes"
              v-model="selection.value"
              v-if="styrofoamTypes.length !== 0"
              class="w-full sm:w-1/3"
          />

          <TextInput type="number" @input="selection.quantity = $event" label="Podaj ilość paczek" class="w-full sm:w-1/3" />

          <div class="md:w-[40%]">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Grubość styropianu
            </label>
            <select @input="selection.thikness = $event.target.value" class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
              <option v-for="n in 26" :key="n-1" :value="n-1">{{ n-1 }}</option>
            </select>
          </div>

          <SubmitButton @click="showQuotes(selection)" :disabled="loading || !selection.value" class="w-full sm:w-1/3 md:mt-7">
            <span v-if="!loading">Pokaż aktualne ceny podstawowe</span>
            <span v-else>Ładowanie...</span>
          </SubmitButton>

          <button @click="deleteSelection(index)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300 md:mt-7" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="hasMultipleSelections" class="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p class="font-bold">Uwaga:</p>
        <p>Dodawaj więcej niż jeden produkt tylko jeśli jesteś pewien, że potrzebujesz różnych typów styropianu. W przeciwnym razie firmy mogą uznać, że Twoje zamówienie jest większe niż w rzeczywistości.</p>
      </div>

      <button @click="addSelection" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center justify-center mt-4" :disabled="loading" title="Dodaj tylko jeśli potrzebujesz innego typu styropianu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Dodaj inny produkt
      </button>
    </div>

    <div class="mt-6">
      <SubmitButton @click="saveAuction" :disabled="loading" class="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto">
        <span v-if="!loading">Stwórz przetarg</span>
        <span v-else>Ładowanie...</span>
      </SubmitButton>
    </div>

    <!-- Modals -->
    <div class="modal-backdrop" v-if="modalData">
      <div class="modal-content">
        <div class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full" style="background-color: rgba(0, 0, 0, 0.50)">
          <div class="relative p-4 w-full max-w-2xl max-h-full mx-auto">
            <div class="relative bg-white rounded-lg shadow">
              <div class="flex items-center justify-between p-4 border-b rounded-t">
                <h3 class="text-xl font-semibold text-gray-900">
                  Wycena dostępnych firm dla tego styropianu
                </h3>

                <button type="button" @click="modalData = false" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>

              <h3 class="mx-4 mt-4 text-red-500 font-bold">
                !! Aby stworzyć przetarg zamknij to okienko i kliknij przycisk stwórz przetarg !!
              </h3>

              <div class="p-4 space-y-4">
                <table class="w-full">
                  <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 font-semibold text-left">Producent</th>
                    <th class="py-2 px-4 font-semibold text-left">Cena jednostkowa netto</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in modalData" :key="item.id" class="border-b">
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
          <TextInput @input="userInfo.zipCode = $event" :value="defaultZipCode" label="Kod pocztowy" class="mb-4" />
          <SubmitButton @click="confirmAuction" :disabled="loading" class="bg-green-500 text-white">
            <span v-if="!loading">Zatwierdź</span>
            <span v-else>Ładowanie...</span>
          </SubmitButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import SubmitButton from "../components/SubmitButton.vue";
import Swal from "sweetalert2";
import Cookies from "universal-cookie/cjs/Cookies";
const { $shopApi: shopApi } = useNuxtApp();

const styrofoamTypes = ref([]);
const selections = reactive([{ value: null, quantity: '', thikness: '' }]);
const modalData = ref(false);
const userInfo = ref({ email: '', phone: '', zipCode: '' });
const showUserInfoModal = ref(false);
const loading = ref(false);
const defaultZipCode = ref('');
const router = useRouter();

const [parent] = useAutoAnimate();

const hasMultipleSelections = computed(() => selections.length > 1);

onMounted(async () => {
  defaultZipCode.value = localStorage.getItem('zipCode');
  userInfo.value.zipCode = defaultZipCode.value;
  try {
    loading.value = true;
    const types = await shopApi.get('/auctions/get-styrofoam-types');
    styrofoamTypes.value = types.data.map(styrofoam => ({ label: styrofoam, value: styrofoam }));
  } finally {
    loading.value = false;
  }
});

const addSelection = () => {
  if (selections.length < 5) {
    selections.push({ value: null, quantity: '', thikness: '' });
  }
};

const saveAuction = async () => {
  try {
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: parseInt(selection.quantity, 10),
      thikness: selection.thikness
    }));

    if (auctionData.length === 0) {
      alert('Musisz dodać ilość styropianu');
      return;
    }

    // Calculate total quantity
    const totalQuantity = auctionData.reduce((sum, item) => sum + item.quantity, 0);

    // Check if total quantity is less than 66
    if (totalQuantity < 66) {
      alert('Ilość końcowa musi być większa niż 66 paczek');
      return;
    }

    showUserInfoModal.value = true;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('Wystąpił błąd. administrator sięz tobą skontaktuje');
  }
};

const confirmAuction = async () => {
  try {
    loading.value = true;
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: selection.quantity,
      thikness: selection.thikness
    }));

    const res = await shopApi.post('/api/auctions/save', { auctionData, userInfo: userInfo.value });
    const cookies = new Cookies();
    await cookies.set("token", res.data.access_token);

    window.dispatchEvent(new CustomEvent('token-refreshed'));

    await Swal.fire('Zapytanie zostało stworzone pomyślnie!', 'Po kliknięciu "OK" Przeniesiemy cię do konta z możliwością zarządzania twoimi zapytaniami', 'info');
    await router.push('/account');

    selections.length = 0;
    showUserInfoModal.value = false;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('An error occurred while saving the auction. Please try again.');
  } finally {
    loading.value = false;
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

const showQuotes = async (selection) => {
  const zipCode = localStorage.getItem('zipCode');

  try {
    loading.value = true;
    const { data: request } = await shopApi.get(`/auctions/get-quotes-by-styrofoarm-type/${selection.value}?zipCode=${zipCode}`);
    modalData.value = Object.values(request).sort((a, b) => {
      return a.price.net_purchase_price_basic_unit - b.price.net_purchase_price_basic_unit;
    });

  } catch (error) {
    console.error('Error fetching quotes:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
em {
  background: -webkit-gradient(linear, left top, left bottom, color-stop(15%, #c1f99d), color-stop(94%, #e0f5d3));
  background: linear-gradient(-180deg, #c1f99d 15%, #e0f5d3 94%);
  padding: 2px;
  font-style: normal;
  color: #343a40;
  border-radius: 4px;
  overflow: hidden;
}
</style>
