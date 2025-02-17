<template>
  <div>
    <div class="line-chart-title">
      <div class="line-chart-name">{{ chartTitle }}</div>
      <div class="line-chart-time-radio">
        <el-radio-group v-model="timeLimit" @change="changeTimeLimit">
          <el-radio-button
            v-for="item in Object.keys(TIME_LIMIT_SETTING)"
            :key="TIME_LIMIT_SETTING[item].key"
            :label="TIME_LIMIT_SETTING[item].name"
          />
        </el-radio-group>
      </div>
    </div>
    <div :id="lineChartId" class="line-chart-body" />
  </div>
</template>

<script>
import VueTypes from "vue-types";
import echarts from "echarts";
import moment from "moment";
import { getMonitorLogs } from "@/api/vadmin/monitor/server";

const TODAY = moment().format("YYYY-MM-DD");
const YESTERDAY = moment().subtract(1, "days").format("YYYY-MM-DD");
const LAST_SEVEN_DAYS = moment().subtract(7, "days").format("YYYY-MM-DD");
const LAST_THIRTY_DAYS = moment().subtract(30, "days").format("YYYY-MM-DD");

const TIME_LIMIT_SETTING = {
  "yesterday": {
    key: "yesterday",
    name: "Hôm qua",
    timeRange: [
      `${YESTERDAY} 00:00:00`,
      `${YESTERDAY} 23:59:59`
    ]
  },
  "today": {
    key: "today",
    name: "Hôm nay",
    timeRange: [
      `${TODAY} 00:00:00`,
      `${TODAY} 23:59:59`
    ]
  },
  "latestWeek": {
    key: "latestWeek",
    name: "Tuần sau",
    timeRange: [
      `${LAST_SEVEN_DAYS} 00:00:00`,
      `${TODAY} 23:59:59`
    ]
  },
  "latestMonth": {
    key: "latestMonth",
    name: "Tháng sau",
    timeRange: [
      `${LAST_THIRTY_DAYS} 00:00:00`,
      `${TODAY} 23:59:59`
    ]
  }
};
const DEFAULT_TIME = "Hôm nay";

export default {
  name: "LineChart",
  props: {
    serverInfo: VueTypes.object.isRequired,
    lineChartKey: VueTypes.string.isRequired,
    chartTitle: VueTypes.string.isRequired,
    chartData: VueTypes.array.isRequired,
    chartTime: VueTypes.array.isRequired
  },
  data() {
    return {
      TIME_LIMIT_SETTING,
      timeLimit: DEFAULT_TIME,
      lineChartId: this.lineChartKey + "Chart",
      lineChartData: this.chartData,
      lineChartTime: this.chartTime
    };
  },
  computed: {
    timeLimitNames() {
      return Object.keys(TIME_LIMIT_SETTING).map(item => {
        return TIME_LIMIT_SETTING[item].name;
      });
    },
    currentDateIndex() {
      return this.timeLimitNames.indexOf(this.timeLimit);
    },
    currentTimeLimitSetting() {
      return TIME_LIMIT_SETTING[Object.keys(TIME_LIMIT_SETTING)[this.currentDateIndex]];
    }
  },

  mounted() {
    this.drawBar();
  },
  methods: {
    drawBar() {
      const barGraph = echarts.init(document.getElementById(this.lineChartId));
      barGraph.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          left: "center",
          data: [],
          bottom: 0
        },
        xAxis: {
          type: "category",
          name: "x",
          splitLine: { show: false },
          data: this.lineChartTime,
          offset: 20
        },
        grid: {
          left: "1%",
          right: "2%",
          bottom: "8%",
          containLabel: true
        },
        yAxis: {
          type: "value",
          name: "Tỉ lệ sử dụng",
          axisLabel: {
            show: true,
            interval: "auto",
            formatter: "{value}%"
          }
        },
        series: [
          {
            name: "Tỉ lệ sử dụng",
            type: "line",
            data: this.lineChartData
          }
        ]
      });
    },
    changeTimeLimit(value) {
      this.timeLimit = value;
      this.getCurrentServerMonitorLogs();
    },
    getCurrentServerMonitorLogs() {
      getMonitorLogs(this.serverInfo.id, { as: JSON.stringify({ create_datetime__range: this.currentTimeLimitSetting.timeRange }) }).then(results => {
        this.lineChartData = results.data[this.lineChartKey];
        this.lineChartTime = results.data["datetime"];
        this.drawBar();
      }).catch(error => {
        this.$message.warning(error.msg || `Không lấy được dữ liệu của${this.chartTitle}！`);
      });
    }
  }
};
</script>

<style scoped>
.line-chart-name {
  font-weight: bolder;
  width: 20%;
  min-width: 30px;
  text-align: left;
  display: inline-block;
}

.line-chart-time-radio {
  font-weight: bolder;
  width: 80%;
  min-width: 200px;
  text-align: right;
  display: inline-block;
}

.line-chart-body {
  min-height: 300px;
  min-width: 300px;
}
</style>
