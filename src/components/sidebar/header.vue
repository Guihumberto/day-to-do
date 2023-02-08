<template>
  <div>
    <div class="bg-indigo text-white">
      <div class="row items-end justify-end q-px-md">
        <q-btn flat round color="grey-4" icon="visibility" />
        <q-btn flat round color="grey-4" icon="help_outline" />
        <q-btn flat round color="grey-4" icon="person" />
      </div>
      <div class="q-pa-md text-bold">Olá, João</div>
    </div>
    <div class="q-pa-md">
      <div class="row justify-between items-center">
        <span class="text-h6">Saldo</span>
        <q-btn flat round color="grey" icon="chevron_right" />
      </div>
      <span class="text-h6">R$ 0,00</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "headerSidebar",
};
</script>

<style scoped></style>
