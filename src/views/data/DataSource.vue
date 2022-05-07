<template>
  <div class="content">

  
    <a-modal v-model:visible="visible" :title="(pageType=='add'?'添加':'修改')+' 数据源信息'" @ok="saveOrUpdate">
       <a-form  ref="modalFormRef" :model="dsModel" name="dbForm"  layout="vertical">
        <a-form-item label="数据源名称" name="name" :rules="[{ required: true, message: '请输入数据源名称!' }]">
          <a-input v-model:value="dsModel.name" />
        </a-form-item>
        <a-form-item label="所属数据库" name="db_id" :rules="[{ required: true, message: '请选择所属数据库!' }]" >
           <a-select  ref="select" v-model:value="dsModel.db_id" show-search  optionFilterProp="label" :disabled="pageType=='edit'" >
             <template v-for="(item,index) in dbList" :key="index">
               <a-select-option :value="item.db_id"  :label="item.name">{{item.name}}</a-select-option>
             </template>
           </a-select>
        </a-form-item>
        <a-form-item label="SQL语句" name="sentence" :rules="[{ required: true, message: '请输入SQL语句!' }]">
           <a-textarea
            v-model:value="dsModel.sentence"
            placeholder="请输入自测过后的SQL语句"
            :auto-size="{ minRows: 12, maxRows: 12 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-table 
      row-key="ds_id"
      :columns="columns" 
      :data-source="data" 
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <template #title> <span class="title"><ConsoleSqlOutlined /> 数据源信息列表</span>  <a-button type="primary" size="large" @click="visible=true,pageType='add'">添加数据源信息</a-button></template>
      
      <template #bodyCell="{  column,record }">
        <template  v-if="column.dataIndex === 'status'">
           <a-switch v-if="record.status==0" :checked="true" checked-children="启用" un-checked-children="禁用" @change='changeStatus(record)' />
           <a-switch v-if="record.status==1" :checked="false" checked-children="启用" un-checked-children="禁用" @change='changeStatus(record)' />
        </template>
        <template  v-if="column.dataIndex === 'action'">
          <span>
            <a @click="visible=true,dsModel={...record},pageType='edit'">Update</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="data.length"
              :title="'确定删除连接【'+record.name +'】?'"
              @confirm="deleteRow(record.ds_id)"
              >
              <a>Delete</a>
            </a-popconfirm>
          </span>
        </template>
      </template>

    </a-table>
  </div>
</template>
<script lang="ts">
import { defineComponent,ref,computed,watch } from "vue"
import { message,FormInstance } from 'ant-design-vue'
import { listData,saveData,updateData,deleteData } from '@/api/DataSourceApi'
import { listData as listDataBase } from '@/api/DataBaseApi'
import {ConsoleSqlOutlined} from "@ant-design/icons-vue"


//  Table 列
const columns = [
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 80,
    align:'center'
  },
  {
    title: "所属数据库",
    dataIndex: "db_name",
    key: "db_name",
    width: 240,
  },
  {
    title: "数据源名称",
    dataIndex: "name",
    key: "name",
    width: 240,
  },
  {
    title: "SQL语句",
    dataIndex: "sentence",
    key: "sentence",
    ellipsis: true,
  },
  {
    title: "创建时间",
    dataIndex: "create_date",
    key: "create_date",
    width: 180,
  },
  {
    title: "修改时间",
    dataIndex: "update_date",
    key: "update_date",
    width: 180,
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: 150,
  },
]

//  数据源对象
interface dsInfo {
  ds_id?:string
  name?: string
  db_id?: string
  db_name?:string
  sentence?: string
  status?: number
  create_date?: string 
  update_date?: string 
}

export default defineComponent({
  setup() {

    const dbList = ref<object[]>([]) //  数据库列表

    const visible = ref<boolean>(false) //  Modal状态
    const modalFormRef = ref<FormInstance>()  //  表单对象ref
    const dsModel = ref<dsInfo>({}) //  表单对象model
    const pageType = ref<string>('') //  表单状态对象

    const loading = ref<boolean>(true)  //  表格加载状态
    const data = ref<dsInfo[]>([])  //  表格数据
    const current = ref<number>(1)  //  表格当前页码
    const pageSize = ref<number>(10)  //  表格页页码大小
    const pageSizeOptions = ref<string[]>(['10', '20', '500', '100']) //  表格每页数量
    const pagination = computed(() => ({  //  表格分页数量
          current: current.value,
          pageSize: pageSize.value,
          showSizeChanger: true,
          pageSizeOptions:pageSizeOptions.value,
          showTotal: () =>  `共 ${data.value.length} 条`
    }))


    //  加载表格数据
    const loadData = () =>{
      listData(null).then(response => {
        const res: any = response.data
        loading.value = false
        if(res.code == 280){
          let dsList = res.data
          let temp:any = dbList.value
          for(let i=0;i<dsList.length;i++){
            for(let j=0;j<temp.length;j++){
              if(dsList[i].db_id == temp[j].db_id){
                dsList[i].db_name = temp[j].name
                break
              }
            }
          }
          data.value = dsList
        }else{
          message.error(res.msg)
        }
      })
    }

    //  表格分页 排序 筛选
    const handleTableChange = (p:any) =>{
        current.value = p.current
        pageSize.value = p.pageSize
    }


    //  新增/修改 数据
    const saveOrUpdate = () =>{
      (modalFormRef.value as FormInstance).validateFields().then(() => {
        if(pageType.value == 'add'){
          saveData(dsModel.value).then(response => {
            const res: any = response.data
            if(res.code == 280){
              message.success(res.msg)
            }else{
              message.error(res.msg)
            }
            visible.value = false
            current.value = 1
            loadData()
          })
        }else{
          updateData(dsModel.value,(dsModel.value.ds_id as string)).then(response => {
            const res: any = response.data
            if(res.code == 280){
              message.success(res.msg)
            }else{
              message.error(res.msg)
            }
            visible.value = false
            current.value = 1
            loadData()
          })
        }
      })
    }

    //  删除数据
    const deleteRow = (ds_id:string) =>{
      deleteData(null,ds_id).then(response => {
        const res: any = response.data
        if(res.code == 280){
          message.success(res.msg)
        }else{
          message.error(res.msg)
        }
        visible.value = false
        current.value = 1
        loadData()
      })
    }

    // 修改状态
    const changeStatus = (record:dsInfo) =>{
      let data = {...record}
      data.status = data.status==1?0:1
      loading.value = true
      updateData(data,(data.ds_id as string)).then(response => {
        const res: any = response.data
        if(res.code == 280){
          message.success(res.msg)
        }else{
          message.error(res.msg)
        }
        visible.value = false
        current.value = 1
        loadData()
      })
    }

  

    //  监控Modal状态 新增状态清空表单对象
    watch(
      visible,
      () => {
       if(pageType.value == 'add')   dsModel.value = {} 
      },
      { flush: 'post' },
    )

    return {
      columns,
      dbList,
      visible,
      modalFormRef,
      dsModel,
      pageType,
      loading,
      data,
      pagination,
      loadData,
      handleTableChange,
      saveOrUpdate,
      deleteRow,
      changeStatus,
    }
  },
  mounted(){
    //  获取数据库列表数据 用作处理数据
    listDataBase(null).then(response => {
        const res: any = response.data
        if(res.code == 280){
          this.dbList = res.data
          this.loadData()
        }else{
          message.error(res.msg)
        }
    })
  },
  components: {
    ConsoleSqlOutlined
  },
})
</script>


<style lang="less" scoped>
.content{
  margin: 24px;

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