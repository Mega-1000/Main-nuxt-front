<template>
  <Navbar />
  <NuxtPage class="mb-40" />
  <Footer class="mt-20" />
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
