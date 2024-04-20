<script setup lang="ts">
import Cookies from "universal-cookie/cjs/Cookies";
import { getToken, setCookie } from "~~/helpers/authenticator";
import transportPrice from "~~/helpers/transportPrice";
import Cart from "~~/utils/Cart";
import Swal from "sweetalert2";
import shipmentCostBruttoFn from "~/helpers/ShipmentCostCalculator";
import emitter from "~/helpers/emitter";
import ShipmentCostCalculator from "~/helpers/PackageCalculator";
import swal from "sweetalert2";

const { query } = useRoute();

const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();

const productsCart = useProductsCart();

const state = ref<any>();

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
    return res.data;
  } catch (e: any) { }
});

const userToken = useUserToken();

const userData = ref<any>();

let emailInput = ref(userData?.value?.email || "");
let phoneInput = ref(userData?.value?.phone || "");
let postalCodeInput = userData?.value?.postal_code || "";
let cityInput = userData?.value?.city || "";
let additionalNoticesInput = "";
let abroadInput = false;
let rulesInput = false;
let files: any[] = [];
const message = ref("");

onBeforeMount(async () => {
  const cookies = new Cookies();
  let cart_token;
  if (query && query.user_code) {
    try {
      const res = await shopApi.post(`api/auth/code/${query.user_code}`);
      setCookie(res.data);
      userToken.value = getToken();
    } catch (error) {
      console.log(error);
    }
  }
  if (query && query?.cart_token) {
    cart_token = query.cart_token;
    cookies.set("cart_token", cart_token);
  } else {
    cart_token = cookies.get("cart_token");
  }

  const res = await shopApi.get("api/user");
  if (res.status === 200 && res.data) {
    userData.value =
      res.data.addresses.filter(
        (address: any) => address.type === "STANDARD_ADDRESS"
      )[0] || {};
  }

  state.value = {
    ...state.value,
    cart_token: cart_token,
  };


  if (query && !query?.notReload) {
    setTimeout(() => window.location.reload(), 1000);
    const redirectString = cart_token ? `/koszyk.html?cart_token=${cart_token}&notReload=true` : "/koszyk.html?notReload=true";
    router.push(redirectString);
  }
});

watch([userData], () => {
  emailInput.value = userData?.value?.email || "";
  phoneInput.value = userData?.value?.phone || "";
  postalCodeInput = userData?.value?.postal_code || "";
  cityInput = userData?.value?.city || "";
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
  const cart = new Cart();
  cart.init();

  if (query?.cart_token && !cart.getEditedCart() || query?.reloadCart) await prepareCartEdition(cart, query?.cart_token);
  await getPackagesNumber(cart);

  productsCart.value = cart;
});

const handleDelete = async () => {
  productsCart.value.init();
  await getPackagesNumber(productsCart.value);

  emitter.emit("cart:change");
};
const updateAmount = (productId: number, value: string | number) => {
  const idx = productsCart.value.getIdxByProductId(productId);
  if (idx === -1) {
    return;
  }
  productsCart.value.changeAmount(idx, value);
  getPackagesNumber(productsCart.value);
};

const prepareSpecialProducts = (item: any) => {
  let products: any[] = [];
  item.packagesList.forEach((item: any) => {
    products = products.concat(item.productList);
  });
  products = products.reduce((prev, current) => {
    const existingElement = prev.find((el: any) => el.id === current.id);
    if (existingElement) {
      existingElement.quantity += current.quantity;
    } else {
      prev.push(current);
    }
    return prev;
  }, []);
  return products;
};

const loading = ref(false);
const errorText2 = ref<string | null>(null);

const handleFiles = (filesInput: any[]) => {
  files = filesInput;
};

const areFilesValid = (files: any[]) => {
  const availableFileExtensions = ["png", "jpg", "jpeg", "pdf", "tif", "gif"];

  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.substring(files[i].name.lastIndexOf(".") + 1);
    if (!availableFileExtensions.includes(ext)) return false;
  }

  return true;
};

