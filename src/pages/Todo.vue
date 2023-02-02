<template>
  <q-page>
    <div
      class="absolute full-width full-height column"
      v-if="listExpanse.length || listPay.length"
    >
      <div>
        <q-btn
          flat
          color="primary"
          no-caps
          icon="chevron_left"
          label="Voltar"
          to="/"
        />
      </div>
      <div>
        <q-item-label header class="text-center bg-black text-white text-bold"
          >Janeiro/2023 <br />
          <small class="text-caption">
            <span class="text-red">D: 0,00</span> |
            <span class="text-green">P 0,00</span> |
            <span class="text-grey"> T: 0,00</span>
          </small>
        </q-item-label>
        <q-item>
          <q-item-section>
            <div class="motthSelect">
              Classificar: mais recentes para o mais antigo
            </div>
          </q-item-section>
          <q-item-section side>
            <q-icon name="list" />
          </q-item-section>
        </q-item>
      </div>
      <q-scroll-area class="scroll-area-task">
        <q-separator class="separator" />
        <q-list separator>
          <q-item
            v-ripple
            v-for="(item, i) in listExpanse"
            :key="i"
            :class="item.operator == 'credit' ? 'bg-green-1' : 'bg-red-1'"
            @click="expanseStore.fbUpdateExpanse(item)"
            clickable
          >
            <q-item-section side top>
              <q-checkbox
                v-model="item.pay"
                @click.stop="
                  (item.pay = !item.pay), expanseStore.fbUpdateExpanse(item)
                "
              />
            </q-item-section>
            <q-item-section>
              <q-item-label> {{ item.name }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div>
                R$
                {{ item.mount }}
                <span v-text="item.operator == 'credit' ? '+' : '-'" />
              </div>
            </q-item-section>
          </q-item>
          <q-item-label
            header
            class="bg-grey text-white q-py-sm"
            v-if="listExpanse.filter((x) => x.pay).length"
            >Pagos</q-item-label
          >
        </q-list>

        <q-list separator v-if="listPay.length">
          <q-item-label header class="bg-grey text-white q-py-sm"
            >Pagos
          </q-item-label>
          <q-item
            v-ripple
            v-for="(item, i) in listPay"
            :key="i"
            :class="item.operator == 'credit' ? 'bg-green-1' : 'bg-red-1'"
            clickable
            @click="expanseStore.fbUpdateExpanse(item)"
          >
            <q-item-section side top>
              <q-checkbox
                v-model="item.pay"
                @click.stop="
                  (item.pay = !item.pay), expanseStore.fbUpdateExpanse(item)
                "
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-strike"> {{ item.name }} </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div>
                R$
                {{ item.mount }}
                <span v-text="item.operator == 'credit' ? '+' : '-'" />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator class="separator" />
      </q-scroll-area>
    </div>

    <div v-else>
      {{ listItems }}
      <q-btn
        flat
        color="primary"
        no-caps
        icon="chevron_left"
        label="Voltar"
        to="/"
      />
      <q-icon
        alt="Sem despesas cadastradas"
        name="task"
        size="200px"
        color="grey-4"
        class="absolute-center"
      />
    </div>

    <!-- dialog add despesa -->
    <q-dialog v-model="showDialogAddDespesa">
      <addDespesa @close="showDialogAddDespesa = false" :operator="operator" />
    </q-dialog>

    <!-- btn ad despeqas -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab icon="add" direction="up" color="primary">
        <q-fab-action
          @click="(showDialogAddDespesa = true), (operator = 'credit')"
          color="green"
          icon="add"
        />
        <q-fab-action
          @click="(showDialogAddDespesa = true), (operator = 'expanse')"
          color="red"
          icon="remove"
        />
        <q-fab-action
          @click="showDialogAddDespesa = true"
          color="grey"
          icon="filter_alt"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import addDespesa from "components/despesas/addDespesa.vue";
import { useExpanseStore } from "stores/ExpanseStore";
const expanseStore = useExpanseStore();

import { useListStore } from "stores/ListStore";
const listStore = useListStore();

export default {
  name: "IndexPage",
  components: {
    addDespesa,
  },
  data() {
    return {
      expanseStore,
      showDialogAddDespesa: false,
      operator: null,
      idList: this.$route.params.id,
      deleteId: null,
      editiId: null,
    };
  },
  computed: {
    listExpanse() {
      return listStore.readListPendent;
    },
    listPay() {
      return listStore.readListPay;
    },
  },
  methods: {
    updateTask(item) {
      // item.pay = !item.pay;
      // this.deleteId = null;
      // this.editId = null;

      expanseStore.fbUpdateExpanse(item);
    },
  },
  created() {
    expanseStore.cargaGroup();
    listStore.setIdList(this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped>
.scroll-area-task {
  display: flex;
  flex-grow: 1;
}
.separator {
  border-top: 2px solid;
  border-bottom: 2px solid;
  border-color: $grey-4;
}
.motthSelect {
  border: 1px solid $grey;
  padding: 5px;
  border-radius: 10px;
}
</style>
