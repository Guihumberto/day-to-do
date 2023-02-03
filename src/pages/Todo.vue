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
        <q-item-label header class="text-center bg-black text-white text-bold">
          <div>
            <h5 class="text-h6 q-my-none">{{ $route.params.list }}</h5>
            <q-space />
            <q-btn
              rounded
              label="Detalhes"
              size="xs"
              color="grey-8"
              icon="loupe"
              @click="showDetails = true"
            />
          </div>
          <div class="row text-caption">
            <div class="col-6">
              <span class="text-green">P: {{ total.pago }}</span>
            </div>
            <div class="col-6">
              <span class="text-blue">R: {{ total.recebido }}</span>
            </div>
            <div class="col-6">
              <span class="text-red">D: {{ total.devendo }}</span>
            </div>
            <div class="col-6">
              <span class="text-orange">F: {{ total.falta }}</span>
            </div>
          </div>
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
                {{ formatCurrency(item.mount) }}
                <q-icon
                  :name="
                    item.operator == 'credit'
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'
                  "
                />
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
                {{ formatCurrency(item.mount) }}
                <q-icon
                  :name="
                    item.operator == 'credit'
                      ? 'keyboard_arrow_up'
                      : 'keyboard_arrow_down'
                  "
                />
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
      <div>
        <q-item-label header class="text-center bg-black text-white text-bold"
          >{{ $route.params.list }}<br />
          <small class="text-caption">
            <span class="text-red">D: 0,00</span> |
            <span class="text-green">P 0,00</span> |
            <span class="text-grey"> T: 0,00</span>
          </small>
        </q-item-label>
      </div>
    </div>

    <!-- dialog detalhes -->
    <q-dialog
      v-model="showDetails"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Resumo</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row">
            <div class="col-8">
              Valor a receber/recebido: <br />
              Valor a pagar/pagos: <br />
              <div class="text-center">
                <span class="text-bold">Saldo:</span>
              </div>
            </div>
            <div class="col">
              {{ totalResumo.recebido }} <br />
              {{ totalResumo.pago }} <br />
              {{ totalResumo.saldo }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
import formatCurrency from "src/mixins/format-currency";
import addDespesa from "components/despesas/addDespesa.vue";
import detailsDialog from "components/despesas/details.vue";
import { useExpanseStore } from "stores/ExpanseStore";
const expanseStore = useExpanseStore();

import { useListStore } from "stores/ListStore";
const listStore = useListStore();

export default {
  name: "IndexPage",
  mixins: [formatCurrency],
  components: {
    addDespesa,
    // detailsDialog,
  },
  data() {
    return {
      expanseStore,
      showDialogAddDespesa: false,
      operator: null,
      idList: this.$route.params.id,
      deleteId: null,
      editiId: null,
      showDetails: false,
    };
  },
  computed: {
    listExpanse() {
      return listStore.readListPendent;
    },
    listPay() {
      return listStore.readListPay;
    },
    total() {
      let devendo = this.listExpanse
        .filter((x) => x.operator == "expanse")
        .reduce((sum, record) => sum + record.mount, 0);

      let pago = this.listPay
        .filter((x) => x.operator == "expanse")
        .reduce((sum, record) => sum + record.mount, 0);

      let falta = this.listExpanse
        .filter((x) => x.operator == "credit")
        .reduce((sum, record) => sum + record.mount, 0);

      let recebido = this.listPay
        .filter((x) => x.operator == "credit")
        .reduce((sum, record) => sum + record.mount, 0);

      return {
        pago: this.formatCurrency(pago),
        devendo: this.formatCurrency(devendo),
        falta: this.formatCurrency(falta),
        recebido: this.formatCurrency(recebido),
      };
    },
    totalResumo() {
      var list = [...this.listExpanse, ...this.listPay];

      let recebido = list
        .filter((x) => x.operator == "credit")
        .reduce((sum, record) => sum + record.mount, 0);

      let pago = list
        .filter((x) => x.operator == "expanse")
        .reduce((sum, record) => sum + record.mount, 0);

      let saldo = list.reduce((sum, record) => sum + record.mount, 0);

      return {
        recebido: this.formatCurrency(recebido),
        pago: this.formatCurrency(pago),
        saldo: this.formatCurrency(saldo),
      };
    },
  },
  methods: {
    updateTask(item) {
      this.deleteId = null;
      this.editId = null;
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
