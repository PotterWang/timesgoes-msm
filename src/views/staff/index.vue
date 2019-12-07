<template>
  <div>
    <!--:inline="true" 表单一行显示  -->
    <!-- 重置按钮  对于重置按钮,除了要写ref属性外，还要对其他的表单绑定属性(字段名prop) -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
    >
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="searchMap.username"
          placeholder="账号"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="姓名"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchOne">查询</el-button>
        <el-button type="primary" @click="removetrim('form_additon')"
          >新增</el-button
        >
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格主体 -->
    <el-table :data="memberlist" height="400" border style="width: 100%">
      <!-- type="index"显示索引值 prop绑定了后面的值  type和prop职能是不一样的-->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="salary" label="薪酬"> </el-table-column>
      <el-table-column prop="entryDate" label="入职时间"> </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 表格底部分页功能 -->
    <div class="block">
      <!-- <span class="demonstration">完整功能</span> -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
        <!-- layout="total, sizes, prev, pager, next, jumper" 制定了完整功能中的各个组件-->
      </el-pagination>
    </div>

    <!-- 新增窗口
    :visible.sync="dialogFormVisible"为true时，弹出窗口
     -->
    <el-dialog
      title="编辑员工信息"
      width="500px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="form_add"
        ref="form_additon"
        label-width="100px"
        label-position="right"
        style="width:400px;"
        :rules="rules"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="form_add.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form_add.name" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="年龄" prop="age">
          <el-input v-model="form_add.age" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="电话" prop="mobile">
          <el-input v-model="form_add.mobile" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item label="薪酬" prop="salary">
          <el-input v-model="form_add.salary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <!-- value-format="yyyy-MM-dd" 指定日期格式-->
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="入职时间"
            v-model="form_add.entryDate"
            style="width:200px;"
            autocomplete="off"
          ></el-date-picker
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            form_add.id == null
              ? addData('form_additon')
              : updateStaff('form_additon')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffapi from "@/api/staff.js";

export default {
  data() {
    return {
      memberlist: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      searchMap: {
        //条件查询绑定的条件值
        //重置组件有时候输入不进去，就是因为这里没有指定字段
        username: "",
        name: ""
      },
      dialogFormVisible: false, //对话框显示与隐藏
      form_add: {
        id: null,
        username: "",
        name: "",
        age: "",
        salary: "",
        mobile: "",
        entryDate: ""
      },
      rules: {
        username: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
       
      }
    };
  },
  created() {
    this.searchOne();
  },
  methods: {
    //重置按钮  对于重置按钮,除了要写ref属性外，还要对其他的表单绑定属性
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // val是以下两个函数最新的页数和条数 val会自动获取
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchOne();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchOne();
    },

    searchOne() {
      staffapi
        .searchList(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          console.log(resp);
          
          this.total = resp.data.total;
          // this.pageSize = resp.data.pageSize;
          // this.currentPage = resp.data.currentPage;
          //此处就不改变pageSize,currentPage的值,有特定函数会调用
          this.memberlist = resp.data.rows;
        });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffapi.addStaff(this.form_add).then(response => {
            console.log(response.data);
            const resp = response.data;
            if (resp.flag) {
              //成功
              this.$message({
                message: "新增成功，初始密码为123456",
                type: "warning"
              });
              this.searchOne();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removetrim(formName) {
      //由于先点击后加载dom，有异步操作
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    handleEdit(id) {
      this.removetrim("form_additon");
      staffapi.getById(id).then(response => {
        console.log(response.data);
        const resp = response.data;
        if (resp.flag) {
          //成功
          this.form_add = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "warning"
          });
        }
      });
    },
    updateStaff(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          staffapi.updateStaff(this.form_add).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              //成功
              this.searchOne();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleDelete(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffapi.deleteStaff(id).then(response => {
            console.log(response.data);
            const resp = response.data;
            if (resp.flag) {
              //成功
              this.searchOne();
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  
};
</script>

<style scoped>
.demo-form-inline {
  margin-top: 18px;
  margin-left: 20px;
}
.block {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
