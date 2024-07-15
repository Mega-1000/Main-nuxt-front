<template>
  <div class="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
    <div class="bg-white rounded-lg shadow-xl p-8 mt-12 border border-gray-200">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Masz pytania? Jesteśmy do Twojej dyspozycji!</h2>

      <div class="flex flex-col md:flex-row items-center justify-between mb-8 bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg">
        <span class="text-xl font-bold text-gray-700 mb-4 md:mb-0">
          Skontaktuj się z nami: <em class="text-blue-600">576 205 389</em>
        </span>
        <button @click="showFreeGuide" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 transform hover:scale-105">
          Pobierz darmowy poradnik
        </button>
      </div>

      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4 text-gray-700">Nie wiesz ile paczek potrzebujesz? Wylicz je!</h3>
        <button @click="showCalculator = true" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
          Otwórz kalkulator
        </button>
      </div>

      <div ref="parent" class="space-y-6">
        <div v-for="(selection, index) in selections" :key="index" class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="w-full sm:w-1/3">
              <StyroTypeModal v-model="selection.value" />
            </div>

            <TextInput type="number" @input="selection.quantity = $event" :value="selection.quantity" label="Ilość paczek" class="w-full sm:w-1/4" />

            <div class="w-full sm:w-1/4">
              <label class="block text-gray-700 text-sm font-bold mb-2">Grubość styropianu</label>
              <select v-model="selection.thickness" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option v-for="n in 26" :key="n-1" :value="n-1">{{ n-1 }} cm</option>
              </select>
            </div>

            <div class="flex items-center gap-2">
              <SubmitButton @click="showQuotes(selection)" :disabled="loading || !selection.value" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                <span v-if="!loading">Pokaż ceny</span>
                <span v-else>Ładowanie...</span>
              </SubmitButton>

              <button @click="deleteSelection(index)" class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors duration-300" :disabled="loading">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <button @click="addSelection" class="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md">
        Dodaj kolejny produkt
      </button>

      <div v-if="hasMultipleSelections" class="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-r-lg">
        <p class="font-bold">Uwaga:</p>
        <p>Dodawaj więcej niż jeden produkt tylko jeśli jesteś pewien, że potrzebujesz różnych typów styropianu. W przeciwnym razie firmy mogą uznać, że Twoje zamówienie jest większe niż w rzeczywistości.</p>
      </div>
    </div>

    <div class="mt-8 text-center">
      <SubmitButton @click="saveAuction" :disabled="loading" class="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <span v-if="!loading">Stwórz przetarg</span>
        <span v-else>Ładowanie...</span>
      </SubmitButton>
    </div>

    <OpinionStars class="mt-8 text-black" />

    <div class="mt-12">
      <h3 class="font-bold text-xl mb-6 text-center text-gray-800">
        Dostaniesz wyceny między innymi od:
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <NuxtLink v-for="(brand, index) in brands" :key="index" class="flex justify-center items-center hover:scale-105 transition-transform duration-300" href="/styropiany">
          <img :src="brand.image" :alt="brand.alt" class="max-w-full h-auto">
        </NuxtLink>
      </div>
    </div>

    <!-- Modals -->
    <CalculatorModal v-if="showCalculator" @close="showCalculator = false" @apply="applyCalculatorResults" />
    <QuotesModal v-if="modalData" :quotes="modalData" @close="modalData = false" />
    <UserInfoModal v-if="showUserInfoModal" @confirm="confirmAuction" @close="showUserInfoModal = false" />

    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Loader :showLoader="loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import SubmitButton from "../components/SubmitButton.vue";
import Swal from "sweetalert2";
import Cookies from "universal-cookie/cjs/Cookies";
import StyroTypeModal from "~/components/StyroTypeModal.vue";
import CalculatorModal from "~/components/RawCalculatorModal.vue";
import QuotesModal from "~/components/QuotesModal.vue";
import UserInfoModal from "~/components/UserInfoModal.vue";

const { $shopApi: shopApi } = useNuxtApp();

const styrofoamTypes = ref([]);
const selections = reactive([{ value: null, quantity: '', thickness: '' }]);
const modalData = ref(false);
const userInfo = ref({ email: '', phone: '', zipCode: '' });
const showUserInfoModal = ref(false);
const loading = ref(false);
const defaultZipCode = ref('');
const router = useRouter();

const [parent] = useAutoAnimate();

const hasMultipleSelections = computed(() => selections.length > 1);

const showCalculator = ref(false);

