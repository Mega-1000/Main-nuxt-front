<script setup>
import Swal from "sweetalert2";

onMounted(() => {
  Swal.fire('Uwaga!', 'Ze względu na małą ilość styropianu w zamówieniu prosimy o wybranie punktu odbioru', 'info')
});

const warehouses = ref([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const selectedWarehouse = ref(null); // Define a reactive variable to store the selected warehouse

onMounted(async () => {
  const {data: response} = await shopApi.get(`/api/orders/get-warehouses-for-order/${route.query.token}`);
  warehouses.value = response[0];
});

const submitForm = () => {
  // Handle form submission with the selected warehouse
  console.log('Selected Warehouse:', selectedWarehouse.value);
}
</script>

<template>
  <div class="mt-12"></div>

  <form @submit.prevent="submitForm">
    <div class="w-2/3 mx-auto mt-3" v-for="warehouse in warehouses">
      <input type="radio" :value="warehouse" v-model="selectedWarehouse"> {{ warehouse.symbol }}
    </div>

    <submitButton class="mt-8">
      Zapisz punkt odbioru
    </submitButton>
  </form>
</template>
