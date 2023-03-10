<template>
  <q-page>
    <template v-if="readDownload">
      <div class="absolute full-width full-height column">
        <transition
          appear
          enter-active-class="animated fadeInDown slower"
          leave-active-class="animated fadeOut slower"
        >
          <div v-if="isAutoFocus || list.length">
            <q-item>
              <q-item-section>
                <q-input
                  outlined
                  dense
                  v-model="nameList"
                  type="text"
                  label="Lista"
                  placeholder="Digite o nome da lista"
                  @keydown.enter="saveList()"
                  @keydown.esc="nameList = null"
                  autofocus
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  rounded
                  size="md"
                  color="green"
                  label="Criar"
                  :disable="!nameList"
                  @click="saveList()"
                />
              </q-item-section>
            </q-item>
            <q-separator class="separator" />
          </div>
        </transition>
        <q-scroll-area class="scroll-area-task">
          <transition
            appear
            enter-active-class="animated fadeIn slower"
            leave-active-class="animated fadeOut slower"
          >
            <q-list separator>
              <q-item
                v-ripple
                v-for="(item, i) in list"
                :key="i"
                :clickable="!idEdit"
                @click.stop="goTo(item)"
                :class="idDelete == item.dateCreate ? 'bg-red' : 'white'"
              >
                <q-item-section avatar>
                  <q-icon :name="!item.complete ? 'list' : 'check'" />
                </q-item-section>
                <q-item-section v-if="idEdit != item.dateCreate">
                  <q-item-label>
                    {{ item.name }}
                  </q-item-label>
                  <q-item-label caption lines="1">
                    {{
                      item.tasks ? qtdItems(item.tasks).qtd + " Items" : "Vazio"
                    }}
                  </q-item-label>
                </q-item-section>

                <!-- editar -->

                <q-item-section v-else>
                  <q-item-label>
                    <div class="row">
                      <q-input
                        outlined
                        dense
                        v-model="nameListEdit"
                        type="text"
                        label="Lista"
                        placeholder="Digite o nome da lista"
                        @keydown.enter="editList(item)"
                        @keydown.esc="nameListEdit = null"
                        autofocus
                        class="col"
                      />
                      <q-btn
                        flat
                        dense
                        round
                        color="grey"
                        icon="close"
                        class="col col-shrink"
                        @click.stop="(idEdit = null), (nameListEdit = null)"
                      />
                    </div>
                  </q-item-label>
                </q-item-section>

                <!-- deletar -->
                <q-item-section side v-if="idDelete == item.dateCreate">
                  <div>
                    <q-btn
                      class="q-mt-sm q-mr-sm c"
                      no-caps=""
                      flat
                      size="sm"
                      dense
                      color="white"
                      label="Cancelar"
                      @click="idDelete = null"
                    />
                    <q-btn
                      class="q-mt-sm q-mr-sm"
                      outline
                      size="sm"
                      dense
                      color="white"
                      label="Deletar"
                      @click="deleteList(item)"
                    />
                  </div>
                </q-item-section>

                <!-- total -->
                <q-item-section side v-else>
                  <span>{{
                    item.tasks ? qtdItems(item.tasks).saldo : ""
                  }}</span>
                </q-item-section>

                <!-- menu -->
                <q-item-section side v-if="idDelete != item.dateCreate">
                  <q-btn
                    color="grey-7"
                    round
                    flat
                    icon="more_vert"
                    @click.stop="true"
                  >
                    <q-menu cover auto-close>
                      <q-list class="bg-grey-3">
                        <q-item
                          clickable
                          @click="
                            (idEdit = item.dateCreate),
                              (idDelete = null),
                              (nameListEdit = item.name)
                          "
                        >
                          <q-item-section>Editar</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          @click="(idDelete = item.dateCreate), (idEdit = null)"
                        >
                          <q-item-section>Deletar</q-item-section>
                        </q-item>
                        <q-item clickable>
                          <q-item-section>Arquivar</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </transition>
          <q-separator class="separator" />
        </q-scroll-area>
      </div>

      <div class="absolute-center" v-if="!list.length">
        <div class="text-center">
          <q-icon
            alt="Sem despesas cadastradas"
            name="add_circle_outline"
            size="100px"
            color="green-4"
            @click="goInsertList()"
          />
          <p class="text-caption text-grey">
            Clique aqui para adicionar uma nova lista
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <span class="absolute-center">
        <q-spinner color="primary" size="5em" />
      </span>
    </template>
  </q-page>
</template>

<script>
import formatCurrency from "src/mixins/format-currency";
import { useListStore } from "stores/ListStore";
const listStore = useListStore();

export default {
  name: "OtdoPage",
  mixins: [formatCurrency],
  data() {
    return {
      nameList: null,
      idEdit: null,
      idDelete: null,
      nameListEdit: null,
      isAutoFocus: false,
    };
  },
  computed: {
    list() {
      let list = listStore.readList;
      return list;
    },
    readDownload() {
      return listStore.readDownload;
    },
  },
  methods: {
    saveList() {
      listStore.addList(this.nameList);
      this.nameList = null;
    },
    editList(item) {
      this.idEdit = null;
      this.idDelete = null;
      item.name = this.nameListEdit;
      listStore.fbUpdateList(item);
    },
    deleteList(item) {
      this.idEdit = null;
      this.idDelete = null;
      listStore.fbDeleteList(item);
    },
    goInsertList() {
      this.isAutoFocus = false;
      this.isAutoFocus = true;
    },
    goTo(item) {
      this.$router.push(`todo/${item.dateCreate}/${item.name}`);
    },
    qtdItems(item) {
      let list = [];
      for (const property in item) {
        list.push(item[property]);
      }

      let values = list.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));

      let saldo = values.reduce((sum, record) => sum + record.mount, 0);

      return { qtd: values.length, saldo: this.formatCurrency(saldo) };
    },
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