const brands = [
  { image: "/genderka.webp", alt: "Genderka - Lider rynku" },
  { image: "/swisspor.webp", alt: "Swisspor - Szwajcarska precyzja" },
  { image: "/images (13).jpeg", alt: "Termoorganika - Naturalnie ciepły dom" },
  { image: "/arsanit.webp", alt: "Arsanit - Komfort na lata" },
  { image: "/austroterm.webp", alt: "Austroterm - Najwyższa jakość" },
  { image: "/yetico.webp", alt: "Yetico - Energia oszczędności" },
  { image: "/images (4).png", alt: "Ciepły dom to szczęśliwy dom" },
  { image: "/unnamed.png", alt: "Zaufana marka, komfortowa izolacja" },
  { image: "/knauf.png", alt: "Knauf - Eksperci izolacji" },
  { image: "/polstyr_logo_without_background.png", alt: "Polstyr - Polska jakość" },
  { image: "/images.png", alt: "Polska jakość izolacji" },
  { image: "/images (14).jpeg", alt: "Innowacyjne rozwiązania izolacyjne" },
];

onMounted(async () => {
  defaultZipCode.value = localStorage.getItem('zipCode');
  userInfo.value.zipCode = defaultZipCode.value;
  try {
    loading.value = true;
    const types = await shopApi.get('/auctions/get-styrofoam-types');
    styrofoamTypes.value = types.data;
  } finally {
    loading.value = false;
  }

  window.addEventListener('beforeunload', handlePageUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handlePageUnload);
});

const handlePageUnload = (event) => {
  event.preventDefault();
  event.returnValue = '';
};

const addSelection = () => {
  if (selections.length < 5) {
    selections.push({ value: null, quantity: '', thickness: '' });
  }
};

const saveAuction = async () => {
  try {
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: parseInt(selection.quantity, 10),
      thickness: selection.thickness
    }));

    if (auctionData.length === 0) {
      Swal.fire('Błąd', 'Musisz dodać ilość styropianu', 'error');
      return;
    }

    const totalQuantity = auctionData.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < 66) {
      Swal.fire('Błąd', 'Ilość końcowa musi być większa niż 66 paczek', 'warning');
      return;
    }

    showUserInfoModal.value = true;
  } catch (error) {
    console.error('Error saving auction:', error);
    Swal.fire('Błąd', 'Wystąpił błąd. Administrator się z tobą skontaktuje', 'error');
  }
};

const confirmAuction = async (userInfoData) => {
  try {
    loading.value = true;
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: selection.quantity,
      thickness: selection.thickness
    }));
    showUserInfoModal.value = false;

    const res = await shopApi.post('/api/auctions/save', { auctionData, userInfo: userInfoData });
    const cookies = new Cookies();
    await cookies.set("token", res.data.access_token);

    window.dispatchEvent(new CustomEvent('token-refreshed'));

    await Swal.fire('Sukces!', 'Zapytanie zostało stworzone pomyślnie. Przeniesiemy cię do konta z możliwością zarządzania twoimi zapytaniami.', 'success');
    await router.push('/account');

    selections.length = 0;
  } catch (error) {
    console.error('Error saving auction:', error);
    Swal.fire('Błąd', 'Wystąpił błąd podczas zapisywania przetargu. Proszę spróbować ponownie.', 'error');
  } finally {
    loading.value = false;
  }
};

const deleteSelection = (index) => {
  selections.splice(index, 1);
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
    Swal.fire('Błąd', 'Nie udało się pobrać wycen. Spróbuj ponownie później.', 'error');
  } finally {
    loading.value = false;
  }
};

const showFreeGuide = () => {
  Swal.fire({
    title: 'Darmowy poradnik',
    text: 'Dziękujemy za zainteresowanie! Nasz poradnik zostanie wysłany na Twój adres email.',
    icon: 'info',
    input: 'email',
    inputPlaceholder: 'Wprowadź swój adres email',
    showCancelButton: true,
    confirmButtonText: 'Wyślij',
    cancelButtonText: 'Anuluj',
    showLoaderOnConfirm: true,
    preConfirm: (email) => {
      // Here you would typically send a request to your backend to handle the email
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 2000)
      })
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Sukces!', 'Poradnik został wysłany na podany adres email.', 'success')
    }
  })
}

const applyCalculatorResults = (results) => {
  const { styrofoamType, thickness, quantity } = results;

  // Find or create a selection with the calculated styrofoam type
  let selection = selections.find(s => s.value === styrofoamType);
  if (!selection) {
    selection = { value: styrofoamType, quantity: '', thickness: '' };
    selections.push(selection);
  }

  // Update the selection with calculated values
  selection.quantity = quantity.toString();
  selection.thickness = thickness.toString();

  showCalculator.value = false;
};
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(45deg, #4CAF50, #2196F3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

em {
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
  padding: 2px 4px;
  font-style: normal;
  color: #05668D;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
</style>
        }
