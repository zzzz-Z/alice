<script setup lang='tsx'>
import * as authority from '@/api/authority'
import * as api from '@/api/role'
import IButton from '@/components/i-button/index.vue'
import { createDialog } from '@/hooks/create-dialog'
import { useAsyncData } from '@/hooks/use-async-data'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import Edit from './edit.vue'

const table = ref<ITableInstance>()
const queryParams = reactive<Params>({})
const [tree] = useAsyncData(authority.getList)

const columns = ref<ITableColumn[]>([
  { label: '角色名称', prop: 'name' },
  { label: '角色编码', prop: 'key' },
  { label: '描述', prop: 'description' },
  {
    label: '创建时间',
    prop: 'created_ts',
    render: ({ row }) => dayjs(row.created_ts).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    width: 190,
    label: '操作',
    render: ({ row }) => [
      <el-button link type="primary" onClick={() => openEdit(row)}>编辑</el-button>,
      <el-button link type="primary" onClick={() => bindPermission(row)}>绑定权限</el-button>,
      <IButton link type="danger" onClick={() => del(row)}>删除</IButton>,
    ],
  },
])

function openEdit(row?: any) {
  createDialog({
    width: '500px',
    title: row ? '编辑' : '新增',
    render: () => <Edit row={row} />,
    afterSave: () => table.value?.getData(),
  }) // 打开编辑页面
}

function bindPermission(row?: any) {
  const model = reactive({ permission_ids: [], _id: row._id })
  // const [ids] = useAsyncData(() => api.permissions(row), {
  //   resolve: () => {
  //     model.permission_ids = ids.value
  //   }
  // })
  createDialog({
    width: 400,
    title: '绑定权限',
    afterSave: table.value?.getData,
    render: () => (
      <i-form span={24} model={model}>
        <el-tree-select
          v-model={model.permission_ids}
          prop="permission_ids"
          required
          label="权限"
          node-key="_id"
          multiple
          render-after-expand={false}
          show-checkbox
          check-strictly
          check-on-click-node
          props={{ label: 'name' }}
          data={tree.value}
        />
      </i-form>
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
</script>

<template>
  <ITable ref="table" :columns="columns" :query-params="queryParams" :request="api.getList" :extra-height="50">
    <template #action>
      <el-button type="primary" @click="openEdit()">
        新增
      </el-button>
      <!-- <el-button type="danger" @click="del()">
        删除
      </el-button> -->
    </template>
    <template #search>
      <el-input v-model="queryParams.name" label="名称" />
    </template>
  </ITable>
</template>

<style lang='scss'>
</style>
