<script lang="ts" setup>
  // type is default to button but can be also link
  const props = defineProps<{
    type: 'button' | 'link'
    href: string | undefined
    target: '_blank' | '_self' | undefined
  }>()
</script>

<template>
  <div>
    <button v-if="type === 'button'" type="button"
      class="p-1 bg-slate-100 text-xs text-gray-700 border rounded hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 border-black">
      <slot />
    </button>

    <a v-if="type === 'link'" :href="href"
      class="p-1 bg-slate-100 text-xs text-gray-900 border rounded hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 border-gray-700">
      <slot />
    </a>
  </div>
</template>