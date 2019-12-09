import Vue from "vue";
import Vuex from "vuex";
//导入模块插件插件
import user from "./modules/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user
  }
});
