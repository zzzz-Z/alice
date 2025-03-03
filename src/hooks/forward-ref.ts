export function forwardRef<T, P extends object>(ref: Ref<T>, target?: P) {
  const expose: Record<string, any> = {}

  onMounted(() => {
    Object.assign(expose, unref(ref), target)
  })

  return expose as T & P
}
