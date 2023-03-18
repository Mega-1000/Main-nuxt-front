<script setup lang="ts">
import { defaultImgSrc } from "~~/helpers/buildImgRoute";

interface Props {
  description?: string;
  imgSrc?: string;
  name: string;
}

const { description, imgSrc, name } = defineProps<Props>();

const realDescription = description?.replace(/\|/gim, "\n");

const { $buildImgRoute: buildImgRoute } = useNuxtApp();
</script>

<template>
  <div class="flex justify-center">
    <div
      class="justify-center items-center bg-white shadow-lg rounded-lg sm:flex flex-row w-full max-w-screen-xl mx-3 lg:mx-6 xl:mx-8"
    >
      <img
        :src="buildImgRoute(imgSrc!)"
        @error="(e: any) => (e.target!.src = defaultImgSrc)"
        alt="img"
        title="img"
        class="object-cover rounded-t-lg sm:w-[45%]"
      />
      <div class="w-full p-4 justify-start flex flex-col">
        <h4 class="border-b-2 text-3xl">{{ name }}</h4>
        <p class="my-4">
          {{ realDescription }}
        </p>
      </div>
    </div>
  </div>
</template>
