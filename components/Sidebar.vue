<script setup lang="ts">
const props = defineProps<{
  categories: any[];
  categoryTree?: any[];
  nested?: boolean;
}>();
</script>

<template>
  <div
    :class="`w-15 md:w-25 h-fit w-full bg-white  ${
      !nested ? `shadow-md border border-gray-500` : ``
    }`"
    id="sidenavExample"
  >
    <h3
      v-if="!nested"
      class="text-xl lg:text-2xl py-5 uppercase px-3 font-medium bg-gray-100"
    >
      Kategorie
    </h3>
    <ul>
      <li
        id="sidenavEx2"
        v-for="category in props.categories"
        class="uppercase"
      >
        <NuxtLink
          :class="`py-3 lg:py-5 px-3 lg:px-5 ${nested && `pl-5 lg:pl-8`} flex border-t border-gray-500 items-center text-md lg:text-lg h-fit overflow-hidden text-gray-700 text-ellipsis ${categoryTree?.map((category: any) => category.id)[categoryTree.length - 1] === category.id && `bg-cyan-500 font-medium text-white`} hover:text-white hover:bg-cyan-500 transition duration-300 ease-in-out cursor-pointer`"
          data-mdb-ripple="true"
          data-mdb-ripple-color="dark"
          data-bs-toggle="collapse"
          data-bs-target="#collapseSidenavEx2"
          aria-expanded="false"
          aria-controls="collapseSidenavEx2"
          :href="`/${category.rewrite}/${category.id}`"
        >
          <p>
            <span v-if="nested">
            </span>
            {{ category.name }}
          </p>
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