const handleSubmit = async (e: Event | null) => {
  e ? e.preventDefault() : null;
  loading.value = true;

  if (files.length > 0 && !areFilesValid(files)) {
    errorText2.value = "Nieprawidłowe pliki";
    loading.value = false;
    return;
  }
  let hideFromCustomer = false;

  if (localStorage.getItem('isAdmin') == 'true') {
    Swal.fire({
      title: 'Ukryć przed klientem?',
      text: "Czy chcesz ukryć zamówienie przed klientem?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        hideFromCustomer = true;
      }
    })
  }

  const params = {
    customer_login: emailInput.value,
    phone: phoneInput.value,
    customer_notices: additionalNoticesInput,
    delivery_address: {
      city: cityInput,
      postal_code: postalCodeInput,
    },
    shipping_abroad: abroadInput,
    is_standard: true,
    files,
    order_items: productsCart.value.idsWithQuantity(),
    rewrite: 0,
    need_support: true,
    update_email: true,
    hide_from_customer: hideFromCustomer,
    packages: ShipmentCostCalculator(productsCart.value.products),
    register_reffered_user_id: localStorage.getItem('registerRefferedUserId') || null,
  };

  try {
    const res = await shopApi.post("/api/new_order", params);
    return res.data;
  } catch (err: any) {
    errorText2.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};

const config = useRuntimeConfig().public;

const handleSubmitWithToken = async () => {
  loading.value = true;

  const cookies = new Cookies();

  const params = {
    order_items: productsCart.value.idsWithQuantity(),
    rewrite: 0,
    cart_token: cookies.get("cart_token"),
    customer_login: '',
  };

  try {
    const res = await shopApi.post("/api/new_order", params);

    if (res.status === 200) {
      productsCart.value.removeAllFromCart();
      cookies.remove("cart_token");
      message.value = "Oferta została nadpisana na starą ofertę ale prosimy pamiętać że jest to niebezpieczne ponieważ klient po dostawie może się kłócić ze dostał nie to co  miał w ofercie i na dowód pokazać starą a upierać się że o nowej nic nie wie. Można sporadycznie tak robić bo ułatwia to temat gdy już jakieś zostały np dokonane wpłaty lub towar wyjechał na listach i jest dużo roboty aby dokonać zmiany do nowej oferty ale musimy być pewnie że klient nie będzie się upierał ze on chciał starą oferte."
    }
  } catch (err: any) {
    errorText2.value = err.response.data.error_message || "Wystąpił błąd";
  } finally {
    loading.value = false;
  }
};

const shipmentCostBrutto = computed(() => {
  return shipmentCostBruttoFn(productsCart.value.products)
});

const isNewOrder = ref(false);

const updateProduct = async (
  cart: Cart,
  productId: number,
  amount: number,
  prodId: number
) => {
  await cart.removeFromCart(prodId);

  setTimeout(async () => {
    try {
      const response = await shopApi.get(`/api/products/${productId}`);
      let product = response.data;
      product.recalculate = 1;
      await cart.addToCart(product, amount);
    } catch (err) { }

    window.location.reload();
  }, 300)
};

const canBeSubmitted = computed(() => {
  return !(!emailInput.value.includes("@") ||
      phoneInput.value.replace(/\D/g, "").length < 9);
});

