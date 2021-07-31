<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div style="margin-top: 15px">
              <el-input placeholder="请输入内容" v-model="input2">
                <template slot="append">
                  <el-button @click="search">查询</el-button>
                </template>
              </el-input>
            </div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div
            class="grid-content bg-purple"
            style="padding-top: 15px; padding-left: 100px"
          >
            <el-button type="primary" @click="add">添加</el-button>
          </div></el-col
        >
      </el-row>

      <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="state(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="data">
            <el-button size="mini" @click="sear(data.row)">查看</el-button>
            <el-button size="mini" @click="del(data.row.id)">删除</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-end"
            >
              <el-button size="mini" @click="f(data.row)">分配角色</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加" :visible.sync="dialogVisible" width="30%">
        <el-form label-width="80px" :model="ruleForm" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" type="text"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add1">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改" :visible.sync="dialogVisible1" width="30%">
        <el-form label-width="80px" :model="ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="ruleForm1.username"
              type="text"
              disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm1.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ruleForm1.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="xiu">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="分配角色" :visible.sync="dialogFormVisible">
        <el-form :model="role">
          <el-form-item label="当前的用户" prop="">
            {{ role.username }}
          </el-form-item>
          <el-form-item label="当前的角色" prop="">
            {{ role.role_name }}
          </el-form-item>
          <el-form-item label="分配新角色" prop="">
            <el-select v-model="role.rig" placeholder="请选择新角色">
              <el-option
                :value="item.id"
                v-for="item in reul"
                :label="item.roleName"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="fe">确 定</el-button>
        </div>
      </el-dialog>

      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: 0,
      input2: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogFormVisible: false,
      ruleForm: {
        id: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      reul: [],
      role: {
        username: "",
        role_name: "",
        rig: "",
      },
      ruleForm1: {
        id: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      form: {},
      //验证规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        mobile: [{ required: true, message: "手机号不能为空" }],
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    //列表索引号
    indexMethod(index) {
      return index + 1;
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.query();
    },
    //渲染用户列表
    query() {
      this.myaxios
        .get("users", {
          params: {
            query: this.input2,
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.data.users;
          this.total = res.data.data.total;
        });
    },
    //修改用户状态
    state(userState) {
      this.myaxios
        .put(`users/${userState.id}/state/${userState.mg_state}`)
        .then((res) => {
          if (res.data.meta.status == 200) {
            // userState.mg_state = !userState.mg_state;
            this.$message({
              showClose: true,
              message: "恭喜你,修改用户状态成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: "修改用户状态失败",
              type: "error",
            });
          }
        });
    },
    //添加用户
    add1() {
      this.myaxios.post("users", qs.stringify(this.ruleForm)).then((res) => {
        console.log(res);
        this.query();
      });
      this.dialogVisible = false;
    },
    add() {
      this.dialogVisible = true;
    },
    //删除用户
    del(id) {
      this.myaxios.delete("users/" + id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          this.query();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //查看修改用户
    sear(data) {
      this.dialogVisible1 = true;
      this.ruleForm1 = data;
      // this.ruleForm1.username = data.username
      // this.ruleForm1.email = data.email
      // this.ruleForm1.mobile = data.mobile
    },
    //确定修改用户
    xiu() {
      this.myaxios
        .put(`users/${this.ruleForm1.id}`, this.ruleForm1)
        .then((res) => {
          console.log(res);
          this.query();
        });
      this.dialogVisible1 = false;
    },
    //查询用户
    search() {
      this.query();
    },
    //分配角色
    f(data) {
      console.log(data);
      this.myaxios.get("roles").then((res) => {
        this.reul = res.data.data;
        console.log(this.reul);
        this.role.username = data.username;
        this.role.role_name = data.role_name;
        this.role.id = data.id;
      });
      this.dialogFormVisible = true;
    },
    //确定分配角色
    fe() {
      this.myaxios
        .put(`users/${this.role.id}/role`, {
          rid: this.role.rig,
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
             this.query();
            this.$message({
              message: "更新角色成功",
              type: "success",
            });
            
            this.dialogFormVisible = false;
          }
        });
    },
  },
};
</script>

<style >
.box-card {
  margin-top: 10px;
}
</style>