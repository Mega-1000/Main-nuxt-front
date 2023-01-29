<script lang="ts" setup>
import { getContent, getPages } from "~~/helpers/customPages";
import useApi from "~~/helpers/shopApi";

const { params } = useRoute();

const appStorage = useRuntimeConfig().public.APP_STORAGE;
const api = useApi(appStorage);

const { data: content } = await useAsyncData(
  async () => {
    const { allPages } = await getPages(api);
    return getContent(allPages, params.pageId as string);
  },
  { server: false }
);
</script>

<template>
  <div class="lg:ml-10 max-w-[90%]">
    <div :innerHTML="content"></div>
  </div>
</template>
