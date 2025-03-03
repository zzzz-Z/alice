import type { EffectScope } from 'vue'

/**
 * 创建一个带有作用域的存储函数
 * 该函数用于在给定的作用域内执行一个可组合的函数，并管理其生命周期
 *
 * @param composable 一个可组合的函数，接受一组参数并返回结果
 * @returns 返回一个闭包函数，该函数在首次调用时会创建作用域并执行可组合的函数，后续调用则直接返回上次的结果
 */
export function createScopeStore<T, P extends any[]>(composable: (...args: P) => T) {
  let store: T | null
  let scope: EffectScope | null

  return (...args: P) => {
    if (!store) {
      scope = effectScope(true)
      store = scope.run(() => composable(...args))!
    }

    onScopeDispose(() => {
      scope?.stop?.()
      store = null
      scope = null
    })

    return store
  }
}
