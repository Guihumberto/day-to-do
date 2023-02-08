<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Day to do </q-toolbar-title>

        <div v-if="!authStore.readLoggedIn">Humberto</div>
        <q-btn
          v-else
          flat
          color="white"
          label="Sair"
          no-caps=""
          icon-right="logout"
          @click="authStore.logOut()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <headerSideBar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import headerSideBar from "src/components/sidebar/header.vue";
import { useAuthStore } from "stores/AuthStore";
const authStore = useAuthStore();

export default defineComponent({
  name: "MainLayout",

  components: { headerSideBar },

  setup() {
    const leftDrawerOpen = ref(false);

    authStore.handlerAuthStateChange();

    return {
      authStore,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
