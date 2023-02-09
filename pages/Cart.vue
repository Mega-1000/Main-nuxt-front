<script setup lang="ts">
import Cookies from "universal-cookie/cjs/Cookies";
import { setCookie } from "~~/helpers/authenticator";
import transportPrice from "~~/helpers/transportPrice";
import Cart from "~~/utils/Cart";
import buildImgRoute from "~~/helpers/buildImgRoute";

const currentPage = ref(1);

const { query } = useRoute();

const inactiveClass =
  "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";
const activeClass =
  "z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700";

const { $shopApi: shopApi } = useNuxtApp();

const { data: products } = await useAsyncData(
  async () => {
    try {
      const items = await shopApi.get(
        `api/products?page=${currentPage.value}&per_page=15`
      );

      return {
        data: items.data.data,
        pages: Math.ceil(items.data.total / 15),
      };
    } catch (e) {
      console.error(e);
    }
  },
  { watch: [currentPage] }
);

const productsCart = useProductsCart();

const state = ref<any>();

onBeforeMount(async () => {
  const cookies = new Cookies();
  let cart_token;
  if (query && query.user_code) {
    try {
      const res = await shopApi.post(`api/auth/code/${query.user_code}`);
      setCookie(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  if (query && query.cart_token) {
    cart_token = query.cart_token;
    cookies.set("cart_token", cart_token);
  } else {
    cart_token = cookies.get("cart_token");
  }

  state.value = {
    ...state.value,
    cart_token: cart_token,
  };
});

const router = useRouter();

const prepareCartEdition = async (cart: Cart, token: any) => {
  try {
    const res = await shopApi.get(`api/orders/getByToken/${token}`);
    cart.removeAllFromCart();
    res.data.map((product: any) => cart.addToCart(product, product.amount));
  } catch (ex: any) {
    router.push("/");
    console.log(ex.message);
  }
};

const getPackagesNumber = async (cart: Cart) => {
  try {
    const response = await shopApi.post(
      "api/packages/count",
      cart.idsWithQuantity()
    );

    state.value = {
      ...state.value,
      packages: response.data,
      transportPrice: transportPrice(response.data),
    };
  } catch (error: any) {
    state.value = {
      ...state.value,
      errorText:
        (error.response &&
          error.response.data &&
          error.response.data.error_message) ||
        "Wystąpił błąd, proszę spróbować później",
    };
  }
};

onMounted(async () => {
  productsCart?.value?.init();
  const showAdressForm =
    productsCart.value.products.length > 0 && !state.value.cart_token;
  state.value = { ...state.value, showAdressForm: showAdressForm };
  if (query.cart_token)
    await prepareCartEdition(productsCart.value, query.cart_token);
  await getPackagesNumber(productsCart.value);
});

const updateAmount = (productId: number, value: string | number) => {
  const idx = productsCart.value.getIdxByProductId(productId);
  if (idx === -1) {
    return;
  }
  productsCart.value.changeAmount(idx, value);
  getPackagesNumber(productsCart.value);
};
</script>
<template>
  <div class="flex justify-center mt-7">
    <h2
      v-if="!productsCart?.products || productsCart?.products?.length === 0"
      class="text-xl md:text-3xl"
    >
      Brak produktów w koszyku
    </h2>
    <div v-else class="grid grid-cols-1 space-y-8">
      <button
        type="button"
        @click="productsCart.removeAllFromCart"
        class="w-40 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
      >
        Usuń wszystko
      </button>

      <div v-for="product in productsCart.products">
        <div
          class="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 w-[60vw] max-w-7xl mx-auto border border-white bg-white"
        >
          <div
            class="w-full md:w-1/3 bg-white grid place-items-end md:place-items-start"
          >
            <img
              :src="buildImgRoute(product?.url_for_website)"
              alt="Photo"
              class="rounded-xl"
            />
            <button
              @click="() => productsCart.removeFromCart(product.id)"
              type="button"
              class="md:absolute md:bottom-0 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Usuń
            </button>
          </div>
          <div
            class="w-full md:w-2/3 bg-white flex flex-col space-y-2 p-3 grid md:place-items-end"
          >
            <h3 class="font-black text-gray-800 md:text-2xl text-xl">
              {{ product.name }}
            </h3>
            <CartPriceTable
              class="max-w-3xl"
              :product="product"
              :handle-product-amount="(val) => updateAmount(product.id, val)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <nav
    class="flex justify-center mt-7"
    v-if="products?.pages && products?.pages > 1"
  >
    <ul class="inline-flex items-center -space-x-px">
      <li v-if="currentPage > 1">
        <a
          @click="currentPage--"
          class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
        >
          <span class="sr-only">Previous</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </li>
      <li v-for="page in 5">
        <a
          :class="page === currentPage ? activeClass : inactiveClass"
          @click="page !== currentPage && (currentPage = page)"
          >{{ page }}</a
        >
      </li>
      <li v-if="products?.pages && currentPage < products.pages">
        <a
          @click="currentPage++"
          class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
        >
          <span class="sr-only">Next</span>
          <svg
            aria-hidden="true"
            class="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
      </li>
    </ul>
  </nav> -->
</template>
