<template>
  <div>
    <q-select
      color="white"
      v-model="select"
      :options="filter"
      outlined
      rounded
      bg-color="grey"
      dense
      class="q-mt-sm"
      option-label="title"
      option-value="id"
      @click="sendOrg()"
    >
      <template v-slot:prepend>
        <q-icon name="list" />
      </template>
    </q-select>
    {{ sendOrg }}
  </div>
</template>

<script>
export default {
  name: "pageCompontnet",
  data() {
    return {
      select: { id: 1, title: "mais recente para o mais antigo" },
      filter: [
        { id: 1, title: "mais recente para o mais antigo" },
        { id: 2, title: "mais antigo para o mais recente" },
        { id: 3, title: "primeito créditos, depois débitos" },
        { id: 4, title: "primeiro débitos, depois créditos" },
      ],
    };
  },
  computed: {
    sendOrg() {
      return this.$emit("orga", this.select);
    },
  },
};
</script>

<style scoped></style>
