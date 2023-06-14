<template>
  <Navbar />
  <NuxtPage class="mb-40" />
  <Footer class="mt-20" />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
