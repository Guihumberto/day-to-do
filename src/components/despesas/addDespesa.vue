<template>
  <q-card style="width: 300px">
    <q-bar class="text-white" :class="operatorSelect.bgColor">
      <q-icon :name="operatorSelect.icon" />
      <span class="text-caption q-ml-sm">{{ operatorSelect.text }}</span>
      <q-space />

      <q-btn dense flat icon="close" v-close-popup>
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-form
      @submit="addExpanse(despesaForm)"
      @reset="clearExpanseForm"
      class="q-gutter-md"
    >
      <q-card-section>
        <q-input
          outlined
          dense
          placeholder="Dê o título a entrada"
          v-model.trim="despesaForm.name"
          type="text"
          label="Nome"
          :rules="[(val) => !!val || 'Campo Obrigatório']"
        />
        <q-input
          outlined
          dense
          placeholder="0,00"
          v-model.trim="despesaForm.mount"
          label="Valor"
          reverse-fill-mask
          mask="##.###,##"
        />

        <!-- receita -->
        <template v-if="operator == 'credit'">
          <div v-if="!showCadGroupExpanse">
            <q-select
              v-model="despesaForm.group"
              :options="listCreditGroup"
              label="Grupo de Receita"
              outlined
              dense
              class="q-mt-md"
            />
            <q-btn
              color="primary"
              flat
              no-caps
              dense
              icon="add"
              label="inserir um novo grupo de receita"
              size="sm"
              @click="showCadGroupExpanse = true"
              class="width-full"
            />
          </div>

          <template v-else>
            <div class="row items-center">
              <q-input
                outlined
                dense
                placeholder="Digite o nome do grupo"
                v-model.trim="despesaForm.group"
                type="text"
                label="Novo Grupo"
                class="q-mt-md col"
              />
              <q-btn
                flat
                color="primary"
                icon="close"
                size="sm"
                @click="showCadGroupExpanse = false"
                class="col col-shrink q-mt-md"
                round
              />
            </div>
          </template>
        </template>

        <!-- despesa -->
        <template v-else>
          <div v-if="!showCadGroupExpanse">
            <q-select
              v-model="despesaForm.group"
              :options="listExpanseGroup"
              label="Grupo de Despesa"
              outlined
              dense
              class="q-mt-md"
            />
            <q-btn
              color="primary"
              flat
              no-caps
              dense
              icon="add"
              label="inserir um novo grupo de despesa"
              size="sm"
              @click="(showCadGroupExpanse = true), (despesaForm.group = null)"
              class="width-full"
            />
          </div>

          <template v-else>
            <div class="row items-center">
              <q-input
                outlined
                dense
                placeholder="Digite o nome do grupo"
                v-model.trim="despesaForm.group"
                type="text"
                label="Novo Grupo de Despesa"
                class="q-mt-md col"
              />
              <q-btn
                flat
                color="primary"
                icon="close"
                size="sm"
                @click="showCadGroupExpanse = false"
                class="col col-shrink q-mt-md"
                round
              />
            </div>
          </template>
        </template>

        <q-checkbox v-model="despesaForm.recorrent" label="Recorrente" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          @click="clearExpanseForm()"
          flat
          label="limpar"
          :color="operatorSelect.textColor"
        />
        <q-btn
          type="submit"
          outline
          label="Salvar"
          :color="operatorSelect.textColor"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { useExpanseStore } from "stores/ExpanseStore";
const expanseStore = useExpanseStore();

export default {
  data() {
    return {
      showCadGroupExpanse: false,
      despesaForm: {
        name: "",
        group: "",
        mount: "",
        dateInsert: "",
        pay: false,
        recorrent: false,
        mounthYear: "02/2023",
      },
      ExpanseGroup: [
        "Não alocado",
        "Cartão de Crédito",
        "Super Mercado",
        "Lanches",
        "Cinema",
        "Theodoro",
        "Guilherme",
        "Idalina",
        "Samanta",
        "Receber Amigos",
        "Carro",
        "Uber/99",
      ],
      CreditGroup: [
        "Salário",
        "Alugel",
        "Cartao Emprestado",
        "Compensações",
        "Extras",
      ],
    };
  },
  props: {
    operator: String,
  },
  computed: {
    operatorSelect() {
      return this.operator == "credit"
        ? {
            bgColor: "bg-green",
            icon: "add",
            textColor: "green",
            text: "Adicionar Receitas",
          }
        : {
            bgColor: "bg-red",
            icon: "remove",
            textColor: "red",
            text: "Adicionar Despesas",
          };
    },
    listExpanseGroup() {
      return expanseStore.readExpanseList;
    },
    listCreditGroup() {
      return expanseStore.readCreditList;
    },
  },
  methods: {
    addExpanse(item) {
      item.mount = item.mount.replace(".", "").replace(",", ".");
      item.mount = this.operator == "credit" ? +item.mount : -item.mount;
      item.idList = this.$route.params.id;
      item.operator = this.operator;
      expanseStore.addExpanse(item);

      if (this.showCadGroupExpanse) {
        let newGroup = this.despesaForm.group;
        expanseStore.addGroup({ name: newGroup, type: this.operator });
      }
      this.showCadGroupExpanse = false;
      this.clearExpanseForm;
      this.$emit("close");
    },
    clearExpanseForm() {
      this.despesaForm = {
        name: "",
        group: "",
        mount: 0,
        dateInsert: "",
        pay: false,
        recorrent: false,
        mounthYear: "02/2023",
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
