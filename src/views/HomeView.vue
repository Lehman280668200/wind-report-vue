<template>
  <a-row>
    <a-col :span="4">
      <!-- menu -->
      <a-menu
        id="dddddd"
        style="width: 100%; height: calc(100vh)"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        @click="handleClick"
      >
        <a-sub-menu key="report-management">
          <template #icon>
            <SettingOutlined />
          </template>
          <template #title>报表管理</template>
          <a-menu-item key="report-data">
            <template #icon><DatabaseOutlined /></template>
            <router-link to="/report-data"> 数据报表</router-link>
          </a-menu-item>
          <a-menu-item key="report-echarts">
            <template #icon><PieChartOutlined /></template>
            <router-link to="/report-echarts"> 图形报表</router-link>
          </a-menu-item>
          <a-menu-item key="report-datav">
            <template #icon><DesktopOutlined /></template>
            <router-link to="/report-datav"> DataV</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-col>
    <a-col :span="20"><router-view /></a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  SettingOutlined,
  DatabaseOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons-vue";
export default defineComponent({
  setup() {
    const selectedKeys = ref<string[]>(["report-management"]);
    const openKeys = ref<string[]>(["report-management"]);
    const router = useRouter();
    //  gogogo
    const handleClick = (e: Event) => {
      //console.log(e);
    };
    return {
      selectedKeys,
      openKeys,

      handleClick,
    };
  },
  components: {
    SettingOutlined,
    DatabaseOutlined,
    PieChartOutlined,
    DesktopOutlined,
  },
});
</script>

