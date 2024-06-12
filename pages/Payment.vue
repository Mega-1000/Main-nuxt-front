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

const accountNumber = "80 1140 2004 0000 3602 8433 3856";
const adress = `ELEKTRONICZNA PLATFORMA HANDLOWA POLSKA SP. Z O.O.`;

const handleBank = (newBank: any) => {
  bank.value = newBank;
  window.open(newBank.site_url, "_blank");
};

const config = useRuntimeConfig().public;

const handleClick = () => {
  window.open(
    `${config.nuxtNewFront}zamowienie/mozliwe-do-realizacji/brak-danych/${paymentData?.value?.id}`,
    "_blank"
  );
};
</script>

<template>
  <div class="flex justify-center pt-10 pb-20">
    <div>
      <div class="text-3xl font-bold">
          !!! UWAGA od dnia 2023.12.13 zmiana numeru konta oraz firmy !!!
      </div>

      <div class="my-4">
        UWAGA! Dane do wysyłki nie zostały uzupełnione.
        <button
            v-if="paymentData?.id"
            class="w-30 text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            @click="handleClick"
        >
          Uzupełnij dane do przesyłki
        </button>
      </div>

      <div class="my-4">
        <a :href="`https://mega1000.pl/account?attachtransferconfirmation=${paymentData?.id}`" class="w-30 text-white bg-cyan-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Podłącz potwierdzenie przelewu
        </a>
      </div>

      <p class="text-md md:text-xl">
        Jeśli potrzebujesz się skontaktować zaloguj się i wejdź w zakładkę "Moje
        Konto" (domyślnie nr telefonu jest hasłem)
      </p>
      <p>
        Zaloguj się na swoim koncie aby
        - sprawdzić/skorygować dane do dostawy i faktury i daty logistyczne
        - podpiąć potwierdznie przelwu w przypadku gdy zależy ci na szybkiej wysyłce
        - sprawdzic po nadaniu nr listów przewozowych oraz ich status
      </p>
      <p class="text-md md:text-xl font-md">
        Aby dokonać płatności przelej kwotę:
        <span class="font-bold">{{ $route.query.total }}</span>
      </p>
      <p class="text-md md:text-xl">
        na konto bankowe: <span class="font-bold">{{ accountNumber }}</span>
      </p>
      <p class="text-md md:text-xl">
        W tytule przelewu wpisz tylko:
        <span class="font-bold"
          >QQ{{ paymentData?.id }}QQ</span
        >
      </p>
      <p class="text-md md:text-xl">
        Dane odbiorcy: <span class="font-bold">{{ adress }}</span>
      </p>
      <p class="text-md md:text-xl">
        Wybierz swój Bank i przekopiuj wartości do przelewu:
      </p>
      <div
        class="grid grid-cols-3 md:grid-cols-4 space-x-5 space-y-5 max-w-3xl py-10"
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
    </div>
  </div>
</template>
