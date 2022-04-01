<template>
  <!-- page -->
  <a-pagination show-quick-jumper :total="500" />

  <!-- report -->
  <a-row type="flex" align="middle">
    <a-col :span="6">
      <div class="report-add" @click="reportClick">
        <appstore-add-outlined />新建报表
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
    <a-col :span="6">
      <div class="report">
        <img @click="reportClick" src="../../assets/excel.jpg " alt="" />
        <div class="foot">
          <span class="name">报表</span>
          <span class="operate"
            ><a href="" title="收藏"> <star-outlined /></a>
            <a href="" title="删除"> <delete-outlined /></a>
            <a href="" title="复制"> <copy-outlined /></a>
          </span>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  DeleteOutlined,
  StarOutlined,
  CopyOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();

    const reportClick = () => {
      console.log(1);
    };
    return { reportClick };
  },
  components: {
    DeleteOutlined,
    StarOutlined,
    CopyOutlined,
    AppstoreAddOutlined,
  },
});
</script>
<style scoped lang="less">
.report {
  margin: 32px;

  img {
    width: 100%;
    height: 195px;
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
.report-add {
  margin: 32px;
  height: 227px;
  line-height: 227px;
  background-color: #2c3e50a8;
  color: white;
  font-size: 20px;
}
</style>
