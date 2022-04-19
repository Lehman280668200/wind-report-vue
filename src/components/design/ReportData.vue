<template>
<div class="wrapper">
  <a-list size="small"  :data-source="props.data">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.column">
          <template #title>{{ item.title }}</template>
        </a-list-item-meta>
          <a-button type="primary" @click="copyColumn(item.column)">复制</a-button>
      </a-list-item>
    </template>
    <template #header>
      <div>数据源-XXXX</div>
    </template>
  </a-list>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { message } from 'ant-design-vue'
import clipboard from 'vue-clipboard3'


export default defineComponent({
  props: {
    data: Array
  },
  setup(props) {

    /* 复制 */
    const copyColumn = (column:string) => {
      copy(column)
    }

    const { toClipboard } = clipboard()
    const copy = async (column:string) => {
      try {
        await toClipboard(column)	//复制
        message.success('复制成功')
      } catch (e) {
        message.error('复制失败')
        console.error(e)
      }
    }

    return {props,copyColumn}
  },
  watch: {},
  computed: {},
  methods: {},
  components: {},
})
</script>
<style lang="less" scoped>
.wrapper {
  height: calc(100vh);
  border-right: 1px #cccccc solid;

  .ant-list-item-meta{
    text-align: left;
  }
}
</style>