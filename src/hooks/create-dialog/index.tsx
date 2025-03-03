import type { AnyFn, Fn } from '@vueuse/core'
import type { DialogProps } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'
import { stringifyStyle } from '@vue/shared'
import { ElButton, ElConfigProvider, ElDialog, ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn.mjs'
import { isUndefined } from 'lodash'
import { isVNode, render } from 'vue'
import './index.scss'

interface Props extends DialogProps {
  render: AnyFn
  close?: Fn
  footer?: (() => VNode | VNode[]) | false
  afterSave?: (r?: Params) => any
  save?: (p?: Params) => Promise<any>
  bodyStyle?: CSSProperties
  appContext?: any
  okText?: string
  cancelText?: string
}

/**
 * @description 点击提交时,调用组件内部expose的save函数 或者createDialog参数传入save
 * @example
 * defineExpose({save：async ()=> {} })
 * save返回为promise时 按钮自动添加loading
 */
export function createDialog({
  footer,
  title,
  afterSave,
  save: customSave,
  render: customRender,
  close: customClose,
  cancelText = '取消',
  okText = '提交',
  bodyStyle = {},
  appContext,
  ...restProps
}: Partial<Props>) {
  const root = document.getElementById('app')
  const div = document.createElement('div')
  const state = reactive({ loading: false, visible: true })

  const contentRef = ref()

  root?.appendChild(div)

  function close() {
    customClose?.()
    state.visible = false
  }

  function closed() {
    render(null, div)
    root?.removeChild(div)
  }

  async function submit() {
    const content = unref(contentRef)
    const request = customSave || content?.save
    const validate = content?.validate || unref(content?.form)?.validate
    if (!request) {
      return
    }
    await validate?.()
    state.loading = true
    const res = await request()?.finally?.(() => {
      state.loading = false
    })

    if (isUndefined(res)) {
      return
    }
    if (!res) {
      return close()
    }
    if (res.code === 200) {
      close()
      afterSave?.(res)
      ElMessage.success(res.msg || '保存成功。')
    }
    else {
      ElMessage.error(res.msg || '保存失败。')
    }
  };

  async function setBodyStyle() {
    await nextTick()
    const body = div.getElementsByClassName('el-dialog__body')[0]
    body.setAttribute(
      'style',
      stringifyStyle({
        overflow: body.clientHeight >= 600 ? 'auto' : 'initial',
        ...bodyStyle,
      }),
    )
  }

  const baseFooter = () => [
    <ElButton onClick={close}>{cancelText}</ElButton>,
    <ElButton type="primary" onClick={submit} loading={state.loading}>
      {okText}
    </ElButton>,
  ]

  const dialog = () => (
    <ElDialog
      class={`create-dialog ${restProps.fullscreen ? '__is-fullscreen' : ''} ${footer === false ? '__no-footer' : ''} `}
      v-model={state.visible}
      onClose={close}
      onClosed={closed}
      append-to={div}
      closeOnClickModal={false}
      width={500}
      {...restProps}
      onVnodeMounted={setBodyStyle}
      v-slots={{
        footer: footer === false ? null : footer || baseFooter,
        header: () => <span class="title-content">{title}</span>,
        default: () => {
          const node = customRender!()
          return isVNode(node) ? h(node, { ref: contentRef }) : node
        },
      }}
    />
  )

  const node = h(ElConfigProvider, { locale: zhCn }, dialog)

  render(node, div)

  return {
    close,
    contentRef,
    baseFooter,
  }
}
