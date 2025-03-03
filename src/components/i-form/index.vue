<script setup lang="ts">
import type { FormInstance, FormProps } from 'element-plus'
import type { ConcreteComponent, Slot, VNode } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { formItemProps } from 'element-plus'
import { isString, isUndefined } from 'lodash'
import { cloneVNode, Comment, Fragment, mergeProps } from 'vue'

type Props = Partial<FormProps> & {
  options?: FormItemOption[]
  span?: number
  gutter?: number
}

const {
  showMessage = true,
  labelWidth = 'auto',
  span = 12,
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
function getMsg(_props: FormItemOption) {
  const node: VNode = _props.render?.()
  const componentName = (node.type as ConcreteComponent).name?.toLocaleLowerCase()
  const prefix = componentName ? (componentName?.includes('input') ? '请输入' : '请选择') : ''
  const label = _props.label || node.props?.label
  const msg = node.props?.placeholder || (prefix ? prefix + label : '')
  return { msg, node }
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
  const itemProps: Params = {}
  const _required = !isUndefined(required) && required !== false
  const rules = removeUndefinedProps({
    message: _required && !validator ? getMsg(_props).msg : undefined,
    required: _required,
    trigger: ['blur', 'change'],
    validator,
    ...rule,
  })
  propsKeys.forEach(key => itemProps[key] = (_props as Params)[key])
  return mergeProps(itemProps, { rules })
}

/**
 * 渲染节点函数，根据表单项配置渲染对应的组件节点
 * @param _props 表单项配置对象
 * @returns 返回渲染后的节点
 */
function RenderNode(_props: FormItemOption) {
  const { node, msg } = getMsg(_props)

  return isString(node.type)
    ? node
    : cloneVNode(node, {
        teleported: false,
        clearable: true,
        filterable: true,
        placeholder: msg,
      })
}

/**
 * 将插槽内容转换为表单项选项数组
 * 此函数用于处理默认插槽中的节点，过滤掉注释节点，并将剩余节点的属性和渲染方法转换为FormItemOption对象
 */
function slotToOptions(): FormItemOption[] {
  return slots
    .default!()
    .filter(node => node.type !== Comment)
    // 使用 template 包裹的节点 <template v-if="false" />
    .flatMap(node => node.type === Fragment ? node.children : node)
    .map((node: any) => ({
      ...node.props,
      render: () => node,
    }))
}

defineExpose(forwardRef(form))
</script>

<template>
  <el-form v-bind="props" ref="form" class="i-form" :show-message :label-width>
    <!-- 行组件，设置栏间距 -->
    <el-row :gutter="gutter">
      <!-- 遍历表单项配置，生成表单项 -->
      <template v-for="(item, _n) in slots.default ? slotToOptions() : options" :key="_n">
        <el-col v-if="item.show?.() !== false" :span="item.span || span">
          <el-form-item v-bind="formatItemProps(item)">
            <template #label>
              {{ item.label }}
              <el-tooltip
                v-if="item.tooltip"
                effect="dark"
                popper-class="form-label-tooltip"
                :content="item.tooltip"
                placement="top"
                raw-content
              >
                <el-icon>
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </template>
            <!-- 渲染表单项组件 -->
            <RenderNode v-bind="item" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
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
