import type { Fn } from '@vueuse/core'
import type { AxiosResponse } from 'axios'
import { isArray } from 'lodash'

type Data<D, T> = unknown extends D ? T : D

type Request<T> = (...args: any[]) => Promise<AxiosResponse<T>>

interface Options<D, T> {
  /** 是否立即请求 */
  immediate?: boolean
  /** 转换数据 */
  transform?: (data: T extends (infer E)[] ? E : T) => any
  /** 请求完成时执行的函数 */
  resolve?: (res: AxiosResponse<T>) => void
  reject?: Fn
  /** 存储到storage的名称 */
  storage?: string
  /** 初始值 */
  initialValue?: Data<D, T>
}

/**
 * 自定义 Hook 用于处理 HTTP 请求
 *
 * @param request 一个返回 Promise 的函数，用于发起 HTTP 请求
 * @param options 配置选项，包括是否立即发起请求和数据转换函数
 * @returns 返回 【 数据、加载函数、加载状态 】
 */
export function useAsyncData<D, T = any>(
  request: Request<T>,
  options: Options<D, T> = {},
) {
  // 解构配置选项，包括是否立即发起请求和数据转换函数
  const { immediate = true, transform = d => d, resolve, reject, initialValue } = options
  // 使用 ref 创建一个响应式的数据值
  const data = options.storage
    ? useStorage(`__${options.storage}`, initialValue || {})
    : ref(initialValue!)
  // 使用 ref 创建一个响应式的加载状态
  const loading = ref(false)

  /**
   * 发起 HTTP 请求的异步函数
   */
  async function loadData(...args: any[]) {
    loading.value = true
    try {
      const res = await request(...args)
      if (res.code === 200) {
        const d: any = res.data
        data.value = isArray(d) ? d.map(item => transform(item)) : transform(d)
        resolve?.(res)
      }
      return res
    }
    catch (error) {
      console.error(error)
      reject?.()
    }
    finally {
      loading.value = false
    }
  }

  if (immediate) {
    loadData()
  }

  return [
    data,
    loadData,
    loading,
  ] as [Ref<Data<D, T>>, Request<T>, Ref<boolean>]
}
