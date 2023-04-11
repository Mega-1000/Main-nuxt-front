<script setup lang="ts">
import { Modal, ModalOptions } from "flowbite";
import RemindMeAboutOfferCalendarModal from "~/components/account/RemindMeAboutOfferCalendarModal.vue";

interface Props {
  item: any;
}

const productsCart = useProductsCart();

const router = useRouter();

const props = defineProps<Props>();

const emit = defineEmits(["refresh"]);

const editCart = (items: any[]) => {
  productsCart.value.removeAllFromCart();
  items.map((product) => {
    const prodPacking = product.product.packing;
    const prodPrice = product.product.price;

    delete product.product.packing;
    delete product.product.price;

    const prodMain = product.product;
    delete product.product;

    const productFinal = {
      ...product,
      ...prodMain,
      ...prodPacking,
      ...prodPrice,
    };
    productsCart.value.addToCart(productFinal, productFinal.quantity);
  });
  router.push("/koszyk.html");
};

const config = useRuntimeConfig().public;

const { $shopApi: shopApi } = useNuxtApp();

const downloadInvoice = async (invoice: any) => {
  const response = await shopApi.get("api/invoices/get/" + invoice?.id, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", invoice.gt_invoice_number + ".pdf");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const proofUploaded = ref(false);

const modal = ref<Modal | null>(null);

onMounted(() => {
  // set the modal menu element
  const $targetEl = document.getElementById(`modal-${props.item.id}`);

  // options with default values
  const options: ModalOptions = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  modal.value = new Modal($targetEl, options);
});

const defaultError = "Wystąpil błąd. Spróbuj ponownie później";

const handleUploadProofOfPayment = async () => {
  const proofOfPaymentInput = document.getElementById("proof_of_payment");
  const formData = new FormData();
  const file = (proofOfPaymentInput! as any).files[0];
  if (!file) return false;
  formData.append("id", props.item.id);
  formData.append("file", file);
  try {
    await shopApi.post("api/orders/uploadProofOfPayment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    modal.value?.hide();
    proofUploaded.value = true;
    if (
      !props.item.dates?.customer_shipment_date_from ||
      !props.item.dates?.customer_shipment_date_to
    )
      window.location.assign(
        `${config.nuxtNewFront}zamowienie/mozliwe-do-realizacji/brak-danych/${props.item.id}`
      );
  } catch (err: any) {
    modal.value?.hide();

    if (err.response && err.response.data) {
      alert(err.response.data.errorMessage ?? defaultError);
    } else {
      alert(defaultError);
    }
  }
};

const markOfferAsInactive = async () => {
  await shopApi.post(`api/orders/move-to-unactive/${props.item.id}`)

  router.go(0);
};
</script>

<template>
  <div class="relative space-y-3 rounded-xl shadow-lg p-3 w-[60vw] max-w-7xl mx-auto border border-white bg-white">
    <p class="text-md">
      <span class="font-bold">Nr zamówienia:</span> {{ item.id }}
    </p>
    <p class="text-md" v-if="item.master_order_id">
      <span class="font-bold">Nr zamówienia głównego:</span>
      {{ item.master_order_id }}
    </p>
    <p class="text-md">
      <span class="font-bold">Data stworzenia:</span> {{ item.created_at }}
    </p>
    <p class="text-md">
      <span class="font-bold">Status:</span> {{ item.status.name }}
    </p>
    <p v-if="item.employee" class="text-md">
      <span class="font-bold">Osoba obsługująca:</span> {{ item.employee.name }}
    </p>
    <p v-if="item.employee" class="text-md">
      <span class="font-bold">Tel. kontaktowy:</span> {{ item.employee.phone }}
    </p>
    <p class="text-md">
      <span class="font-bold">Wartość brutto zamówienia:</span>
      {{ item.total_sum.toFixed(2) }} PLN
    </p>
    <p class="text-md">
      <span class="font-bold">Wpłacono:</span> {{ item.bookedPaymentsSum }} PLN
    </p>

    <div v-if="item.reminder_date">
      <p class="text-md">
        <span class="font-bold">Data przypomnienia:</span> {{ item.reminder_date }}
      </p>
    </div>

    <div v-if="item.labels.filter(label => label.id === 224)[0] && !item.reminder_date">

      <hr />

      <div>
        Wskaż datę przypomnienia lub przenieś do ofert nieaktywnych bo w innym przypadku system będzie codziennie wysyłał powiadomienia na twojego emaila
      </div>

      <RemindMeAboutOfferCalendarModal :offer-id="item.id" />

      <button class="bg-red-500 text-white rounded px-4 py-2 ml-4" @click="markOfferAsInactive">
        Przenieś tą ofertę do nieaktywnych
      </button>
    </div>

    <hr />

    <div class="relative overflow-x-auto">
      <table class="max-w-4xl text-sm text-left text-gray-500 w-full" v-if="item.packages && item.packages.length > 0">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">Nr paczki</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Kurier</th>
            <th scope="col" class="px-6 py-3">Nr listu przewozowego</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b w-full" v-for="pack in item.packages">
            <td class="px-6 py-4">
              {{ pack.id }}
            </td>
            <td class="px-6 py-4">
              {{ pack.status }}
            </td>
            <td class="px-6 py-4">
              {{ pack.delivery_courier_name }}
            </td>
            <td class="px-6 py-4">
              {{ pack.letter_number }}
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="text-lg">Brak paczek</p>
    </div>

    <hr />

    <div class="grid md:flex">
      <button @click="modal?.show" v-if="!proofUploaded && (!item?.files || item.files.length === 0)"
              class="p-1 bg-slate-100 text-xs text-gray-700 border rounded hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 border-black">
        Podłącz potwierdzenie przelewu - przyśpiesza realizacje
      </button>

      <button v-else disabled class="p-1 bg-green-400 text-xs text-black border border-gray-700">
        Potwierdzenie przelewu podłączone - zapłacono
      </button>

      <template v-if="item?.order_offers && item.order_offers.length > 0">
        <a is="button" :href="`${config.baseUrl}/order-proform-pdf/${item.order_offers[0]?.id}`"
          class="p-1 bg-slate-100 text-xs text-gray-900 border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
          Faktura proforma
        </a>
        <a is="button" target="_blank" :href="`${config.baseUrl}/order-offer-pdf/${item.order_offers[0]?.id}`"
          class="p-1 bg-slate-100 text-xs text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
          Opis oferty
        </a>
      </template>

      <accountActionButton :target="undefined" href="" type="button" @click="editCart(item.items)">
        Edytuj koszyk
      </accountActionButton>

      <accountActionButton target="_blank" type="link" is="button"
        :href="`${config.nuxtNewFront}zamowienie/mozliwe-do-realizacji/brak-danych/${item.id}`">
        Dane do dostawy i faktury oraz ich edycja
      </accountActionButton>

      <accountActionButton v-for="invoice in item?.invoices?.filter((invoice: any) => invoice.is_visible_for_client)"
        target="_blank" is="button" :href="`${config.baseUrl}/storage/invoices/${invoice.invoice_name}`" type="link">
        Pobierz fakturę {{ invoice.invoice_name }}
      </accountActionButton>

      <accountActionButton type="link"
        v-for="invoice in item?.invoices?.filter((invoice: any) => invoice.is_visible_for_client)" target="_blank"
        is="button" :href="`${config.baseUrl}/storage/invoices/${invoice.invoice_name}`">
        Pobierz fakturę {{ invoice.invoice_name }}
      </accountActionButton>

      <button v-for="invoice in item?.user_invoices" @click="() => downloadInvoice(invoice)"
        class="p-1 bg-slate-100 text-xs text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
        Faktura: {{ invoice.gt_invoice_number }}
      </button>

      <accountActionButton type="link" target="_blank" is="button"
        :href="`${config.baseUrl}/chat-show-or-new/${item.id}/${item.customer_id}`">
        Dyskusja
      </accountActionButton>
    </div>
    <div class="grid md:flex pt-2" v-for="buttonGroup in Object.keys(item.buttons)">
      <p class="text-sm text-center pr-2 pt-1">{{ buttonGroup }}</p>
      <a v-for="button in (Object.values(item.buttons[buttonGroup]) as any)" target="_blank" is="button"
        :href="button.url"
        class="p-1 text-center bg-slate-100 text-xs text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
        {{ button.description }}
      </a>
    </div>
  </div>

  <div :id="`modal-${item.id}`" tabindex="-1"
    class="top-0 fixed z-50 w-auto hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
    <div class="relative w-full h-full max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            Podłącz potwierdzenie przelewu
          </h3>
          <button type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-hide="modal" @click="modal?.hide">
            <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6 w-auto">
          <template v-if="
            !item.dates?.customer_shipment_date_from ||
            !item.dates?.customer_shipment_date_to
          ">
            <div class="flex max-w-lg p-6 bg-gray-100 border border-gray-200 rounded-lg shadow">
              <h5 class="mb-2 text-lg font-md tracking-tight text-red-500 mr-6">
                Uwaga brak danych do dostawy bądź faktury
              </h5>
              <a is="button" :href="`${config.nuxtNewFront}zamowienie/mozliwe-do-realizacji/brak-danych/${item.id}`"
                class="text-center p-1 bg-slate-100 text-md rounded-lg text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                Uzupełnij dane
              </a>
            </div>
          </template>
          <p>
            Uwaga podłączasz potwierdzenie zapłaty do oferty o numerze [{{
              item.id
            }}].
          </p>
          <p>
            Sprawdźcie Państwo czy napewno chcieliście realizować tą ofertę a
            nie inną, ponieważ po tym zatwierdzeniu zostaje ona przekazana do
            produkcji i w przypadku błędnego wskazania, wszelkie koszty z tym
            związane będą obciążać Państwa.
          </p>
          <p>
            Zalecane aby otworzyć ją i sprawdzić pod względem asortymentowym,
            ilościowym oraz sprawdzić dane do dostawy, faktury i daty
            logistyczne.
          </p>
          <input type="file" id="proof_of_payment" accept=".pdf,image/*" />
        </div>
        <!-- Modal footer -->
        <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <button type="button" @click="async () => await handleUploadProofOfPayment()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Jestem pewny poprawności oferty, podłączam potwierdzenie przelewu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
