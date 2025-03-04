<script lang="tsx" setup>
import type { PageHeaderInstance, TableInstance } from 'element-plus'
import type { Slot } from 'vue'
import { forwardRef } from '@/hooks/forward-ref'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElCol, ElMessage, ElTable, ElTableColumn } from 'element-plus'
import saveAs from 'file-saver'
import { cloneDeep, isObject } from 'lodash'
import { cloneVNode, createVNode } from 'vue'
import { tableProps } from './props'

defineOptions({ name: 'ITable' })

const {
  request,
  immediate = true,
  pagination = true,
  index = true,
  height,
  container,
  queryParams = {},
  exportCfg,
  importCfg,
  columns = [],
  data = [],
  rowKey = 'id',
  requestCfg,
  ...props
} = defineProps(tableProps)

const emit = defineEmits(ElTable.emits!)

const slots = defineSlots<Record<'action' | 'search' | 'append' | 'default' | 'header', Slot>>()

const listener = ElTable.emits!.reduce(
  (events, event) => ({ ...events, [event]: (...args: any[]) => emit(event, ...args) }),
  {},
)

const flexLayout = { xl: 4, lg: 6, md: 8, sm: 12, xs: 24 }

const rawQueryParams = reactive(cloneDeep(queryParams))

const _requestCfg = {
  size: 'pageSize',
  page: 'pageNum',
  total: 'total',
  list: 'rows',
  ...requestCfg,
}

const _pagination = reactive({
  total: 0,
  page: 1,
  size: 10,
})

const dataSource = ref<any[]>(data)
const loading = ref(false)
const customHeight = ref(height)
const table = ref<TableInstance>()
const root = ref<HTMLDivElement>()
const header = ref<HTMLDivElement>()
const search = ref<HTMLDivElement>()
const action = ref<HTMLDivElement>()
const paginationRef = ref<PageHeaderInstance>()
const [isUnfold, toggle] = useToggle()

const store = ref<Params>({})

const selection = computed({
  get: () => store.value.states.selection,
  set: v => store.value.states.selection = v,
})

watch(
  () => data,
  v => (dataSource.value = v),
  { deep: true },
)

onMounted(() => {
  if (immediate) {
    getData()
  }

  if (!height) {
    useResizeObserver([root, header, search, action], computedHeight)
  }
})

function getRefHeight(domRef: Ref, extraHeight = 0) {
  const dom = unref(domRef)
  const h = dom?.offsetHeight ?? dom?.$el?.offsetHeight ?? 0
  return h ? h + extraHeight : h
}

function computedHeight() {
  if (!unref(root)) {
    return
  }

  const { paddingTop, paddingBottom } = getComputedStyle(root.value!)
  const rootPadding = [paddingTop, paddingBottom]
    .map(s => Number(s.replace('px', '')))
    .reduce((p, n) => p + n, 0)

  customHeight.value
    = getRefHeight(root)
      - getRefHeight(header)
      - getRefHeight(search)
      - getRefHeight(action)
      - getRefHeight(paginationRef)
      - rootPadding
      - 22// search(margin-bottom:10) + el-card__header(border-bottom:1)
}

async function getData(_params?: Params) {
  if (!request) {
    return
  }

  const params = {
    ...queryParams,
    ..._params,
    [_requestCfg.size!]: _pagination.size,
    [_requestCfg.page!]: _pagination.page,
  }

  loading.value = true
  const res = await request!(params)?.finally?.(() => (loading.value = false))

  if (!res) {
    return
  }

  if (res?.code) {
    if (pagination) {
      dataSource.value = res?.[_requestCfg.list!]
      _pagination.total = res?.[_requestCfg.total!] || 0
    }
    else {
      dataSource.value = res?.data
    }
  }
  else {
    dataSource.value = []
    _pagination.total = 0
    ElMessage.error(res?.msg)
  }
}

function reset() {
  _pagination.page = 1
  Object.keys(queryParams).forEach((key) => {
    const rawValue = rawQueryParams[key]
    queryParams![key] = isObject(rawValue) ? cloneDeep(rawValue) : rawValue
  })

  if (immediate) {
    getData()
  }
  else {
    dataSource.value = []
    _pagination.total = 0
  }
}

function query() {
  _pagination.page = 1
  getData()
}

function change(n: number) {
  _pagination.page = n
  getData()
}

function sizeChange(n: number) {
  _pagination.size = n
  getData()
}

function cellDblclick(row: Params, { property }: Params) {
  navigator.clipboard?.writeText?.(row[property])
  // ElMessage.success(`已复制至剪切板--(${row[property]})`)
}

