<script setup lang="tsx">
const form = ref<IFormInstance>()
const model = reactive<Params>({
  name: '',
  ids: [],
})

onMounted(() => {
})
</script>

<template>
  <IForm ref="form" :label-width="100">
    <el-input v-model="model.name" label="zcc" />
  </IForm>
</template>

<style lang="scss" scoped></style>
