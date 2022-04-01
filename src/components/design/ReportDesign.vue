<template>
  <a-row>
    <a-col :span="2"> <ReportData></ReportData></a-col>
    <a-col :span="18">col-12</a-col>
    <a-col :span="4"> <ReportSetting></ReportSetting></a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import ReportData from "./ReportData.vue";
import ReportSetting from "./ReportSetting.vue";
export default defineComponent({
  setup() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  components: { ReportData, ReportSetting },
});
</script>
<style lang="less" scoped>
</style>