<script setup lang='tsx'>
const emit = defineEmits(['test'])
</script>

<template>
  <el-button @click="emit('test')">
    click
  </el-button>
</template>

<style lang='scss' scoped>

</style>
