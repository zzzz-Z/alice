import type { IForm, ITable } from '@/components'
import type { ElTableColumn, FormItemProps, FormItemRule } from 'element-plus'

export { }

declare global {
  export type Params = Record<string, any>
  export type ITableInstance = InstanceType<typeof ITable>
  export type IFormInstance = InstanceType<typeof IForm>
  export type ITableColumn<T = Params> = InstanceType<typeof ElTableColumn>['$props'] & {
    show?: () => boolean
    prop?: string
    columns?: ITableColumn<T>[]
    render?: ({ row: T, value: any, columns: any, index: number }) => any
    renderDefault?: any
  }

  export interface FormItemOption extends Partial<FormItemProps> {
    span?: number
    label?: string
    show?: () => boolean
    tooltip?: string
    rule?: FormItemRule
    validator?: FormItemRule['validator']
    render: () => any
    [string: string]: any
  }
}
