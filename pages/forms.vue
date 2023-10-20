<script>
const route = useRoute();
onMounted(() => {

  const formName = route.params.formName;
  const orderId = route.params.orderId;

  setTimeout(() => {
    window.location.href = `https://admin.mega1000.pl/form/${formName}/${orderId}`;
  }, 10)
})
</script>