const createChat = async (redirect: boolean) => {
  let deliveryTypesErrors: any[] = [];
  await productsCart.value.products.forEach((product) => {
    if (!product.delivery_type) {
      deliveryTypesErrors.push(product);
    }
  });

  if (deliveryTypesErrors.length != 0) {
    const alertText = 'Brak możliwości wyceny transportu produktów poniżej i jeżeli chcesz dokonać od razu zakupu to usuń je z koszyka.\n' +
        'W przypadku gdy chcesz poznać wycenę wraz z transportem to wyślij a skontaktujemy się z tobą.';

    const listOfProducts = deliveryTypesErrors.map((product) => {
      return `<br>${product.name} - ${product.amount} szt.`
    });


    const confirmation = await swal.fire({
      title: '',
      html: `${alertText}<br />${listOfProducts}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Wróć do koszyka i dokonaj usunięcia',
      confirmButtonText: 'Wyślij do sprawdzenia kosztów transportu',
    });

    if (!confirmation.isConfirmed) {
      return;
    } else {
      loading.value = true;
      const data =  await handleSubmit(null);
      loading.value = false;

      swal.fire({
        title: '',
        html: 'Dziękujemy za wysłanie zapytania ofertowego. Wkrótce skontaktujemy się z Tobą.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      return;
    }
  }

  loading.value = true;
  const data =  await handleSubmit(null);
  loading.value = false;

  if (!getToken() && data.newAccount) {
    await Swal.fire('', `<span style="text-align: left; ">Informujemy że założyliśmy Państwu konto na naszej stronie na którym po zalogowaniu można :<br>
        <br>
        <br>- zapoznać się z ofertą i pobrać fakturę proformę\n
        <br>- skorygować wysłane zapytanie ofertowe\n
        <br>- uzupełnić dane do dostawy i faktury i wskazać datę nadania przesyłki\n
        <br>- podpiąć potwierdzenie przelewu które przyspiesza realizacje\n
        <br>- rozpocząć dyskusje/chata z konsultantem\n
        <br>- oraz sprawdzać statusy ofert i listów przewozowych.\n
        <br>
        <br>Z pozdrowieniami<br>
        <br>
    </span>`, 'info');
  }

  setTimeout(() =>  productsCart.value.removeAllFromCart(), 100)

  let isOrderStyrofoam = false;
  productsCart.value.products.forEach((product: any) => {
    if (product.variation_group === 'styropiany') {
      isOrderStyrofoam = true;
    }
  });

  if (isOrderStyrofoam) {
    const url = `${config.baseUrl}/chat-show-or-new/${data.id}/${data.customerId}?showAuctionInstructions=true`;

    window.location.href = url;
    return;
  }
  await router.push(`/payment?token=${data.token}&total=${(parseFloat(productsCart.value.grossPrice()) + shipmentCostBrutto.value).toFixed(2)}`);
};

const ShipmentCostItemsLeftText = (product: any) => {
  const itemPackageQuantity = product.assortment_quantity;
  const products = productsCart.value.products.filter((item: any) => item.delivery_type === product.delivery_type);
  let itemsLeft;

  if (products.length > 0) {
    const itemsQuantity = Math.round((products.reduce((acc: any, item: any) => acc + item.amount / item.assortment_quantity, 0) % 1) * 100) / 100;
    itemsLeft = Math.floor((1 - itemsQuantity) / (1 / itemPackageQuantity));
  } else {
    itemsLeft = itemPackageQuantity;
  }

  return `Możesz dodać do przesyłki jeszcze ${itemsLeft} ${product.unit_commercial} tego produktu aby uzupełnić do pełna paczkę i nie ponosić dodatkowych kosztów transportu.`;
};
</script>

<template>
  <div class="flex flex-col md:flex-row">
    <div class="md:w-1/4 lg:w-1/5 bg-gray-100 p-4">
      <Sidebar :categories="categories" />
    </div>
    <div class="md:w-3/4 lg:w-4/5 p-4">
      <div v-if="!productsCart?.products || productsCart?.products?.length === 0" class="text-center py-20">
        <h2 class="text-2xl md:text-4xl font-bold mb-4">Your Cart is Empty</h2>
        <p class="text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <button class="bg-indigo-500 text-white py-2 px-4 rounded mt-4 hover:bg-indigo-600 transition-colors duration-300">
          Start Shopping
        </button>
      </div>
      <div v-else>
        <div v-if="state?.errorText" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {{ state?.errorText }}
        </div>
        <div v-if="state?.cart_token" class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
          <p class="font-bold">Attention!</p>
          <p>You are currently editing your cart.</p>
          <div class="flex items-center mt-2">
            <input id="new-order" type="checkbox" v-model="isNewOrder" class="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out" />
            <label for="new-order" class="ml-2 text-sm font-medium text-gray-700">Is this a new order?</label>
          </div>
        </div>
        <button type="button" @click="productsCart.removeAllFromCart" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 mb-4">
          Clear Cart
        </button>
        <div v-for="product in productsCart.products" class="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/3 p-4">
              <img :src="buildImgRoute(product?.url_for_website)" :alt="product.name" class="w-full rounded-lg" />
            </div>
            <div class="md:w-2/3 p-4">
              <h3 class="text-xl font-bold mb-2">{{ product.name }}</h3>
              <CartPriceTable :product="product" :handle-product-amount="(val) => updateAmount(product.id, val)" />
              <div class="flex justify-end mt-4">
                <button v-if="state?.cart_token" @click="updateProduct(productsCart, product.product_id, product.amount, product.id)" class="bg-indigo-500 text-white py-2 px-4 rounded mr-2 hover:bg-indigo-600 transition-colors duration-300">
                  Recalculate Price
                </button>
                <button @click="async () => { productsCart.removeFromCart(product.id); await handleDelete(); }" class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300">
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="productsCart?.products && productsCart?.products?.length > 0" class="bg-white shadow-md rounded-lg p-4">
          <h2 class="text-2xl font-bold mb-4">Order Summary</h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto">
              <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th class="py-3 px-6 text-left">Product</th>
                <th class="py-3 px-6 text-left">Quantity</th>
                <th class="py-3 px-6 text-left">Net Price</th>
                <th class="py-3 px-6 text-left">Gross Price</th>
                <th class="py-3 px-6 text-left">Net Total</th>
                <th class="py-3 px-6 text-left">Gross Total</th>
              </tr>
              </thead>
              <tbody class="text-gray-600 text-sm font-light">
              <tr v-for="product in productsCart.products" class="border-b border-gray-200 hover:bg-gray-100">
                <td class="py-3 px-6 text-left whitespace-nowrap">{{ product.name }}</td>
                <td class="py-3 px-6 text-left">{{ product.amount }} {{ product.unit_commercial }}</td>
                <td class="py-3 px-6 text-left">{{ product.net_selling_price_commercial_unit || 0 }} {{ product.currency || "PLN" }}</td>
                <td class="py-3 px-6 text-left">{{ product.gross_price_of_packing || 0 }} {{ product.currency || "PLN" }}</td>
                <td class="py-3 px-6 text-left">{{ (parseFloat(product.net_selling_price_commercial_unit) * product.amount).toFixed(2) || 0 }} {{ product.currency || "PLN" }}</td>
                <td class="py-3 px-6 text-left">{{ (parseFloat(product.gross_price_of_packing) * product.amount).toFixed(2) || 0 }} {{ product.currency || "PLN" }}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-between items-center mt-4">
            <p class="text-gray-600">Total Order:</p>
            <div>
              <p class="text-gray-600">Net: {{ productsCart.nettoPrice() }} PLN</p>
              <p class="text-gray-600">Gross: {{ productsCart.grossPrice() }} PLN</p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-600">Shipping Cost:</p>
            <p class="text-gray-600">{{ shipmentCostBrutto }} PLN</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-600">Total Order (including shipping):</p>
            <p class="text-gray-600">Gross: {{ (parseFloat(productsCart.grossPrice()) + shipmentCostBrutto).toFixed(2) }} PLN</p>
          </div>
          <div class="flex justify-between items-center mt-2">
            <p class="text-gray-600">Total Weight:</p>
            <p class="text-gray-600">{{ parseFloat(productsCart.totalWeight()).toFixed(2) }} kg</p>
          </div>
        </div>
        <div v-if="(productsCart?.products && productsCart?.products?.length > 0 && !state?.cart_token) || isNewOrder" class="bg-white shadow-md rounded-lg p-4 mt-4">
          <form @submit.prevent="createChat" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700             ">Email</label>
              <input type="email" name="email" id="email" v-model="emailInput" required :disabled="loading"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="phone" name="phone" id="phone" v-model="phoneInput" required :disabled="loading"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="abroad" type="checkbox" v-model="abroadInput"
                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <label for="abroad" class="ml-3 text-sm text-gray-600">Shipping outside Poland</label>
            </div>
            <div>
              <label for="postal-code" class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" name="postal-code" id="postal-code" v-model="postalCodeInput" required :disabled="loading"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <input type="text" name="city" id="city" v-model="cityInput" required :disabled="loading"
                     class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
            </div>
            <div>
              <label for="additional-notices" class="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea id="additional-notices" rows="4" v-model="additionalNoticesInput"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"></textarea>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="rules" type="checkbox" v-model="rulesInput" required
                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <label for="rules" class="ml-3 text-sm text-gray-600">I have read and agreed to the terms and conditions</label>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="rules-2" type="checkbox" v-model="rulesInput" required
                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              </div>
              <label for="rules-2" class="ml-3 text-sm text-gray-600">I have read and agreed to the privacy policy</label>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="rules-3" type="checkbox" v-model="rulesInput" required
                       class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo -500" />
              </div>
              <label for="rules-3" class="ml-3 text-sm text-gray-600">I have read and agreed to the return policy</label>
            </div>
            <p v-if="errorText2" class="text-red-500 text-sm">{{ errorText2 }}</p>
            <button type="submit" :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Submit
            </button>
          </form>
        </div>
        <div v-if="state?.cart_token && !isNewOrder" class="flex justify-center mt-4">
          <button @click="handleSubmitWithToken" :disabled="loading"
                  class="py-2 px-4 bg-cyan-500 text-white rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2">
            Save Changes
          </button>
        </div>
        <div v-if="message" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4" role="alert">
          <p class="font-bold">Success</p>
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading spinner -->
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
    <div class="lds-dual-ring"></div>
  </div>
</template>


<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  text-transform: uppercase;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ccc;
}
</style>
