module.exports = {
  devServer: {
    port: 8888,
    https: false,
    host: "localhost",
    open: true,
    //<开发环境>代理
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL, //目标服务器地址
        changeOrigin: true, //开启代理服务器
        pathRewrite: {
          //将请求地址替换为空的 /dev-api
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  lintOnSave: false,
  productionSourceMap: false
};
