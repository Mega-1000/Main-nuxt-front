<template v-if="item">
  <input class="font-black text-gray-800 md:text-3xl text-xl z-20" @input="handleInput" v-model="name" contenteditable="true">
  <div class="text-left w-full font-light text-sm">
    {{ item.symbol }}
    <div class="mt-4" @click="handleInput" >
      Zapisuj nazwę
      <input v-model="saveName" :checked="saveName" type="checkbox">
      {{saveName}}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
    item: any;
}

const props = defineProps<Props>();

const { $shopApi: shopApi } = useNuxtApp();
const name = ref(props.item.name);
const saveName = ref(props.item.save_name === 1);

const handleInput = (e: any) => {
  setTimeout(() => {
    shopApi.post(`/api/products/${props.item.id}`, {
      name: name.value,
      save_name: saveName.value,
    });
  }, 100);
};
</script>
