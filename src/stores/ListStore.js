import { defineStore } from "pinia";
import { firebaseDb, auth } from "boot/firebase";
import { Notify } from "quasar";

export const useListStore = defineStore("list", {
  state: () => ({
    list: [],
    downloadOk: false,
    listItems: null,
    idList: null,
  }),
  getters: {
    readList() {
      let values = this.list.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));
      return values;
    },
    readDownload() {
      return this.downloadOk;
    },
    readListItems() {
      let id = this.idList;
      let list = [];
      let litim = this.list.filter((x) => x.dateCreate == id)[0].tasks;

      for (const property in litim) {
        list.push(litim[property]);
      }

      let values = list.filter(function (a) {
        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
      }, Object.create(null));

      return values;
    },
    readListPendent() {
      return this.readListItems.filter((x) => !x.pay);
    },
    readListPay() {
      return this.readListItems.filter((x) => x.pay);
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
    setIdList(item) {
      this.idList = item;
    },
  },
});
