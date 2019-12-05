<template>
  <div class="header">
    <a href="#/">
      <img class="logo" src="@/assets/timg.png" width="50" height="50" />
      <span class="company">{{ title }}</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
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
  </div>
</template>

<script>
import { logout } from "@/api/login.js";
export default {
  data() {
    return {
      title: "时光屋会员管理系统"
    };
  },
  components: {},
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.$message("click on item " + command);
          break;
        case "b":
          var tokename = localStorage.getItem("timegoes-msm-token");
          logout(tokename).then(response => {
            const resp = response.data;
            //
            if (resp.flag) {
              localStorage.removeItem("timegoes-msm-token");
              localStorage.removeItem("timegoes-msm-user");

              this.$message("退出系统");
              //前往登录页
              this.$router.push("/login");
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
                duration: 500 //停留时间
              });
            }
            //
            console.log(resp);

            this.$message("退出系统");
          });

          break;

        default:
          break;
      }
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
