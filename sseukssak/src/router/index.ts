import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Rename from "@/views/Rename.vue";
import Restore from "@/views/Restore.vue";
import MiniMode from "@/views/MiniMode.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/rename",
    name: "Rename",
    component: Rename,
  },
  {
    path: "/restore",
    name: "Restore",
    component: Restore,
  },
  {
    path: "/mini",
    name: "MiniMode",
    component: MiniMode,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
