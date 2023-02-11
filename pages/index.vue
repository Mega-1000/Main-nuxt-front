<script setup lang="ts">
import buildImgRoute, { defaultImgSrc } from "~~/helpers/buildImgRoute";

const { $shopApi: shopApi } = useNuxtApp();

const { data: categories, pending } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("/api/products/categories");
    console.log(res.data);
    return res.data;
  } catch (e: any) {}
});

const buildLink = ({ rewrite, id }: { rewrite: string; id: number }) =>
  `/${rewrite}/${id}`;
</script>

<template>
  <p v-if="pending">Loading...</p>
  <section v-else class="py-10">
    <div class="flex justify-center mb-5">
      <h1 class="font-bold text-5xl">Kategorie</h1>
    </div>
    <div
      class="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
    >
      <article
        v-for="category in categories"
        class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
      >
        <NuxtLink :href="buildLink(category)">
          <div class="overflow-hidden rounded-xl h-[85%]">
            <img
              :src="buildImgRoute(category.img)"
              alt="Photo"
              @error="(e: any) => (e.target!.src = defaultImgSrc)"
              class="h-full w-full"
            />
          </div>

          <div class="mt-1 p-2">
            <h2 class="text-gray-900 font-medium">{{ category.name }}</h2>
          </div>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>
