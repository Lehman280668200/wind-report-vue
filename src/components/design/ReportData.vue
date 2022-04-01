<template>
  <a-list size="small" bordered :data-source="data">
    <template #renderItem="{ item }">
      <a-list-item>{{ item }}</a-list-item>
    </template>
    <template #header>
      <div>Header</div>
    </template>
    <template #footer>
      <div>Footer</div>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
const data: string[] = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
export default defineComponent({
  setup() {
    return { data };
  },
  watch: {},
  computed: {},
  methods: {},
  components: {},
});
</script>
<style lang="less" scoped>
</style>