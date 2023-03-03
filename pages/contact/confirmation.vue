<script setup lang="ts">
  const { $shopApi: shopApi } = useNuxtApp();
  const router = useRouter();

  const loading = useState(() => false);
  const errorMessage = useState(() => "");

  const onConfirm = async () => {
    const params = JSON.parse(router.currentRoute.value.query.params as string);
    try {
      await shopApi.post("/api/new_order", params);
      router.push("/thanks?contact=true");
    } catch (err: any) {
      errorMessage.value = err.response.data.error_message || "Wystąpił błąd";
    } finally {
      loading.value = false;
    }
  };
</script>

<template>
  <div class="w-screen max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto mt-12">
    <div class="mt-4 font-bold text-4xl mb-4">
      !!! Super cena dodatkowy rabat !!! w przypadku samoobsługi i poniżej button Przjedź do sklepu <nuxt-link to="/" class="text-blue-500">Wróć do strony głównej</nuxt-link>
    </div>

    <primaryButton :disabled="loading" @click="onConfirm">
      Rozpocznij rozmowę z konsultantem ( godzina 7 - 22 )
    </primaryButton>
  </div>
</template>
