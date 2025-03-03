<script setup lang="ts">
import type { SwitchInstance } from 'element-plus'
import Dark from '@/components/icons/dark.vue'
import Light from '@/components/icons/light.vue'
import { useDark, useToggle } from '@vueuse/core'
import { ref, watch } from 'vue'

defineOptions({ inheritAttrs: false })

const isDark = useDark()

const toggleDark = useToggle(isDark)

const darkMode = ref(isDark.value)
const switchRef = ref<SwitchInstance>()

watch(
  () => darkMode.value,
  () => {
    toggleDark()
  },
)
</script>

<template>
  <el-switch
    ref="switchRef"
    v-model="darkMode"
    v-bind="$attrs"
    :active-action-icon="Dark"
    :inactive-action-icon="Light"
  />
</template>

<style lang="scss" scoped>
:deep(.el-switch__core) {
  --el-switch-on-color: #f2f2f2;
  --el-switch-off-color: #f2f2f2;
  --el-switch-border-color: #dcdfe6;

  .el-switch__action {
    width: 14px;
    height: 14px;
  }
}

:deep(.dark-icon) {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}

:deep(.light-icon) {
  color: #606266;
}
</style>
