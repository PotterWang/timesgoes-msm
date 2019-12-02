import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login";
import Layout from "@/components/Layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    name: "layout",
    component: Layout
  }
];

const router = new VueRouter({
  // mode: "history", //历史路由 #
  base: process.env.BASE_URL,
  routes
});

export default router;
