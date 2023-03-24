<script setup>
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { Modal } from "flowbite";

const { $shopApi: shopApi } = useNuxtApp();
const [parent] = useAutoAnimate()
const user = useUser();

const modal = ref(null);

onMounted(() => {
  const $targetEl = document.getElementById(`modal`);

  const options = {
    placement: "center",
    backdrop: "dynamic",
    backdropClasses: "bg-gray-500 bg-opacity-50 fixed inset-0 z-40",
    closable: true,
  };

  modal.value = new Modal($targetEl, options);
});

const { data: userData } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("api/user");
    if (res.status === 200 && res.data) {
      return (
        res.data.addresses.filter(
          (address) => address.type === "STANDARD_ADDRESS"
        )[0] || {}
      );
    }
  } catch {}
});

const hideModal = () => {
  modal?.value.hide();
};

user.value = userData.value;
</script>

<template>
  <div>
    <div class="mt-6 text-2xl font-semibold">
      Czy chcesz połączyć się z konsultantem i zadać kolejne pytanie?
    </div>
    <button class="bg-slate-700 text-white rounded px-4 py-2 block mt-4" @click="modal?.show">Zadaj pytanie</button>
  </div>


  <div id="modal" tabindex="-1" ref="parent"
    class="top-0 fixed z-50 w-auto hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
    <div class="relative w-full h-full max-w-xl sm:max-w-3xl md:max-w-5xl lg:max-w-7xl md:h-auto">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            Wpisz numer telefonu
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
            <span class="sr-only">Zamknij modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6m w-fit mx-auto">
          <ContactForm @submit="hideModal()" v-if="user?.phone && user?.phone !== null" class="max-w-screen" />
          <ContactPhoneContactForm v-else class="max-w-[100%]" />
        </div>
        <!-- Modal footer -->
      </div>
    </div>

  </div>
</template>