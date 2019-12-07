import axios from "axios";
//导入el组件loading
import { Loading, Message } from "element-ui";
//创建加载实例,但这里是全局的，需要放在请求拦截里面
//Loading.service(options);

//创建加载实例
const loading = {
  loadingInstance: null,
  open: function() {
    //实例为空，有则创建，无则不建立
    if (this.loadingInstance === null) {
      this.loadingInstance = function() {
        Loading.service({
          target: ".main",
          text: "拼命加载中",
          background: "rgba(0,0,0,0.5)"
        });
      };
    }
  },
  close: function() {
    //不为空则关闭,并置空
    if (this.loadingInstance !== null) {
      this.loadingInstance.close();
    }
    this.loadingInstance = null;
  }
};

//设置axios的配置
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
});

// Add a request interceptor //请求拦截
//可实现拼命加载功能loading
axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    loading.open();

    return config;
  },
  error => {
    // Do something with request error
    loading.close();

    return Promise.reject(error);
  }
);

// Add a response interceptor //响应拦截
//统一异常处理
axios.interceptors.response.use(
  response => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    loading.close();
    const resp = response.data;
    if (resp.code != 2000) {
      Message({
        message: resp.message || "系统异常",
        type: "warning",
        duration: 5000
      });
    }
    return response;
  },
  error => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    loading.close();
    //看具体code码
    console.log(error.response.status);
    Message({
      message: error.message,
      type: "error",
      duration: 5000
    });
    return Promise.reject(error);
  }
);

export default request;
