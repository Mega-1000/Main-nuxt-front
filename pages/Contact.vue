<script setup lang="ts">
const user = useUser();

const { $shopApi: shopApi } = useNuxtApp();

const { data: userData } = await useAsyncData(async () => {
  try {
    const res = await shopApi.get("api/user");
    if (res.status === 200 && res.data) {
      return (
        res.data.addresses.filter(
          (address: any) => address.type === "STANDARD_ADDRESS"
        )[0] || {}
      );
    }
  } catch {}
});

user.value = userData;
</script>

<template>
  <div class="flex pt-20 xl:pt-40">
    <div class="m-auto">
      <ContactForm v-if="user?.phone && user?.phone !== null" />
      <ContactPhoneContactForm v-else />
    </div>
  </div>
</template>
