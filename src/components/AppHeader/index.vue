<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/timg.png" width="50" height="50" />
      <span class="company">{{ title }}</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-back" command="b"
          >退出账号</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 修改密码框 -->
    <el-dialog title="修改密码" :visible.sync="dialogForm" width="400px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="原密码" prop="oldPass" style="width:300px">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass" style="width:300px">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" style="width:300px">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { logout } from "@/api/login.js";
import passwordapi from "@/api/password.js";
export default {
  data() {
    //自定义校验规则需要在return上面定义 并且不能用逗号 value为输入框的值 callbsck为回调,成功则callback(),失败则callback(err)
    const validateOldPass = (rule, value, callback) => {
      passwordapi.checkPwd(this.user.id, value).then(response => {
        const resp = response.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value == this.ruleForm.pass) {
        callback();
      } else {
        callback(new Error("两次输入密码不一致"));
      }
    };
    return {
      // user: JSON.parse(localStorage.getItem("timegoes-msm-user")),
      user: this.$store.state.user.user,
      title: "时光屋会员管理系统",
      dialogForm: false,
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validateOldPass, trigger: "blur" }
        ],

        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validateCheckPass, trigger: "change" } //此处校验是change增加用户体验
        ]
      },
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      }
    };
  },
  components: {},
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
    handleLogout() {
      // var tokename = localStorage.getItem("timegoes-msm-token");
      this.$store.dispatch("Logout").then(response => {
        if (response.flag) {
          //成功
          this.$router.push("/login");
        } else {
          this.$message({
            message: response.message,
            type: "warning"
          });
        }
      });
      // logout(tokename).then(response => {
      //   const resp = response.data;
      //   //
      //   if (resp.flag) {
      //     localStorage.removeItem("timegoes-msm-token");
      //     localStorage.removeItem("timegoes-msm-user");

      //     this.$message("退出系统");
      //     //前往登录页
      //     this.$router.push("/login");
      //   } else {
      //     this.$message({
      //       message: resp.message,
      //       type: "warning",
      //       duration: 500 //停留时间
      //     });
      //   }
      //   this.$message("退出系统");
      // });
    },
    validateOldPass() {},
    validatePass() {},
    validateCheckPass() {},
    handlePwd() {
      this.dialogForm = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    resetForm(Formname) {
      this.$refs[Formname].resetFields();
    },
    submitForm(Formname) {
      this.$refs[Formname].validate(valid => {
        if (valid) {
          passwordapi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then(response => {
              const resp = response.data;
              if (resp.flag) {
                //成功,都提示,且退出,跳转登录页,关闭窗户
                this.$message({
                  message: resp.message,
                  type: "success"
                });
                this.handleLogout();
                this.dialogForm = false;
              } else {
                this.$message({
                  message: resp.message,
                  type: "warning"
                });
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  .company {
    color: aliceblue;
    position: absolute;
    padding-left: 10px;
    font-size: 20px;
  }
  .logo {
    vertical-align: middle;
    padding-left: 30px;
  }
  .el-dropdown {
    float: right;
    padding-right: 50px;
    cursor: pointer;
    .el-dropdown-link {
      color: aliceblue;
      font-weight: 700;
    }
  }
}
</style>
