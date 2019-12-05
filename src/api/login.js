import request from "@/utils/request"; //在同一src路径下

export function login(username, password) {
  return request({
    url: "/user/login",
    method: "post",
    data: {
      username,
      password
    }
  });
}

export function getUserInfo(token) {
  return request({
    url: `/user/info/${token}`,
    method: "get"
  });
}

export function logout(token) {
  return request({
    url: `/user/logout`,
    method: "post",
    data: {
      token
    }
  });
}
