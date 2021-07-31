<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        :closable="false"
        title="注意：只允许为第三级分类设置参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <span class="demonstration">请选择商品分类：</span>
      <el-cascader
        v-model="form.goods_cat"
        :options="options"
        :props="defau"
        @change="handleChange"
      ></el-cascader>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="many">
          <el-button :disabled="isBtnDisabled" @click="add">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button :disabled="isBtnDisabled">添加属性</el-button></el-tab-pane
        >
        <!-- <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" :index="indexMethod"> </el-table-column>
          <el-table-column prop="attr_name" label="参数名称" width="300">
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="sear(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table> -->

        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                v-for="(item, index) in scope.row.attr_vals"
                :key="index"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, index)"
                >{{ item }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="sear(scope.row)"
              ></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="动态参数" :label-width="formLabelWidth">
              <el-input v-model="form.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addList">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑动态参数" :visible.sync="dialogFormVisible1">
          <el-form :model="form">
            <el-form-item label="动态参数" :label-width="formLabelWidth">
              <el-input v-model="form.attr_name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updata">确 定</el-button>
          </div>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicTags: ["标签一", "标签二", "标签三"],
      inputVisible: false,
      inputValue: "",

      item: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      dialogFormVisible1: false,
      manyList: [], //存放动态数据的
      onlyList: [], //存放静态数据的
      tableData: [],
      form: {
        attr_name: "",
        goods_cat: "",
        attr_id: "",
      },

      activeName: "many",
      options: [],
      defau: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        goods_cat: "",
        children: "children",
      },
    };
  },
  methods: {
    //获取列表数据
    getList() {
      this.myaxios
        .get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName,
          },
        })
        .then((res) => {
          res.data.data.map((item) => {
            item.attr_vals =
              item.attr_vals.length === "0" ? [] : item.attr_vals.split(" ");
          });
          console.log(res);
          this.tableData = res.data.data;
        });
      if (this.activeName === "many") {
        this.manyList = this.tableData;
      } else {
        this.onlyList = this.tableData;
      }
    },
    //添加参数
    add() {
      this.dialogFormVisible = true;
    },
    //确定添加参数
    addList() {
      this.myaxios
        .post(`categories/${this.cateId}/attributes`, {
          attr_name: this.form.attr_name,
          attr_sel: this.activeName,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 201) {
            this.$message.success("添加参数成功");
            this.dialogFormVisible = false;
            this.getList();
          } else {
            this.$message.error("添加参数失败");
          }
        });
    },
    //根据iD查询参数
    sear(data) {
      console.log(data);
      this.dialogFormVisible1 = true;
      this.form.attr_id = data.attr_id;
      this.form.attr_name = data.attr_name;
    },
    //确定修改
    updata() {
      this.myaxios
        .put(`categories/${this.cateId}/attributes/${this.form.attr_id}`, {
          attr_name: this.form.attr_name,
          attr_sel: this.activeName,
        })
        .then((res) => {
          console.log(res);
          this.dialogFormVisible1 = false;
          this.getList();
        });
    },

    //获取分类列表数据
    handleChange() {
      this.myaxios.get("categories").then((res) => {
        this.options = res.data.data;
        console.log(res.data.data);
      });
      if (this.form.goods_cat.length == 3) {
        this.getList();
      }
    },
    //判断是静态数据或是动态数据
    handleClick() {
      this.getList();
    },
    //index索引
    indexMethod(index) {
      return index + 1;
    },

    showInput() {
      this.inputVisible = true;

      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //删除数据下的参数
    handleClose(row, index) {
      row.attr_vals.splice(index, 1);
      this.num(row);
    },
    handleInputConfirm(row) {
      row.attr_vals.push(this.inputValue);
      this.num(row);
      //   let inputValue = this.inputValue;
      //   if (inputValue) {
      //     this.dynamicTags.push(inputValue);
      //   }
      //   this.inputVisible = false;
      this.inputValue = "";
    },
    num(row) {
      this.myaxios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status != 200) {
            return this.$message.error("修改参数项失败");
          }
          this.$message.success("修改参数项成功");
          this.getList();
        });
    },
  },
  computed: {
    cateId() {
      if (this.form.goods_cat.length == 3) {
        return this.form.goods_cat[2];
      }
      return null;
    },
    isBtnDisabled() {
      if (this.form.goods_cat.length !== 3) {
        return true;
      }
      return false;
    },
  },
  created() {
    this.handleChange();
    this.getList();
  },
};
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>