<template>
  <div id="main" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    this.myaxios.get("reports/type/1").then((res) => {
      console.log(res.data.data);
      var asda = Object.assign(this.options, res.data.data);
      var myChart = echarts.init(document.getElementById("main"));
      console.log(res);
      myChart.setOption(asda);
    });
  },
  methods: {},
};
</script>
<style>
</style>