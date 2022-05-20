<template>
  <a-row>
    <a-col :span="4">
      <ReportData :sqlColumn="sqlColumn" v-if="sqlColumn.length>0"></ReportData>
      <template v-else>
        <div class="chooseDataSource">
            <a-button  type="primary" size="large" @click="visible=true"><appstore-add-outlined />选择数据源</a-button>
        </div>
      </template>
    </a-col>
    <a-col :span="16" :loading="false" class="content">
      <a-spin :spinning="!sqlColumn.length>0" >
        <div style="text-align: right;padding:10px 10px 0px 0px;m">
          <a-button type="primary" danger @click="clear">清空配置</a-button>
          <a-button type="primary" @click="save">保存配置</a-button>
        </div>

        <a-divider><a-tag color="#2db7f5">表格列配置</a-tag></a-divider>

        <a-table
          :columns="dColumns"
          :data-source="fixedData"
          :pagination="false"
          :scroll="{ x: 'max-content'}"
          bordered
        >

          <template #bodyCell="{column,record }">
            <template v-if="column.dataIndex === 'operation'">
              <a @click="addColumn">add </a>
            </template>
            <template v-else-if="column.dataIndex === 'key'"><a-tag color="#f50">SQL列</a-tag></template>
            <template v-else>
                <a-select v-model:value="record[column.dataIndex]" show-search  style="width:100%"  >
                  <template v-for="(item,index) in sqlColumn" :key="index">
                    <a-select-option :value="item" >{{item}}</a-select-option>
                  </template>
                </a-select>
            </template>
          </template>

          <template #customFilterIcon="{column}">
            <setting-filled  :class="selectColumn&&column.dataIndex==selectColumn.dataIndex?'tableIconActive tableIcon':'tableIcon'"  @click="selectColumn=column"/>
            <delete-two-tone class="tableIcon" v-if="column.dataIndex!='name1'"  @click="delColumn(column.dataIndex)"/>
          </template>
          <template #customFilterDropdown></template>

          <template #summary>
            <a-table-summary fixed>
              <a-table-summary-row>
                  <a-table-summary-cell v-for="(column,index) in dColumns" :key="index" :index="index">
                    <a-tag v-if="index==0" color="#87d068">合计列</a-tag>
                  </a-table-summary-cell>
              </a-table-summary-row>
            </a-table-summary>
          </template>

        </a-table>
        
      </a-spin>
    </a-col>
    <a-col :span="4"> 
      <a-spin :spinning="!sqlColumn.length>0" >
        <ReportSetting 
         :name="name" :page="page" :bordered="bordered"
         @reportName="reportName" @reportPage="reportPage" @reportBordered="reportBordered"></ReportSetting>
        <ColumnSetting :selectColumn="selectColumn"> </ColumnSetting>
       </a-spin>
    </a-col>
  </a-row>

  <a-modal v-model:visible="visible" title="选择数据源" @ok="chooseDataSource">
    <a-select  ref="select" v-model:value="ds_id" show-search  optionFilterProp="label" style="width:100%"  >
      <template v-for="(item,index) in dsList" :key="index">
        <a-select-option :value="item.ds_id"  :label="item.name">{{item.name}}</a-select-option>
      </template>
    </a-select>
  </a-modal>

</template>

<script lang="ts">
import { message, TableColumnsType,Modal  } from 'ant-design-vue'
import { defineComponent, ref,h } from "vue"
import ReportData from "./ReportData.vue"
import ReportSetting from "./ReportSetting.vue"
import ColumnSetting from "./ColumnSetting.vue"
import {
  DeleteTwoTone ,
  SettingFilled,
  AppstoreAddOutlined
} from "@ant-design/icons-vue"

import { listData} from '@/api/DataSourceApi'
import { getData,saveData,updateData} from '@/api/ReportDataApi'
import { useRoute } from "vue-router"

