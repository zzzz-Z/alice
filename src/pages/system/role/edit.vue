<script setup lang='tsx'>
import type { FormInstance } from 'element-plus';
import * as api from '@/api/role';

const props = defineProps<{
  row: Params
}>()

const form = ref<FormInstance>()
const model = reactive<Params>({ ...props.row })

function save() {
  return !props.row ? api.create(model) : api.edit(model)
}

defineExpose({ save, form })
</script>

<template>
  <IForm ref="form" :model="model" :span="24">
    <el-input v-model="model.name" prop="name" required label="名称" />
    <el-input v-model="model.key" prop="key" required label="编码" />
    <el-input v-model="model.description" prop="description" label="描述" />
  </IForm>
</template>

<style lang='scss' scoped>

</style>
