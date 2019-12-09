//此文件为工具 封装函数:保存用户信息工具
const TOKEN_KEY = "timegoes-msm";
const USER_KEY = "timegoesuser";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
