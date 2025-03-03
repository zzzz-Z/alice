import type { AnyFn } from '@vueuse/core'
import type { CardProps } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'
import { ElCard, ElMenu, ElMenuItem } from 'element-plus'
import { render } from 'vue'

interface MenuItem {
  click: AnyFn
  text: string
}

interface Props extends Partial<CardProps> {
  render?: any
  menus?: MenuItem[]
  close?: () => void
}

let closePreMenu: AnyFn | null = null
const mouse = useMouse()

/** @description 右键菜单 */
export async function createContextmenu({
  render: customRender,
  close: _close,
  menus,
  bodyStyle,
  ...props
}: Props) {
  const root = document.getElementById('app')
  const div = document.createElement('div')
  const stop = onClickOutside(div, close)
  const targetMouse = reactive(unRefs(mouse))
  const style = computed<CSSProperties>(() => {
    return ({
      left: `${targetMouse.x}px`,
      top: `${targetMouse.y}px`,
      zIndex: 9999,
      position: 'fixed',
      overflow: 'inherit'
    })
  })

  closePreMenu?.()
  closePreMenu = close
  root!.appendChild(div)

  function close() {
    render(null, div)
    root?.removeChild(div)
    stop()
    _close?.()
    closePreMenu = null
  }

  /** 检查给定的虚拟节点（VNode）是否超出视口范围 */
  function isElementOutOfViewport(node: VNode) {
    const rect = node!.el!.getBoundingClientRect();

    // 检查元素是否超出视口宽度
    if (rect.right > window.innerWidth) {
      targetMouse.x = window.innerWidth - rect.width;
    } else if (rect.left < 0) {
      targetMouse.x = 0;
    } else {
      targetMouse.x = rect.x;
    }

    // 检查元素是否超出视口高度
    if (rect.bottom > window.innerHeight) {
      targetMouse.y = window.innerHeight - rect.height;
    } else if (rect.top < 0) {
      targetMouse.y = 0;
    } else {
      targetMouse.y = rect.y;
    }
  }

  const renderMenu = () => (
    <ElMenu>
      {menus?.map?.(menuItem => (
        <ElMenuItem
          v-text={menuItem.text}
          style='height:35px;font-size:12px'
          onClick={() => {
            menuItem.click()
            close()
          }}
        />
      ))}
    </ElMenu>
  )

  const content = h(() => (
    <ElCard
      style={unref(style)}
      bodyStyle={menus ? { padding: 0 } : bodyStyle}
      onVnodeMounted={isElementOutOfViewport}
      {...props}
    >
      {menus ? renderMenu() : customRender()}
    </ElCard>
  ))

  render(content, div)
}
