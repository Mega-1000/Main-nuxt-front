<script setup lang="ts">
import { Modal } from "flowbite";
import buildImgRoute, { defaultImgSrc } from "~~/helpers/buildImgRoute";

interface Props {
  item: any;
  modal: Modal | null;
}

const props = defineProps<Props>();

const currentItem = useCurrentItem();

const handleShowModal = () => {
  props.modal?.show();
  currentItem.value = props.item;
};
</script>

<template>
  <button
    data-modal-target="defaultModal"
    data-modal-toggle="defaultModal"
    @click="handleShowModal"
  >
    <article
      class="rounded-xl bg-white p-5 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
    >
      <div class="overflow-hidden rounded-xl h-[85%]">
        <img
          :src="buildImgRoute(props.item.img)"
          alt="Photo"
          @error="(e: any) => (e.target!.src = defaultImgSrc)"
          class="h-full w-full"
        />
      </div>

      <div class="mt-1 p-2">
        <h2 class="text-gray-900 font-medium">{{ props.item.name }}</h2>
      </div>
    </article>
  </button>
</template>
