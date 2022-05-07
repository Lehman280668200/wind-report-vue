<template>
  <div >
    <a-divider>欢迎使用追风报表</a-divider>
    <a-image
    :src="excel"
  />
  </div>
</template>

<script lang="ts">
import { defineComponent} from "vue"
export default defineComponent({
  setup() {
  
  return{
    excel:require('@/assets/excel.jpg')
   }
  },
  watch: {},
  computed: {},
  methods: {},
  components: {},
});
</script>
<style lang="less" scoped>
</style>