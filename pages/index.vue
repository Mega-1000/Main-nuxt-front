<script setup lang="ts">
import buildImgRoute, { defaultImgSrc } from "~~/helpers/buildImgRoute";

const { $shopApi: shopApi } = useNuxtApp();

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
    return res.data;
  } catch (e: any) {}
});

const buildLink = ({ rewrite, id }: { rewrite: string; id: number }) =>
  `/${rewrite}/${id}`;

const config = useRuntimeConfig().public;
</script>

<template>
  <p v-if="pending">Loading...</p>
  <div v-else class="flex">
    <section class="pt-10 pb-20 w-full flex justify-center">
      <div>
        <div class="lg:flex justify-center">
          <div class="px-10 w-full lg:w-fit flex justify-center lg:w-1/3">
            <Sidebar
              class="h-fit flex flex-col justify-center mt-30 w-full"
              :categories="categories"
            />
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
                        :src="buildImgRoute(category.img, config.baseUrl)"
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
