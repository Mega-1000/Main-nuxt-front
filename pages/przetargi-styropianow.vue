
<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import SubmitButton from "../components/SubmitButton.vue";
import Swal from "sweetalert2";
import Cookies from "universal-cookie/cjs/Cookies";
import StyroTypeModal from "~/components/StyroTypeModal.vue";
import axios from "axios";
import {trackEvent} from "~/utils/trackEvent";

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

const calculator = reactive({
  styrofoamType: null,
  thickness: 1,
  edgeFinish: 'proste',
  area: 0,
});

const calculatedVolume = computed(() => {
  return (calculator.area * calculator.thickness) / 100;
});

const calculatedArea = computed(() => {
  return calculator.area;
});

const calculatedPackages = computed(() => {
  return calculatedVolume.value / 0.3;
});

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
      alert('Musisz dodać ilość styropianu');
      return;
    }

    const totalQuantity = auctionData.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity < 66) {
      alert('Ilość końcowa musi być większa niż 66 paczek');
      return;
    }

    showUserInfoModal.value = true;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('Wystąpił błąd. Administrator się z tobą skontaktuje');
  }
};

const confirmAuction = async () => {
  try {
    loading.value = true;
    const auctionData = selections.filter(selection => selection.value !== null && selection.quantity !== '').map(selection => ({
      styrofoamType: selection.value,
      quantity: selection.quantity,
      thickness: selection.thickness
    }));
    showUserInfoModal.value = false;

    const res = await shopApi.post('/api/auctions/save', { auctionData, userInfo: userInfo.value });
    const cookies = new Cookies();
    await cookies.set("token", res.data.access_token);

    window.dispatchEvent(new CustomEvent('token-refreshed'));

    await Swal.fire('Zapytanie zostało stworzone pomyślnie!', 'Po kliknięciu "OK" Przeniesiemy cię do konta z możliwością zarządzania twoimi zapytaniami', 'info');
    await trackEvent('conversion_event_request_quote', 'styropian', 'Stworzenie przetargu', 5);
    await router.push('/account');

    selections.length = 0;
  } catch (error) {
    console.error('Error saving auction:', error);
    alert('Wystąpił błąd podczas zapisywania przetargu. Proszę spróbować ponownie.');
  } finally {
    loading.value = false;
  }
};

const deleteSelection = (index) => {
  selections.splice(index, 1);
};

const updateSelection = (index, newValue) => {
  if (index === selections.length - 1 && selections.length < 5) {
    // addSelection();
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

const applyCalculatorResults = () => {
  const calculatedQuantity = Math.ceil(calculatedPackages.value);

  // Find or create a selection with the calculated styrofoam type
  let selection = selections.find(s => s.value === calculator.styrofoamType);
  if (!selection) {
    selection = { value: calculator.styrofoamType, quantity: '', thickness: '' };
    selections.push(selection);
  }

  // Update the selection with calculated values
  selection.quantity = calculatedQuantity.toString();
  selection.thickness = calculator.thickness.toString();

  showCalculator.value = false;
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
}
