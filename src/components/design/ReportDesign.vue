<template>
  <a-row>
    <a-col :span="4"> <ReportData :data="dataSources"></ReportData></a-col>
    <a-col :span="16">

      <div style="text-align: right;padding:10px 10px 0px 0px;m">
        <a-button type="primary" danger @click="clear">清空配置</a-button>
        <a-button type="primary" @click="save">保存配置</a-button>
      </div>

      <a-divider><a-tag color="#87d068">表格列配置</a-tag></a-divider>

      <a-table
        :columns="fixedColumns"
        :data-source="fixedData"
        :pagination="false"
        :scroll="{ x: 'max-content', y: 500 }"
        bordered
      >

        <template #bodyCell="{  column,record }">
          <template v-if="column.dataIndex === 'operation'">
            <a @click="addColumn">add </a>
          </template>
          <template v-else-if="column.dataIndex === 'key'">
            #
          </template>
          <template v-else>
              <a-input v-model:value="fixedData[record.key][column.dataIndex]" style="margin: -5px 0" placeholder='粘贴列'  />
          </template>
        </template>

        <template #customFilterIcon="{column  }"> <delete-outlined style="font-size:16px;color:red;" @click="delColumn(column.dataIndex)"/></template>
        <template #customFilterDropdown></template>

        <template #summary>
          <a-table-summary fixed>
            <a-table-summary-row>
                <a-table-summary-cell v-for="(column,index) in fixedColumns" :key="index" :index="index">
                  {{index==0?"合计:":""}}
                </a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>

      </a-table>
      
    </a-col>
    <a-col :span="4"> <ReportSetting></ReportSetting></a-col>
  </a-row>
</template>

<script lang="ts">
import { message, TableColumnsType } from 'ant-design-vue'
import { defineComponent, ref } from "vue"
import ReportData from "./ReportData.vue"
import ReportSetting from "./ReportSetting.vue"
import {
  DeleteOutlined,
} from "@ant-design/icons-vue"

//  数据源-列对象
interface dataSource {
  id:string
  title: string
  column: string
}
//  数据源数据--dev
const dataSources: dataSource[] = [
 {id:"A1",title:'姓名',column:'name'},
 {id:"A2",title:'密码',column:'password'},
 {id:"A3",title:'地址',column:'address'},
 {id:"A4",title:'手机',column:'phone'},
 {id:"A5",title:'邮箱',column:'email'},

]

export default defineComponent({
  setup() {


    const fixedColumns = ref<TableColumnsType>([
      {
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
        width: 100,
      },
      {
        title: '列1',
        dataIndex: 'name1',
      },
      {
        title: '#',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
      },
    ])

    const fixedData = ref<{ key: number; operation:string }[]>([])
    fixedData.value=[{key: 0,operation:'添加一列'}]
    

    
    /*  添加一列 */
    const addColumn = () => {
      fixedColumns.value.pop()  //  先删除操作按钮

      //  处理得到index
      let lastColumn:any=fixedColumns.value[fixedColumns.value.length-1]
      let index=parseInt(lastColumn.dataIndex.substring(4))+1

      //  追加列
      fixedColumns.value.push({
        title: '列'+index,
        dataIndex: 'name'+index,
        customFilterDropdown: true,
      })
       fixedColumns.value.push({
        title: '#',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
      })
    }


    /*  删除一列 */
    const delColumn = (dataIndex :any) => {
      //  列删除
      let temp=JSON.parse(JSON.stringify(fixedColumns.value))
      for(let i=0;i<temp.length;i++){
        if(temp[i].dataIndex==dataIndex){
          temp.splice(i,1)
          break
        }
      }
      fixedColumns.value=temp
      //  列对应的数据也删除
      temp=JSON.parse(JSON.stringify(fixedData.value[0]))
      delete temp[dataIndex]
      fixedData.value[0]=temp

    }


    /*  清空配置 */  
    const clear = () => {
      fixedColumns.value=[{
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
        width: 100,
      },
      {
        title: '列1',
        dataIndex: 'name1',
      },
      {
        title: '#',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
      }]
      fixedData.value=[{key: 0,operation:'添加一列'}]
    }

    
    /*  保存配置 */    
    const save = () => {
      //  组装数据
      let columns=JSON.parse(JSON.stringify(fixedColumns.value))
      columns.shift()
      columns.pop()
      let data=JSON.parse(JSON.stringify(fixedData.value[0]))
      for(let i=0;i<columns.length;i++){
         for(let key in data){
           columns[i].column=''
           if(columns[i].dataIndex==key){
              columns[i].column=data[key]
              break
           }
        }
      }
      //  效验配置
      for(let i=0;i<columns.length;i++){
        let flag=false
         for(let j=0;j<dataSources.length;j++){
           if(columns[i].column==dataSources[j].column){
             flag=true
             break
           }
         }
         if(!flag) return message.warn('表格列配置与数据源的列无法对应,请检查！')
      }
      message.success("保存成功")
    }



    return {
      dataSources,
      fixedColumns,
      fixedData,
      addColumn,
      delColumn,
      clear,
      save,
    }

  },
  watch: {},
  computed: {},
  methods: {},
  components: { ReportData, ReportSetting ,DeleteOutlined},
});
</script>
<style lang="less" scoped>
#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme='dark'] #components-table-demo-summary tfoot th,
[data-theme='dark'] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
</style>