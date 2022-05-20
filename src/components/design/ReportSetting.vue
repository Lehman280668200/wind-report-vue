<template>
  <div class="wrapper">
    <a-divider><a-tag color="cyan">基础信息</a-tag></a-divider>
    <a-form layout="vertical">
      <a-form-item label="报表名称">
        <a-input v-model:value="reportName" placeholder="请输入报表名称" />
      </a-form-item>
      <a-form-item label="分页风格">
         <a-select  ref="select" v-model:value="reportPage" show-search  style="width:100%"  >
          <template v-for="(item,index) in pageList" :key="index">
            <a-select-option :value="item"  >{{item}}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="表格边框">
          <a-switch v-model:checked="reportBordered" checked-children="有" un-checked-children="无" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs,watch} from "vue"

export default defineComponent({
  props: {
    name: String,
    page: String,
    bordered: Number,
  },
  setup(props,{emit}) {
    
    //  分页风格数组
    const pageList = ref<string[]>([
      "10/20/50/100",
      "10/50/100/500",
      "50/100/500/1000",
      "100/500/1000/2000"
    ])

    const reportName = ref<string>()  // 报表名称
    const reportPage = ref<string>()  //  报表分页风格
    const reportBordered = ref<boolean>()  //  报表边框

    const {name,page,bordered} = toRefs(props)  //  props
    
    reportName.value = name.value
    reportPage.value = page.value
    reportBordered.value = bordered.value==0?false:true




    watch(() => [name.value], () => {
       reportName.value = name.value
       reportPage.value = page.value
       reportBordered.value = bordered.value==0?false:true
    })



    //  监控 传递值给父组件
    watch(() => [reportName.value,reportPage.value,reportBordered.value], ([newName, newPage,newBordered]) => {
      emit('reportName',newName)
      emit('reportPage',newPage)
      emit('reportBordered',newBordered?1:0)
    })

    return {
      pageList,
      reportName,
      reportPage,
      reportBordered,
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