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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="商品名称"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="searchMap.code"
          placeholder="商品编号"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <!--el-input @click是不行的 需要事件修饰符.native  -->
      <el-form-item
        label="供应商"
        prop="supplierName"
        @click.native="dialogForm_goods = true"
      >
        <el-input
          readonly
          v-model="searchMap.supplierName"
          placeholder="请选择供应商"
          style="width:200px;"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="removetrim('form_additon')"
          >新增</el-button
        >
        <!-- <el-button type="primary" @click="removetrim('form_additon')"
          >新增</el-button"
        > -->
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格主体 -->
    <el-table :data="list" height="400" border style="width: 100%">
      <!-- type="index"显示索引值 -->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="code" label="商品编号"> </el-table-column>
      <el-table-column prop="spec" label="商品规格"> </el-table-column>
      <el-table-column prop="retailPrice" label="零售价"> </el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"> </el-table-column>
      <el-table-column prop="storageNum" label="库存"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商"> </el-table-column>
      <!-- 通过 Scoped slot 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。 -->

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
    <el-dialog title="编辑商品" width="500px" :visible.sync="dialogFormVisible">
      <el-form
        :model="form_add"
        ref="form_additon"
        label-width="100px"
        label-position="right"
        style="width:400px;"
        :rules="rules"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form_add.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品编号" prop="code">
          <el-input v-model="form_add.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="form_add.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input
            v-model="form_add.retailPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input
            v-model="form_add.purchasePrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="storageNum">
          <el-input v-model="form_add.storageNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="供应商"
          prop="supplierName"
          placeholder="请选择供应商"
        >
          <el-input
            readonly
            @click.native="editOption"
            v-model="form_add.supplierName"
            autocomplete="off"
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
              : updateGoods('form_additon')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 供应商弹框 -->
    <el-dialog
      title="选择供应商"
      width="500px"
      :visible.sync="dialogForm_goods"
    >
      <suppliervue @optionsupplier="optiongoods" :isDialog="true"></suppliervue>
    </el-dialog>
  </div>
</template>

<script>
import goodsapi from "@/api/goods.js";
//导入子组件
import suppliervue from "@/views/supplier";

export default {
  data() {
    return {
      list: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      searchMap: {
        //条件查询绑定的条件值
        //重置组件有时候输入不进去，就是因为这里没有指定字段
        supplierName: "",
        name: "",
        code: ""
      },
      dialogFormVisible: false, //对话框显示与隐藏
      dialogForm_goods: false,
      form_add: {
        id: null,
        code: "",
        name: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId: ""
      },
      rules: {
        name: [{ required: true, message: "商品不能为空", trigger: "blur" }],
        code: [{ required: true, message: "编号不能为空", trigger: "blur" }], //这个是选择按钮的状态:失去焦点
        retailPrice: [
          { required: true, message: "零售价不能为空", trigger: "blur" } //这个是选择按钮的状态,需要change
        ]
      },
      isEdit: false //是否为编辑窗口还是新增窗口(选择供应商)
    };
  },
  //注册子组件
  components: { suppliervue },
  methods: {
    fetchData() {
      goodsapi
        .searchList(this.currentPage, this.pageSize, this.searchMap)
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
    //每页几条
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //当前第几页
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
          goodsapi.addGoods(this.form_add).then(response => {
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
    },
    handleEdit(id) {
      this.removetrim("form_additon");
      console.log(id);
      goodsapi.getById(id).then(response => {
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
          goodsapi.deleteGoods(id).then(response => {
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
    updateGoods(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          goodsapi.updateGoods(this.form_add).then(response => {
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
    optiongoods(currentRow) {
      console.log(currentRow);
      //currentRow为当前行的对象{name:xx//供应商名称,cardNum:xxx}
      if (this.isEdit) {
        this.form_add.supplierName = currentRow.name;
        this.form_add.supplierId = currentRow.id; //一般都要返回个id
      } else {
        this.searchMap.supplierName = currentRow.name;
        this.searchMap.supplierId = currentRow.id; //一般都要返回个id
      }
      this.isEdit = false;
      this.dialogForm_goods = false;
    },
    editOption(currentRow) {
      this.isEdit = true;
      console.log(currentRow);
      this.dialogForm_goods = true;
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
