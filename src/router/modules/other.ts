export default {
  path: "/:pathMatch(.*)*",
  name: "notFound",
  component: () => import("@/pages/not-found/index.vue"),
};
