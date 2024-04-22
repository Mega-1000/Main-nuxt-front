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
    <div class="mx-auto max-w-screen-xl py-10">
      <div class="grid grid-cols-2 gap-8 text-gray-400 sm:gap-12 md:grid-cols-3 lg:grid-cols-6">
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/genderka.webp" alt="Genderka Logo" style="width: 70%">
        </a>
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/swisspor.webp" alt="Swisspor Logo" style="width: 70%">
        </a>
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/kubala.webp" alt="Kubala Logo" style="width: 70%">
        </a>
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/arsanit.webp" alt="Arsanit Logo" style="width: 70%">
        </a>
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/austroterm.webp" alt="Austroterm Logo" style="width: 70%">
        </a>
        <a href="#" class="flex justify-center items-center hover:scale-105 transition-transform duration-300">
          <img src="/yetico.webp" alt="Yetico Logo" style="width: 70%">
        </a>
      </div>
    </div>
  </section>

  <div class="bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center">
        <h2 class="text-3xl font-bold mb-4 text-gray-200">Ponad 50 producentów styropianu</h2>
        <p class="text-center mb-2 text-gray-300">
          Gwarantujemy najniższą cenę w polsce z darmową dostawą po spełnieniu minimum logistycznego.
        </p>
        <p class="font-extrabold text-yellow-400 mb-2 text-xl">
          !! Teraz również z płatnością za pobraniem
          <nuxt-link to="/styropian-platnosc-za-pobraniem" class="underline text-yellow-300 hover:text-yellow-200">Kliknij aby zobaczyć szczegóły tej usługi</nuxt-link>
          !!
        </p>
        <NuxtLink to="/styropiany" class="bg-white text-indigo-700 font-semibold py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-300">
          Kup styropian
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
