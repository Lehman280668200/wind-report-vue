<template>
  <a-table :columns="columns" :data-source="data">
    <template #tag="{ text: tag }">
      <span>
        <a-tag
          :color="
            tag === 'MySQL'
              ? 'green'
              : tag === 'Oracle'
              ? 'geekblue'
              : 'volcano'
          "
        >
          {{ tag }}
        </a-tag>
      </span>
    </template>
    <template #name="{ text }">
      <a>{{ text }}</a>
    </template>
    <template #customTitle>
      <span>
        <smile-outlined />
        Name
      </span>
    </template>
    <template #action="{ record }">
      <span>
        <a>Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a>Delete</a>
        <a-divider type="vertical" />
        <a class="ant-dropdown-link">
          More actions
          <down-outlined />
        </a>
      </span>
    </template>
  </a-table>
</template>
<script lang="ts">
import { SmileOutlined, DownOutlined } from "@ant-design/icons-vue";
import { defineComponent } from "vue";
const columns = [
  {
    title: "数据库类型",
    key: "tag",
    dataIndex: "tag",
    slots: { customRender: "tag" },
  },
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle", customRender: "name" },
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Action",
    key: "action",
    slots: { customRender: "action" },
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tag: "MySQL",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tag: "MySQL",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tag: "Oracle",
  },
];

export default defineComponent({
  setup() {
    return {
      data,
      columns,
    };
  },
  components: {
    SmileOutlined,
    DownOutlined,
  },
});
</script>


<style lang="less" scoped>
</style>