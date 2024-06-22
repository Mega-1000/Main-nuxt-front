<template>
  <div class="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6 mt-12">
      <h2 class="text-xl md:text-2xl font-bold mb-4">Potrzebujesz pomocy? Zadzwoń do nas: <em>576 205 389</em></h2>
      <div ref="parent" class="space-y-4">
        <div v-for="(selection, index) in selections" :key="index" class="flex flex-col sm:flex-row items-center gap-2 p-4 border rounded-lg">
          <SelectInput
              label="Rodzaj styropianu"
              :options="styrofoamTypes"
              v-model="selection.value"
              v-if="styrofoamTypes.length !== 0"
              class="w-full sm:w-1/3"
              tooltip="Wybierz typ styropianu, którego potrzebujesz"
          />

          <TextInput
              type="number"
              @input="selection.quantity = $event"
              label="Ilość paczek"
              class="w-full sm:w-1/3"
              tooltip="Podaj liczbę paczek, które chcesz zamówić"
          />

          <div class="md:w-[40%]">
            <label class="block text-gray-700 text-sm font-bold mb-2">
              Grubość styropianu
            </label>
            <select
                @input="selection.thickness = $event.target.value"
                class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                title="Wybierz grubość styropianu w centymetrach"
            >
              <option value="">Wybierz grubość</option>
              <option v-for="n in 26" :key="n-1" :value="n-1">{{ n-1 }} cm</option>
            </select>
          </div>

          <SubmitButton
              @click="showQuotes(selection)"
              :disabled="loading || !selection.value || !selection.quantity || !selection.thickness"
              class="w-full sm:w-1/3 md:mt-7"
              tooltip="Kliknij, aby zobaczyć aktualne ceny dla wybranego styropianu"
          >
            <span v-if="!loading">Sprawdź ceny</span>
            <span v-else>Ładowanie...</span>
          </SubmitButton>

          <button
              @click="deleteSelection(index)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300 md:mt-7"
              :disabled="loading"
              title="Usuń ten produkt z listy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <button
          @click="addSelection"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300 flex items-center justify-center mt-4"
          :disabled="loading"
          title="Dodaj kolejny produkt do zamówienia"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Dodaj inny produkt
      </button>
    </div>

    <div class="mt-6">
      <SubmitButton
          @click="saveAuction"
          :disabled="loading || selections.length === 0"
          class="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto"
          tooltip="Kliknij, aby przejść do ostatniego kroku i złożyć zamówienie"
      >
        <span v-if="!loading">Przejdź dalej</span>
        <span v-else>Przetwarzanie...</span>
      </SubmitButton>
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
import { ref, reactive, onMounted } from 'vue';
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

const [parent] = useAutoAnimate();

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

    await shopApi.post('/api/auctions/save', { auctionData, userInfo: userInfo.value });
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
  try {
    loading.value = true;
    const { data: request } = await shopApi.get(`/auctions/get-quotes-by-styrofoarm-type/${selection.value}`);
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
