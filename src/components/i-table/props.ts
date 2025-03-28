import type { PropType } from 'vue'
import baseTableProps from 'element-plus/es/components/table/src/table/defaults'

interface TableProps<T = any> {
  /** 包裹table的父级元素 用于动态计算table高度 */
  container?: string | HTMLElement
  /** 列是否展示序号，默认为true */
  index?: boolean
  /** 是否展示分页  */
  pagination?: boolean
  columns?: ITableColumn<T>[]
  /** 请求函数 */
  request?: (params: any) => Promise<any>
  /**
   * 🔍 搜索参数
   */
  queryParams?: Params
  /** 是否立即调用请求函数 */
  immediate?: boolean
  /** 导出按钮配置 */
  exportCfg?: {
    request?: (params: Params) => Promise<any>
    title?: string
    type?: string
  }
  /** 导入按钮配置 */
  importCfg?: {
    request?: (params: any) => Promise<any>
    templateRequest?: () => Promise<any>
    templateUrl?: string
    limitTotal?: number
    title?: string
  }
  requestCfg?: {
    /** 请求函数返回字段映射 @default size */
    size?: string
    /** 请求函数返回字段映射 @default page */
    page?: string
    /** 请求函数返回字段映射 @default list */
    list?: string
    /** 请求函数返回字段映射 @default total */
    total?: string
  }
}

export const tableProps = {
  ...baseTableProps,
  index: Boolean,
  pagination: Boolean,
  boolean: Boolean,
  columns: Array as PropType<TableProps['columns']>,
  request: Function as PropType<TableProps['request']>,
  queryParams: Object as PropType<TableProps['queryParams']>,
  immediate: Boolean as PropType<TableProps['immediate']>,
  exportCfg: Object as PropType<TableProps['exportCfg']>,
  importCfg: Object as PropType<TableProps['importCfg']>,
  requestCfg: Object as PropType<TableProps['requestCfg']>,
}
