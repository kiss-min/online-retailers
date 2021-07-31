<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="active - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs
        @tab-click="tab"
        :tab-position="tabPosition"
        v-model="active"
        :before-leave="leave1"
      >
        <el-tab-pane label="基本信息">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_number">
              <el-input v-model.number="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_weight">
              <el-input v-model.number="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="ruleForm.goods_cat"
                :options="options"
                :props="defau"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form :label-position="labelPosition" label-width="80px">
            <el-form-item
              v-for="(item, index) in tabList"
              :key="index"
              :label="item.attr_name"
              prop="attr_name"
            >
              <el-checkbox-group v-model="checked">
                <el-checkbox
                  :label="item1"
                  v-for="(item1, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form :label-position="labelPosition" label-width="80px">
            <el-form-item
              :label="child.attr_name"
              v-for="(child, index) in tabList1"
              :key="index"
            >
              <el-input v-model="child.attr_vals"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://122.112.253.28:8888/api/private/v1/upload"
            ref="upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="ruleForm.goods_introduce"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          >
          </quill-editor>
          <el-button type="primary" @click="add" style="margin-top: 10px"
            >添加</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      tabList: [],
      tabList1: [],
      content: null,
      labelPosition: "top",
      checkList: "",
      editorOption: {},
      options: [],
      checked2: "",
      checked: true,
      tabPosition: "left",
      active: "0",
      defau: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        goods_cat: "",
        children: "children",
      },
     
      //上传图片的url地址
      //添加商品的表单数据
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: "", //分类的数据
        goods_introduce: "",
        attrs: [],
         pice: [], //图片数组
      },
      //添加商品的表单验证规则
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格" },
          { type: "number", message: "价格必须为数字值" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量" },
          { type: "number", message: "价格必须为数字值" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量" },
          { type: "number", message: "价格必须为数字值" },
        ],
      },
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  methods: {
    handleSuccess(responce) {
      console.log(responce);
      const array ={
        pic:responce.data.tmp_path
      }
      this.ruleForm.pice.push(array)
      console.log(array)
      // const picInfo = { pic: responce.data.tmp_path };
      // this.ruleForm.pice.push(picInfo);
    },
    handleRemove(file) {
      console.log(file);
      // // 1. 获取将要删除的图片的临时路径
      // const filePath = file.response.data.tmp_path;
      // // 2. 从pics数组中，找到这个图片对应的索引值
      // const i = this.ruleForm.pice.findIndex((x) => x.pic === filePath);
      // // 3. 调用数组的splice方法，把图片信息对象，从pics数组中移除
      // this.ruleForm.pice.splice(i, 1);
      // console.log(ruleForm.pice);
    },
    tab() {
      if (this.active == "1") {
        this.myaxios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "many",
            },
          })
          .then((res) => {
            console.log(res);
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.tabList = res.data.data;
            this.checked != this.checked;
          });
      } else if (this.active == "2") {
        this.myaxios
          .get(`categories/${this.cateId}/attributes`, {
            params: {
              sel: "only",
            },
          })
          .then((res) => {
            console.log(res);
            this.tabList1 = res.data.data;
          });
      }
    },
    handleChange() {
      this.myaxios.get("categories").then((res) => {
        this.options = res.data.data;
        console.log(res.data.data);
      });
    },
    // headerObj:{
    //   Authorization:window.sessionStorage.getItem("token")
    // },

    leave1(activeName, oldActiveName) {
      if (
        this.ruleForm.goods_cat.length == 0 ||
        this.ruleForm.goods_cat.length != 3
      ) {
        this.$message.error("请选择分类");
        return false;
      }
      return true;
    },
    // 处理图片预览效果
    handlePreview() {},
    // 处理移除图片的操作
    handleRemove() {},
    //添加
    add() {
      this.ruleForm.goods_cat = this.ruleForm.goods_cat.join(",")
      this.tabList.forEach((item) => {
        //静态数据
        this.ruleForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        });
         console.log(item)
      })
      //动态数据
      this.tabList1.forEach((item)=>{
        this.ruleForm.attrs.push({
          attr_id: item.attr_id,
          attr_value: item.attr_vals,
        })
        console.log(item)
      })
      this.myaxios.post("goods",this.ruleForm).then(res=>{
        console.log(res)
        if(res.data.meta.status == 201){
          this.$message.success("添加成功")
          this.$router.push('/goods')
        }else{
          this.$message.error("添加失败")
          
        }

      })
      // var arr = [];
      // arr.push(this.tabList[0]);
      // arr.push(this.tabList1[0]);
      // console.log(arr);
      // this.myaxios
      //   .post("goods", {
      //     goods_name: this.ruleForm.goods_name,
      //     goods_cat: this.ruleForm.goods_cat.toString(),
      //     goods_price: this.ruleForm.goods_price,
      //     goods_number: this.ruleForm.goods_number,
      //     goods_weight: this.ruleForm.goods_weight,
      //     goods_introduce: this.ruleForm.goods_introduce,
      //     attrs: arr,
      //   })
      //   .then((res) => {
      //     if (res.data.meta.status != 201) {
      //       this.$message.error("添加商品失败");
      //     } else {
      //       this.$message.success("添加商品成功");
      //     }
      //     this.$router.push("/goods");
      //     console.log(res);
      //   });
    },
  },

  computed: {
    cateId() {
      if (this.ruleForm.goods_cat.length == 3) {
        return this.ruleForm.goods_cat[2];
      }
      return null;
    },
  },
  created() {
    this.handleChange();
  },
};
</script>

<style scoped>
.el-steps {
  margin: 15px 0;
}
</style>