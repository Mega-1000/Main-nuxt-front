<script setup lang="ts">
import buildImgRoute, { defaultImgSrc } from "~~/helpers/buildImgRoute";

interface Props {
  description?: string;
  imgSrc?: string;
  name: string;
}

const { description, imgSrc, name } = defineProps<Props>();

const realDescription = description?.replace(/\|/gim, "\n");
</script>

<template>
  <div class="flex justify-center">
    <div
      id="whoobe-3fery"
      class="justify-center items-center bg-white shadow-lg rounded-lg flex flex-row w-[95vw] sm:w-[90vw] lg:w-[60vw]"
    >
      <img
        :src="buildImgRoute(imgSrc!)"
        @error="(e: any) => (e.target!.src = defaultImgSrc)"
        alt="img"
        title="img"
        class="object-cover rounded-t-lg w-[45%]"
        id="whoobe-ixxe5"
      />
      <div id="whoobe-1okdg" class="w-full p-4 justify-start flex flex-col">
        <h4 class="border-b-2 text-3xl" id="whoobe-3mr7n">{{ name }}</h4>
        <p class="my-4" id="whoobe-950fw">
          {{ realDescription }}
        </p>
      </div>
    </div>
  </div>
</template>
