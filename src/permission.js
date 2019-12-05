/* 
权限校验
*/
import router from "@/router/index";
import { getUserInfo } from "@/api/login.js";
//全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果获取到token
  const tokename = localStorage.getItem("timegoes-msm-token");

  if (!tokename) {
    if (to.path !== "/login") {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      next();
    } else {
      const userInfo = localStorage.getItem("timegoes-msm-user");
      if (userInfo) {
        next();
      } else {
        getUserInfo(tokename).then(response => {
          const respUser = response.data;
          if (respUser.flag) {
            localStorage.setItem(
              "timegoes-msm-user",
              JSON.stringify(respUser.data)
            );
            next();
          } else {
            localStorage.removeItem("timegoes-msm-token");
            localStorage.removeItem("timegoes-msm-user");
            next({
              path: "/login"
            });
          }
        });
      }
    }
  }
});
