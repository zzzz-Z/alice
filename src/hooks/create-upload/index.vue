<script setup lang="ts">
import type { ImportParams } from './index';
import { ElMessage } from 'element-plus';

const props = defineProps<ImportParams>()

const list = ref<Params[]>([]);
function downTemplate() {}
function change() {}

async function save() {
  const file = list.value[0]?.raw;
  if (!file) {
    ElMessage.warning('请导入文件');
    return;
  }
  return props.request({ file });
}

defineExpose({ save });
</script>

<template>
  <el-upload
    v-model:file-list="list"
    :limit="1"
    action="#"
    :accept="props.accept"
    :auto-upload="false"
    drag
    @change="change"
  >
    <el-icon class="el-icon--upload">
      <i-ep-upload-filled />
    </el-icon>
    <div class="el-upload__text">
      将文件拖到此处，或点击上传
    </div>
    <template #tip>
      <div class="text-center el-upload__tip">
        <span v-if="accept">仅允许导入{{ accept }}格式文件。</span>
        <el-link
          v-if="props.template"
          type="primary"
          :underline="false"
          style="font-size: 12px; vertical-align: baseline" @click="downTemplate"
        >
          下载模板
        </el-link>
      </div>
    </template>
  </el-upload>
</template>
