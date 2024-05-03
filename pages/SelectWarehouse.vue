<script setup>
import Swal from "sweetalert2";

onMounted(() => {
  Swal.fire(
      'Uwaga!',
      'Prosimy o wybranie punktu odbioru w którym odbierzecie Państwo swoje zamówienie.',
      'info'
  )
});

const warehouses = ref([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const selectedWarehouse = ref(null); // Define a reactive variable to store the selected warehouse
const loading = ref(false);
const router = useRouter();
const productsCart = useProductsCart();

onMounted(async () => {
  const {data: response} = await shopApi.get(`/api/orders/get-warehouses-for-order/${route.query.token}`);
  warehouses.value = response[0];
});

const submitForm = async () => {
  if (!selectedWarehouse.value?.id) {
    Swal.fire('Nie wybrano punktu odbioru zamówienia!', '', 'error')
    return;
  }

  loading.value = true;
  await shopApi.post(`/api/set-warehouse/${selectedWarehouse.value.id}/${route.query.token}`)
  loading.value = false;

  await Swal.fire('Poymyślnie zapisano magazyn odbioru', 'Teraz możesz wykonać płatność', 'success');

  let total = route.query.isOrderSmall === 'true' ? parseFloat(route.query.total) + 50 : route.query.total;

  await router.push(`/payment?token=${route.query.token}&total=${total}`);
}
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="mt-12"></div>

    <form @submit.prevent="submitForm">
      <div class="mt-3" v-for="warehouse in warehouses">
        <input type="radio" :value="warehouse" v-model="selectedWarehouse" :id="warehouse.id"> <label :for="warehouse.id"> {{ warehouse.symbol }} </label>

        <a :href="`https://www.google.com/maps/search/?api=1&query=${warehouse.adresString}`" target="_blank" class="ml-2">
          <span class="text-blue-500 ml-4">Zobacz punkt odbioru na mapie</span>
        </a>
      </div>

      <submitButton class="mt-8" :disabled="loading.value">
        Zapisz punkt odbioru
      </submitButton>
    </form>
  </div>

  <div v-if="loading" class="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-gray-500 bg-opacity-50">
    <div class="bg-white rounded p-5">
      <div class="flex justify-center items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span class="text-gray-900 text-lg">Ładowanie...</span>
      </div>
    </div>
  </div>
</template>
