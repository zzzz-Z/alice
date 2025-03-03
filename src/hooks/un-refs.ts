import { UnwrapRef } from "vue"

/**
 * 将一个对象中所有的 ref 属性转换为普通属性
 * @param source 一个包含 ref 属性的对象
 * @returns 一个新对象，其中所有的 ref 属性都被转换为普通属性
 */
export function unRefs<T extends object>(source: T) {
  const target = {}

  Object.keys(source).forEach((key) => {
    target[key] = unref(source[key])
  })

  return target as { [K in keyof T]: UnwrapRef<T[K]> }
}
