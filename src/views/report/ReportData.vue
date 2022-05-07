<template>

  <!-- report -->
  <div class="report-div">
     <a-row type="flex" align="middle">
      <a-col :span="6">
        <div class="report report-add">
          <img @click="reportAdd" :src="new_excel" alt="" />
          <div class="foot"></div>
        </div>
      </a-col>
      <template v-for="(item,index) in data" :key="index">
        <a-col :span="6">
          <div class="report">
            <img @click="reportEdit" :src="excel" alt="" />
            <div class="foot">
              <span class="name">{{item.name}}</span>
              <span class="operate">
                 <a @click="reportCollect(item)" title="收藏">
                    <star-filled v-if="item.collect==1" style="color:#ffeb3b;" />
                    <star-outlined v-else />
                 </a>
                 <a-popconfirm
                  v-if="data.length"
                  :title="'确定删除【'+item.name +'】?'"
                  @confirm="reportDelete(item.data_id)" >
                    <delete-outlined />
                  </a-popconfirm>
                <a href="" title="复制"> <copy-outlined /></a>
              </span>
            </div>
          </div>
        </a-col>
      </template>
    </a-row>
  </div>
  <!-- page -->
  <a-pagination show-quick-jumper 
      v-model:current="current"
      v-model:page-size="pageSize" 
      @change="changePage" 
      :total="total"
      :show-total="total => `共 ${total} 条`"  />
  
</template>
<script lang="ts">
import { defineComponent,ref } from "vue"
import {
  DeleteOutlined,
  StarOutlined,
  CopyOutlined,
  StarFilled,
} from "@ant-design/icons-vue"
import { pageData,updateData,deleteData } from '@/api/ReportDataApi'
import { message } from 'ant-design-vue'


//  数据报表对象
interface reportData {
  data_id?: string
  name?: string
  ds_id?: string
  columns?: string
  collect?: number
  create_date?: string
}
export default defineComponent({
  setup() {

    const current = ref<number>(1)  //  当前页码
    const pageSize = ref<number>(10)  //  每页展示数量
    const data = ref<reportData[]>([])  //  数据报表数据
    const total = ref<number>(0) //  数据报表总数


    //  加载表格数据
    const loadData = () =>{
      pageData(null,current.value,pageSize.value).then(response => {
        const res: any = response.data
        if(res.code == 280){
          data.value = res.data.data
          total.value = res.data.count
        }else{
          message.error(res.msg)
        }
      })
    }

    //  新建报表
    const reportAdd = () => {
      window.open("/design")
    }

    //  编辑报表
    const reportEdit = () => {
      window.open("/design")
    }

    // 收藏/取消收藏 报表
    const reportCollect = (item:reportData) =>{
      let temp = {...item}
      temp.collect = temp.collect==1?0:1
      updateData(temp,(temp.data_id as string)).then(response => {
        const res: any = response.data
        if(res.code == 280){
          message.success(temp.collect==1?'收藏成功':'已取消收藏')
        }else{
          message.error(res.msg)
        }
        loadData()
      })
    }

    // 删除报表
    const reportDelete = (data_id:string) =>{
      deleteData(null,data_id).then(response => {
        const res: any = response.data
        if(res.code == 280){
          message.success(res.msg)
        }else{
          message.error(res.msg)
        }
        loadData()
      })
    }

    // 复制报表
    const reportCopy = (item:reportData) =>{
      let copy = {...item}
      delete copy['data_id']
      delete copy['create_date']
      console.log('insert'+item.name)
    }

    //  分页跳转
    const changePage = (page:any, size:any) =>{
      current.value=page
      pageSize.value=size
      loadData()
    }

    return { 
      current,
      pageSize,
      data,
      total,
      loadData,
      reportAdd,
      reportEdit,
      reportCollect,
      reportDelete,
      reportCopy,
      changePage,
      excel:require('@/assets/excel.jpg'),
      new_excel:require('@/assets/new_excel.jpg'),
    }
  },
  mounted(){
    this.loadData()
  },
  components: {
    DeleteOutlined,
    StarOutlined,
    CopyOutlined,
    StarFilled,
  },
});
</script>
<style scoped lang="less">
.report-div{
  height: calc(90vh);
  overflow: auto;
  margin: 16px;


  .report {
    margin: 18px;

    img {
      width: 100%;
    }
    img:hover{
      cursor:pointer;
      box-shadow: 10px -10px 0px rgba(0,0,0,0.3);
    }
    .foot {
      background-color: #2c3e50a8;
      width: 100%;
      height: 32px;
      line-height: 32px;
      color: white;
      padding: 0 10px;
      a {
        color: white;
        padding: 5px;
      }
      .name {
        float: left;
      }
      .operate {
        float: right;
      }
    }
  }
}

</style>
