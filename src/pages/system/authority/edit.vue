<script setup lang='tsx'>
import type { FormInstance } from 'element-plus';
import * as api from '@/api/authority';
import { routes } from 'vue-router/auto-routes';

const { row, isAdd } = defineProps<{
  row?: Params
  isAdd?: boolean
}>()

const form = ref<FormInstance>()
const model = reactive<Params>({ type: 1, ...row })
const [tree] = useAsyncData(api.getList)

const types = [
  { label: '目录', value: 1 },
  { label: '菜单', value: 2 },
  { label: '按钮', value: 3 },
]

const options = flat(routes)
  .filter(r => r.component)
  .map((r) => {
    const regex = /import\("([^?]+)(\?.*)?"\)/
    const match = String(r.component).match(regex)
    const path = match?.[1]
    return {
      label: path,
      value: path,
    }
  })

function flat(arr = routes): any[] {
  return arr.flatMap(({ children = [], ...r }) => [r, ...flat(children)])
}

async function save() {
  return isAdd
    ? api.create(model)
    : api.edit(model)
}

defineExpose({ save, form })
</script>

<template>
  <IForm ref="form" :model="model" :span="24">
    <el-tree-select
      v-model="model.parent_id"
      :data="tree"
      label="父级"
      node-key="_id"
      :props="{ label: 'name' }"
    />
    <el-select-v2
      v-model="model.type"
      prop="type"
      required :options="types"
      label="类型"
    />
    <el-input
      v-model="model.name"
      prop="name"
      required
      label="名称"
    />
    <el-input
      v-if="model.type !== 3"
      v-model="model.path"
      prop="path"
      required
      label="路由地址"
    />
    <el-select-v2
      v-if="model.type === 2"
      v-model="model.component"
      :options="options"
      prop="component"
      required
      label="组件路径"
    />
    <el-input
      v-if="model.type !== 1"
      v-model="model.perms"
      prop="perms"
      label="权限字符"
    />
  </IForm>
</template>

<style lang='scss' scoped></style>
