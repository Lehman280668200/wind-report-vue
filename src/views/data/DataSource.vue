<template>
  <div class="content">

  
    <a-modal v-model:visible="visible" :title="(pageType=='add'?'添加':'修改')+' 数据源信息'" @ok="saveOrUpdate">
      <a-spin :spinning="validateResult" tip="效验成功,等待保存...">
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
              placeholder="请输入SQL语句"
              :auto-size="{ minRows: 8, maxRows: 8 }"
              :disabled="dsModel.status==1"
            />
          </a-form-item>
          <a-form-item label="SQL查询结果列" name="columns" >
            <a-textarea
              v-model:value="dsModel.columns"
              placeholder="根据SQL语句生成"
              :auto-size="{ minRows: 3, maxRows: 3 }"
              :disabled="true"
            />
          </a-form-item>
        </a-form>
      </a-spin>
       <template #footer>
        <a-button type="primary" class="ruleSQL"  >SQL编写规则</a-button>
        <a-button type="primary" class="testConnection"  @click="sqlConnection"  :loading="validateLoading" >效验SQL</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary"  @click="saveOrUpdate" :loading="submitLoading" >保存</a-button>
      </template>
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
           <a-tag :color="record.status==0?'#f50':'#2db7f5'">{{record.status==0?'未使用':'已使用'}}</a-tag>
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
import { listData,saveData,updateData,deleteData,validateSQL } from '@/api/DataSourceApi'
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
  columns?:string
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

    const validateLoading = ref<boolean>(false) //  测试连接按钮加载状态
    const submitLoading = ref<boolean>(false)  //  保存按钮加载状态
    const validateResult = ref<boolean>(false)  //  是否通过测试连接

    const loading = ref<boolean>(true)  //  表格加载状态
    const data = ref<dsInfo[]>([])  //  表格数据
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



    // 效验SQL
    const sqlConnection = () =>{
      (modalFormRef.value as FormInstance).validateFields().then(() => {
        validateLoading.value = true
          validateSQL(dsModel.value).then(response => {
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
      if(!validateResult.value){return message.warning('请先进行SQL语句效验,确保通过效验!')} 

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

 
  
    //  监控Modal状态 
    watch(() => [visible.value,dsModel.value.sentence], ([newVisible, newSentence], [oldVisible]) => {
      //  鉴别是不是visible发生改变
      if(newVisible!=oldVisible){
          validateResult.value = false  //  
          if(pageType.value == 'add')   dsModel.value = {} // 新增状态清空表单对象
      }else{
          // 拆分字符串得到SQL查询结果列（columns）
          if((newSentence as string)){
            let sentence:string = (newSentence as string).toLocaleLowerCase()
            let ass = sentence.substring(6,sentence.indexOf("from")).split(",")
            dsModel.value.columns=''
            for(let i=0;i<ass.length;i++){
              if(ass[i].indexOf(' as ')!=-1){
                  dsModel.value.columns += ass[i].substring(ass[i].indexOf(' as ')+3).replace(/(^\s*)|(\s*$)/g, "")+(i==ass.length-1?'':',')
              }
            }
          }
      }
    })

    

    return {
      columns,
      dbList,
      visible,
      modalFormRef,
      dsModel,
      pageType,
      validateLoading,
      submitLoading,
      validateResult,
      loading,
      data,
      pagination,
      loadData,
      handleTableChange,
      sqlConnection,
      handleCancel,
      saveOrUpdate,
      deleteRow,
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

.testConnection,.ruleSQL{
  float: left;
}
.ruleSQL{
  background-color: #607d8b;
  border: #607d8b;
}
.testConnection{
  background-color: #ff5722;
    border: #ff5722;
}
</style>