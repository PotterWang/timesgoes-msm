import {
  getToken,
  setToken,
  getUser,
  setUser,
  removeToken
} from "@/utils/auth";
import { login, getUserInfo, logout } from "@/api/login.js";

const user = {
  state: {
    token: getToken(), //解决页面刷新为空
    user: getUser()
  },
  getters: {},
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token);
    },
    SET_USER(state, user) {
      state.user = user;
      setUser(user);
    }
  },
  actions: {
    Login({ commit }, form) {
      //promise
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", resp.data.token);
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });

      //
    },
    //state不是载荷，不能写在{}外面
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const respUser = response.data;
            commit("SET_USER", respUser.data);
            resolve(respUser);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(response => {
            const respUser = response.data;
            commit("SET_TOKEN", "");
            commit("SET_USER", "");
            removeToken();
            resolve(respUser);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
export default user;
