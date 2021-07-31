<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button class="bu" @click="add">添加分类</el-button>
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:level="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag
            size="mini"
            type="warning"
            v-else-if="scope.row.cat_level === 2"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="sear(scope.row)"
            >编辑</el-button
          >
          <el-button type="warning" icon="el-icon-delete" size="mini" @click="delect(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="ruleForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- <el-cascader
              v-model="ruleForm.cat_level"
              :options="options"
              :props="defau"
              @change="handleChange"
            ></el-cascader> -->
            <el-cascader
            v-model="ruleForm.cat_level"
              :options="options"
              :props="defau"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="getList">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改分类" :visible.sync="dialogFormVisible1">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="ruleForm.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- <el-cascader
              v-model="ruleForm.cat_level"
              :options="options"
              :props="defau"
              @change="handleChange"
            ></el-cascader> -->
            <el-cascader
            v-model="ruleForm.cat_level"
              :options="options"
              :props="defau"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updata">确 定</el-button>
        </div>
      </el-dialog>
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.from.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="this.from.pagesize"
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
      catelist: [],
      total: 0,
      value: "",
      options: [],
      dialogFormVisible: false,
       dialogFormVisible1: false,
      from: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      defau: {
        checkStrictly: "true",
        label: "cat_name",
        value: "cat_id",
        cat_name: "",
        children: "children",
      },
      ruleForm: {
        cat_id:"",
        cat_pid:"",
        cat_name: "",
        cat_level: "0",
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "level",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.myaxios
        .get("categories", {
          params: this.from,
        })
        .then((res) => {
          console.log(res);
          this.catelist = res.data.data.result;
          this.total = res.data.data.total;
        });
    },
    //添加
    getList() {
      this.myaxios
        .post("categories", {
          cat_pid: this.ruleForm.cat_level[this.ruleForm.cat_level.length-1],
          cat_name: this.ruleForm.cat_name,
          cat_level: this.ruleForm.cat_level.length - 1,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status != 201) {
            return this.$message.error("添加失败");
          }
          this.$message.success("添加成功");
          this.query();
          this.dialogFormVisible = false;
        });
    },
    //删除
  delect(id){
    this.myaxios.delete(`categories/${id}`).then(res=>{
      console.log(res)
      if(res.data.meta.status !=200){
        return this.$message.error("删除失败")
      }
      this.$message.success("删除成功")
      this.query()
    })
  },
  sear(data){
    this.ruleForm.cat_id = data.id
    this.dialogFormVisible1 = true
    this.ruleForm = data
     
  },

  //修改
  updata(){
    this.myaxios.put(`categories/${this.ruleForm.cat_id}`,{
      cat_name:this.ruleForm.cat_name
    }).then(res=>{
      console.log(res)
      if(res.data.meta.status !=200){
        return this.$message.error("修改失败")
      }
      this.$message.success("修改成功")
      this.query()
      this.dialogFormVisible1 = false
    })
  },
    add() {
      this.dialogFormVisible = true;
      this.myaxios
        .get("categories", {
          params: {
            type: 2,
          },
        })
        .then((res) => {
          this.options = res.data.data;
        });
    },
    handleSizeChange(val) {
      this.from.pagesize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.from.pagenum = val;
      this.query();
    },
  },
};
</script>
<style scoped>
.bu {
  margin: 15px 0;
}
</style>