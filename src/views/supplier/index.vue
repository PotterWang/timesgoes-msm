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
      <el-form-item label="供应商" prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="供应商"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="linkman" v-if="!isDialog">
        <el-input
          v-model="searchMap.linkman"
          placeholder="联系人"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile" v-if="!isDialog">
        <el-input
          v-model="searchMap.mobile"
          placeholder="电话"
          style="width:200px;"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button
          type="primary"
          @click="removetrim('form_additon')"
          v-if="!isDialog"
          >新增</el-button
        >
        <!-- <el-button type="primary" @click="removetrim('form_additon')"
          >新增</el-button"
        > -->
        <el-button @click="resetForm('searchForm')" v-if="!isDialog"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 表格主体 -->

    <!-- Table 组件提供了单选的支持，只需要配置highlight-current-row属性即可实现单选。
    之后由current-change事件来管理选中时触发的事件@current-change="handleChange"，它会传入currentRow，oldCurrentRow。
    如果需要显示索引，可以增加一列el-table-column，设置type属性为index即可显示从 1 开始的索引号。 -->

    <el-table
      :data="list"
      height="400"
      border
      style="width: 100%"
      :highlight-current-row="isDialog"
      @current-change="handleChange"
    >
      <!-- type="index"显示索引值 -->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="供应商名称"> </el-table-column>
      <el-table-column prop="linkman" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="联系人电话" v-if="!isDialog">
      </el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog">
      </el-table-column>
      <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。 -->

      <el-table-column label="操作" width="150" v-if="!isDialog">
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
        :layout="
          !isDialog
            ? 'total, sizes, prev, pager, next, jumper'
            : 'prev, pager, next'
        "
        :total="total"
      >
        <!-- layout="total, sizes, prev, pager, next, jumper" 制定了完整功能中的各个组件-->
      </el-pagination>
    </div>

    <!-- 新增窗口
    :visible.sync="dialogFormVisible"为true时，弹出窗口
     -->
    <el-dialog
      v-if="!isDialog"
      title="编辑供应商"
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
        <el-form-item label="供应商" prop="name">
          <el-input v-model="form_add.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form_add.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form_add.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form_add.remark"
            autocomplete="off"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            form_add.id == null
              ? addData('form_additon')
              : updateSupplier('form_additon')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierapi from "@/api/supplier.js";
const typeOptions = [
  {
    type: "1",
    name: "支付宝"
  },
  {
    type: "2",
    name: "微信"
  },
  {
    type: "3",
    name: "现金"
  },
  {
    type: "4",
    name: "银行卡"
  }
];
export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      typeOptions, //搜索栏需要用到
      searchMap: {
        //条件查询绑定的条件值
        //重置组件有时候输入不进去，就是因为这里没有指定字段
        linkman: "",
        name: "",
        mobile: ""
      },
      dialogFormVisible: false, //对话框显示与隐藏
      form_add: {
        id: null,
        linkman: "",
        name: "",
        mobile: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "供应商不能为空", trigger: "blur" }],
        linkname: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ], //这个是选择按钮的状态:失去焦点
        mobile: [
          { required: true, message: "电话不能为空", trigger: "blur" } //这个是选择按钮的状态,需要change
        ]
      }
    };
  },
  components: {},
  props: {
    //子组件接收父组件的传值
    isDialog: Boolean
  },
  methods: {
    fetchData() {
      supplierapi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          //接口这里有个坑.data.data.rows
          this.list = resp.data.rows;
          this.total = resp.data.total;
          // if (resp.flag) {
          //   //成功
          //   this.list = resp.data;
          // } else {
          //   this.message({
          //     message: resp.message,
          //     type: "warning"
          //   });
          // }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removetrim(formName) {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierapi.addSupplier(this.form_add).then(response => {
            console.log(response.data);
            const resp = response.data;
            if (resp.flag) {
              //成功
              this.fetchData();
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
      console.log("dsad");
    },
    handleEdit(id) {
      this.removetrim("form_additon");
      console.log(id);
      supplierapi.getById(id).then(response => {
        const resp = response.data;
        console.log(resp);
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
    handleDelete(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierapi.deleteSupplier(id).then(response => {
            console.log(response.data);
            const resp = response.data;
            if (resp.flag) {
              //成功
              this.fetchData();
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
    },
    updateSupplier(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierapi.updateSupplier(this.form_add).then(response => {
            const resp = response.data;
            console.log(response.data);
            if (resp.flag) {
              //成功
              this.fetchData();
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
    handleChange(currentRow) {
      console.log(currentRow);
      this.$emit("optionsupplier", currentRow);
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.demo-form-inline {
  margin-top: 18px;
  margin-left: 20px;
}
.block {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
