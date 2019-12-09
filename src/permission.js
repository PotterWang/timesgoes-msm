/* 
权限校验
*/
import router from "@/router/index";
import store from "@/store";

//全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果获取到token
  const tokename = store.state.user.token;

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
      const userInfo = store.state.user.user;
      //user是模块名 在.user是模块中的数据
      // const userInfo = localStorage.getItem("timegoes-msm-user");
      if (userInfo) {
        next();
      } else {
        store.dispatch("GetUserInfo").then(response => {
          //response已经是data数据le
          if (response.flag) {
            //成功
            next();
          } else {
            next({
              path: "/login"
            });
          }
        });
        // getUserInfo(tokename).then(response => {
        //   const respUser = response.data;
        //   if (respUser.flag) {
        //     localStorage.setItem(
        //       "timegoes-msm-user",
        //       JSON.stringify(respUser.data)
        //     );
        //     next();
        //   } else {
        //     localStorage.removeItem("timegoes-msm-token");
        //     localStorage.removeItem("timegoes-msm-user");
        //     next({
        //       path: "/login"
        //     });
        //   }
        // });
      }
    }
  }
});
