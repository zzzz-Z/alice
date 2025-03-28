/**
 * 转发引用，将一个引用对象的属性和方法转发到另一个对象上。
 *
 * @template T 引用对象的类型。
 * @template P 目标对象的类型，必须是一个对象。
 * @param {Ref<T>} ref 要转发的引用对象。
 * @param {P} [target] 可选的目标对象，用于合并属性和方法。
 * @returns {T & P} 包含引用对象和目标对象属性和方法的对象。
 */
export function forwardRef<T, P extends object>(ref: Ref<T>, target?: P): T & P {
  // 初始化一个空对象，用于存储暴露的属性和方法
  const expose: Record<string, any> = {}

  // 在组件挂载后执行的生命周期钩子
  onMounted(() => {
    // 获取引用对象的实际值
    const refValue = unref(ref)
    // 设置 expose 对象的原型为引用对象的原型（echarts方法在实例原型上）
    Object.setPrototypeOf(expose, Object.getPrototypeOf(refValue))
    // 将引用对象和目标对象的属性和方法合并到 expose 对象中
    Object.assign(expose, refValue, target)
  })

  // 返回合并后的对象，类型为引用对象和目标对象的交集
  return expose as T & P
}
