<script setup lang="ts">
import { defaultImgSrc } from "~~/helpers/buildImgRoute";
import Swal from "sweetalert2";

const { $shopApi: shopApi, $buildImgRoute: buildImgRoute } = useNuxtApp();
const route = useRoute();

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
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

  const data:any = await shopApi.get('/api/staff/isStaff');

  if (data.data) {
    isStaff.value = true;
  }

  useState('isStaff', () => isStaff.value);
})

const config = useRuntimeConfig().public;
</script>

<template>
  <div id="alert-additional-content-4" class="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
    <div class="flex items-center">
      <svg class="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">Info</span>
      <h3 class="text-lg font-medium">Zgarnij 30 zł polecając nas znajomym!</h3>
    </div>
    <div class="mt-2 mb-4 text-sm">
      Mamy świetną wiadomość: zaproś do nas dowolną ilość znajomych, którzy jeszcze nie kupowali styropianów na naszej stronie, i odbierz 25 zł na każde zamówienie nowego użytkownika! Twoje bonusy automatycznie zamienią się na zniżki przy kolejnych zakupach. To proste!
    </div>
    <div class="flex">
      <a type="button" class="text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-yellow-300 dark:text-gray-800 dark:hover:bg-yellow-400 dark:focus:ring-yellow-800">
        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
          <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        </svg>
        Dowiedz się więcej
      </a>
    </div>
  </div>
  <p v-if="pending">Loading...</p>
  <div v-else class="flex">
    <section class="pt-10 pb-20 w-full flex justify-center">
      <div>
        <div class="lg:flex justify-center">
          <div class="px-10 w-full lg:w-fit justify-center lg:w-1/3">
            <Sidebar
                class="h-fit flex flex-col justify-center mt-30 w-full"
                :categories="categories"
            />

            <nuxt-link class="bg-green-500 rounded px-4 py-2 text-white" href="/categories/create" v-if="isStaff">Dodaj kategorię</nuxt-link>
          </div>
          <div class="w-full flex justify-center">
            <div>
              <div
                  class="lg:w-2/3 grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 mb-10 items-center lg:grid-cols-3 h-fit"
              >
                <article
                    v-for="category in categories"
                    class="h-full w-fit sm:w-auto rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
                >
                  <NuxtLink :href="buildLink(category)">
                    <div class="overflow-hidden rounded-xl h-4/5">
                      <img
                          :src="buildImgRoute(category.img)"
                          alt="Photo"
                          @error="(e: any) => (e.target!.src = defaultImgSrc)"
                          class="w-full h-full"
                      />
                    </div>

                    <div class="mt-1 p-2 h-1/5">
                      <h2 class="text-gray-900 font-medium">
                        {{ category.name }}
                      </h2>
                    </div>
                  </NuxtLink>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
