<script setup lang="ts">
const auctions = ref<any>([]);
const { $shopApi: shopApi } = useNuxtApp();
const route = useRoute();
const currentFirm = ref<any>(null);

onMounted(() => {
  fetchAuctions();
});

const fetchAuctions = async () => {
  const firmToken = route.query.firmToken as string;
  const { data: response } = await shopApi.get(`/api/get-auctions/${firmToken}`) as any;

  currentFirm.value = response[0];
  auctions.value = response[1];

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

const showOfferTable = (auction: any) => {
  auction.offerTableShown = true;
};
</script>

<template>
  <div v-for="auction in auctions" class="border mx-auto w-1/2 p-3 mt-12 text-lg">
    <div class=" flex justify-between">
      <div>
        Numer przetargu: {{ auction.id }}
        <br>Koniec przetargu {{ auction.end_of_auction }}
        <br>Wstępna data dostawy wskazana przez klienta {{ auction.date_of_delivery }}
        <br>Procentowy udział ceny {{ auction.price }}
        <br>Procentowy udział jakości {{ auction.quality }}
        <br>Data rozpoczęcia przetargu {{ auction.created_at }}
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

<!--        Oferty:-->
<!--        <div v-for="offer in auction.activeOffers" class="tooltip">-->
<!--            ID: {{ offer.id }} Firma: {{ offer.firm.symbol }} Cena: {{ offer.basic_price_net }}-->
<!--            <span class="tooltip-text">-->
<!--              Cena za opakowanie handlowe: {{ offer.commercial_price_net }}<br>-->
<!--              Cena za m3: {{ offer.basic_price_net }}<br>-->
<!--              cena za m2: {{ offer.calculated_price_net }}<br>-->
<!--            </span>-->
<!--        </div>-->

<!--        <SubmitButton @click="auction.offersExpanded === false ? expandOffers(auction) : collapseOffers(auction)">-->
<!--          <span v-if="auction.offersExpanded === false">-->
<!--            Wyświetl wszystkie oferty-->
<!--          </span>-->
<!--          <span v-else>-->
<!--            Ogranicz oferty-->
<!--          </span>-->
<!--        </SubmitButton>-->

        <button @click="showOfferTable(auction)" class="bg-green-500 mt-4 block px-4 py-2 rounded text-sm">
          Zobacz tabelę ofert
        </button>
      </div>
    </div>

    <div v-if="auction.offerTableShown" class="mt-4">
      <table>
        <tr>
          <th>Produkt</th>
          <th>Ilość opakowań</th>
          <th>Ilość M3</th>
          <th>Twoja cena</th>
          <th>Najniższa cena na ten moment</th>
        </tr>

        <tr v-for="item in auction.chat.order.items" class="mt-4">
          <td>{{ item.product.name.substr(item.product.name.indexOf(" ") + 1) }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.product.packing.unit_commercial }}</td>
          <td>
            {{
               auction.offers.filter((offer) => offer.firm_id === currentFirm.id).sort((a, b) => a.basic_price_net - b.basic_price_net)[0]?.basic_price_net
            }}
          </td>
          <td>{{ auction.offers.filter((offer) => offer.order_item_id === item.id).sort((a, b) => a.basic_price_net - b.basic_price_net)[0].basic_price_net }}</td>
        </tr>
      </table>

      <span>
        <SubmitButton>
          Zmień swoje ceny w tej ofercie
        </SubmitButton>
      </span>
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
