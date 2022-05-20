<template>
  <div class="content">

  
    <a-modal v-model:visible="visible" :title="(pageType=='add'?'添加':'修改')+' 数据库信息'" @ok="saveOrUpdate">
      <a-spin :spinning="validateResult" tip="连接成功,等待保存...">
        <a-form  ref="modalFormRef" :model="dbModel" name="dbForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
          <a-form-item label="连接名称" name="name" :rules="[{ required: true, message: '请输入连接名称!' }]">
            <a-input v-model:value="dbModel.name" />
          </a-form-item>
          <a-form-item label="主机地址" name="host" :rules="[{ required: true, message: '请输入主机地址!' }]">
            <a-input v-model:value="dbModel.host" />
          </a-form-item>
          <a-form-item label="端口号" name="port" :rules="[{ required: true, message: '请输入端口号!' }]">
            <a-input-number  v-model:value="dbModel.port" />
          </a-form-item>
          <a-form-item label="用户名" name="user" :rules="[{ required: true, message: '请输入用户名!' }]">
            <a-input v-model:value="dbModel.user" />
          </a-form-item>
            <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码!' }]">
            <a-input-password v-model:value="dbModel.password" />
          </a-form-item>
          <a-form-item label="DB库" name="database" :rules="[{ required: true, message: '请输入DB库名称!' }]">
            <a-input v-model:value="dbModel.database" />
          </a-form-item>
        </a-form>
      </a-spin>
       <template #footer>
        <a-button type="primary" class="testConnection"  @click="testConnection"  :loading="validateLoading" >测试连接</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary"  @click="saveOrUpdate" :loading="submitLoading" >保存</a-button>
      </template>
    </a-modal>

    <a-table 
      row-key="db_id"
      :columns="columns" 
      :data-source="data" 
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      bordered
    >
      <template #title> <span class="title"><DatabaseOutlined /> 数据库信息列表</span>  <a-button type="primary" size="large" @click="visible=true,pageType='add'">添加数据库信息</a-button></template>

      <template #bodyCell="{  column,record }">
        <template  v-if="column.dataIndex === 'action'">
          <span>
            <a @click="visible=true,dbModel={...record},pageType='edit'">Update</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="data.length"
              :title="'确定删除连接【'+record.name +'】?'"
              @confirm="deleteRow(record.db_id)"
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
import { listData,saveData,updateData,deleteData,validatePool } from '@/api/DataBaseApi'
import {DatabaseOutlined} from "@ant-design/icons-vue"

//  Table 列
const columns = [
  {
    title: "连接名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "主机地址",
    dataIndex: "host",
    key: "host",
    width: 240,
  },
  {
    title: "端口",
    dataIndex: "port",
    key: "port",
    width: 100,
    align:'center'
  },
  {
    title: "用户名",
    dataIndex: "user",
    key: "user",
    width: 160,
  },
  {
    title: "DB名称",
    dataIndex: "database",
    key: "database",
    width: 160,
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

//  数据库对象
interface dbInfo {
  db_id?:string
  name?: string
  host?: string
  port?: number
  user?: string
  passsword?:string
  database?: string
  create_date?: string 
  update_date?: string 
}

export default defineComponent({
  setup() {

    const visible = ref<boolean>(false) //  Modal状态
    const modalFormRef = ref<FormInstance>()  //  表单对象ref
    const dbModel = ref<dbInfo>({}) //  表单对象model
    const pageType = ref<string>('') //  表单状态对象

    const validateLoading = ref<boolean>(false) //  测试连接按钮加载状态
    const submitLoading = ref<boolean>(false)  //  保存按钮加载状态
    const validateResult = ref<boolean>(false)  //  是否通过测试连接

    const loading = ref<boolean>(true)  //  表格加载状态
    const data = ref<dbInfo[]>([])  //  表格数据
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


    //  加载表格数据
    const loadData = () =>{
      listData(null).then(response => {
        const res: any = response.data
        loading.value = false
        if(res.code == 280){
          data.value =res.data
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


    // 测试连接
    const testConnection = () =>{
      (modalFormRef.value as FormInstance).validateFields().then(() => {
        validateLoading.value = true
          validatePool(dbModel.value).then(response => {
            const res: any = response.data
            validateLoading.value = false
            if(res.code == 280){
              message.success(res.msg)
              validateResult.value = true
            }else{
              message.error(res.msg)
            }
          })
      })
    }

    // 取消保存
    const handleCancel = () =>{
      submitLoading.value =false
      visible.value = false
    }

    //  新增/修改 数据
    const saveOrUpdate = () =>{
      if(!validateResult.value){return message.warning('请先进行测试连接,并确保连接通过！')} 

      (modalFormRef.value as FormInstance).validateFields().then(() => {
        submitLoading.value = true
        if(pageType.value == 'add'){
          saveData(dbModel.value).then(response => {
            const res: any = response.data
            if(res.code == 280){
              message.success(res.msg)
              handleCancel()
              current.value = 1
              loadData()
            }else{
              message.error(res.msg)
            }
          })
        }else{
          updateData(dbModel.value,(dbModel.value.db_id as string)).then(response => {
            const res: any = response.data
            if(res.code == 280){
              message.success(res.msg)
              handleCancel()
              current.value = 1
              loadData()
            }else{
              message.error(res.msg)
            }
          })
        }
      })
    }

    //  删除数据
    const deleteRow = (db_id:string) =>{
      deleteData(null,db_id).then(response => {
        const res: any = response.data
        if(res.code == 280){
          message.success(res.msg)
        }else{
          message.error(res.msg)
        }
        current.value = 1
        loadData()
      })
    }
   


    //  监控Modal状态 新增状态清空表单对象
    watch(
      visible,
      () => {
       validateResult.value = false
       if(pageType.value == 'add')   dbModel.value = {} 
      },
      { flush: 'post' },
    )

    return {
      columns,
      visible,
      modalFormRef,
      dbModel,
      pageType,
      validateLoading,
      submitLoading,
      validateResult,
      loading,
      data,
      pagination,
      loadData,
      handleTableChange,
      testConnection,
      handleCancel,
      saveOrUpdate,
      deleteRow,
    }
  },
  mounted(){
    this.loadData()
  },
  components: {
    DatabaseOutlined
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
.testConnection{
  float: left;
  background-color:#87d068;
  border:#87d068;
}
</style>