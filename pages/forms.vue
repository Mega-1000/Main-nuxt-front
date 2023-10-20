<script>
const route = useRoute();
onMounted(() => {

  const formName = route.params.formName;
  const orderId = route.params.orderId;

  window.location.href = `https://admin.mega1000.pl/form/${formName}/${orderId}`;
})
</script>
