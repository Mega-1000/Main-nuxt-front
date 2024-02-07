<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const offers = ref<[]>([]);

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;
  auctions.value = response;

  auctions.value.forEach((auction: any) => {
    auction.offersExpanded = false;
    auction.activeOffers = auction.offers.splice(0, 3);
  });
};

const expandOffers = (auction: any) => {
  auction.offersExpanded = true;
  auction.activeOffers = auction.offers;
};

const collapseOffers = (auction: any) => {
  auction.offersExpanded = false;
  auction.activeOffers = auction.offers.splice(0, 3);
};
</script>

<template>
  <div v-for="auction in auctions" class="border p-3 mx-auto w-1/2 mt-12 text-lg flex justify-between">
    <div>
      ID: {{ auction.id }}
      <br>Koniec aukcji {{ auction.end_of_auction }}
      <br>Data dostawy {{ auction.date_of_delivery }}
      <br>Cena {{ auction.price }}
      <br>Jakość {{ auction.quality }}
      <br>Utworzona {{ auction.created_at }}
      <br>Zaktualizowana {{ auction.updated_at }}
      <br>Email klienta: {{ auction.chat.order.customer.login }}
      <br>Telefon klienta: {{ auction.chat.order.customer.addresses[0].phone }} <a :href="`tel:${auction.chat.order.customer.addresses[0].phone}`">Zadzwoń</a>
    </div>

    <div>
      <a :href="auction.editPricesLink" target="__blank">
        <SubmitButton>
          Zmień swoje ceny w tym przetargu
        </SubmitButton>
      </a>

      <br>

      Oferty:
      <div v-for="offer in auction.activeOffers" class="tooltip">
          ID: {{ offer.id }} Firma: {{ offer.firm.symbol }} Cena: {{ offer.basic_price_net }}
          <span class="tooltip-text">
            Cena za opakowanie handlowe: {{ offer.commercial_price_net }}<br>
            Cena za m3: {{ offer.basic_price_net }}<br>
            cena za m2: {{ offer.calculated_price_net }}<br>
          </span>
      </div>

      <SubmitButton @click="auction.offersExpanded === false ? expandOffers(auction) : collapseOffers(auction)">
        <span v-if="auction.offersExpanded === false">
          Wyświetl wszystkie oferty
        </span>
        <span v-else>
          Ogranicz oferty
        </span>
      </SubmitButton>
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip .tooltip-text {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 20px;
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
}

</style>
