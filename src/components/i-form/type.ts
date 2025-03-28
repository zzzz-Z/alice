import type { FormItemRule } from 'element-plus'

export { }

declare module 'vue' {

  interface ComponentCustomProps {
    /** IForm 表单控件label */
    label?: string
    /** IForm 表单控件required */
    required?: boolean
    span?: number
    /** 表单控件的提示信息 */
    tooltip?: string
    rule?: FormItemRule
    validator?: FormItemRule['validator']
  }
}
