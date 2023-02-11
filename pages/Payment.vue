<script setup lang="ts">
import getImage from "~~/helpers/image";

const bank = ref<any>(null);

const { $shopApi: shopApi } = useNuxtApp();

const { query } = useRoute();

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
  } catch (err: any) {
    console.log(err.getMessage);
  }
});

const { data: banks } = await useAsyncData(async () => {
  try {
    const res = await shopApi.post("api/banks");
    return res.data;
  } catch (err) {}
});

const accountNumber = "73 1140 2004 0000 3902 7979 8406";
const adress = `ELEKTRONICZNA PLATFORMA HANDLOWA 55-200 OŁAWA`;

const handleBank = (newBank: any) => {
  bank.value = newBank;
  window.open(newBank.site_url, "_blank");
};

const config = useRuntimeConfig().public;

const handleClick = () => {
  window.open(
    `${config.nuxtNewFront}/zamowienie/mozliwe-do-realizacji/brak-danych/${paymentData?.value?.id}`,
    "_blank"
  );
};
</script>

<template>
  <div class="flex justify-center py-10">
    <div>
      <p class="text-md md:text-xl">
        Jeśli potrzebujesz się skontaktować zaloguj się i wejdź w zakładkę "Moje
        Konto" (domyślnie nr telefonu jest hasłem)
      </p>
      <p class="text-md md:text-xl font-md">
        Aby dokonać płatności przelej kwotę:
        <span class="font-bold">{{ paymentData?.totalPrice }}</span>
      </p>
      <p class="text-md md:text-xl">
        na konto bankowe: <span class="font-bold">{{ accountNumber }}</span>
      </p>
      <p class="text-md md:text-xl">
        W tytule przelewu wpisz:
        <span class="font-bold"
          >PLATNOSC OFERTA: QQ{{ paymentData?.id }}QQ</span
        >
      </p>
      <p class="text-md md:text-xl">
        Dane odbiorcy: <span class="font-bold">{{ adress }}</span>
      </p>
      <p class="text-md md:text-xl">
        Wybierz swój Bank i przekopiuj wartości do przelewu:
      </p>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 space-x-5 space-y-5 max-w-3xl py-10"
      >
        <div
          v-for="bank in banks"
          @click="handleBank(bank)"
          class="p-5 cursor-pointer border border-gray-200"
        >
          <img
            :src="getImage(bank.img_url, config.baseUrl)"
            class="w-full h-full"
          />
        </div>
      </div>
      <button
        v-if="paymentData?.id"
        class="w-30 text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        @click="handleClick"
      >
        Uzupełnij dane do przesyłki
      </button>
    </div>
  </div>
</template>