export default defineComponent({
  setup() {

    const sqlColumn = ref<string[]>([])   //  SQL查询结果列集合

    const visible = ref<boolean>(false) //  选择数据源弹窗状态
    const dsList = ref<any[]>([]) //  数据源列表
    const ds_id = ref<string>('') //  选择的数据源ID

    const dColumns = ref<TableColumnsType>([])  //  表格动态列
    const fixedData = ref<object[]>([])    //  表格动态数据

    const name = ref<string>()  //  报表名称
    const page = ref<string>()  //  报表分页风格
    const bordered = ref<number>()  //  报表边框

    const selectColumn = ref<any>(null)  //  当前选择的配置列

    const route = useRoute()
    const data_id = ref<string>(route.params.id as string)
   
    //  初始化加载
    const loadDColumns = () =>{
      if(data_id.value){
        getData(null,data_id.value).then(response => {
           const res: any = response.data
            if(res.code == 280){
              loadData(res.data)
            }else{
              message.error(res.msg)
            }
        })
      }else{
        dColumns.value =[
          {title: '表格列',dataIndex: 'key',fixed: 'left', width: 80},
          {title: '列名1',dataIndex: 'name1',customFilterDropdown: true,align:'left',sorter:false},
          {title: '操作',dataIndex: 'operation',fixed: 'right', width: 80,align:'center'}
        ]
        fixedData.value =[{key:0,name1:''}]
        sqlColumn.value = []
        name.value = ''
        page.value = "['10', '20', '50', '100']"
        bordered.value = 0
      }
    }

    //  加载数据并处理
    const loadData = (data:any) =>{
      ds_id.value = data.ds_id
      chooseDataSource()
      dColumns.value =[{title: '表格列',dataIndex: 'key',fixed: 'left', width: 80}]
      let columns = JSON.parse(data.columns)
      let attr:any = {key:0}
      for(let i=0;i<columns.length;i++){
        let temp = {...columns[i]}
        let dataIndex = 'name'+(i+1)
        attr[dataIndex] = temp.dataIndex
        temp.dataIndex = dataIndex
        temp['customFilterDropdown'] = true
        dColumns.value.push(temp)
      }
      dColumns.value.push({title: '操作',dataIndex: 'operation',fixed: 'right', width: 80,align:'center'})
      fixedData.value[0] = attr
      name.value = data.name
      page.value = data.page
      bordered.value = data.bordered
    }

    //  选择数据源
    const chooseDataSource = () =>{
      if(!ds_id.value)  return message.warn('请选择数据源')
      visible.value = false
      for(let i=0;i<dsList.value.length;i++){
        if(dsList.value[i].ds_id==ds_id.value){
          sqlColumn.value = dsList.value[i].columns.split(",")
          break
        }
      }
    }
    

    
    /*  添加一列 */
    const addColumn = () => {
      selectColumn.value=null
      dColumns.value.pop()  //  先删除操作按钮
      let lastColumn:any=dColumns.value[dColumns.value.length-1]
      let index=parseInt(lastColumn.dataIndex.substring(4))+1   //  处理得到index
    
      dColumns.value.push({title: '列名'+index,dataIndex: 'name'+index, customFilterDropdown: true,align:'left',sorter:false}) //  追加列
      dColumns.value.push({title: '操作',dataIndex: 'operation',fixed: 'right', width: 80, align:'center' })  //  补全操作按钮
      
      //  补全对象属性
      let temp = JSON.parse(JSON.stringify(fixedData.value[0]))
      temp['name'+index] = null
      fixedData.value[0] = temp
    }

    /*  删除一列 */
    const delColumn = (dataIndex :string) => {
      if(selectColumn.value!=null&&selectColumn.value.dataIndex==dataIndex)  selectColumn.value=null  //  配置当前选中列 but 点击了删除按钮 

      //  列删除
      let temp=JSON.parse(JSON.stringify(dColumns.value))
      for(let i=0;i<temp.length;i++){
        if(temp[i].dataIndex==dataIndex){
          temp.splice(i,1)
          break
        }
      }
      dColumns.value=temp
      //  列对应的数据也删除
      temp={...fixedData.value[0]}
      delete temp[dataIndex]
      fixedData.value[0]=temp
    }


    /*  清空配置 */  
    const clear = () => {
      loadDColumns()
    }

    
    /*  保存配置 */    
    const save = () => {
      if(!name.value)  return  message.warn("报表名称不能为空！")

      //  效验配置
      let dataColumns:any = {...fixedData.value[0]}
      delete dataColumns['key']
      for(let key in dataColumns){
        if(!dataColumns[key]) return message.warn("SQL列不能为空,请检查配置！")
      }
     
      //  组装数据 得到 最终结果
      let result:any = []
      let columns:any = JSON.parse(JSON.stringify(dColumns.value))
      for(let i=1;i<columns.length-1;i++){
        delete columns[i].customFilterDropdown
        result.push(columns[i])
        for(let key in dataColumns){
            if(columns[i].dataIndex==key){
              result[i-1].dataIndex=dataColumns[key]
            }
        }
      }

      let obj = {
        name:name.value,
        ds_id:ds_id.value,
        page:page.value,
        bordered:bordered.value,
        columns:JSON.stringify(result)
      }

      //  add or edit
      if(data_id.value){
        updateData(obj,data_id.value).then(response => {
            const res: any = response.data
            if(res.code == 280){
              Modal.success({
                title: res.msg,
                content: h('div', {}, [
                  h('p', '点击按钮关闭窗口'),
                ]),
                onOk() {
                  window.close()
                },
              })
            }else{
              message.error(res.msg)
            }
        })
      }else{
        saveData(obj).then(response => {
            const res: any = response.data
            if(res.code == 280){
              Modal.success({
                title: res.msg,
                content: h('div', {}, [
                  h('p', '点击按钮关闭窗口'),
                ]),
                onOk() {
                  window.close()
                },
              })
            }else{
              message.error(res.msg)
            }
        })
      }

    }

    // 报表名称
    const reportName = (val:string) =>{
      name.value = val
    }
    const reportPage = (val:string) =>{
      page.value = val
    }
    const reportBordered = (val:number) =>{
      bordered.value = val
    }



    return {
      sqlColumn,
      visible,
      dsList,
      ds_id,
      dColumns,
      fixedData,
      name,
      page,
      bordered,
      selectColumn,
      data_id,
      loadDColumns,
      chooseDataSource,
      addColumn,
      delColumn,
      clear,
      save,
      reportName,
      reportPage,
      reportBordered
    }

  },
  watch: {},
  computed:{ },
  created() {
    //  获取数据库列表数据 用作处理数据
    listData(null).then(response => {
          const res: any = response.data
          if(res.code == 280){
            this.dsList = res.data
            this.loadDColumns()
          }else{
            message.error(res.msg)
          }
    })
  },
  methods: {},
  components: { ReportData, ReportSetting, ColumnSetting ,DeleteTwoTone ,SettingFilled ,AppstoreAddOutlined},
});
</script>
<style lang="less" scoped>
#components-table-demo-summary tfoot th,#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme='dark'] #components-table-demo-summary tfoot th,[data-theme='dark'] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}

.chooseDataSource{
  height: calc(100vh);
  border-right: 1px #cccccc solid;
  display: grid;

  button{
    align-self: center;
    justify-self: center;
  }
}

.content{
  height: calc(100vh);
  border-left: 1px #cccccc solid;
  border-right: 1px #cccccc solid;

  .tableIcon{
    font-size: 24px;
    padding: 1px;
    margin-left: 5px;
  }
  .tableIcon:hover{
    padding: 0px;
    border: 1px red solid;
  }
  .tableIconActive {
    padding: 0px;
    border: 1px red solid;
  }
}

</style>