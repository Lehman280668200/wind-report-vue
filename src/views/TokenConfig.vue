<template>
  <div class="">
     <a-divider>全局Token授权配置</a-divider>
     <div class="form">
       <a-textarea
        v-model:value="token"
        placeholder="Access_token"
        :auto-size="{ minRows: 10, maxRows: 10 }"
        />
        <a-button type="primary" size="large" @click="save">应用配置</a-button>
     </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from "vue"
import { message } from 'ant-design-vue'
export default defineComponent({
  setup() {
    
    const token = ref<string>('')

    const save = ()=>{
      localStorage.setItem('ACCESS_TOKEN',token.value)
      message.success('应用成功！')
    }


  return{
    token,
    save
   }
  },
  watch: {},
  computed: {},
  mounted(){
    let local = localStorage.getItem('ACCESS_TOKEN')
    if(local) this.token = local
  },
  components: {},
});
</script>
<style lang="less" scoped>
.form{
  width: 85%;
  margin: auto;
  button{
    width: 100%;
    margin-top: 24px;
  }
}
</style>