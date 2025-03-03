<script setup lang='tsx'>
import * as api from '@/api/authority'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Edit from './edit.vue'

const table = ref<ITableInstance>()
const queryParams = reactive<Params>({})

const columns = ref<ITableColumn[]>([
  { label: '菜单名称', prop: 'name' },
  { label: '权限', prop: 'perms' },
  { label: '组件', prop: 'component' },
  { label: '路由', prop: 'path' },
  {
    label: '创建时间',
    prop: 'created_ts',
    render: ({ row }) => dayjs(row.created_ts).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    label: '操作',
    width: 190,
    render: ({ row }) => [
      <el-button link type="primary" onClick={() => openEdit(row, false)}>编辑</el-button>,
      <el-button link type="primary" onClick={() => openEdit({ parent_id: row._id })}>
        新增
      </el-button>,
      <el-button link type="danger" onClick={() => del(row)}>删除</el-button>,
    ],
  },
])

function openEdit(row?: Params, isAdd: boolean = true) {
  createDialog({
    title: !isAdd ? '编辑' : '新增',
    render: () => <Edit row={row} isAdd={isAdd} />,
    afterSave: () => table.value.getData(),
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
    table.value.getData()
    ElMessage.success('删除成功。')
  }
}
</script>

<template>
  <ITable
    ref="table"
    :columns="columns"
    :query-params="queryParams"
    :pagination="false"
    row-key="_id"
    :request="api.getList"
  >
    <template #action>
      <el-button type="primary" @click="openEdit()">
        新增
      </el-button>
      <!-- <el-button type="danger" @click="del()">
        删除
      </el-button> -->
    </template>
    <template #search>
      <el-input v-model="queryParams.name" label="菜单名称" />
    </template>
  </ITable>
</template>

<style lang='scss'>
</style>
