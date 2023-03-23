<script setup lang="ts">
import { Modal } from "flowbite";
import Cookies from "universal-cookie";

interface Props {
  item: any;
  modal: Modal | null;
  contactModal: Modal | null;
  setupModals: () => void;
}

const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();

const props = defineProps<Props>();

const config = useRuntimeConfig().public;

const currentItem = useCurrentItem();

onMounted(props.setupModals);

const handleShowModal = async (item: any, isSubProduct = false) => {
  if (!isSubProduct) {
    if (subProducts.value.length > 0) {
      subProducts.value = [];
      return;
    }

    const newSubProducts = await getSubProducts();
    if (newSubProducts.length > 0) {
      subProducts.value = newSubProducts;
      return;
    }
  }
  props.modal?.show();
  currentItem.value = item;
};

const subProducts = ref<any[]>([]);

const selectedMediaId = useSelectedMediaId();

const getSubProducts = async () => {
  const res = await shopApi.get("api/products/get-hidden", {
    params: {
      product: props.item.id,
      per_page: 25,
    },
  });

  return res.data;
};

const getPriceString = (priceType: any) => {
  priceType = priceType.toString().toLowerCase();
  let price: any = false;
  let unit = false;
  if (priceType === "p") {
    price = props.item.gross_selling_price_basic_unit;
    unit = props.item.unit_basic;
  } else if (priceType === "h") {
    price = props.item.gross_price_of_packing;
    unit = props.item.unit_commercial;
  } else if (priceType === "o") {
    price = props.item.gross_selling_price_calculated_unit;
    unit = props.item.calculation_unit;
  }
  if (Math.ceil(price) === 0 || !unit) {
    return null;
  }
  return `${price} PLN / ${unit}`;
};

const handleMediaButton = (e: Event, media: any) => {
  if (media.url) {
    window.open(media.url, "_blank");
    return;
  }

  e.preventDefault();

  const cookies = new Cookies();
  const email = cookies.get("email");
  const postalCode = cookies.get("post_code");
  const phone = cookies.get("phone");

  if (email && postalCode && phone) {
    const url = `${config.baseUrl}/chat/getUrl/${media.id}/${postalCode}/${email}/${phone}`;
    window.open(url, "_blank");
    return;
  }

  selectedMediaId.value = media.id;
  props.contactModal?.show();
};
</script>

<template>
  <div class="flex flex-col justify-center">
    <div
      @click="() => handleShowModal(props.item)"
      data-modal-target="calculatorModal"
      class="justify-between cursor-pointer relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 w-full mx-auto border border-white bg-white max-w-7xl"
    >
      <div
        class="w-full md:w-1/3 bg-white grid place-items-center md:place-items-start"
      >
        <img
          :src="buildImgRoute(props.item.url_for_website)"
          alt="Photo"
          loading="lazy"
          class="rounded-xl"
        />
      </div>
      <div
        class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3 grid md:place-items-end"
      >
        <h3 class="font-black text-gray-800 md:text-3xl text-xl">
          {{ props.item.name }}
          <div class="text-left w-full font-normal">
            {{ props.item.symbol }}
          </div>
        </h3>
        <p class="md:text-lg text-gray-500 text-base">
          {{ props.item.description }}
        </p>
        <div v-if="props.item.meta_price">
          <p
            class="text-3xl font-bold"
            v-for="val in props.item.meta_price.split(`.`)"
          >
            {{ getPriceString(val) }}
            <button
              class="bg-blue-500 text-lg text-white rounded px-4 py-2"
              data-modal-target="calculatorModal"
              @click="() => handleShowModal(props.item)"
            >
              Kalkulator cenowy
            </button>
          </p>
        </div>

        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button
            v-for="media in props.item.media"
            type="button"
            @click="(e) => handleMediaButton(e, media)"
            data-modal-target="contactModal"
            class="bg-slate-100 text-xs text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
          >
            {{ media.description }}
          </button>
        </div>
      </div>
    </div>
    <div>
      <div
        v-for="subProduct in subProducts"
        class="py-4 cursor-pointer border-t border-md bg-slate-100 px-3"
      >
        <div
          class="flex flex-row justify-between"
          @click="() => handleShowModal(subProduct, true)"
          data-modal-target="calculatorModal"
        >
          <p class="text-sm pr-2">{{ subProduct.name }}</p>
          <p class="text-sm pr-2">
            Cena: {{ subProduct.gross_price_of_packing }}
            {{ subProduct.currency || "PLN" }}/{{ subProduct.unit_commercial }}
          </p>
          <p class="text-sm">Symbol produktu: {{ subProduct.symbol }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
