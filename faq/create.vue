<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { Modal } from "flowbite";

const { $shopApi: shopApi } = useNuxtApp();

const questions = ref([]);
const category = ref(0);
const answer = ref('');

const modal = ref(null);

onMounted(async () => {
  const { data } = await shopApi.get("/api/faqs/get");
  questions.value = data;
});

const categoryQuestions = computed(() => {
  return questions.value[category.value];
});

onMounted(() => {
  // set the modal menu element
  const $targetEl = document.getElementById(`modal-${props.item.id}`);

  // options with default values
  const options = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses: "bg-gray-900 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  modal.value = new Modal($targetEl, options);
});

const [parent] = useAutoAnimate()
</script>

<template>
  <div class="w-[70%] mx-auto mt-8">
    <div>
      <h1 class="text-4xl">Pytania i odpowiedzi</h1>
    </div>

    <div class="rounded bg-slate-500 p-4 mt-4">
      Wybierz temat kontaktu.
    </div>

    <div class="lg:flex">
      <div class="lg:w-[15%]">
        <button v-for="(questions, name) in questions" @click="category = name; answer = ''"
          class="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6 ">
          {{ name }}
        </button>

        <button class="bg-green-500 rounded text-white px-4 py-2 mt-4" @click="modal?.show">
          Ztwórz nową kategorię
        </button>
      </div>

      <div class="m-5" ref="parent">
        <div v-if="answer" class="my-5">
          <p>{{ answer }}</p>
        </div>
        <div v-for="question in categoryQuestions" :key="question.id" @click="answer = question.answer">
          <div class="pointer bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l block mt-6"
            v-if="question.question !== '0'">
            <h2 class="text-lg">{{ question.question }}</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    :id="`modal`"
    tabindex="-1"
    class="top-0 fixed z-50 w-auto hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
  >
    <div
      class="relative w-full h-full max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:h-auto"
    >
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            Podłącz potwierdzenie przelewu
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            data-modal-hide="modal"
            @click="modal?.hide"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6 w-auto">
          <template
            v-if="
              !item.dates?.customer_shipment_date_from ||
              !item.dates?.customer_shipment_date_to
            "
          >
            <div
              class="flex max-w-lg p-6 bg-gray-100 border border-gray-200 rounded-lg shadow"
            >
              <h5 class="mb-2 text-lg font-md tracking-tight text-red-500 mr-6">
                Uwaga brak danych do dostawy bądź faktury
              </h5>
              <a
                is="button"
                :href="`${config.nuxtNewFront}zamowienie/mozliwe-do-realizacji/brak-danych/${item.id}`"
                class="text-center p-1 bg-slate-100 text-md rounded-lg text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
              >
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
        <div
          class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b"
        >
          <button
            type="button"
            @click="async () => await handleUploadProofOfPayment()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Jestem pewny poprawności oferty, podłączam potwierdzenie przelewu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>