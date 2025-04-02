<script setup lang='tsx'>
import * as api from '@/api/user'
import { IForm, ISelect } from '@/components'
import { createDialog } from '@/hooks/create-dialog'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Edit from './edit.vue'

const table = ref<ITableInstance>()
const queryParams = reactive<Params>({})
const ctx = getCurrentInstance()!
ctx.proxy!.test = '1'

const columns = ref<ITableColumn[]>([
  { label: '用户名', prop: 'username' },
  { label: '角色', prop: 'role' },
  { label: '邮箱', prop: 'email' },
  {
    label: '创建时间',
    prop: 'created_ts',
    render: ({ row }) => dayjs(row.created_ts).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    label: '操作',
    width: 190,
    render: ({ row }) => [
      <el-button link type="primary" onClick={() => openEdit(row)}>编辑</el-button>,
      <el-button link type="primary" onClick={() => openPassword(row)}>修改密码</el-button>,
      <el-button link type="danger" onClick={() => del(row)}>删除</el-button>,
    ],
  },
])

function openEdit(row?: any) {
  createDialog({
    width: '500px',
    modalClass: 'system-dialog',
    title: row ? '编辑' : '新增',
    render: () => <Edit row={row} />,
    afterSave: table.value?.getData,
  }) // 打开编辑页面
}

function openPassword(row?: any) {
  const model = reactive({
    password: '',
    _id: row._id,
  })

  createDialog({
    width: 400,
    title: row ? '编辑' : '新增',
    afterSave: table.value?.getData,
    render: () => (
      <IForm span={24} model={model}>
        <el-input
          v-model={model.password}
          prop="password"
          required
          label="密码"
          type="password"
          show-password
        />
      </IForm>
    ),
  })
}

async function del(row?: Params) {
  await ElMessageBox.confirm('确认删除吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  const res = await api.del(row)
  if (!res.error) {
    table.value?.getData()
    ElMessage.success('删除成功。')
  }
}

function contextmenu() {

}
</script>

<template>
  <ITable
    ref="table"
    :columns="columns"
    :query-params="queryParams"
    :data="[{ username: 'zcc' }, { username: 'zcc' }]"
    @row-contextmenu="contextmenu"
  >
    <template #action>
      <el-button type="primary" @click="openEdit()">
        新增
      </el-button>
    </template>
    <template #search>
      <el-input v-model="queryParams.username" label="用户名" />
      <ISelect
        v-model="queryParams.role"
        :allow-create="true"
        multiple
        :options="[{ label: '管理员', value: 'admin' }]"
        label="角色"
      />
      <el-input v-model="queryParams.email" label="邮箱" />
      <el-input v-model="queryParams.email" label="邮箱" />
    </template>
  </ITable>
</template>

<style lang='scss'>
</style>
