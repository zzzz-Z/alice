<script setup lang='tsx'>
import type { ButtonProps, ElTooltipProps, MessageOptions, PopconfirmProps } from 'element-plus'
import { isObject } from '@vueuse/core'
import { ElMessageBox } from 'element-plus'
import { mergeProps } from 'vue'

type Props = Partial<ButtonProps> & {
  tooltip?: string | Partial<ElTooltipProps>
  popConfirm?: Partial<PopconfirmProps>
  msgBox?: Partial<MessageOptions>
  onClick?: (evt?: Event, loading?: Ref<boolean>) => Promise<any> | void
}

defineOptions({ inheritAttrs: false })
const { popConfirm, msgBox, tooltip, onClick, ...props } = defineProps<Props>()
const slots = defineSlots()
const attrs = useAttrs()
const loading = ref(false)
const tooltipRef = ref()

const tooltipProps = computed(() =>
  isObject(tooltip)
    ? tooltip
    : { effect: 'dark', placement: 'top', content: tooltip },
)

function click(evt?: Event) {
  tooltipRef.value?.hide?.()
  return onClick?.(evt, loading)
}

async function customClick(evt: MouseEvent) {
  try {
    if (msgBox) {
      msgBoxConfirm()
    }
    else {
      loading.value = true
      await click(evt)
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    loading.value = false
  }
}

function msgBoxConfirm() {
  ElMessageBox.confirm(msgBox!.message, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    beforeClose: async (action, ctx, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      try {
        ctx.confirmButtonLoading = true
        await click()
      }
      finally {
        ctx.confirmButtonLoading = false
        done()
      }
    },
    ...msgBox,
  }).catch(() => {})
}

function RenderBtn(_props: Params) {
  return (
    <el-button
      {...mergeProps(props, attrs, _props)}
      loading={loading.value}
      v-slots={{
        default: slots.default,
      }}
    />
  )
}
</script>

<template>
  <!-- 根据 popConfirm 属性决定是否显示确认框 -->
  <el-popconfirm
    v-if="popConfirm"
    v-bind="popConfirm"
    confirm-button-text="确定"
    cancel-button-text="取消"
    @confirm="customClick"
  >
    <template #reference>
      <el-tooltip v-if="!!tooltip" v-bind="tooltipProps" ref="tooltipRef">
        <RenderBtn />
      </el-tooltip>
      <RenderBtn v-else />
    </template>
  </el-popconfirm>

  <!-- 根据 tooltip 属性决定是否显示工具提示 -->
  <el-tooltip v-else-if="!!tooltip" v-bind="tooltipProps" ref="tooltipRef">
    <RenderBtn @click="customClick" />
  </el-tooltip>

  <!-- 如果没有 popConfirm 和 tooltip 属性，则直接渲染按钮 -->
  <RenderBtn v-else @click="customClick" />
</template>
