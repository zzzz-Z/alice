<script setup lang="ts">
import type { FormInstance, FormProps } from 'element-plus'
import type { ConcreteComponent, Slot, VNode } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { formItemProps } from 'element-plus'
import { isString, isUndefined } from 'lodash'
import { cloneVNode, Comment, Fragment } from 'vue'

type Props = Partial<FormProps> & {
  options?: FormItemOption[]
  span?: number
  gutter?: number
}

const {
  showMessage = true,
  labelWidth = 'auto',
  span = 24,
  gutter = 16,
  options,
  ...props
} = defineProps<Props>()

const slots = defineSlots<Record<string, Slot>>()

const form = ref<FormInstance>()

/**
 * 根据表单项配置获取验证消息和节点
 * @param _props 表单项配置对象
 * @returns 返回包含消息和节点的对象
 */
function getPlaceholder(_props: FormItemOption) {
  const node: VNode = _props.node || _props.render?.()
  const componentName = (node.type as ConcreteComponent).name?.toLocaleLowerCase()
  const prefix = componentName ? (componentName?.includes('input') ? '请输入' : '请选择') : ''
  const label = _props.label || node.props?.label
  const placeholder = node.props?.placeholder || (prefix ? prefix + label : '')
  return placeholder
}

/**
 * 移除对象中值为 undefined 的属性
 *
 * @param obj {Params} - 输入的对象，其类型为 Params
 * @returns {Params} - 返回一个新的对象，其中不包含值为 undefined 的属性
 */
function removeUndefinedProps(obj: Params): Params {
  // 将对象转换为键值对数组，过滤掉值为 undefined 的键值对，再将其转换回对象
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  )
}

/**
 * 格式化表单项属性
 * @returns 返回格式化后的表单项属性
 */
function formatItemProps({ rule, required, validator, ..._props }: FormItemOption) {
  const propsKeys = Object.keys(formItemProps)
  const _required = !isUndefined(required) && required !== false

  const prop = (_props as any)['onUpdate:modelValue']
    ?.toString()
    .replace(/\(\$event\)\s*=>\s*\$setup\.|\s*=\s*\$event/g, '')
    .split('.')
    .slice(1)
    .join('.')

  const rules = removeUndefinedProps({
    message: _required && !validator ? getPlaceholder(_props) : undefined,
    required: _required,
    trigger: ['blur', 'change'],
    validator,
    ...rule,
  })

  const itemProps: Params = { prop, rules }

  propsKeys.forEach((key) => {
    const v = (_props as Params)[key]
    if (!isUndefined(v)) {
      itemProps[key] = v
    }
  })

  return itemProps
}

/**
 * 渲染节点函数，根据表单项配置渲染对应的组件节点
 * @param _props 表单项配置对象
 * @returns 返回渲染后的节点
 */
function RenderNode(_props: FormItemOption) {
  const node: VNode = _props.node || _props.render?.()
  const params = {
    teleported: false,
    clearable: true,
    filterable: true,
    placeholder: getPlaceholder(_props),
  }
  return isString(node.type) ? node : cloneVNode(node, params)
}

/**
 * 将插槽内容转换为表单项选项数组
 * 此函数用于处理默认插槽中的节点，过滤掉注释节点，并将剩余节点的属性和渲染方法转换为FormItemOption对象
 */
function slotToOptions() {
  return slots
    .default?.()
    // 使用 template 包裹的节点 <template v-if="false" />
    .flatMap(node => node.type === Fragment ? node.children : node)
    .filter((node: any) => node.type !== Comment)
    .map((node: any) => ({
      ...node.props,
      node,
      type: node.type,
      render: () => node,
    }))
}

defineExpose(forwardRef(form))
</script>

<template>
  <ElForm v-bind="props" ref="form" class="i-form" :show-message :label-width>
    <!-- 行组件，设置栏间距 -->
    <ElRow :gutter="gutter">
      <!-- 遍历表单项配置，生成表单项 -->
      <template v-for="(item, _n) in slots.default ? slotToOptions() : options" :key="_n">
        <ElCol v-if="item.show?.() !== false" :span="item.span || span">
          <RenderNode v-if="!isUndefined(item.block) && !isString(item.type) " v-bind="item" />
          <ElFormItem v-else v-bind="formatItemProps(item)">
            <template #label>
              {{ item.label }}
              <ElTooltip
                v-if="item.tooltip"
                effect="dark"
                popper-class="form-label-tooltip"
                :content="item.tooltip"
                placement="top"
                raw-content
              >
                <ElIcon>
                  <InfoFilled />
                </ElIcon>
              </ElTooltip>
            </template>
            <!-- 渲染表单项组件 -->
            <RenderNode v-bind="item" />
          </ElFormItem>
        </ElCol>
      </template>
    </ElRow>
  </ElForm>
</template>

<style lang="scss">
.form-label-tooltip {
  max-width: 500px;
}

.i-form {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-form-item__label {
    display: flex;
    align-items: center;
  }

  .el-input-number,
  .el-date-editor {
    width: 100%;
  }

  .el-input__inner {
    text-align: left;
  }
}
</style>
