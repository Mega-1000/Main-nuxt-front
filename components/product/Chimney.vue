<script setup lang="ts">
interface Props {
  item: any;
}

const props = defineProps<Props>();

const loading = ref(false);

const handleSubmit = (e: any) => {
  e.preventDefault();
};
</script>

<template>
  <div
    class="w-screen max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8"
  >
    <form class="space-y-6" @submit="handleSubmit">
      <div v-for="attribute in props.item.chimney_attributes">
        <label
          :for="`attr[${attribute.id}]`"
          class="block mb-2 text-sm lg:text-lg font-medium text-gray-900"
          >{{ attribute.name.trim() }}</label
        >
        <select
          :id="`attr[${attribute.id}]`"
          v-if="attribute.options && attribute.options.length > 0"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option v-for="item in attribute.options" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <input
          v-else
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="name@company.com"
          required
          :disabled="loading"
        />
      </div>
    </form>
  </div>
</template>
