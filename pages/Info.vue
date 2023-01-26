<template>
  <div :innerHTML="content"></div>
</template>

<script setup>
import placeholder from "~~/mocks/placeholder";

const { data: content } = await useAsyncData(() => placeholder, {
  server: false,
});
</script>
