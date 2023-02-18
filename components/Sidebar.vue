<script setup lang="ts">
const props = defineProps<{
  categories: any[];
  categoryTree?: any[];
  nested?: boolean;
}>();

console.log();
</script>

<template>
  <div
    :class="`w-15 md:w-25 h-fit lg:w-fit bg-gray-50 px-1 lg:px-2 rounded-lg  ${
      !nested ? `shadow-md pt-6 lg:px-6 md:py-6 border border-gray-100` : `pl-2`
    }`"
    id="sidenavExample"
  >
    <h3 v-if="!nested" class="text-md md:text-xl lg:text-2xl pb-3">
      Kategorie
    </h3>
    <ul>
      <li
        id="sidenavEx2"
        v-for="category in props.categories"
        class="md:py-1 lg:py-2"
      >
        <NuxtLink
          :class="`flex border-b border-gray-200 items-center text-sm md:text-xs lg:text-lg xl:text-xl h-fit overflow-hidden text-gray-700 text-ellipsis ${categoryTree?.map((category: any) => category.id).includes(category.id) && `bg-gray-200`} hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer`"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
          data-bs-toggle="collapse"
          data-bs-target="#collapseSidenavEx2"
          aria-expanded="false"
          aria-controls="collapseSidenavEx2"
          :href="`/${category.rewrite}/${category.id}`"
        >
          <p>{{ category.name }}</p>
        </NuxtLink>
        <div
          v-if="categoryTree?.map((category: any) => category.id).includes(category.id) && category.children"
        >
          <Sidebar
            :name="`${category.id}`"
            :categories="category.children"
            :category-tree="categoryTree"
            nested
          />
        </div>
      </li>
    </ul>
  </div>
</template>
