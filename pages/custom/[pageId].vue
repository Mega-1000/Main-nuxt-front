<script lang="ts" setup>
import { getContent, getPages } from "~~/helpers/customPages";

const { params } = useRoute();

const { $api: api } = useNuxtApp();

const { data: content, pending } = await useAsyncData(async () => {
  const { allPages } = await getPages(api);
  return getContent(allPages, params.pageId as string);
});
</script>

<template>
  <div class="lg:ml-10 max-w-[90%]">
    <p v-if="pending">Loading...</p>
    <div v-else :innerHTML="content"></div>
  </div>
</template>
