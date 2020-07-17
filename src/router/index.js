import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/dhcpIP",
    name: "DHCP",
    component: () => import(/* webpackChunkName: "dhcpIP" */ "../views/DHCP.vue")
  },
  {
    path: "/staticIP",
    name: "Static",
    component: () => import(/* webpackChunkName: "staticIP" */ "../views/Static.vue")
  },
  {
    path: "/files",
    name: "FileManager",
    component: () => import(/* webpackChunkName: "staticIP" */ "../views/FileManager.vue")
  },
  {
    path: "/update",
    name: "Update",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import (/* webpackChunkName: "update" */ "../views/Update.vue")
  },
];

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  routes,
});

export default router;
