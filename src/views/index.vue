<template>
  <div class="app-container home">
    <PanelGroup />
    <LinerChart />
    <el-divider />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <PlanetChart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <BubbleChart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from "../views/dashboard/PanelGroup";
import LinerChart from "../views/dashboard/LineChart";
import PieChart from "../views/dashboard/PieChart";
import RaddarChart from "../views/dashboard/RaddarChart";
import BarChart from "../views/dashboard/BarChart";
import PlanetChart from "../views/dashboard/PlanetChart";
import BubbleChart from "../views/dashboard/Bubble";

export default {
  name: "Index",
  components: {
    PlanetChart,
    PanelGroup,
    LinerChart,
    PieChart,
    RaddarChart,
    BarChart,
    BubbleChart
  },
  data() {
    return {
      version: "1.1.1"
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    }
  }
};
</script>

<style scoped lang="scss">
  .home {
    blockquote {
      padding: 10px 20px;
      margin: 0 0 20px;
      font-size: 17.5px;
      border-left: 5px solid #eee;
    }

    hr {
      margin-top: 20px;
      margin-bottom: 20px;
      border: 0;
      border-top: 1px solid #eee;
    }

    .col-item {
      margin-bottom: 20px;
    }

    ul {
      padding: 0;
      margin: 0;
    }

    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;

    ul {
      list-style-type: none;
    }

    h4 {
      margin-top: 0px;
    }

    h2 {
      margin-top: 10px;
      font-size: 26px;
      font-weight: 100;
    }

    p {
      margin-top: 10px;

      b {
        font-weight: 700;
      }
    }

    .update-log {
      ol {
        display: block;
        list-style-type: decimal;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
        padding-inline-start: 40px;
      }
    }
  }
</style>