async function exportData() {
  const res = await exportCfg?.request?.(queryParams)
  if (res) {
    saveAs(res, exportCfg?.title)
    ElMessage.success('导出成功。')
  }
  else {
    ElMessage.error('导出失败。')
  }
}

function RenderColumns(props: { columns: ITableColumn[] }) {
  return props.columns
    ?.filter(({ show }) => show?.() !== false)
    .map(
      ({ columns, formatter, render, renderDefault, renderHeader, ...props }) => (
        <ElTableColumn
          showOverflowTooltip={true}
          minWidth={/日期|时间/.test(props.label!) ? 190 : 130}
          formatter={(...p) => render?.({ row: p[0], columns: p[1], value: p[2], index: p[3] }) ?? p[2] ?? '-'}
          {...props}
          v-slots={{
            default: columns ? () => RenderColumns({ columns }) : renderDefault,
            header: renderHeader,
          }}
        />
      ),
    )
}

function onKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    getData()
  }
}

function RenderSearch() {
  return slots
    .search?.()
    .filter(node => node.type !== Comment)
    .filter((_, n) => isUnfold.value || n < 3)
    .map(node => (
      <ElCol
        class="mb-10px"
        {...flexLayout}
        v-slots={{ default: () => createVNode(
          node,
          { clearable: true, onKeyup },
          { prefix: () => <el-text>{node.props?.label}</el-text> },
        ) }}
      />
    ))
}

function RenderAction() {
  return slots
    .action?.()
    .filter(node => node.type !== Comment)
    .map(node => cloneVNode(node, { plain: true }))
}

defineExpose(forwardRef(table, {
  getData,
  reset,
  rawQueryParams,
  dataSource,
  selection,
  store,
  _pagination,
}))
</script>

<template>
  <div ref="root" class="i-table">
    <!-- 渲染表头插槽 -->
    <div v-if="slots.header" ref="header" class="table-header">
      <slot name="header" />
    </div>
    <!-- 渲染搜索区域 -->
    <el-row v-if="slots.search" ref="search" :gutter="20" class="table-search">
      <RenderSearch />
      <ElCol v-bind="flexLayout" class="pb-10px">
        <el-button type="primary" plain @click="reset">
          重置
        </el-button>
        <el-button type="primary" @click="query">
          查询
        </el-button>
        <el-button v-if="slots.search!().length >= 3" link type="primary" @click="toggle()">
          {{ !isUnfold ? '展开' : '收起' }}
          <el-icon class="el-icon--right">
            <ArrowDown v-if="!isUnfold" />
            <ArrowUp v-else />
          </el-icon>
        </el-button>
      </ElCol>
    </el-row>
    <!-- 渲染操作区域 -->
    <el-card :body-style="{ padding: '10px 10px 0' }">
      <template v-if="slots.action() || exportCfg || importCfg" #header>
        <div ref="action" class="table-action">
          <RenderAction />
          <el-button v-if="exportCfg" type="primary" plain @click="exportData">
            导出
          </el-button>
        </div>
      </template>

      <!-- 渲染表格 -->
      <ElTable
        ref="table"
        v-loading="loading"
        :row-key="rowKey"
        :height="customHeight"
        :data="dataSource"
        v-bind="props"
        v-on="{ ...listener, 'cell-dblclick': cellDblclick }"
        @vue:mounted="(node:any) => store = node.component.store"
      >
        <ElTableColumn
          v-if="index"
          type="index"
          label="序号"
          :width="70"
          align="center"
        />

        <RenderColumns :columns="columns" />
        <slot />
        <template #empty>
          <el-empty />
        </template>
        <slot name="append" />
      </ElTable>
      <!-- 渲染分页 -->
      <el-pagination
        v-if="pagination"
        ref="paginationRef"
        background
        class="table-pagination"
        :teleported="false"
        layout="total, prev, pager, next, sizes"
        :total="_pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="_pagination.page"
        :page-size="_pagination.size"
        @current-change="change"
        @size-change="sizeChange"
      />
    </el-card>
  </div>
</template>

<style lang="scss">
.i-table {
  height: 100%;
  width: 100%;
  padding: 8px;

  .el-card {
    border: none;
  }

  .el-card__header {
    padding: 0;
  }
}

.table-search {
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  padding-top: 15px;
  padding-bottom: 5px;
  margin: 0 !important;
  margin-bottom: 10px !important;
  border-radius: 4px;
  box-sizing: content-box;
}

.table-action {
  padding: 10px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
}

.table-pagination {
  padding: 10px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  justify-content: end;
}
</style>
