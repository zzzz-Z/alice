<script setup lang='tsx'>
import type { FormInstance } from 'element-plus';
import * as role from '@/api/role';
import * as api from '@/api/user';

const props = defineProps<{ row: Params }>()

const form = ref<FormInstance>()
const model = reactive<Params>({
  ...props.row,
  user: { name: '' }
})
const [roles] = useAsyncData(role.getList, {
  transform: d => ({
    label: d.name,
    value: d._id,
  }),
})

onMounted(async () => {
  // if (props.row) {
  //   const res = await api.getList({ _id: props.row._id })
  //   if (!res.error) {
  //     model.role_ids = res.data.roles.map(d => d._id)
  //   }
  // }
})

async function save() {
  return !props.row ? api.create(model) : api.edit(model)
}

defineExpose({ save, form })
</script>

<template>
  <IForm ref="form" :model="model">
    <el-input
      v-model="model.user.name"
      required
      label="用户名"
    />
    <el-input
      v-if="!row"
      v-model="model.password"
      required
      label="密码1"
      type="password"
      show-password
    />
    <el-select-v2
      v-model="model.role_ids"
      multiple
      :options="roles || []"
      required
      label="角色"
    />
    <el-input v-model="model.email" label="邮箱" />
  </IForm>
</template>

<style lang='scss' scoped>

</style>
