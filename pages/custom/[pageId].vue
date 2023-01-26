<template>
  <div class="lg:ml-10 max-w-[90%]">
    <div :innerHTML="content"></div>
  </div>
</template>

<script lang="ts" setup>
import { getContent, getPages } from "~~/helpers/customPages";

const { params } = useRoute();

const { data: content } = await useAsyncData(
  async () => {
    const { allPages } = await getPages();
    return getContent(allPages, params.pageId as string);
  },
  { server: false }
);
</script>
