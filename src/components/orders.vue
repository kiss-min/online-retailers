<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="230">
        </el-table-column>
        <el-table-column prop="order_price" label="价格" width="180">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag>{{
              scope.row.pay_status == 0 ? "未付款" : "以付款"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <el-button type="primary">查看</el-button>
          <el-button type="success">删除</el-button>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 5, 7, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.myaxios
        .get("orders", {
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize,
          },
        })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.data.goods;
          this.total = res.data.data.total;
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.query();
    },
    indexMethod(index) {
      return index + 1;
    },
  },
};
</script>
<style>
</style>