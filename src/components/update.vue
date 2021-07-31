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
      <el-tabs :tab-position="tabPosition" v-model="active">
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
                  border
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
            class="upload-demo"
            action="upurl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
             :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            v-model="ruleForm.goods_introduce"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-button type="primary" @click="updata" style="margin-top: 10px"
            >修改</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
    fileList:[],
      tabList: [],//动态数据
      tabList1: [],//静态数据
      pices:[],//存放图片的数组
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
      pice: [], //图片数组
      //上传图片的url地址
      //添加商品的表单数据
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_cat: "", //分类的数据
        attrdata: [],
        attribute: [],
        attrs:"",
        goods_introduce: "",
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
    };
  },
  methods: {
    query() {
      this.myaxios.get(`goods/${this.$route.params.id}`).then((res) => {
        console.log(res);
        this.ruleForm = res.data.data;
        res.data.data.goods_cat = this.ruleForm.goods_cat.split(",");
        var arr = [];
        res.data.data.goods_cat.map((item) => {
          console.log(item);
          // res.data.goods_cat.push(arr)
          arr.push(parseInt(item));
        });
        console.log(arr);
        this.ruleForm.goods_cat = arr;
        res.data.data.attrs.map((item)=>{
            if(item.attr_sel === "many"){
                this.tabList.push(item)
                 console.log(item)
            }else{
                this.tabList1.push(item)
                 console.log(item)
            }
        })
        res.data.data.pics.map((item)=>{
            this.fileList.push({
                name:item.pics_big,
                url:item.pics_big_url
            })
            console.log(this.fileList);
        })
      })
    },

    updata() {
      this.myaxios.put(`goods/${this.$route.params.id}`, {
        goods_name: this.ruleForm.goods_name,
        goods_cat: this.ruleForm.goods_cat.toString(),
        goods_price: this.ruleForm.goods_price,
        goods_number: this.ruleForm.goods_number,
        goods_weight: this.ruleForm.goods_weight,
        goods_introduce: this.ruleForm.goods_introduce,
      }).then(res=>{
          console.log(res)
          if(res.data.meta.status == 200){
              this.$message.success("修改商品成功")
              this.$router.push('/goods')
          }else{
              this.$message.error("修改商品失败")
          }

      })
    },
    handleChange() {
      this.myaxios.get("categories").then((res) => {
        this.options = res.data.data;
        console.log(res.data.data);
      });
    },
    handlePreview() {},
    handleRemove() {},
  },
  created() {
    this.query();
    this.handleChange();
  },
  computed: {
    cateId() {
      if (this.ruleForm.goods_cat.length == 3) {
        return this.ruleForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>
<style>
</style>