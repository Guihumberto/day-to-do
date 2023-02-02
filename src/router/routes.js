const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "Lista",
      },
      {
        path: "/todo/:id",
        component: () => import("pages/Todo.vue"),
        name: "Despesas",
      },
      {
        path: "/auth",
        component: () => import("pages/Auth.vue"),
        name: "Login",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
