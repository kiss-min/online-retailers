<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div style="margin-top: 15px">
        <el-input placeholder="请输入内容" v-model="input2">
          <template slot="append">查询</template>
        </el-input>
        <el-button type="primary" @click="$router.push('/add')">添加</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200" :formatter="dateFormat" >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="ser(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="dele(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      style="text-align:center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.rule.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="this.rule.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
import moment from 'moment'
export default {
  data() {
    return {
      tableData: [],
      input2: "",
      total: 0,
      rule: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    //时间戳处理
      dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    query() {
      this.myaxios
        .get("goods", {
          params: {
            query: this.rule.query,
            pagenum: this.rule.pagenum,
            pagesize: this.rule.pagesize,
          },
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
            this.$message({
              message: "获取商品列表成功",
              type: "success",
            });
            this.tableData = res.data.data.goods;
            this.total = res.data.data.total;
            console.log(res);
          }
        });
    },
    //每页多少条数据
    handleSizeChange(val) {
      this.rule.pagesize = val;
      this.query();
    },
    //第几页
    handleCurrentChange(val) {
      this.rule.pagenum = val;
      this.query();
    },
    //修改
    ser(id) {
      this.$router.push({
        name:"update",
        params:{
          id:id
        }
      })
    },
    //删除
    dele(goods_id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.myaxios
          .delete("goods/" + goods_id)
          .then((res) => {
            console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.query();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
    indexMethod(index) {
      return index + 1;
    },
  },
};
</script>

<style scoped>
.el-table{
    margin-top:10px;
}
.el-input {
    margin-right:10px;
  width: 400px !important;
}
</style>