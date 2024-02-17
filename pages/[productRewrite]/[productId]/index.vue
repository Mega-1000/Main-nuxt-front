<script setup lang="ts">
import findActiveMenu from "~~/helpers/findActiveMenu";
import { defaultImgSrc } from "~~/helpers/buildImgRoute";
import { Modal, ModalOptions } from "flowbite";
import Cookies from "universal-cookie";
import emmiter from "~/helpers/emitter";
import AskUserForZipCodeStyrofoarms from "~/components/AskUserForZipCodeStyrofoarms.vue";
import {integer} from "vscode-languageserver-types";

const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();

const currentItem = useCurrentItem();

const { params, query } = useRoute();
const { productId } = params;
const page = ref(parseInt((query.page as string) || "1"));
const isStaff = ref(false);
const askUserForZipCode = ref(false);
const categoryFirmId = ref<integer|null>(null);
const isMainStyrofoamLobby = ref<bool>(false);

const { data: currentProduct, pending: pending1 } = await useAsyncData(
  async () => {
    try {
      const res = await shopApi.get("/api/products/categories");
      const currentProduct = findActiveMenu(res.data, productId as string);
      let product = { ...currentProduct };
      let categoryTree = [currentProduct];
      while (product.parent_id && parseInt(product.parent_id) !== 0) {
        product = findActiveMenu(res.data, product.parent_id);
        categoryTree = [product, ...categoryTree];
      }

      return {
        currentProduct,
        categories: res.data,
        categoryTree,
      };
    } catch (err) {}
  }
);

const { data: categoryData, pending: pending2 } = await useAsyncData(
  async () => {
    try {
      const res = await shopApi.get(
        `/api/categories/details/search?category=${productId}`
      );
      return res.data;
    } catch (err) {}
  }
);

const { data: itemsData, pending: pending3 } = await useAsyncData(
  async () => {
    try {
      const currentPage = query?.page as string ?? 1;
      const zipCode = localStorage.getItem('zipCode');

      const res = await shopApi.get(
        `/api/products/categories/get?page=${currentPage}&per_page=10&category_id=${productId}&zipCode=${zipCode}`
      );
      return res.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  },
  { watch: [page] }
);

const buildLink = ({ rewrite, id, name }: { rewrite: string; id: number, name: string }) =>
  name !== 'porady na temat zakupu styropianu' ? `/${rewrite}/${id}` : '/Styrofoarm-generate-table';

const modal = ref<Modal | null>(null);

const contactModal = ref<Modal | null>(null);

const setupModals = () => {
  // set the modal menu element
  const $targetEl = document.getElementById("calculatorModal");

  // options with default values
  const options: ModalOptions = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  modal.value = new Modal($targetEl, options);

  const $contactTargetEl = document.getElementById("contactModal");

  // options with default values
  const contactOptions: ModalOptions = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  contactModal.value = new Modal($contactTargetEl, contactOptions);
};

onMounted(async () => {
  setupModals();

  if (productId === '103' && !localStorage.getItem('zipCode')) {
    askUserForZipCode.value = true;
    isMainStyrofoamLobby.value = true;
  }

  const data:any = await shopApi.get('/api/staff/isStaff');
  if (data.data) {
    await handleStaffUser();
  }
});
watch([itemsData], setupModals);

const handleStaffUser = async () => {
  isStaff.value = true;

  const categoryFirmName: string = currentProduct.value?.currentProduct?.name;
  const matched = categoryFirmName.match(/-+([a-zA-Z]+-?[a-zA-Z]+ ?[a-zA-Z]*)/);
  let result = matched ? matched[1] : null;

  const categoryFirm: any = await shopApi.get(`/api/firm/${result}`);
  categoryFirmId.value = categoryFirm?.data?.id
}

const handleCloseModal = () => {
  modal.value?.hide();
  currentItem.value = null;
};

const productsCart = useProductsCart();
const productAmount = useProductAmount();

const handleCart = () => {
  const { cart: _cart, ...product } = currentItem.value;
  productsCart.value.addToCart(product, productAmount.value);
  modal.value?.hide();

  emmiter.emit("cart:change");
};

let emailInput = "";
let phoneInput = "";
let postalCodeInput = "";

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const selectedMediaId = useSelectedMediaId();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  loading.value = true;

  try {
    const res = await shopApi.post("/api/chat/getUrl", {
      mediaId: selectedMediaId.value,
      postCode: postalCodeInput,
      email: emailInput,
      phone: phoneInput,
    });

    let req = JSON.parse(res.config.data);
    const cookies = new Cookies();
    cookies.set("email", req.email);
    cookies.set("post_code", req.postCode);
    cookies.set("phone", req.phone);
    errorMessage.value = null;
    window.open(res.data.url, "_blank");
    contactModal.value?.hide();
  } catch (err: any) {
    errorMessage.value =
      err?.response?.data?.errorMessage ||
      "Wystąpil błąd. Spróbuj ponownie później";
  } finally {
    loading.value = false;
  }
};

const router = useRouter();

const goToPage = async (val: number) => {
  page.value = val;

  router.push({
    query: {
      page: val,
    },
  });

  window.location.reload();
  window.scrollTo(0, 0);
};
</script>

 <template>
  <div class="container mx-auto px-4">
    <div v-if="!pending1 && !pending2 && !pending3" class="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="item in itemsData.data" :key="item.id" class="product-item">
        <div class="product-image">
          <img :src="buildImgRoute(item.img)" :alt="item.name" class="w-full h-auto" @error="e => e.target.src = defaultImgSrc">
        </div>
        <div class="product-info mt-2">
          <h3 class="product-name text-lg font-bold">{{ item.name }}</h3>
          <p class="product-description text-sm">{{ item.description }}</p>
        </div>
      </div>
    </div>
    <div v-else class="loading-state text-center">
      <p>Loading products...</p>
    </div>
  </div>
</template>
