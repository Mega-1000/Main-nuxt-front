<script setup>
import Swal from "sweetalert2";

onMounted(() => {
  Swal.fire('Uwaga!', 'Ze względu na małą ilość styropianu w zamówieniu prosimy o wybranie punktu odbioru', 'info')
});

const { data: paymentData } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get(
        `api/orders/get-payments-for-order/${query.token}`
    );

    return {
      transportPrice: res.data.transport_price,
      totalPrice: res.data.total_price,
      id: res.data.id,
    };
  } catch (err) {
    console.log(err.getMessage);
  }
});
</script>

<template>
  {{ paymentData }}
</template>
