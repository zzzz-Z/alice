import type { App, Directive, DirectiveBinding } from 'vue'
import { useStore } from '@/store'

const { permissions } = useStore()

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    if (!permissions.value.includes(value || arg)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
}

export default function (app: App) {
  app.directive('perm', permission)
}
