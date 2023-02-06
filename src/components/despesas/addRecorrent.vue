<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Lançamentos Recorrentes</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <q-card-section>
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
      <v-space></v-space>
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
  props: {
    listId: Array,
  },
  computed: {
    listRecorrentTask() {
      let list = recorrentStore.readRecorrent;
      if (this.listId.length) {
        this.listId.forEach((id) => {
          let index = recorrentStore.readRecorrent.findIndex(
            (x) => x.dateCreate == id
          );
          list.splice(index, 1);
        });
      }

      return list;
    },
    listChecked() {
      return recorrentStore.readRecorrent.filter((x) => x.recorrent);
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
