<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      class="login-form"
    >
      <h2>{{ title }}</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { login, getUserInfo } from "@/api/login.js";

export default {
  data() {
    return {
      title: "时光屋会员管理系统",
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },

  methods: {
    // onSubmit() {
    //   console.log("submit!");
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.form);
          this.$store
            .dispatch("Login", this.form)
            .then(response => {
              if (response.flag) {
                //成功,此处不getUserInfo了, 路由拦截已经重新加载了用户信息
                this.$router.push("/");
              } else {
                this.$message({
                  message: response.message || "系统异常",
                  type: "warning"
                });
              }
            })
            .catch(error => {
              //这里不校验了，路由拦截里有校验
              console.log(error);
            });

          // login(this.form.username, this.form.password).then(response => {
          //   console.log(response.data);
          //   const resp = response.data;
          //   if (resp.flag) {
          //     getUserInfo(resp.data.token).then(response => {
          //       console.log(response.data);
          //       const respUser = response.data;
          //       if (respUser.flag) {
          //         localStorage.setItem(
          //           "timegoes-msm-user",
          //           JSON.stringify(respUser.data)
          //         );
          //         localStorage.setItem("timegoes-msm-token", resp.data.token);
          //         //前往首页
          //         this.$router.push("/");
          //       } else {
          //         this.$message({
          //           message: respUser.message,
          //           type: "warning"
          //         });
          //       }
          //     });
          //   } else {
          //     this.$message({
          //       message: resp.message,
          //       type: "warning"
          //     });
          //   }
          // });
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
/* 上面lang指定不能为空 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../../assets/pic.jpg);
  .login-form {
    width: 350px;
    margin: 160px auto;
    background-color: gray;
    padding: 28px;
    border-radius: 20px;
  }
  h2 {
    color: aliceblue;
    text-align: center;
  }
}
</style>
