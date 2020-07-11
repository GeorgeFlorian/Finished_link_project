import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
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
    path: "/update",
    name: "Update",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import (/* webpackChunkName: "update" */ "../views/Update.vue")
  },
];

const router = new VueRouter({
  // mode: "history",
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
