<template>
  <div class="wrapper">

    <a-divider><a-tag color="purple">列配置信息</a-tag></a-divider>

    <a-alert v-if="column==null" message="请点击配置图标进行列配置" type="warning" show-icon />

    <a-form v-else layout="vertical">
      <a-form-item label="列标题">
        <a-input v-model:value="column.title" placeholder="请输入列标题" />
      </a-form-item>
      <a-form-item label="列宽度">
        <a-input-number v-model:value="column.width" :min="50" :max="800" placeholder="请输入50-800之间的数字大小"   style="width:100%"/>
      </a-form-item>
      <a-form-item label="对齐方式">
        <a-radio-group v-model:value="column.align"  button-style="solid">
          <a-radio-button value="left">左对齐</a-radio-button>
          <a-radio-button value="center">居中</a-radio-button>
          <a-radio-button value="right">右对齐</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="数据类型">
        <a-radio-group v-model:value="column.dataType">
          <a-radio value="string" @click="delete column['json']">文本类型</a-radio>
          <a-radio value="number" @click="delete column['json']">数字类型</a-radio>
           <br />
          <a-radio value="date" @click="delete column['json']">时间日期</a-radio>
          <a-radio value="json">JSON数组</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="【JSON数组】: text-value " v-if="column.dataType=='json'">
        <a-textarea
          v-model:value="column.json"
          placeholder='请输入如下格式JSON字符串
[
  {
  "text":"男",
  "value":"1"
  },
  {
  "text":"女",
  "value":"2"
  }
]'
          :auto-size="{ minRows: 5, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item label="【数字类型】: 合计项" v-if="column.dataType=='number'">
        <a-switch  checked-children="是" un-checked-children="否" />
      </a-form-item>
      <a-alert
        message="注意事项"
        description="下列配置项受数据类型影响，请确保您的数据类型配置无误！"
        type="info"
        show-icon
      />
      <br/>
      <a-form-item label="列排序">
        <a-switch v-model:checked="column.sorter" checked-children="是" un-checked-children="否" />
      </a-form-item>
      <a-form-item label="列筛选">
        <a-switch v-model:checked="column.search" checked-children="是" un-checked-children="否" />
      </a-form-item>

    </a-form>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs,watch} from "vue"

export default defineComponent({
  props: {
    selectColumn: Object,
  },
  setup(props) {
    

    const column = ref<any>()

    const {selectColumn} = toRefs(props)  //  props
    
    column.value = selectColumn.value




    



    //  监控 传递值给父组件
    watch(() => [selectColumn.value], ([newProps]) => {
      column.value = newProps
    })
    /*watch(() => [column.value], ([newColumn]) => {
      if(newColumn!=null)  console.log(newColumn)
    })*/


    return {
      column
    }
  },
});
</script>
<style lang="less" scoped>
.wrapper {
  padding: 16px;
  text-align: left;
}
</style>