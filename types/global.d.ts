import type { IForm, ITable } from '@/components'
import type { ElTableColumn, FormItemProps, FormItemRule } from 'element-plus'

export { }

declare global {

  type Params = Record<string, any>
  type ITableInstance = InstanceType<typeof ITable>
  type IFormInstance = InstanceType<typeof IForm>
  type ITableColumn<T = Params> = InstanceType<typeof ElTableColumn>['$props'] & {
    show?: () => boolean
    prop?: string
    columns?: ITableColumn<T>[]
    render?: ({ row: T, value: any, columns: any, index: number }) => any
    renderDefault?: any
  }

  interface FormItemOption extends Partial<FormItemProps> {
    span?: number
    label?: string
    show?: () => boolean
    tooltip?: string
    rule?: FormItemRule
    validator?: FormItemRule['validator']
    render: () => any
  }

  export {
    FormItemOption,
    IFormInstance,
    ITableColumn,
    ITableInstance,
    Params,
  }
}
