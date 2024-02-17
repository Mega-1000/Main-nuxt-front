<script setup>
const route = useRoute();
const isNoLayout = ref(false);

onMounted(() => {
  const lastSegment = route.path.split('/').pop();

  if (lastSegment === 'no-layout') {
    isNoLayout.value = true;
  }
});
</script>



<template>
  <Navbar v-if="!isNoLayout" />
  <NuxtPage class="mb-40" />
  <Footer class="mt-20" v-if="isNoLayout" />
  <script async data-id="8598422425" id="chatling-embed-script" type="text/javascript" src="https://chatling.ai/js/embed.js"></script>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940);
  transform: translate3d(0,0,0);
}
.page-enter-from {
  opacity: 0;
  transform: translate3d(0,-100%,0);
}
.page-leave-to {
  opacity: 0;
  transform: translate3d(0,100%,0);
}
</style>
