<script setup lang="tsx">
import { routes } from 'vue-router/auto-routes'

const columns: ITableColumn[] = [
  { type: 'selection' },
  { prop: 'path', label: 'path' },
  { prop: 'name', label: 'name' },
]

const table = ref<ITableInstance>()
const model = reactive({
  name: '1',
})

onMounted(() => {
})

function click() {
  table.value?.getData()
}
</script>

<template>
  <ITable
    ref="table"
    class="inline-block"
    :immediate="false"
    :columns="columns"
    row-key="path"
    :data="routes"
  >
    <template #search>
      <el-input v-model="model.name" label="姓名" />
      <el-select label="姓名" />
      <el-select label="姓名" />
      <el-select label="姓名" />
      <el-select label="姓名" />
      <el-select label="姓名" />
      <el-select label="姓名" />
    </template>
    <template #action>
      <el-button @click="click">
        click
      </el-button>
    </template>
  </ITable>
</template>
