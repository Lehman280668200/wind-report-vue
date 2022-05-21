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

      <template #bodyCell="{  column,record }">
        <template  v-if="column.dataType === 'json'">
            <a-tag>{{ column.jsonData(record[column.dataIndex]) }}</a-tag>
        </template>
      </template>

      <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
      <div  class="filterDropdown">

        <a-input 
          v-if="column.dataType=='string'"
          ref="searchInput"
          :placeholder="`筛选 【${column.title}】`"
          :value="selectedKeys[0]"
          class="inputs"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(confirm)"
        />

        <a-input-number 
          v-if="column.dataType=='number'"
          ref="searchInput"
          :placeholder="`筛选 【${column.title}】`"
          :value="selectedKeys[0]"
          class="inputs"
          @change="value => setSelectedKeys(value ? [value] : [])"
          @pressEnter="handleSearch(confirm)"
          >
          <template #addonBefore>
            <a-select  v-model:value="column.arithmetic" style="width: 80px" @change="handleReset(clearFilters)">
              <a-select-option value="=">＝</a-select-option>
              <a-select-option value=">">＞</a-select-option>
              <a-select-option value="<">＜</a-select-option>
              <a-select-option value="!=">!＝</a-select-option>
              <a-select-option value=">=">＞＝</a-select-option>
              <a-select-option value="<=">＜＝</a-select-option>
            </a-select>
          </template>
        </a-input-number>


        <div  v-if="column.dataType=='date'">
          <a-select  v-model:value="column.arithmetic" style="width: 80px" @change="handleReset(clearFilters)">
            <a-select-option value="=">＝</a-select-option>
            <a-select-option value=">">＞</a-select-option>
            <a-select-option value="<">＜</a-select-option>
            <a-select-option value="!=">!＝</a-select-option>
            <a-select-option value=">=">＞＝</a-select-option>
            <a-select-option value="<=">＜＝</a-select-option>
          </a-select>
          <a-select v-model:value="column.dateType" style="width: 200px" @change="handleReset(clearFilters)">
            <a-select-option value="date">YYYY-MM-DD</a-select-option>
            <a-select-option value="month">YYYY-MM</a-select-option>
            <a-select-option value="year">YYYY</a-select-option>
            <a-select-option value="time">hh:mm:ss</a-select-option>
          </a-select>
          <template v-if="column.dateType === 'time'">
            <a-time-picker
            ref="searchInput"
            :placeholder="`筛选 【${column.title}】`"
            :value="selectedKeys[0]"
            class="inputs"
            @change="value => setSelectedKeys(value ? [value] : [])"
            @pressEnter="handleSearch(confirm)"
             />
          </template>
          <template v-else>
            <a-date-picker :picker="column.dateType" 
            ref="searchInput"
            :placeholder="`筛选 【${column.title}】`"
            :value="selectedKeys[0]"
            class="inputs"
             @change="value => setSelectedKeys(value ? [value] : [])"
            @pressEnter="handleSearch(confirm)"
            />
          </template>
        </div>
       
        <a-button
          type="primary"
          size="small"
          style="width: 100px;"
          @click="handleSearch(confirm)"
        >
          筛选
        </a-button>
        <a-button size="small" style="width: 100px;float: right;" @click="handleReset(clearFilters)">
          重置
        </a-button>
      </div>
    </template>

    </a-table>


  </div>
</template>

<script lang="ts">

import { message  } from 'ant-design-vue'
import { defineComponent, ref, computed } from "vue"
import { useRoute } from "vue-router"
import { getData} from '@/api/ReportDataApi'
import { getReportData} from '@/api/DataSourceApi'
import { columnConvert} from '../utils/columnConvert'

export default defineComponent({
  setup() {
  
  const route = useRoute()
  const data_id = ref<string>(route.params.data_id as string)
  const ds_id = ref<string>(route.params.ds_id as string)

  const name = ref<string>()  //  报表名称
  const loading = ref<boolean>(true) //  表格加载状态
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
        showTotal: (total:any) => `共 ${total} 条`
  }))
  const bordered = ref<boolean>(false)  //  表格边框


  //  初始化加载
  const loadData = () =>{

    /* 表格配置 */
    getData(null,data_id.value).then(response => {
        const res: any = response.data
        if(res.code == 280){
          name.value = res.data.name
          pageSizeOptions.value = res.data.page.split('/')
          pageSize.value = parseInt(pageSizeOptions.value[0])
          bordered.value = res.data.bordered==0?false:true
          //  调用工具类进行转换处理
          columns.value = columnConvert(JSON.parse(res.data.columns))
        }else{
          message.error(res.msg)
        }
    })

    /* 表格数据 */
    getReportData(null,ds_id.value).then(response => {
        const res: any = response.data
        if(res.code == 280){
          loading.value = false
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

  //  确定筛选
  const handleSearch = (confirm:any) => {
    confirm()
  }

  // 重置筛选
  const handleReset = (clearFilters:any) => {
    clearFilters({ confirm: true })
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
    handleTableChange,
    handleSearch,
    handleReset
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
.filterDropdown{
  padding: 8px;
  .inputs{
    width: 280px; margin-bottom: 8px; display: block;
  }
}


</style>