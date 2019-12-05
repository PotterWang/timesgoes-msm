import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login";
import Layout from "@/components/Layout";
import Home from "@/views/home";
import goods from "@/views/goods";
import member from "@/views/member";
import staff from "@/views/staff";
import supplier from "@/views/supplier";

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
    redirect: "/home",
    component: Layout,
    children: [
      {
        path: "/home",
        component: Home,
        meta: { title: "首页" }
      },

      {
        path: "/member",
        component: member,
        meta: { title: "会员管理" }
      },
      {
        path: "/staff",
        component: staff,
        meta: { title: "员工管理" }
      },
      {
        path: "/supplier",
        component: supplier,
        meta: { title: "供应商管理" }
      }
    ]
  },
  {
    path: "/goods",
    component: Layout,
    children: [
      {
        path: "/",
        component: goods,
        meta: { title: "商品管理" }
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "history", //历史路由 #
  base: process.env.BASE_URL,
  routes
});

//在使用Element UI 时点击同一个路由，控制台报错，但不影响使用
//路由自己跳转自己控制台会报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
