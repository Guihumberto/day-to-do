<template>
  <q-card style="width: 800px">
    <q-card-section class="row items-center">
      <div class="text-h6">Lançamentos Recorrentes</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
      <q-input
        rounded
        v-model="filter.text"
        type="text"
        placeholder="Busca..."
        dense
        outlined
        ><template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <div class="q-gutter-sm">
        <q-radio v-model="filter.type" val="0" label="Todos" />
        <q-radio v-model="filter.type" val="credit" label="a receber" />
        <q-radio v-model="filter.type" val="expanse" label="a pagar" />
      </div>
    </q-card-section>
    <q-item-label header>
      Total de Registros: {{ listRecorrentTask.length }}</q-item-label
    >
    <q-separator />
    <q-card-section style="max-height: 50vh" class="scroll">
      <q-list separator>
        <q-item
          v-ripple
          v-for="(item, i) in listRecorrentTask"
          clickable=""
          :key="i"
          :class="item.operator == 'credit' ? 'bg-green-1' : 'bg-red-1'"
          @click="item.recorrent = !item.recorrent"
        >
          <q-item-section side top>
            <q-checkbox v-model="item.recorrent" />
          </q-item-section>
          <q-item-section>
            <q-item-label> {{ item.name }} </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div>
              {{ formatCurrency(item.mount) }}
            </div>
          </q-item-section>
          <!-- menu -->
          <q-item-section side v-if="deleteId != item.dateCreate">
            <q-btn
              color="grey-7"
              round
              flat
              icon="more_vert"
              @click.stop="true"
            >
              <q-menu cover auto-close>
                <q-list class="bg-grey-3" separator>
                  <q-item clickable @click="editTask(item)">
                    <q-item-section avatar>
                      <q-avatar icon="edit" />
                    </q-item-section>
                    <q-item-section>Editar</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="(deleteId = item.dateCreate), (editiId = null)"
                  >
                    <q-item-section avatar>
                      <q-avatar icon="delete" />
                    </q-item-section>
                    <q-item-section>Deletar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
          <!-- delete -->
          <q-item-section side class="bg-red" v-else>
            <transition
              appear
              enter-active-class="animated bounceInRight slower"
              leave-active-class="animated bounceOutRight slower"
            >
              <div class="row">
                <q-btn
                  flat
                  size="sm"
                  color="white"
                  no-caps
                  label="Cancelar"
                  @click.stop="deleteId = null"
                  dense
                />

                <q-btn
                  outline
                  size="sm"
                  color="white"
                  no-caps
                  label="Apagar"
                  @click.stop="expanseStore.fbDeleteExpanse(item)"
                  class="q-mx-sm"
                />
              </div>
            </transition>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        color="primary"
        label="Inserir a Lista"
        class="full-width"
        :disable="!listChecked.length"
        @click="addList"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { useRecorrentStore } from "stores/RecorrentStore";
const recorrentStore = useRecorrentStore();
import { useExpanseStore } from "stores/ExpanseStore";
const expanseStore = useExpanseStore();
import formatCurrency from "src/mixins/format-currency";
recorrentStore.cargaRecorrent();

export default {
  mixins: [formatCurrency],
  data() {
    return {
      deleteId: null,
      filter: {
        text: null,
        type: "0",
      },
    };
  },
  props: {
    listId: Array,
  },
  computed: {
    listRecorrentTask() {
      if (this.listId.length) {
        list = recorrentStore.readRecorrent;
        this.listId.forEach((x) => {
          let index = list.findIndex((y) => y.dateCreate == x);
          if (index > 0) {
            list.splice(index, 1);
          }
        });
      }

      if (this.filter.text) {
        let search = this.filter.text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        let exp = new RegExp(
          search.trim().replace(/[\[\]!'.@><|//\\&*()_+=]/g, ""),
          "i"
        );
        //fazer o filtro
        list = list.filter(
          (item) =>
            exp.test(
              item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            ) || exp.test(item.group.replace(".", ""))
        );
      }

      if (this.filter.type != "0") {
        list = list.filter((x) => x.operator == this.filter.type);
      }

      return list;
    },
    listChecked() {
      if (this.filter.text || this.filter.type != "0") {
        return this.listRecorrentTask;
      } else {
        return recorrentStore.readRecorrent.filter((x) => x.recorrent);
      }
    },
  },
  methods: {
    addList() {
      this.listChecked.forEach((x) => {
        x.recorrent = false;
        x.idList = this.$route.params.id;
        expanseStore.addExpanse(x);
      });
      this.$emit("close");
    },
  },
};
</script>

<style scoped></style>
