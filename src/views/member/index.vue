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
      <el-form-item label="卡号" prop="cardNum">
        <el-input
          v-model="searchMap.cardNum"
          placeholder="会员卡号"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="searchMap.name"
          placeholder="会员名称"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付类型" prop="payType">
        <el-select
          v-model="searchMap.payType"
          placeholder="支付类型"
          style="width:110px;"
        >
          <!-- 下面的typeOptions并不是data中的属性 -->
          <el-option
            v-for="item in typeOptions"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <!-- value-format="yyyy-MM-dd" 指定日期格式-->
        <el-date-picker
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="生日"
          v-model="searchMap.birthday"
          style="width:200px;"
        ></el-date-picker
      ></el-form-item>

      <el-form-item>
        <el-button type="primary" @click="searchOne">查询</el-button>
        <el-button type="primary" @click="removetrim('form_additon')"
          >新增</el-button
        >
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="memberlist" height="400" border style="width: 100%">
      <!-- type="index"显示索引值 -->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="birthday" label="生日"> </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column prop="integral" label="会员积分"> </el-table-column>
      <el-table-column prop="money" label="可用金额"> </el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
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
      title="编辑会员信息"
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
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="form_add.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form_add.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <!-- value-format="yyyy-MM-dd" 指定日期格式-->
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="生日"
            v-model="form_add.birthday"
            style="width:200px;"
            autocomplete="off"
          ></el-date-picker
        ></el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="form_add.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="form_add.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="form_add.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="payType">
          <el-select
            v-model="form_add.payType"
            placeholder="支付类型"
            style="width:120px;"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input
            v-model="form_add.address"
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
              : updateMember('form_additon')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberapi from "@/api/member.js";
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
      memberlist: [],
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页显示条数
      typeOptions, //搜索栏需要用到
      searchMap: {
        //条件查询绑定的条件值
        //重置组件有时候输入不进去，就是因为这里没有指定字段
        cardNum: "",
        birthday: "",
        name: "",
        payType: ""
      },
      dialogFormVisible: false, //对话框显示与隐藏
      form_add: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        payType: "",
        money: "",
        integral: "",
        phone: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "支付类型不能为空", trigger: "change" } //这个是选择按钮,需要change
        ]
      }
    };
  },
  created() {
    this.searchOne();
    // this.fetchData();
  },
  methods: {
    //重置按钮  对于重置按钮,除了要写ref属性外，还要对其他的表单绑定属性
    resetForm(formName) {
      console.log("sads");
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
      memberapi
        .searchList(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
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
          memberapi.addMember(this.form_add).then(response => {
            console.log(response.data);
            const resp = response.data;
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
      console.log("dsad");
    },
    removetrim(formName) {
      //由于先点击后加载dom，有异步操作
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    handleEdit(id) {
      console.log(id);
      this.removetrim("form_additon");
      memberapi.getById(id).then(response => {
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
    updateMember(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          memberapi.updateMember(this.form_add).then(response => {
            console.log(response.data);
            const resp = response.data;
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
          memberapi.deleteMember(id).then(response => {
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

    // fetchData() {
    //   //以下接口出问题,只能promise异步加载重写接口 模仿多次promise接口调用
    //   var newList = [];
    //   memberapi
    //     .getList()
    //     .then(response => {
    //       const resp = response.data;
    //       // console.log(resp);
    //       // var newList = []; //copy
    //       resp.data.id = Math.floor(Math.random() * 1000 + 11);
    //       newList.push(resp.data);
    //       this.memberlist = newList;
    //       // console.log(this.memberlist);
    //       return memberapi.getList();
    //     })
    //     .then(response => {
    //       const resp = response.data;
    //       // console.log(resp);
    //       // var newList = []; //copy
    //       resp.data.id = Math.floor(Math.random() * 1000 + 11);
    //       newList.push(resp.data);
    //       this.memberlist = newList;
    //       // console.log(this.memberlist);
    //       return memberapi.getList();
    //     });
    //   }
  },
  components: {},
  filters: {
    payTypeFilter(type) {
      //在过滤器中不能引用当前vue实例中的data数据
      const payobj = typeOptions.find(obj => obj.type == type);
      return payobj ? payobj.name : null;
    }
  }
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
