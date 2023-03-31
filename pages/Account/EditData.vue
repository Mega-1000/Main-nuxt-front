<script setup>
  const { $shopApi: shopApi } = useShopApi();

  onMounted(async () => {
    await shopApi.get('/api/user')
    
  })
</script>

<template>
  
</template>
