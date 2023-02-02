import { defineStore } from "pinia";
import { firebaseDb, auth } from "boot/firebase";
import { Notify } from "quasar";

export const useExpanseStore = defineStore("expanse", {
  state: () => ({
    listExpanse: [],
    downloadOk: false,
    listExpanseGroup: [
      "Cartão de Crédito",
      "Mercado",
      "Transporte",
      "Lanches",
      "Moradia",
    ],
    listCreditGroup: ["Salário", "Aluguel"],
  }),
  getters: {
    readListExpanse() {
      return this.listExpanse;
    },
    readDownload() {
      return this.downloadOk;
    },
    readExpanseList() {
      return this.listExpanseGroup;
    },
    readCreditList() {
      return this.listCreditGroup;
    },
  },
  actions: {
    cargaExpanse(idList) {
      this.listExpanse = [];
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(`/todo/${userUid}/list/${idList}/tasks`);

      // initial carga for data
      linkUser.once("value", (snapshot) => {
        this.completeDowload(true);
      });

      //child added
      linkUser.on("child_added", (snapshot) => {
        let plan = snapshot.val();
        this.listExpanse.push(plan);
      });

      //child change
      linkUser.on("child_changed", (snapshot) => {
        let plan = snapshot.val();
        this.updateExpanse(plan);
      });

      //child remove
      linkUser.on("child_removed", (snapshot) => {
        let plan = snapshot.val();
        this.deleteExpanse(plan);
      });
    },
    addExpanse(item) {
      let expanse = {
        idList: item.idList,
        name: item.name,
        group: item.group,
        mount: item.mount,
        dateCreate: Date.now(),
        pay: item.pay,
        recorrent: item.recorrent,
        operator: item.operator,
        mounthYear: item.mounthYear,
      };
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/list/${expanse.idList}/tasks/${expanse.dateCreate}`
      );
      linkUser.set(expanse);
      Notify.create("Entrada adicionado!");
    },
    updateExpanse(payload) {
      const x = this.listExpanse.map((item) =>
        item.dateCreate == payload.dateCreate ? payload : item
      );
      this.listExpanse = x;
    },
    deleteExpanse(payload) {
      // this.plans = this.plans.filter( item => item.dateCreate != payload.dateCreate)
      let index = this.listExpanse.findIndex(
        (x) => x.dateCreate == payload.dateCreate
      );
      this.listExpanse.splice(index, 1);
    },
    fbUpdateExpanse(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/list/${item.idList}/tasks/${item.dateCreate}`
      );
      linkUser.update(item);
      Notify.create("Entrada Atualizada!");
    },
    fbDeleteExpanse(item) {
      let userUid = auth.currentUser.uid;
      let linkUser = firebaseDb.ref(
        `/todo/${userUid}/list/${item.idList}/tasks/${item.dateCreate}`
      );
      linkUser.remove();
      Notify.create("Entrada Removida!");
    },
    completeDowload(value) {
      this.downloadOk = value;
    },
    findGroupCreate(item) {
      let find = null;
      if (item.type == "credit") {
        find = this.listCreditGroup.find(
          (x) => x.toLowerCase() == item.name.toLowerCase()
        );
      } else {
        find = this.listExpanseGroup.find(
          (x) => x.toLowerCase() == item.name.toLowerCase()
        );
      }
      return !!find;
    },
    addGroup(item) {
      console.log(this.findGroupCreate(item));
      if (this.findGroupCreate(item)) {
        Notify.create("Já existe um Grupo Cadastradom com esse nome!");
      } else {
        let expanseGroup = item.name;

        if (item.type == "credit") {
          let userUid = auth.currentUser.uid;
          let linkUser = firebaseDb.ref(
            `/todo/${userUid}/group/credit/${expanseGroup}`
          );
          linkUser.set(expanseGroup);
          this.listCreditGroup.push(expanseGroup);
          Notify.create("Novo Grupo Cadastrado!");
        } else {
          let userUid = auth.currentUser.uid;
          let linkUser = firebaseDb.ref(
            `/todo/${userUid}/group/expanse/${expanseGroup}`
          );
          linkUser.set(expanseGroup);
          this.listExpanseGroup.push(expanseGroup);
          Notify.create("Novo Grupo Cadastrado!");
        }
      }
    },
    cargaGroup() {
      let userUid = auth.currentUser.uid;
      let Credit = firebaseDb.ref(`/todo/${userUid}/group/credit`);
      let Expanse = firebaseDb.ref(`/todo/${userUid}/group/expanse`);

      //child added
      Credit.on("child_added", (snapshot) => {
        let plan = snapshot.val();

        this.listCreditGroup.push(plan);
      });

      Expanse.on("child_added", (snapshot) => {
        let plan = snapshot.val();
        this.listExpanseGroup.push(plan);
      });
    },
  },
});
