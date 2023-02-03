<script setup lang="ts">
interface Props {
  id: number;
}

const props = defineProps<Props>();
console.log(props);
</script>

<template>
  {{ id }}
</template>
