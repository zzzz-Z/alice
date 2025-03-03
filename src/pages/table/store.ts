import { reactive } from 'vue'

export default createScopeStore(() => {
  const state = reactive({ num: 1 })
  const add = () => {
    state.num++
  }

  return { state, add }
})
