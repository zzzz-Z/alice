<script setup lang="ts">
import { zhCn } from '@/config';
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>
