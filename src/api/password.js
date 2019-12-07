import request from "@/utils/request"; //在同一src路径下

export default {
  //校验密码
  checkPwd(userId, password) {
    return request({
      url: `/user/pwd`,
      method: "post",
      data: {
        userId,
        password
      }
    });
  },
  //修改密码
  updatePwd(userId, password) {
    return request({
      url: `/user/pwd`,
      method: "put",
      data: {
        userId,
        password
      }
    });
  }
};
