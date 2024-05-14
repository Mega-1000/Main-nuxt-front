<script setup lang="ts">
import { defaultImgSrc } from "~~/helpers/buildImgRoute";
import Swal from "sweetalert2";
import ReferalBanner from "~/components/ReferalBanner.vue";

const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();
const route = useRoute();

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get(`/api/products/categories?zip-code=${localStorage.getItem('zipCode')}&`);
    return res.data;
  } catch (e: any) {}
});

const isStaff = ref(false);

const buildLink = ({ rewrite, id }: { rewrite: string; id: number }) =>
    `/${rewrite}/${id}`;

onMounted(async () => {
  if (route.query.ref) {
    localStorage.setItem('registerRefferedUserId', atob(route.query.ref as string || ''));

    Swal.fire({
      title: 'Kod poleceń został zapisany!',
      text: 'Wchodzisz na stronę z kodem polecenia od twojego znajomego.',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  }

  if (localStorage.getItem('noAllegroVisibilityLimit') == null) {
    localStorage.setItem('noAllegroVisibilityLimit', 'true');
    window.location.reload();
  }

  // const data:any = await shopApi.get('/api/staff/isStaff');
  //
  // if (data.data) {
  //   isStaff.value = true;
  // }
  //
  // useState('isStaff', () => isStaff.value);
})

const config = useRuntimeConfig().public;
</script>

<template>
  <ReferalBanner />

  <section>
    <div class="mx-auto max-w-screen-xl pb-10">
      <h1 class="font-bold text-xl mb-4 sm:text-lg sm:font-semibold"> Współpracujemy z: </h1>
      <NuxtLink class="md:grid flex md:gap-8 justify-between text-gray-400 grid-cols-10 gap-5 mx-1" href="/styropian">
        <div class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/genderka.webp" alt="Genderka Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/swisspor.webp" alt="Swisspor Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (13).jpeg" alt="Termo organika Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/arsanit.webp" alt="Arsanit Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/austroterm.webp" alt="Austroterm Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/yetico.webp" alt="Yetico Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/images (4).png" alt="Yetico Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/unnamed.png" alt="Yetico Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/knauf.png" alt="Yetico Logo" class="md:w-[70%]">
        </div>
        <div href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300 hidden md:flex">
          <img src="/polstyr_logo_without_background.png" alt="Yetico Logo" class="md:w-[70%]">
        </div>
      </NuxtLink>
    </div>
  </section>

  <div class="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center">
        <h2 class="text-3xl font-bold mb-4 text-gray-200">Ponad 50 producentów styropianu oraz 100 punktów odbioru w całej polski</h2>
        <p class=" font-extrabold text-center mb-2 text-gray-300 text-xl">
          Gwarantujemy najniższą cenę w polsce z darmową dostawą po spełnieniu minimum logistycznego.
        </p>
        <p class="font-extrabold text-yellow-400 mb-2 text-xl text-center">
          !! Teraz również z płatnością za pobraniem !!
        </p>
        <NuxtLink to="/styropiany" class="bg-white text-indigo-700 font-semibold text-2xl py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-300">
           Kliknij aby zobaczyć tabelkę cen podstawowych i mapę magazynów odbioru
        </NuxtLink>
      </div>
    </div>
  </div>

  <Slider />

  <div v-if="pending" class="flex justify-center py-12">
    <div class="text-center text-xl text-gray-600">Loading...</div>
  </div>
  <div v-else class="bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:flex justify-center">
        <div class="px-4 w-full lg:w-1/4">
          <Sidebar class="h-fit flex flex-col mt-10" :categories="categories" />
          <nuxt-link
              v-if="isStaff"
              to="/categories/create"
              class="bg-green-500 rounded px-4 py-2 text-white mt-4 hover:bg-green-600"
          >
            Dodaj kategorię
          </nuxt-link>
        </div>
        <div class="w-full lg:w-3/4 flex justify-center">
          <div>
            <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <article
                  v-for="category in categories"
                  :key="category.id"
                  class="h-full w-full sm:w-auto rounded-lg bg-white p-3 shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div :class="category.blured ? 'blur-sm' : ''">
                  <NuxtLink :to="buildLink(category)">
                    <div class="overflow-hidden rounded-xl">
                      <img
                          :src="buildImgRoute(category.img)"
                          :alt="category.name"
                          @error="(e) => (e.target.src = defaultImgSrc)"
                          class="w-full h-auto transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div class="mt-2 p-2">
                      <h2 class="text-gray-900 font-medium text-lg">
                        {{ category.name }}
                      </h2>
                    </div>
                  </NuxtLink>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
