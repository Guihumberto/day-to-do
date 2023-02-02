import { defineStore } from "pinia";
import { firebaseDb, auth } from "boot/firebase";
import { Notify } from "quasar";

export const useListStore = defineStore("list", {
  state: () => ({
    list: [],
    downloadOk: false,
    listItems: null,
  }),
  getters: {
    readList() {
      return this.list;
    },
    readDownload() {
      return this.downloadOk;
    },
    readListItems() {
      return this.list;
    },
  },
  actions: {
    cargaList() {
      this.list = [];
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/list`);

      // initial carga for data
      linkUser.once("value", (snapshot) => {
        this.completeDowload(true);
      });

      //child added
      linkUser.on("child_added", (snapshot) => {
        let plan = snapshot.val();
        this.list.push(plan);
      });

      //child change
      linkUser.on("child_changed", (snapshot) => {
        let plan = snapshot.val();
        this.updateList(plan);
      });

      //child remove
      linkUser.on("child_removed", (snapshot) => {
        let plan = snapshot.val();
        this.deleteList(plan);
      });
    },
    addList(item) {
      let list = {
        name: item,
        dateCreate: Date.now(),
        complete: false,
      };

      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/list/${list.dateCreate}`);
      linkUser.set(list);
      Notify.create("Nova lista adicionado!");
    },
    updateList(payload) {
      const x = this.list.map((item) =>
        item.dateCreate == payload.dateCreate ? payload : item
      );
      this.list = x;
    },
    deleteList(payload) {
      // this.plans = this.plans.filter( item => item.dateCreate != payload.dateCreate)
      let index = this.list.findIndex(
        (x) => x.dateCreate == payload.dateCreate
      );
      this.list.splice(index, 1);
    },
    fbUpdateList(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/list/${item.dateCreate}`);
      linkUser.update(item);
      Notify.create("Lista Atualizada!");
    },
    fbDeleteList(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/list/${item.dateCreate}`);
      linkUser.remove();
      Notify.create("Lista Removida!");
    },
    completeDowload(value) {
      this.downloadOk = value;
    },
  },
});
