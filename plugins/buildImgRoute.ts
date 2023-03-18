export default defineNuxtPlugin(() => {
  const baseUrl = useRuntimeConfig().public.baseUrl;

  return {
    provide: {
      buildImgRoute: (path: string) => baseUrl + path,
    },
  };
});
