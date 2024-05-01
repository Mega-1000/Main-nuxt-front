<script setup>
import Swal from "sweetalert2";

onMounted(() => {
  Swal.fire('Uwaga!', 'Ze względu na małą ilość styropianu w zamówieniu prosimy o wybranie punktu odbioru', 'info')
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
  loading.value = true;
  await shopApi.post(`/api/set-warehouse/${selectedWarehouse.id}`)
  loading.value = false;

  await Swal.fire('Poymyślnie zapisano magazyn odbioru', 'Teraz możesz wykonać płatność', 'success');


  await router.push(`/payment?token=${route.query.token}&total=${(parseFloat(productsCart.value.grossPrice())).toFixed(2)}`);
}
</script>

<template>
  <div class="w-2/3 mx-auto">
    <div class="mt-12"></div>

    <form @submit.prevent="submitForm">
      <div class="mt-3" v-for="warehouse in warehouses">
        <input type="radio" :value="warehouse" v-model="selectedWarehouse" :id="warehouse.id"> <label :for="warehouse.id"> {{ warehouse.symbol }} </label>

        <a :href="`https://www.google.com/maps/search/?api=1&query=${warehouse.adresString}`" target="_blank">
          <span class="text-blue-500">Zobacz na mapie</span>
        </a>
      </div>

      <submitButton class="mt-8" :disabled="loading.value">
        Zapisz punkt odbioru
      </submitButton>
    </form>
  </div>
</template>
