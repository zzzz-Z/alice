import Index from './index.vue'

export interface ImportParams {
  template?: string
  accept?: string
  request: ({ file }: any) => Promise<any>
  success: () => any
}

export function createUpload(props: ImportParams) {
  createDialog({
    title: '导入文件',
    okText: '确定',
    afterSave: props.success,
    render: () => h(Index, props)
  })
}
