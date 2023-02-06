import { defineStore } from "pinia";
import { firebaseDb, auth } from "boot/firebase";
import { Notify } from "quasar";

export const useRecorrentStore = defineStore("recorrent", {
  state: () => ({
    listRecorrent: [],
    downloadOK: false,
  }),
  getters: {
    readRecorrent() {
      return this.listRecorrent;
    },
  },
  actions: {
    cargaRecorrent() {
      this.listRecorrent = [];
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/recorrent`);

      // initial carga for data
      linkUser.once("value", (snapshot) => {
        this.completeDowload(true);
      });

      //child added
      linkUser.on("child_added", (snapshot) => {
        let plan = snapshot.val();
        this.listRecorrent.push(plan);
      });

      //child change
      linkUser.on("child_changed", (snapshot) => {
        let plan = snapshot.val();
        this.updateRecorrent(plan);
      });

      //child remove
      linkUser.on("child_removed", (snapshot) => {
        let plan = snapshot.val();
        this.deleteRecorrent(plan);
      });
    },
    addTaskrecorret(item) {
      item.idList = null;
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/recorrent/${item.dateCreate}`
      );
      linkUser.set(item);
      Notify.create("Lançamento recorrente adicionado a lista!");
    },
    completeDowload(value) {
      this.downloadOK = value;
    },
    updateRecorrent(payload) {
      const x = this.listRecorrent.map((item) =>
        item.dateCreate == payload.dateCreate ? payload : item
      );
      this.listRecorrent = x;
    },
    deleteRecorrent(payload) {
      let index = this.listRecorrent.findIndex(
        (x) => x.dateCreate == payload.dateCreate
      );
      this.listRecorrent.splice(index, 1);
    },
    fbUpdateExpanse(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/recorrent/${item.dateCreate}`
      );
      linkUser.update(item);
      Notify.create("Lançamento Atualizado!");
    },
    fbDeleteExpanse(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/recorrent/${item.dateCreate}`
      );
      linkUser.remove();
      Notify.create("Lançamento Removido da lista de recorrente!");
    },
  },
});
