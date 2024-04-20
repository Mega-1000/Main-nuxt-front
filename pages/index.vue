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

  <div class="bg-gradient-to-r from-blue-300 to-gray-600 font-[sans-serif] p-6">
    <div class="container mx-auto flex flex-col justify-center items-center">
      <h2 class="text-white text-3xl font-bold mb-4">Ponad 50 producentów styropianu</h2>
      <p class="text-white text-base text-center mb-6">Gwarantujemy najniższą cenę w polsce z darmową dostawą po spełnieniu minimum logistycznego.</p>
      <NuxtLink href="/styropiany" class="bg-white text-sm text-blue-600 font-semibold py-2 px-6 rounded hover:bg-slate-100">
        Kup styropian
      </NuxtLink>
    </div>
  </div>

  <Slider />

  <p v-if="pending" class="text-center text-xl text-gray-600">Loading...</p>
  <div v-else class="flex justify-center">
    <section class="pt-10 pb-20 w-full">
      <div class="lg:flex justify-center">
        <div class="px-10 w-full lg:w-1/4">
          <Sidebar class="h-fit flex flex-col mt-10" :categories="categories" />
          <nuxt-link class="bg-green-500 rounded px-4 py-2 text-white mt-4 hover:bg-green-600" to="/categories/create" v-if="isStaff">Dodaj kategorię</nuxt-link>
        </div>
        <div class="w-full lg:w-3/4 flex justify-center">
          <div>
            <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 items-center lg:grid-cols-3">
              <article
                  v-for="category in categories"
                  class="h-full w-full sm:w-auto rounded-lg bg-white p-3 shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div :class="category.blured ? 'blur-sm' : ''">
                  <NuxtLink :to="buildLink(category)">
                    <div class="overflow-hidden rounded-xl">
                      <img
                          :src="buildImgRoute(category.img)"
                          alt="Category Image"
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
    </section>
  </div>
</template>
