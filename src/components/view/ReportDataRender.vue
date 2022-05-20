<template>
  <div  class="content">

    <a-table 
      :columns="columns" 
      :data-source="data" 
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :bordered="bordered"
    >

      <template #title> <span class="title">{{name}}</span>  <a-button type="primary" size="large" >导出数据</a-button></template>

    </a-table>


  </div>
</template>

<script lang="ts">
import { message  } from 'ant-design-vue'
import { defineComponent, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { getData} from '@/api/ReportDataApi'
import { getReportData} from '@/api/DataSourceApi'

export default defineComponent({
  setup() {
  
  const route = useRoute()
  const data_id = ref<string>(route.params.data_id as string)
  const ds_id = ref<string>(route.params.ds_id as string)

  const name = ref<string>()  //  报表名称
  const loading = ref<boolean>(false) //  表格加载状态
  const columns = ref<any[]>([])  //
  const data = ref<any[]>([]) //  表格数据
  const current = ref<number>(1)  //  表格当前页码
  const pageSize = ref<number>(10)  //  表格页页码大小
  const pageSizeOptions = ref<string[]>(['10', '20', '50', '100']) //  表格每页数量
  const pagination = computed(() => ({  //  表格分页数量
        current: current.value,
        pageSize: pageSize.value,
        showSizeChanger: true,
        pageSizeOptions:pageSizeOptions.value,
        showTotal: () =>  `共 ${data.value.length} 条`
  }))
  const bordered = ref<boolean>(false)  //  表格边框


  //  初始化加载
  const loadData = () =>{

    //  表格配置
    getData(null,data_id.value).then(response => {
        const res: any = response.data
        if(res.code == 280){
          name.value = res.data.name
          pageSizeOptions.value = res.data.page.split('/')
          pageSize.value = parseInt(pageSizeOptions.value[0])
          bordered.value = res.data.bordered==0?false:true

          let columnsBefore = JSON.parse(res.data.columns)
          for(let i=0;i<columnsBefore.length;i++){
            if(columnsBefore[i].sorter){
               let dataIndex = columnsBefore[i].dataIndex
               columnsBefore[i].sorter = (a:any, b:any) => typeof(a[dataIndex])=='number'?a[dataIndex] - b[dataIndex]:a[dataIndex].length - b[dataIndex].length
            }
          }
          columns.value = columnsBefore
        }else{
          message.error(res.msg)
        }
    })

    //  表格数据
    getReportData(null,ds_id.value).then(response => {
        const res: any = response.data
        if(res.code == 280){
          data.value = res.data
        }else{
          message.error(res.msg)
        }
    })
  }




  //  表格分页 排序 筛选
  const handleTableChange = ( pag: { pageSize: number; current: number }) =>{
      current.value = pag.current
      pageSize.value = pag.pageSize
  }


  
  return{
    data_id,
    ds_id,
    name,
    loading,
    columns,
    data,
    current,
    pageSize,
    pageSizeOptions,
    pagination,
    bordered,
    loadData,
    handleTableChange
   }
  },
  created(){
    this.loadData()
  },
  components: {},
});
</script>
<style lang="less" scoped>
.content{
  padding: 24px;

  button{
     float: right;
     margin-bottom: 12px;
  }
  .title{
     float: left;
     font-size: 24px;
  }
}


</style>