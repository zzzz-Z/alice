<script setup lang='tsx'>
import { ElSelect } from 'element-plus'

defineProps<{ options: any[] }>()
defineSlots<InstanceType<typeof ElSelect>['$slots']>()
</script>

<template>
  <ElSelect>
    <template v-for="(_, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
    <el-option
      v-for="item in (options!)"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </ElSelect>
</template>

<style lang='scss' scoped>

</style>
