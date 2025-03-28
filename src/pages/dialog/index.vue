<script setup lang="tsx">
import FormDemo from '@/pages/form/index.vue'
import { promiseTimeout } from '@vueuse/core'

function open() {
  createDialog({
    title: '测试mapbox',
    fullscreen: true,
    render: () => <div />,
  })
}

function open1() {
  createDialog({
    title: '测试form',
    render: () => <FormDemo />,
  })
}

async function open2() {
  return promiseTimeout(3000)
}
</script>

<template>
  <el-button type="danger" @click="open">
    全屏地图弹窗
  </el-button>
  <el-button type="success" @click="open1">
    表单弹窗
  </el-button>
</template>
