<script setup lang="ts">
import findActiveMenu from "~~/helpers/findActiveMenu";
import buildImgRoute, { defaultImgSrc } from "~~/helpers/buildImgRoute";

const { $shopApi: shopApi } = useNuxtApp();

const { params, query } = useRoute();
const { productId } = params;
const page = query.page || 1;

const { data: currentProduct } = await useAsyncData(async () => {
  const res = await shopApi.get("/api/products/categories");
  return findActiveMenu(res.data, productId as string);
});

const { data: categoryData } = await useAsyncData(async () => {
  const res = await shopApi.get(
    `/api/categories/details/search?category=${productId}`
  );
  return res.data;
});

const { data: items } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get(
      `/api/products/categories/get?page=${page}&per_page=15&category_id=${productId}`
    );
    console.log(res.data);
    return res.data.data;
  } catch (e) {
    console.log(e);
    return [];
  }
});

const buildLink = ({ rewrite, id }: { rewrite: string; id: number }) =>
  `/${rewrite}/${id}`;
</script>

<template>
  <ProductHeader
    :name="currentProduct.name"
    :description="currentProduct.description"
    :imgSrc="currentProduct.img"
    class="mt-10"
  />

  <div
    v-if="
      currentProduct.children &&
      currentProduct.children.length > 0 &&
      (!items || !(items.length > 0))
    "
    class="mx-auto grid max-w-8xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4 mb-10"
  >
    <article
      v-for="product in currentProduct.children"
      class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
    >
      <NuxtLink :href="buildLink(product)">
        <div class="overflow-hidden rounded-xl">
          <img
            :src="buildImgRoute(product.img)"
            alt="Photo"
            @error="(e: any) => (e.target!.src = defaultImgSrc)"
            class="h-full w-full"
          />
        </div>

        <div class="mt-1 p-2">
          <h2 class="text-gray-900 font-medium">{{ product.name }}</h2>
        </div>
      </NuxtLink>
    </article>
  </div>

  <div
    v-else-if="
      !categoryData.chimney_attributes ||
      !(categoryData.chimney_attributes.length > 0)
    "
  >
    <div v-for="item in items">{{ item.id }}</div>
  </div>
  <div v-else>Chimney</div>
</template>
