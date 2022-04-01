<template>
  <div class="wrapper">
    <a-form layout="vertical" :model="formState">
      <a-form-item label="Field A">
        <a-input
          v-model:value="formState.fieldA"
          placeholder="input placeholder"
        />
      </a-form-item>
      <a-form-item label="Field B">
        <a-input
          v-model:value="formState.fieldB"
          placeholder="input placeholder"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, UnwrapRef } from "vue";

export default defineComponent({
  setup() {
    const formState = {
      fieldA: "",
      fieldB: "",
    };
    return {
      formState,
    };
  },
});
</script>
<style lang="less" scoped>
.wrapper {
  height: calc(100vh);
  border: 1px #cccccc solid;
}
</style>