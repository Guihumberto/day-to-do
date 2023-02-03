<template>
  <q-card class="bg-teal text-white" style="width: 700px">
    <q-card-section>
      <div class="text-h6">Resumo</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      Click/Tap on the backdrop.
    </q-card-section>

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn flat label="OK" v-close-popup />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: "detailsComponente",
  data() {
    return {};
  },
  props: {
    sumTotal: Object,
  },
};
</script>

<style scoped></style>
